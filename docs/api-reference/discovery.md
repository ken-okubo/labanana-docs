---
sidebar_position: 11
title: Discovery / Home Feed
---

# Discovery / Home Feed

Endpoint público único que monta a home pública em uma chamada — **bestsellers**, **artworks curados** e **artistas em destaque**.

## Endpoint

```http
GET /discovery/home
```

Auth: **público** (sem token).

## Response

```json
{
  "bestsellers": {
    "products": [
      {
        "id": "uuid",
        "title": "Caneca Gatinho",
        "slug": "caneca-gatinho",
        "storeSlug": "atelie-ana",
        "artistName": "Ana Silva",
        "priceCents": 4990,
        "thumbnailUrl": "https://cdn.labanana.art/...",
        "productTypeName": "Caneca"
      }
    ],
    "total": 20
  },
  "curated": {
    "artworks": [
      {
        "id": "uuid",
        "title": "Gato Surrealista",
        "artistName": "Ana Silva",
        "artistSlug": "atelie-ana",
        "thumbnailUrl": "https://cdn.labanana.art/...",
        "productCount": 5
      }
    ],
    "total": 10
  },
  "featuredArtists": {
    "artists": [
      {
        "id": "uuid",
        "name": "Atelie da Ana",
        "slug": "atelie-ana",
        "avatarUrl": "https://cdn...",
        "coverUrl": "https://cdn...",
        "productCount": 12,
        "designCount": 8
      }
    ],
    "total": 8
  }
}
```

## Lógica de curadoria

| Seção | Limite | Critério |
|---|---|---|
| `bestsellers` | 20 | Top produtos por **vendas nos últimos 30 dias**. Se não há vendas, fallback para **mais recentes** |
| `curated` | 10 | Top artworks por vendas, com **ordem embaralhada** para variedade |
| `featuredArtists` | 8 | Top sellers por vendas nos últimos 30 dias |

## Uso no frontend

Três seções independentes na home — cada uma tem seu próprio carousel/grid.

- **Clique em produto** → `/stores/{storeSlug}/products/{slug}`
- **Clique em artwork** → página da arte (usando `artistSlug`)
- **Clique em artista** → `/stores/{slug}`

:::info Zero chamadas extras na home
A home completa vem em **1 request**. Não precisa hidratar cada seção separadamente.
:::

:::tip Fallback de thumbnail
`thumbnailUrl` vem sempre preenchido pelo backend (render ou fallback). O frontend não precisa implementar a lógica de fallback chain aqui — só exibir.
:::

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| `app/services/discovery.py` | Lógica de curadoria (queries + agrupamento) |
| `app/routers/discovery.py` | Exposição do endpoint `GET /discovery/home` |
