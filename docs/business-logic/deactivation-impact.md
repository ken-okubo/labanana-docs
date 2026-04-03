---
sidebar_position: 2
title: Impacto de Desativação
---

# Impacto de Desativar / Deletar Entidades

Guia de consequências para cada tipo de entidade. Use como referência ao implementar warnings no frontend.

:::danger Regra geral
Pedidos existentes **nunca** são afetados por nenhuma operação de delete/inativação (design by snapshot). O risco principal está na **visibilidade na loja** e na **falta de cascade automático**.
:::

---

## ProductTypeAsset

**Exemplo:** desativar `size=350ml`

**O que acontece:**
- Valor some das `assetDefinitions` na loja
- Novos templates/variants não podem usar esse valor
- Variants existentes **continuam ativas** — não são desativadas automaticamente

:::warning Mensagem para o frontend
"Desativar este asset irá removê-lo das opções visíveis na loja. Variantes e templates existentes que usam este valor continuarão funcionando, mas não poderão ser recriados."
:::

---

## ProductTypeOption / OptionValue

**Exemplo:** desativar `color` ou `color=black`

| Ação | Efeito |
|---|---|
| **Inativar option** | Todas as values desaparecem. Seletor some do frontend. |
| **Inativar value** | Apenas aquele valor some (ex: "Preto" desaparece, "Branco" continua). |

**Impacto downstream:**
- `allowedOptions` nos SellerProducts **não é limpo automaticamente**
- Templates com essa option continuam no banco mas não aparecem na loja
- Renders existentes permanecem, mas cliente não consegue visualizar a opção

:::warning Mensagem para o frontend
"Desativar esta opção irá removê-la do seletor na loja. Renders e variantes existentes não são apagados, mas clientes não poderão selecionar esta opção em novas compras."
:::

---

## ProductVariant

**Exemplo:** desativar a variant `350ml + glossy`

**O que acontece:**
- SKU é liberado (`sku = null`) para reuso
- Variant some das listagens do catálogo admin
- `SellerProductVariant` que referencia esta variant **continua ativa** — não é desativada automaticamente
- Sellers continuam vendendo com o preço antigo

:::danger Mensagem para o frontend
"Desativar esta variante do catálogo **não** desativa automaticamente os SKUs dos sellers que a utilizam. Os sellers continuarão vendendo até que suas variantes sejam desativadas manualmente. Considere notificar os sellers afetados."
:::

---

## Template

**Exemplo:** desativar `caneca-350ml-black-v1`

**O que acontece:**
- Template excluído das buscas de render na loja
- **SKUs que dependiam exclusivamente deste template ficam sem imagens**
- Renders e placements permanecem no banco (não são deletados)
- Seller **não é notificado** — produto simplesmente perde a imagem

:::warning Mensagem para o frontend
"Desativar este template irá remover os mockups associados da visualização na loja. SKUs que dependem exclusivamente deste template ficarão sem imagem. Renders podem ser restaurados reativando o template."
:::

---

## SellerProduct

| Ação | Tipo | Efeito |
|---|---|---|
| **Arquivar** (seller) | Soft (`status=archived`) | Produto some da loja. Pode ser reativado. |
| **Deletar** (admin) | Hard | Remove produto, variants, imagens, renders e placements. |

:::danger Hard delete (admin) — cuidado!
Deleta **todos** os renders do artwork, mesmo que ele seja usado em outro produto. Se o mesmo artwork for compartilhado, os renders do **outro produto** também são apagados.
:::

:::info Arquivar
"Arquivar este produto irá removê-lo da loja. Pode ser reativado a qualquer momento. Pedidos existentes não são afetados."
:::

---

## SellerProductVariant (SKU do Seller)

**Deletar** remove o SKU permanentemente. Não é possível deletar o último SKU (precisa arquivar o produto).

- SKU some da loja imediatamente
- Faixa de preço (`minPrice`/`maxPrice`) é recalculada automaticamente
- Renders são compartilhados por template, não por variant — permanecem

---

## Resumo de Segurança

| Entidade | Pedidos OK? | Cascade Auto? | Risco Principal |
|---|---|---|---|
| Asset | Sim | Nao | JSONB orfao em variants |
| Option/Value | Sim | Nao | Opcao some da UI silenciosamente |
| ProductVariant | Sim | Nao | Seller continua vendendo |
| Template | Sim | Nao | SKUs ficam sem imagem |
| SellerProduct (archive) | Sim | Nao | Pode ser reativado |
| SellerProduct (hard delete) | Sim | Parcial | Render loss cross-product |
| SellerProductVariant | Sim | Nao | Minimo -- preco recalcula |
