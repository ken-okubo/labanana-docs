---
sidebar_position: 10
title: Catálogo Consolidado
---

# Catálogo Consolidado (`GET /catalog/seller`)

Endpoint **agregador** que retorna tudo que o seller precisa para a tela de edição de artwork / criação de produto — **em uma única chamada**.

:::tip Substitui 7+ chamadas em cascata
Antes: o frontend precisava chamar separadamente `/products/types`, `/products/types/{id}/variants`, `/products/types/{id}/templates`, `/products/types/{id}/assets`, `/products/types/{id}/options`, etc — para cada ProductType. Agora é **1 chamada** com tudo pré-agrupado.
:::

## Endpoint

```http
GET /catalog/seller
```

Requer role `seller` ou `admin`.

## O que vem por ProductType

Para cada ProductType ativo, o endpoint retorna:

| Campo | Descrição |
|---|---|
| `variants` | Variantes **ativas** com assets, custo base, SKU, lead time |
| `templates` | Templates **ativos** com assets, options, config e imagem base |
| `assetDefinitions` | Definições de assets agrupadas por key, com labels i18n (pt) |
| `optionDefinitions` | Definições de options com values, `inputType`, `displayBehavior` |

**Filtros aplicados:** apenas registros com `is_active=true` (types, variants e templates).

## Response

<details>
<summary>JSON completo (1 ProductType)</summary>

```json
{
  "productTypes": [
    {
      "id": "uuid",
      "slug": "caneca-ceramica",
      "name": "Caneca Cerâmica",
      "description": "Caneca de cerâmica com sublimação",
      "platformFeePercent": 15,
      "artistRoyaltyPercent": 30,

      "variants": [
        {
          "id": "uuid",
          "assets": { "size": "350ml" },
          "baseCostCents": 2500,
          "sku": "MUG-350ML",
          "productionDays": 3,
          "packagingDays": 1
        }
      ],

      "templates": [
        {
          "id": "caneca-350ml-azul-v1",
          "displayName": "Caneca 350ml Azul",
          "assets": { "size": "350ml" },
          "options": { "color": "blue" },
          "config": {
            "printArea": { "x": 100, "y": 150, "width": 300, "height": 400 },
            "sourceImage": { "width": 800, "height": 1000 }
          },
          "images": {
            "baseUrl": "https://cdn.labanana.art/public/templates/.../base.png"
          }
        }
      ],

      "assetDefinitions": [
        {
          "key": "size",
          "label": "Tamanho",
          "values": [
            { "value": "350ml", "label": "350ml" },
            { "value": "700ml", "label": "700ml" }
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
            { "value": "blue", "label": "Azul", "hexColor": "#0000FF" },
            { "value": "white", "label": "Branca", "hexColor": "#FFFFFF" }
          ]
        }
      ]
    }
  ]
}
```

</details>

## Uso no frontend

Agrupe templates por ProductType para montar a UI do seller:

```
Caneca Cerâmica (8 templates)
├── 350ml: Azul, Branca, Preta
└── 700ml: Azul, Branca, Preta

Camiseta (3 templates)
└── Branca, Preta, Vermelha
```

## Exemplo de hydration

```typescript
const { productTypes } = await fetch('/catalog/seller', {
  headers: { Authorization: `Bearer ${accessToken}` },
}).then((r) => r.json());

// Agrupar templates por key de asset (ex: size)
const catalog = productTypes.map((pt) => ({
  ...pt,
  templatesByAsset: Object.groupBy(
    pt.templates,
    (t) => t.assets.size ?? 'universal',
  ),
}));
```

:::info Dados suficientes para "criação sem ida e volta"
Com o response deste endpoint, o seller consegue:
- Escolher um ProductType
- Ver todas as variantes disponíveis (com custo e lead time)
- Ver todos os templates com mockup base pré-carregado
- Saber quais options estão disponíveis e como renderizá-las (`inputType`, `displayBehavior`)

Sem chamadas adicionais.
:::
