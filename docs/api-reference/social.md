---
sidebar_position: 9
title: Social (Follows e Likes)
---

# Social — Follows e Likes

Sistema de interações sociais. Qualquer usuário autenticado pode **seguir** um seller e **curtir** um produto. Ambos são toggle direto, sem aprovação.

## Conceitos

| Conceito | Descrição |
|---|---|
| **Follow** | Usuário logado segue um `SellerProfile`. Toggle on/off. |
| **Like** | Usuário logado curte um `SellerProduct` **ativo**. Toggle on/off. |

## Toggle Follow

```http
POST /stores/{store_slug}/follow
```

Requer `Authorization: Bearer <token>`. Se já segue, deixa de seguir; se não segue, passa a seguir.

```json
{
  "isFollowing": true,
  "followersCount": 42
}
```

:::danger Self-follow bloqueado
Seller não pode seguir a própria loja — retorna `400 Bad Request`.
:::

## Toggle Like

```http
POST /stores/{store_slug}/products/{product_slug}/like
```

Requer `Authorization: Bearer <token>`. Toggle on/off.

```json
{
  "isLiked": true,
  "likesCount": 15
}
```

:::warning Produto inativo
Não é possível curtir produto que não está `active` — retorna `404`.
:::

## Contadores na página da loja

`GET /stores/{store_slug}` retorna contadores sociais:

```json
{
  "id": "uuid",
  "storeName": "...",
  "storeSlug": "...",
  "displayName": "...",
  "bio": "...",
  "avatarUrl": "...",
  "bannerUrl": "...",
  "socialLinks": [],
  "followersCount": 42,
  "followingCount": 10,
  "likesReceivedCount": 128,
  "isFollowing": null
}
```

| Campo | Descrição |
|---|---|
| `followersCount` | Quantos usuários seguem este seller |
| `followingCount` | Quantos sellers o dono desta loja segue |
| `likesReceivedCount` | Total de likes em todos os produtos deste seller |
| `isFollowing` | `true`/`false` se autenticado, **`null`** se visitante anônimo |

:::info Autenticação opcional
O endpoint `GET /stores/{slug}` aceita Bearer token opcionalmente. Com token válido, `isFollowing` é preenchido. Sem token, vem `null`.
:::

## Likes nos produtos

Os endpoints públicos de produto retornam os campos de like:

- `GET /stores/{store_slug}/products` — listagem
- `GET /stores/{store_slug}/products/{product_slug}` — detalhe

```json
{
  "id": "uuid",
  "title": "...",
  "likesCount": 15,
  "isLiked": null
}
```

:::tip Bulk sem N+1
Na listagem, os likes são buscados em **bulk** (uma query para counts, outra para liked-by-user). Não há N+1 mesmo para centenas de produtos.
:::

## Regras

| Regra | Detalhe |
|---|---|
| **Self-follow bloqueado** | Seller não segue própria loja (`400`) |
| **Produto inativo** | Não curtível (`404`) |
| **Idempotência** | Chamar follow quando já segue apenas desfaz — seguro para retry |
| **Sem cascata** | Produto arquivado → likes permanecem no banco mas não são contabilizados |

## Modelo de dados

```
user_follows_seller
├── id (UUID PK)
├── follower_user_id (FK → users.id)
├── seller_profile_id (FK → seller_profiles.id)
└── created_at
    UniqueConstraint(follower_user_id, seller_profile_id)

user_likes_product
├── id (UUID PK)
├── user_id (FK → users.id)
├── seller_product_id (FK → seller_products.id)
└── created_at
    UniqueConstraint(user_id, seller_product_id)
```

## UX sugerida no frontend

**Botão "Seguir":**
- `isFollowing === null` (anônimo) → mostrar botão "Seguir", ao clicar redireciona para login
- `isFollowing === false` → botão "Seguir" (neutro)
- `isFollowing === true` → botão "Seguindo" (preenchido, clique desfaz)
- Ao toggle, usar `followersCount` do response para atualizar o contador inline (sem re-fetch)

**Botão de Like:**
- `isLiked === null` (anônimo) → coração vazio, clique leva ao login
- `isLiked === false` → coração vazio
- `isLiked === true` → coração cheio / preenchido
- Mesma UX: update inline com `likesCount` do response
