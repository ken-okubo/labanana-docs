---
sidebar_position: 8
title: FAQ
---

# FAQ

Respostas diretas para dúvidas operacionais.

:::tip Conceitos
Para entender como Assets, Options, Variants e Templates funcionam, veja a seção [Conceitos](/docs/concepts/assets-and-options).
:::

---

### Todos os valores monetários são em centavos?

Sim. `priceCents`, `baseCostCents` — sempre inteiros. Para exibir: `(priceCents / 100).toFixed(2)`.

---

### Qual a diferença entre o endpoint do seller e o público?

| Endpoint | Quem usa | Quando |
|---|---|---|
| `/seller-products/me/...` | Dashboard do seller (autenticado) | Gerenciamento, renders |
| `/stores/{slug}/products/{slug}` | Frontend público (sem auth) | Loja, PDP |

O frontend da loja **sempre** usa `/stores/...`.

---

### Como funciona o carrinho/checkout?

O checkout envia:
- `sellerProductVariantId` (o SKU selecionado)
- `selectedOptions` (ex: `{color: "black"}`)

O backend valida as options contra `allowedOptions` do SKU.

---

### O que acontece com pedidos existentes ao desativar algo?

Pedidos já feitos **não são cancelados**. A desativação só impede novas vendas/criações.

---

### A presigned URL expirou, o que faço?

Faça o presign novamente (`POST /presign`). A nova URL dura 15 minutos. O upload anterior (se incompleto) é descartado.

---

### O seller precisa renderizar todos os templates?

Não. O seller **escolhe** quais templates usar. Templates sem render simplesmente não aparecem na galeria. O frontend usa artwork preview como fallback.

---

### Posso usar o mesmo SKU em dois products?

O SKU é **por ProductType**. Ao desativar uma variant, o SKU é liberado para reuso. Mas dentro do mesmo ProductType, SKUs devem ser únicos.

---

### Como o frontend sabe qual preço mostrar?

O preço é fixo por SKU (`priceCents`). Trocar assets → troca de SKU → muda o preço. Trocar options → **nunca** muda o preço. O frontend exibe `minPriceCents` como "A partir de R$ X".
