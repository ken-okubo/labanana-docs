---
sidebar_position: 14
title: Power Tools (hidden endpoints)
---

# Power Tools — Hidden Endpoints & Comportamentos Silenciosos

Endpoints e comportamentos do backend que são fáceis de esquecer por não aparecerem no fluxo "normal". **Use com cuidado** — vários têm efeitos colaterais fora do contexto onde são chamados.

## `POST /orders/{orderId}/dev-pay` — DEV ONLY

Simula aprovação de pagamento **sem passar pelo Asaas**. Útil em testes locais.

- **Auth:** user dono da order
- **Gate:** `settings.environment ∈ {local, dev, development}`. Em produção retorna `403`
- **Efeito:** muda `paymentStatus` para `approved`, dispara `_trigger_shipment_label()` (tenta gerar etiqueta no Melhor Envio sandbox)

:::danger Verifique `ENVIRONMENT` em produção
Se a variável de ambiente estiver configurada errado (ex: `ENVIRONMENT=dev` em prod), este endpoint pode ficar disponível em produção — **um user autenticado poderia marcar pedidos como pagos**.
:::

Guia de teste end-to-end: [Testes Locais com Tunnel](/docs/development/local-testing-tunnel#teste-com-dev-pay-fallback-sem-asaas).

---

## `POST /seller-products/admin` — Admin cria produto em nome do seller

Idêntico a `POST /seller-products/me`, mas aceita `sellerProfileId` no body. Útil para:

- **Onboarding assistido** de seller novo (admin cadastra o primeiro produto)
- **Criar produto-padrão** para todos da plataforma
- **Debug / correção manual**

Ownership e validações normais se aplicam (artwork deve existir e ser do seller, variant ativa, etc.).

---

## `DELETE /seller-products/admin/{productId}` — Hard delete

**Diferente** do `DELETE /seller-products/me/{id}` (que faz archive/soft-delete). Este endpoint:

1. Remove todos os `Render` do S3
2. Remove todas as `ProductImage` do S3
3. Remove `Placement`s
4. Remove variantes
5. Remove o `SellerProduct` (DB)

:::danger Irreversível e pode afetar outros produtos
Se o `artwork` compartilhado for usado em outro produto, os renders do outro produto também são perdidos. Use apenas para testes, duplicatas acidentais, ou compliance (LGPD).
:::

Ver [Impacto de Deletar/Inativar](/docs/business-logic/deactivation-impact#sellerproduct).

---

## `GET /seller-products/me/{productId}/preview` — Preview como PDP

Retorna **a mesma resposta** da página pública do produto (`GET /stores/.../products/...`), **independente do `status`** do produto (draft, paused, archived).

**Caso de uso:** seller quer pré-visualizar o produto antes de publicar, enquanto ainda está em `draft`. Ou admin quer revisar um produto arquivado.

---

## `POST /seller-products/me/{productId}/generate-skus` — Cartesian product de SKUs

Gera um `SellerProductVariant` para **cada combinação possível** dos `assets` do ProductType, preservando variantes já existentes.

**Caso de uso:** admin adicionou um novo asset ao ProductType (ex: novo tamanho) e o seller precisa popular as variantes sem criar uma por uma.

Comportamento similar ao `generate-variants` do ProductType ([ver Variants](/docs/concepts/variants#geração-automática-produto-cartesiano)), mas aplicado ao SellerProductVariant.

---

## `POST /shipping/poll-tracking` — Trigger manual do poller

Admin força o poll imediatamente, sem esperar o cron de 30 min. Retorna `{total, updated, errors, details[]}`.

**Quando usar:**
- Debug de integração com ME em dev
- Admin precisa atualizar status urgente sem esperar 30 min
- Depois de gerar etiqueta manualmente, forçar o primeiro poll

Ver [Tracking Polling](/docs/integrations/shipping-melhor-envio#4-tracking-polling-estratégia-principal).

---

## Webhook auto-refund (comportamento silencioso)

Em `app/routers/webhooks.py:107-124`, quando o Asaas envia webhook `RECEIVED`/`CONFIRMED` para uma order que **já foi cancelada ou reembolsada** pelo admin:

- Status `RECEIVED` / `CONFIRMED` → backend **chama `asaas.refund_payment()`** automaticamente
- Status `PENDING` → backend **chama `asaas.cancel_payment()`**

**Por quê:** evita que o cliente seja cobrado se a ordem foi cancelada entre o redirect e o pagamento efetivo.

:::warning Admin não é notificado
O efeito aparece apenas em `logger.info` — não há email, push ou entrada em dashboard. Se você investigar por que uma order `cancelled` apareceu `refunded` no Asaas, procure nos logs do backend próximo ao momento do webhook.
:::

Detalhes: [Pagamentos (Asaas) — proteção](/docs/integrations/payments-asaas#proteção-contra-pagamento-em-order-cancelada).

---

## Payout hooks silenciosos

Estes hooks disparam dentro de `app/crud/order.py` e **não aparecem na API**. Conhecer a tabela evita duplicar a lógica ao adicionar novos caminhos de mutação de order:

| Gatilho | Hook chamado |
|---|---|
| `update_payment_status(approved)` | `create_payout_items_for_approved_order` (items viram `held`) |
| `update_payment_status(refunded / cancelled)` | `reverse_payout_items_for_order` |
| `_sync_fulfillment_from_shipment → delivered` | `release_payout_items_for_order` (`held → releasable`) |
| `update_item_fulfillment(delivered)` | `release_payout_items_for_order` |
| `update_item_fulfillment(returned)` | `reverse_payout_item` |
| `cancel_order_with_refund` | via `update_payment_status` (reversão em cascata) |

:::info Adicionou novo caminho de mutação?
Se você criar uma nova função que muda `Order.payment_status` ou `OrderItem.fulfillment_status`, garanta que o hook certo seja chamado — senão o `SellerPayoutItem` correspondente não vai atualizar e o seller pode ficar sem ver o saldo.
:::

Detalhes completos em [Dashboard do Seller — Payout Hooks](/docs/flows/seller-dashboard#payout-hooks-para-quem-trabalha-no-backend).
