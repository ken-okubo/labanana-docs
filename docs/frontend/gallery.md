---
sidebar_position: 2
title: Galeria e Filtragem
---

# Galeria e Filtragem de Renders

O frontend filtra os renders do SKU ativo baseado nas options selecionadas pelo comprador.

## Filtragem de renders

```typescript
function filterRenders(
  renders: SkuRender[],
  selectedOptions: Record<string, string>,
  optionDefinitions: OptionDefinition[],
): SkuRender[] {
  return renders.filter((render) => {
    const tOptions = render.options;

    // 1. options === null → template genérico, sempre mostra
    if (tOptions === null) return true;

    // 2. Filtrar por options com displayBehavior === "filter"
    for (const [key, value] of Object.entries(tOptions)) {
      const optDef = optionDefinitions.find((o) => o.key === key);
      if (optDef?.displayBehavior === 'filter') {
        if (selectedOptions[key] !== value) return false;
      }
      // displayBehavior === 'show_all' → não filtra (sempre mostra)
    }

    return true;
  });
}
```

**Resultado:** Selecionou `color: "black"` → galeria mostra renders com `options.color === "black"` + renders genéricos (`options: null`).

## Options disponíveis por SKU

Quando o comprador muda de SKU, as options podem mudar (cada SKU tem `allowedOptions`):

```typescript
function getAvailableOptions(
  optionDefinitions: OptionDefinition[],
  selectedSku: Sku,
): OptionDefinition[] {
  return optionDefinitions.map((opt) => ({
    ...opt,
    values: opt.values.filter((v) => {
      const allowed = selectedSku.allowedOptions[opt.key];
      // allowedOptions vazio = herda todos
      return !allowed || allowed.length === 0 || allowed.includes(v.value);
    }),
  }));
}
```

## Tratamento de renders ausentes

Nem toda combinação de options terá render (é um gap de conteúdo, **não** de negócio). Options sem render continuam **compráveis**. A galeria usa uma cadeia de 5 fallbacks:

```typescript
function getGalleryImages(
  sku: Sku,
  selectedOptions: Record<string, string>,
  optionDefinitions: OptionDefinition[],
  product: StoreProductResponse,
): string[] {
  // 1. Renders com match exato das options selecionadas
  const exactRenders = filterRenders(sku.renders, selectedOptions, optionDefinitions);
  if (exactRenders.length > 0) {
    return exactRenders.map(r => r.url);
  }

  // 2. Renders genéricos do mesmo SKU (templates "universais", options === null)
  const genericRenders = sku.renders.filter(r => r.options === null);
  if (genericRenders.length > 0) {
    return genericRenders.map(r => r.url);
  }

  // 3. Fotos manuais do seller (product.images)
  if (product.images.length > 0) {
    const primary = product.images.find(img => img.isPrimary);
    return [primary?.url ?? product.images[0].url];
  }

  // 4. Preview da arte original
  if (product.artwork.previewUrl) {
    return [product.artwork.previewUrl];
  }

  // 5. Último recurso
  return ['/images/placeholder-product.webp'];
}
```

**Resumo visual:**

```
Option selecionada tem render?
 ├── SIM → mostra render(s) como carousel
 └── NÃO → render genérico (options: null) do SKU?
           ├── SIM → mostra genérico
           └── NÃO → product.images (fotos manuais)?
                    ├── SIM → mostra foto
                    └── NÃO → artwork.previewUrl?
                             ├── SIM → mostra arte original
                             └── NÃO → placeholder
```

### UX para options sem render

1. **Mostrar o fallback normalmente** (sem mensagem de erro)
2. **NÃO desabilitar a option** — ela continua comprável
3. Opcionalmente, exibir badge sutil tipo "Imagem ilustrativa"

:::tip `show_all` nunca filtra renders
Options com `displayBehavior: "show_all"` (ex: `size_label`, `engraving`) **nunca filtram** a galeria. A fallback chain só é relevante para options com `displayBehavior: "filter"` (ex: `color`, `side`).
:::

:::warning
O comprador **nunca deve ver uma galeria vazia** — sempre há pelo menos um nível de fallback.
:::

## Seleção de variante (SKU)

O preço é fixo por SKU. Mudar assets muda de SKU e portanto de preço. Mudar options **não muda o preço**.

```typescript
function findSku(
  skus: Sku[],
  selectedAssets: Record<string, string>,
): Sku | undefined {
  return skus.find((sku) => {
    for (const [key, value] of Object.entries(selectedAssets)) {
      if (sku.assets?.[key] !== value) return false;
    }
    return true;
  });
}
```

## Estado inicial

**Regra fundamental:** o produto **nunca** abre mostrando a arte raw. Sempre deve haver SKU selecionado, options pré-selecionadas, e mockup visível.

```typescript
function getInitialState(product: StoreProductResponse) {
  // 1. SKU mais barato
  const sku = product.skus
    .filter(s => s.isActive)
    .sort((a, b) => a.priceCents - b.priceCents)[0];
  if (!sku) return null;

  // 2. Options disponíveis para este SKU
  const availableOptions = getAvailableOptions(product.optionDefinitions, sku);

  // 3. Para cada option, pré-selecionar o PRIMEIRO VALOR QUE TEM RENDER
  const selectedOptions: Record<string, string> = {};
  for (const opt of availableOptions) {
    const valueWithRender = opt.values.find(v =>
      sku.renders.some(r => r.options?.[opt.key] === v.value)
    );
    // Se nenhum valor tem render, cai no primeiro valor disponível
    selectedOptions[opt.key] = valueWithRender?.value ?? opt.values[0]?.value;
  }

  // 4. Filtrar renders
  const visibleRenders = filterRenders(sku.renders, selectedOptions, product.optionDefinitions);

  return { sku, selectedOptions, visibleRenders };
}
```

:::tip Por que priorizar valores com render?
Options são genéricas (`color`, `side`, `style`, etc.) e nem todo valor tem mockup. Se o frontend pré-seleciona um valor sem render, o comprador vê **a arte raw** como primeira impressão — sensação de produto incompleto.

**Exemplo:** SKU tem `color: ["black", "white", "red"]` mas só há render para preto e branco. Pré-seleção ideal é `black` (primeiro com render), não `red`.
:::

## URL com estado (Deep Linking)

Para compartilhar link com configuração escolhida:

```
/stores/{storeSlug}/products/{slug}?size=350ml&finish=glossy&color=black
```

**Ao carregar:** ler query params → usar como seleção (se válidos) → senão, usar default.

**Ao mudar seleção:** atualizar query params sem reload (`history.replaceState`).

## Exemplo completo de UI flow

```
Estado inicial (página carrega):
├── SKU: 350ml Glossy (mais barato, R$ 18,00)
├── Options: [black, white, red, blue]
├── Pré-seleção: {color: "black"}
├── Galeria: renders color="black"
└── URL: ?size=350ml&finish=glossy&color=black

Comprador muda cor para "blue":
├── SKU: mesmo (350ml Glossy) — cor NÃO muda SKU
├── Preço: mesmo (R$ 18,00)
├── Galeria: filtra por color="blue"
└── URL: ?size=350ml&finish=glossy&color=blue

Comprador muda cor para "red" (sem render):
├── SKU: mesmo
├── Galeria: NÃO TEM RENDER
│   → Fallback 1: render genérico (options: null) do mesmo SKU?
│   → Fallback 2: product.images (fotos manuais)?
│   → Fallback 3: artwork.previewUrl
├── "red" continua COMPRÁVEL (está em allowedOptions)
└── Opcional: badge "Imagem ilustrativa"

Comprador muda tamanho para "700ml":
├── SKU: muda para 700ml Glossy (R$ 28,00)
├── Options: MUDA → [black, white] (allowedOptions do novo SKU)
├── "blue" indisponível → auto-seleciona "black"
├── Galeria: renders do novo SKU com color="black"
└── URL: ?size=700ml&finish=glossy&color=black
```

## Cards de produtos relacionados

O endpoint de detalhe retorna `relatedProducts` com 3 categorias (`sameArtwork`, `sameArtist`, `recommended`), cada uma com **o mesmo formato completo** da response principal (`StoreProductResponse`). Para renderizar cada card do carousel, aplique a mesma lógica de fallback — pegando o SKU mais barato como referência:

```typescript
function getRelatedProductImage(product: StoreProductResponse): string {
  const sku = product.skus
    .filter(s => s.isActive)
    .sort((a, b) => a.priceCents - b.priceCents)[0];
  if (!sku) return product.artwork.previewUrl ?? '/images/placeholder.webp';

  // Primeiro render disponível do SKU mais barato
  if (sku.renders.length > 0) {
    return sku.renders[0].url;
  }

  // Fallback
  if (product.images.length > 0) {
    return product.images.find(i => i.isPrimary)?.url ?? product.images[0].url;
  }
  return product.artwork.previewUrl ?? '/images/placeholder.webp';
}
```

Cada card é clicável. A rota é `/stores/{card.store.storeSlug}/products/{card.slug}` (se `slug` for `null`, use `id`).
