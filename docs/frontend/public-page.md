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

Também disponível por ID: `GET /stores/{store_slug}/products/{product_id}`

## Response completa

```json
{
  "id": "uuid-seller-product",
  "title": "Caneca Arte Abstrata",
  "description": "Caneca com arte exclusiva",
  "slug": "caneca-arte-abstrata",

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
    "avatarUrl": "https://..."
  },

  "artwork": {
    "id": "uuid-artwork",
    "title": "Arte Abstrata",
    "previewUrl": "https://..."
  },

  "images": [{ "url": "https://...", "altText": "Foto 1", "isPrimary": true }]
}
```

## O que cada bloco alimenta no frontend

| Bloco | Dados | Uso no frontend |
|---|---|---|
| **store** | nome, slug, avatar, contadores | Header da loja, link "ver mais" |
| **artwork** | id, título, preview, dominantColor | Fallback de galeria, SEO, cor de fundo |
| **title/description/slug** | texto do produto | SEO, breadcrumb, compartilhamento |
| **assetDefinitions** | tamanho, acabamento, etc. | Seletores que mudam SKU/preço |
| **optionDefinitions** | cor, etc. com inputType e displayBehavior | Seletores visuais (color picker, radio) |
| **skus[]** | variantes com preço, allowedOptions, renders | Preço, galeria, options disponíveis |
| **skus[].renders[]** | templateId, url, options | Imagens filtradas por option |
| **images[]** | fotos da galeria (uploaded pelo seller) | Galeria estática |
| **minPriceCents/maxPriceCents** | range de preço | "A partir de R$ X" |

:::info
**Nada está faltando.** O frontend não precisa de requests adicionais — tudo vem em uma única chamada.
:::

## Como o backend monta os renders por SKU

Para cada SKU (SellerProductVariant):

1. Pega `assets` da ProductVariant (ex: `{"size": "350ml", "finish": "glossy"}`)
2. Busca templates ativos do ProductType
3. Filtra templates cujos `assets` são **subconjunto** dos assets da variante
4. Para cada match, busca o render mais recente com status `rendered`
5. **Filtra por allowedOptions**: template com `options: {"color": "blue"}` mas variante com `allowedOptions: {"color": ["black", "white"]}` → render **excluído**
6. Templates com `options: null` aparecem em **todas** as variantes

## Produtos relacionados

O endpoint de detalhe retorna `relatedProducts`:

```json
"relatedProducts": {
  "sameArtwork": [...],
  "sameArtist": [...],
  "recommended": [...]
}
```

| Categoria | O que retorna | Limite |
|---|---|---|
| `sameArtwork` | Outros produtos com a mesma artwork | 12 |
| `sameArtist` | Outros produtos do mesmo seller | 12 |
| `recommended` | Mesmo tipo de produto de outros sellers | 12 |

Cada card retorna: `id`, `title`, `slug`, `minPriceCents`, `thumbnailUrl`, `productTypeName`, `storeSlug`, `artistName`.

:::tip Prioridade do thumbnail
1. Imagem `isPrimary` da galeria
2. Primeira imagem da galeria
3. Último render disponível
4. Preview da artwork (fallback)
:::
