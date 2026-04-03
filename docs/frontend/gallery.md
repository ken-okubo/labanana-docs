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

Nem toda option terá um render. Use fallbacks:

```typescript
function getGalleryImages(
  sku: Sku,
  selectedOptions: Record<string, string>,
  optionDefinitions: OptionDefinition[],
  artworkPreviewUrl: string | null,
): string[] {
  const renders = filterRenders(sku.renders, selectedOptions, optionDefinitions);

  if (renders.length > 0) {
    return renders.map(r => r.url);
  }

  // Fallback: artwork preview (sem mockup)
  if (artworkPreviewUrl) {
    return [artworkPreviewUrl];
  }

  // Último recurso: placeholder
  return ['/images/placeholder-product.webp'];
}
```

:::warning
O comprador **nunca deve ver uma galeria vazia**. Se não há render para a option selecionada, use a artwork preview como fallback.
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

Quando a página carrega, pré-selecione tudo:

```typescript
function getInitialState(product: StoreProductResponse) {
  // 1. SKU mais barato
  const sku = product.skus
    .filter(s => s.isActive)
    .sort((a, b) => a.priceCents - b.priceCents)[0];
  if (!sku) return null;

  // 2. Options disponíveis para este SKU
  const availableOptions = getAvailableOptions(product.optionDefinitions, sku);

  // 3. Pré-selecionar primeiro valor de cada option
  const selectedOptions: Record<string, string> = {};
  for (const opt of availableOptions) {
    if (opt.values.length > 0) {
      selectedOptions[opt.key] = opt.values[0].value;
    }
  }

  // 4. Filtrar renders
  const visibleRenders = filterRenders(sku.renders, selectedOptions, product.optionDefinitions);

  return { sku, selectedOptions, visibleRenders };
}
```

:::tip
O produto abre com **tudo pré-selecionado**: primeiro SKU, primeira cor, e o render correspondente. O comprador nunca vê uma página "vazia".
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
├── Galeria: NÃO TEM RENDER → Fallback: artwork preview
└── Nota: option "red" aparece mas sem mockup

Comprador muda tamanho para "700ml":
├── SKU: muda para 700ml Glossy (R$ 28,00)
├── Options: MUDA → [black, white] (allowedOptions do novo SKU)
├── "blue" indisponível → auto-seleciona "black"
├── Galeria: renders do novo SKU com color="black"
└── URL: ?size=700ml&finish=glossy&color=black
```
