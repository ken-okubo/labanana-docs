---
sidebar_position: 1
title: Página Pública
---

# Página Pública do Produto

A response do endpoint público contém **tudo** que o frontend precisa para renderizar a PDP (Product Detail Page).

## Endpoint

```http
GET /stores/{store_slug}/products/{product_slug}
```

Também disponível por ID: `GET /stores/{store_slug}/products/{product_id}`.

Para listar **todos** os produtos da loja (sem detalhe): `GET /stores/{store_slug}/products`.

:::danger Não use o endpoint do seller no frontend público
O frontend público deve usar apenas `/stores/{slug}/products/...`. Nunca chame `/seller-products/me` — esse é o endpoint do **dashboard do seller** (requer autenticação, expõe campos internos de placement, e retorna estado editável inclusive para produtos não publicados).
:::

## Response completa

```json
{
  "id": "uuid-seller-product",
  "title": "Caneca Arte Abstrata",
  "description": "Caneca com arte exclusiva",
  "slug": "caneca-arte-abstrata",
  "tags": ["abstrato", "canecas"],
  "backgroundColor": "#F5E6D3",

  "productTypeId": "uuid-product-type",
  "productTypeName": "Caneca Cerâmica",
  "productTypeSlug": "caneca-ceramica",

  "assetDefinitions": [
    {
      "key": "size",
      "label": "Tamanho",
      "values": [
        { "value": "350ml", "label": "350ml" },
        { "value": "700ml", "label": "700ml" }
      ]
    },
    {
      "key": "finish",
      "label": "Acabamento",
      "values": [
        { "value": "glossy", "label": "Brilhante" },
        { "value": "matte", "label": "Fosco" }
      ]
    }
  ],

  "optionDefinitions": [
    {
      "key": "color",
      "label": "Cor",
      "inputType": "color_picker",
      "displayBehavior": "filter",
      "required": true,
      "values": [
        { "value": "black", "label": "Preto", "hexColor": "#000000" },
        { "value": "white", "label": "Branco", "hexColor": "#FFFFFF" },
        { "value": "red", "label": "Vermelho", "hexColor": "#FF0000" },
        { "value": "blue", "label": "Azul Marinho", "hexColor": "#1261A0" }
      ]
    }
  ],

  "skus": [
    {
      "id": "uuid-seller-variant-1",
      "productVariantId": "uuid-variant-glossy-350",
      "isActive": true,
      "allowedOptions": { "color": ["black", "white", "red", "blue"] },
      "optionLabel": "350ml Brilhante",
      "priceCents": 4990,
      "renders": [
        {
          "templateId": "caneca-350ml-black-v1",
          "url": "https://cdn.../render-black.webp",
          "options": { "color": "black" }
        },
        {
          "templateId": "caneca-350ml-white-v1",
          "url": "https://cdn.../render-white.webp",
          "options": { "color": "white" }
        }
      ]
    }
  ],

  "minPriceCents": 4990,
  "maxPriceCents": 6990,

  "store": {
    "storeName": "Arte Store",
    "storeSlug": "arte-store",
    "displayName": "Arte Store",
    "avatarUrl": "https://...",
    "isFollowing": null
  },

  "artwork": {
    "id": "uuid-artwork",
    "title": "Arte Abstrata",
    "previewUrl": "https://...",
    "dominantColor": "#6b4f2a"
  },

  "images": [{ "url": "https://...", "altText": "Foto 1", "isPrimary": true }],

  "likesCount": 15,
  "isLiked": null,

  "relatedProducts": {
    "sameArtwork": ["...StoreProductResponse[]"],
    "sameArtist": ["...StoreProductResponse[]"],
    "recommended": ["...StoreProductResponse[]"]
  }
}
```

:::info `isFollowing` / `isLiked` são `null` para visitantes anônimos
Para usuários autenticados, são `true` ou `false`. Use esse valor para alternar o ícone do botão (ex: coração cheio vs vazio) e **esconder** o botão quando `null` se preferir forçar login antes da ação.
:::

## O que cada bloco alimenta no frontend

| Bloco | Dados | Uso no frontend |
|---|---|---|
| **store** | nome, slug, displayName, avatar, isFollowing | Header da loja, botão "seguir", link "ver mais" |
| **artwork** | id, título, preview, dominantColor | Fallback de galeria, SEO, cor de fundo |
| **title/description/slug** | texto do produto | SEO, breadcrumb, compartilhamento |
| **tags** | lista de strings | SEO, filtros de busca |
| **backgroundColor** | hex color | Cor de fundo customizada da PDP |
| **assetDefinitions** | tamanho, acabamento, etc. | Seletores que mudam SKU/preço |
| **optionDefinitions** | cor, etc. com inputType e displayBehavior | Seletores visuais (color picker, radio) |
| **skus[]** | variantes com preço, allowedOptions, renders | Preço, galeria, options disponíveis |
| **skus[].renders[]** | templateId, url, options | Imagens filtradas por option |
| **images[]** | fotos da galeria (uploaded pelo seller) | Galeria estática (não muda com options) |
| **minPriceCents/maxPriceCents** | range de preço | "A partir de R$ X" |
| **likesCount / isLiked** | contador e estado do like do usuário | Botão de coração + contador |
| **relatedProducts** | sameArtwork, sameArtist, recommended | Carousels de recomendação (só no detalhe) |

:::info
**Nada está faltando.** O frontend não precisa de requests adicionais — tudo vem em uma única chamada.
:::

## Como o backend monta os renders por SKU

Para cada SKU (SellerProductVariant):

1. Pega `assets` da ProductVariant (ex: `{"size": "350ml", "finish": "glossy"}`)
2. Busca templates ativos do ProductType
3. Filtra templates cujos `assets` são **subconjunto** dos assets da variante
4. Para cada match, busca o render mais recente com status `rendered`
5. Se existe render, adiciona ao array `renders[]` do SKU com `templateId`, `url` e `options`
6. **Filtra por allowedOptions**: template com `options: {"color": "blue"}` mas variante com `allowedOptions: {"color": ["black", "white"]}` → render **excluído**
7. Templates com `options: null` aparecem em **todas** as variantes (genéricos)

## Produtos relacionados

O endpoint de detalhe retorna `relatedProducts` com 3 categorias:

| Categoria | O que retorna | Limite |
|---|---|---|
| `sameArtwork` | Outros produtos usando a **mesma artwork** (outros tipos de produto ou sellers) | 12 |
| `sameArtist` | Outros produtos do **mesmo seller** com **outras artworks** | 12 |
| `recommended` | Mesmo **tipo de produto** de **outros sellers** (mais recentes primeiro) | 12 |

:::info Formato completo, não um card reduzido
Cada item em `sameArtwork[]`, `sameArtist[]` e `recommended[]` retorna o **mesmo formato** (`StoreProductResponse`) do produto principal — com SKUs, renders, store, artwork, likesCount, etc.

Isso permite renderizar mockups reais nos cards do carousel sem chamadas adicionais. O endpoint de **listagem** (`GET /stores/{slug}/products`) **não** retorna `relatedProducts` (por performance).
:::

Para escolher a imagem de cada card, veja [`getRelatedProductImage`](/docs/frontend/gallery#cards-de-produtos-relacionados) em Galeria e Filtragem.
