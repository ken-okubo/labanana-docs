---
sidebar_position: 7
title: Autenticação
---

# Autenticação

A API usa **JWT** (Bearer token) com access + refresh tokens.

## Conceitos

- **Cadastro mínimo** — apenas email, senha e nome. Telefone e endereço são coletados no checkout.
- **Roles** — `customer`, `seller`, `admin`. Customer é o padrão no signup público.
- **Seller signup** — via convite (waitlist → invite token)

:::info Como usar nas requests
Todas as requests autenticadas usam o header:
```
Authorization: Bearer <accessToken>
```
:::

---

## Cadastro (Signup)

```http
POST /auth/signup
```

```json
{
  "email": "cliente@email.com",
  "password": "minimo8chars",
  "name": "João Silva"
}
```

| Campo | Obrigatório | Validação |
|---|---|---|
| `email` | Sim | Formato válido, único (409 se duplicado) |
| `password` | Sim | Mínimo 8 caracteres |
| `name` | Sim | 1-150 caracteres |

<details>
<summary>Response (201)</summary>

```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "tokenType": "bearer"
}
```

</details>

O usuário é criado com role `customer` e já recebe tokens para uso imediato.

---

## Login

```http
POST /auth/login
```

```json
{
  "email": "cliente@email.com",
  "password": "minhasenha123"
}
```

<details>
<summary>Response</summary>

```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "tokenType": "bearer"
}
```

</details>

---

## Refresh Token

```http
POST /auth/refresh
```

```json
{
  "refreshToken": "eyJ..."
}
```

Retorna novos access + refresh tokens.

---

## Dados do Usuário

```http
GET /auth/me
```

Requer `Authorization: Bearer <accessToken>`.

<details>
<summary>Response</summary>

```json
{
  "id": "uuid",
  "email": "cliente@email.com",
  "name": "João Silva",
  "status": "active",
  "roles": ["customer"],
  "createdAt": "2026-03-25T10:00:00Z"
}
```

</details>

---

## Alterar Senha

```http
POST /auth/change-password
```

```json
{
  "currentPassword": "senhaatual",
  "newPassword": "novasenha123"
}
```

---

## Recuperar Senha

```http
POST /auth/password/forgot
```

Envia email com token de reset.

```http
GET /auth/password/reset/validate?token=xxx
```

Valida se o token ainda é válido.

```http
POST /auth/password/reset
```

```json
{
  "token": "token-do-email",
  "newPassword": "novasenha123"
}
```
