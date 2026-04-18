---
sidebar_position: 13
title: Galeria do Produto
---

# Galeria do Produto (fotos do seller)

Cada `SellerProduct` tem uma galeria de `ProductImage` — fotos reais do produto, **separadas** dos mockups/renders gerados a partir de templates.

:::info Fotos manuais ≠ renders
- **Renders** (`/render`) — gerados automaticamente a partir de template + artwork
- **Product Images** (aqui) — fotos manuais que o seller faz upload (ex: foto do produto acabado, close da textura, detalhe do acabamento)

As duas fontes aparecem na galeria pública ([fallback chain](/docs/frontend/gallery#tratamento-de-renders-ausentes)).
:::

:::warning Upload multipart, não presign
Diferente do upload de artworks/templates (que usa presign para S3 direto), **product images usam `multipart/form-data`** direto na API.
:::

## Endpoints

| Método | Rota | Auth |
|---|---|---|
| `POST` | `/seller-products/me/{productId}/images` | `seller_or_admin` |
| `PATCH` | `/seller-products/me/{productId}/images/{imageId}` | `seller_or_admin` |
| `DELETE` | `/seller-products/me/{productId}/images/{imageId}` | `seller_or_admin` |
| `POST` | `/seller-products/me/{productId}/images/reorder` | `seller_or_admin` |

:::info Ownership
Admin pode modificar galeria de qualquer produto. Seller só pode modificar produtos da própria loja.
:::

## Upload

```http
POST /seller-products/me/{productId}/images
Content-Type: multipart/form-data
```

**Fields:**

| Campo | Lugar | Obrigatório | Descrição |
|---|---|:---:|---|
| `file` | form-data | Sim | Arquivo binário da imagem |
| `isPrimary` | query | Não | `true` / `false` — marca como imagem principal |
| `altText` | query | Não | Texto alternativo (acessibilidade) |

<details>
<summary>Response</summary>

```json
{
  "id": "uuid",
  "sellerProductId": "uuid",
  "imageUrl": "https://cdn.labanana.art/public/products/.../uuid.webp",
  "altText": "Caneca vista de frente",
  "position": 0,
  "isPrimary": true,
  "createdAt": "2026-04-16T10:00:00Z"
}
```

</details>

## Atualizar metadata

```http
PATCH /seller-products/me/{productId}/images/{imageId}
```

```json
{ "altText": "Novo texto", "isPrimary": true }
```

## Deletar

```http
DELETE /seller-products/me/{productId}/images/{imageId}
```

## Reordenar

```http
POST /seller-products/me/{productId}/images/reorder
```

```json
{ "imageIds": ["uuid3", "uuid1", "uuid2"] }
```

Envie o **array completo** de IDs na nova ordem. Response: array na nova ordem (`position` atualizado).

## Regras importantes

### `position` é auto-atribuído no upload

Cada nova imagem recebe o próximo `position` (append ao final). Para mudar a ordem, use `/reorder`.

### `isPrimary` precisa ser exclusivo — **mas o backend não desmarca automaticamente**

```
⚠ Gotcha
```

Só uma imagem por produto deve estar com `isPrimary: true`. Mas quando você seta `isPrimary: true` em uma imagem, **o backend não desmarca automaticamente a anterior**.

**Fluxo correto no frontend:**

```typescript
// 1. Desmarcar a antiga (se existir)
if (currentPrimaryId) {
  await api.patch(`.../images/${currentPrimaryId}`, { isPrimary: false });
}

// 2. Marcar a nova
await api.patch(`.../images/${newId}`, { isPrimary: true });
```

Se você não fizer isso, a loja pode acabar com 2 imagens primárias — comportamento não definido.

## Uso no frontend público

O endpoint público `GET /stores/{slug}/products/{slug}` retorna as imagens da galeria em `product.images[]`:

```json
{
  "images": [
    { "url": "https://...", "altText": "Foto 1", "isPrimary": true, "position": 0 },
    { "url": "https://...", "altText": "Detalhe", "isPrimary": false, "position": 1 }
  ]
}
```

A imagem com `isPrimary: true` aparece **primeiro** na galeria. Se não há renders matching para as options selecionadas, a [fallback chain](/docs/frontend/gallery#tratamento-de-renders-ausentes) usa `product.images` como 3º nível.
