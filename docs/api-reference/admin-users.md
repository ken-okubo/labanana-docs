---
sidebar_position: 12
title: Admin — Usuários
---

# Admin — Gestão de Usuários

Ações administrativas sobre `User` e suas roles. Todos os endpoints exigem role `admin`.

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/users` | Cria user |
| `GET` | `/users?role=seller` | Lista (filtro opcional) |
| `GET` | `/users/{userId}` | Detalhe |
| `POST` | `/users/{userId}/suspend` | Suspende — bloqueia login |
| `POST` | `/users/{userId}/activate` | Reativa |
| `POST` | `/users/{userId}/roles/{role}` | Adiciona role (`customer`, `seller`, `admin`) |
| `DELETE` | `/users/{userId}/roles/{role}` | Remove role |

## Estados do User

| `status` | Efeito |
|---|---|
| `active` | Login normal |
| `inactive` | Default em alguns fluxos internos (ex: aguardando ativação) |
| `suspended` | Tentativa de login retorna **401** |

## Regras críticas

| Regra | HTTP | Mensagem |
|---|:---:|---|
| Admin não pode se auto-suspender | `400` | `"Cannot suspend yourself"` |
| Admin não pode remover a própria role `admin` | `400` | `"Cannot remove admin role from yourself"` |
| User precisa manter pelo menos 1 role | `400` | `"User must have at least one role"` |

:::danger Self-actions bloqueadas
A API protege contra o admin logado "travar a própria conta" — as 3 regras acima garantem que um admin **não consegue** se deixar sem permissão ou sem acesso.
:::

## Multi-role

Um mesmo user pode ter múltiplas roles (ex: `customer` + `seller`). Um seller que quer testar a loja como comprador mantém ambas.

## Exemplos

### Promover user existente a admin

```bash
curl -X POST https://api.labanana.art/users/{userId}/roles/admin \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Suspender seller problemático

```bash
curl -X POST https://api.labanana.art/users/{userId}/suspend \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Reativar

```bash
curl -X POST https://api.labanana.art/users/{userId}/activate \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Remover role

```bash
curl -X DELETE https://api.labanana.art/users/{userId}/roles/seller \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

## Role automático via profile

Criar ou deletar profile adiciona/remove role automaticamente:

| Ação | Efeito em role |
|---|---|
| `POST /profiles/seller/me` | Adiciona `role=seller` |
| `DELETE /profiles/seller/me` | Remove `role=seller` |
| `POST /profiles/customer/me` | Adiciona `role=customer` |
| `DELETE /profiles/customer/me` | Remove `role=customer` |

Se o user ficaria sem nenhuma role após a remoção, a API **bloqueia** (regra "pelo menos 1 role").

## Suspensão vs Soft Delete

Não há endpoint de hard delete de user na API admin. Para remover um user:

1. **Suspender** (`/suspend`) bloqueia login imediatamente
2. Se quiser remover dados dos profiles (ex: dados LGPD), deletar profiles separadamente
3. Hard delete só via script `scripts/cleanup_all.py` (ambiente de dev — ver [Scripts & Cron](/docs/development/scripts-and-cron))

## UX sugerida no painel admin

- **Lista de usuários** com filtro por role (`?role=seller`, `?role=admin`, etc.) e por status
- **Badge de status** com cores: `active` (verde), `inactive` (cinza), `suspended` (vermelho)
- **Ações por linha:** suspender/reativar, adicionar/remover role
- **Ao tentar suspender a si mesmo** ou remover própria role admin: UI desabilita o botão e exibe tooltip explicando a regra
