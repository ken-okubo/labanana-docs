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

## Signup de Seller (via convite)

```http
POST /auth/signup/seller
```

Usado apenas para completar cadastro de seller **convidado** via waitlist. O artista recebe um `inviteToken` por email/WhatsApp e finaliza o cadastro definindo a senha.

```json
{
  "token": "a1b2c3...hex",
  "password": "minimo8chars"
}
```

**Comportamento:**

1. Valida o token (não expirado + waitlist com `status = invited`)
2. Cria `User` com `role=seller`
3. Cria `SellerProfile` (`onboarding_status=pending`, `storeStatus=unpublished`)
4. Muda waitlist para `status=converted`, grava `user_id` e `convertedAt`

Response: mesmos access + refresh tokens do signup público.

:::info Fluxo completo
Para o fluxo end-to-end (waitlist → invite → signup), ver [Onboarding do Seller](/docs/flows/seller-onboarding).
:::

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

## Atualizar Perfil

```http
PATCH /users/me
```

Atualiza dados do usuário autenticado. Todos os campos são **opcionais** — envie apenas o que deseja alterar.

```json
{
  "name": "Ken Okubo",
  "documentType": "cpf",
  "documentNumber": "123.456.789-09"
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `name` | string | Nome (1-150 chars) |
| `documentType` | string | `cpf`, `cnpj` ou `passport` |
| `documentNumber` | string | Número do documento (aceita com pontuação) |

**Validações:**

- `documentType` é **obrigatório quando `documentNumber` é enviado**
- CPF: 11 dígitos, validado com dígitos verificadores
- CNPJ: 14 dígitos, validado com dígitos verificadores
- Pontuação (`.`, `-`, `/`) é removida automaticamente
- `status` **não** pode ser alterado pelo próprio usuário

:::danger CPF/CNPJ é obrigatório para checkout
O **Asaas** (gateway de pagamento) exige CPF/CNPJ para criar o customer. Se o usuário não tem `documentNumber`, o `POST /orders` retorna erro.

**Fluxo recomendado no frontend:**
1. Antes de abrir o checkout, checar `GET /auth/me` — o usuário tem `documentNumber`?
2. Se **não**, coletar no formulário de checkout e chamar `PATCH /users/me` antes de criar o pedido
3. Se **sim**, seguir direto para `POST /orders`
:::

Response `200` retorna o `UserResponse` atualizado.

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
