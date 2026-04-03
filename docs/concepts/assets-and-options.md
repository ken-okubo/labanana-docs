---
sidebar_position: 1
title: Assets vs Options
---

# Assets vs Options

A plataforma separa as características de um produto em dois tipos fundamentais. Entender essa distinção é essencial para configurar produtos corretamente.

## Assets (Ativos)

**Características estruturais/de fabricação.** Definem o que será produzido fisicamente.

- Afetam custo de produção e logística
- Cada combinação de assets = uma **ProductVariant** com seu próprio custo
- Exemplos: tamanho (350ml/700ml), acabamento (brilhante/fosco), material (algodão/poliéster)

:::warning Regra
Se muda o que é fabricado e impacta no custo de produção → **é Asset**.
:::

## Options (Opções)

**Características puramente visuais.** O cliente escolhe na hora da compra, mas **NÃO** afetam preço nem fabricação.

- Controlam quais renders (mockups) são exibidos na galeria
- Exemplos: cor (preto/branco), lado (frente/costas), orientação (retrato/paisagem)

:::tip Regra
Se é apenas visual e não muda custo → **é Option**.
:::

## Comparação

|                   | **Assets**                                      | **Options**                      |
| ----------------- | ----------------------------------------------- | -------------------------------- |
| Afeta preço?      | Indiretamente (cada variante tem preço próprio) | Nunca                            |
| Afeta fabricação? | Sim                                             | Nunca                            |
| Afeta galeria?    | Sim (sempre filtra)                             | Depende do `displayBehavior`     |
| Quem define?      | Admin (por ProductType)                         | Admin (por ProductType)          |
| Quem escolhe?     | Cliente (seleciona variante)                    | Cliente (seleciona opção visual) |

## Regra de seleção única

Tanto assets quanto options seguem a regra de **uma value por key**. O formato é sempre `dict[str, str]`:

```json
{ "size": "350ml", "finish": "glossy" }
```

:::danger Nunca múltiplos valores por key
```json
// ERRADO
{ "size": ["350ml", "700ml"] }
```
:::

## Onde cada um é armazenado

| Recurso                  | Campo                | Quem define | Significado                                         |
| ------------------------ | -------------------- | ----------- | --------------------------------------------------- |
| **ProductVariant**       | `assets`             | Admin       | Combinação de assets = 1 variant com seu custo      |
| **Template**             | `assets`             | Admin       | Match exato com a variant                           |
| **Template**             | `options` (nullable) | Admin       | Match opcional — filtra renders por option          |
| **SellerProductVariant** | `allowed_options`    | Seller      | Quais options permitir. `{}` = todas do ProductType |

:::info
**Options não ficam na variant.** A variant define apenas assets (o que é fabricado).
Options são escolhidas pelo cliente na hora da compra e usadas para filtrar os renders/templates exibidos na galeria.
:::

## Campos da Option

Cada option tem campos que orientam o frontend sobre **como renderizar o seletor**:

| Campo             | Valores possíveis                 | O que faz                                                                      |
| ----------------- | --------------------------------- | ------------------------------------------------------------------------------ |
| `inputType`       | `select`, `radio`, `color_picker` | Tipo de input HTML do frontend                                                 |
| `displayBehavior` | `filter`, `show_all`              | Como afeta a galeria de renders                                                |
| `required`        | `true`, `false`                   | Se o cliente deve selecionar um valor antes de comprar                         |

### Display Behavior

| Valor      | Comportamento                                    | Exemplo                                                    |
| ---------- | ------------------------------------------------ | ---------------------------------------------------------- |
| `filter`   | Filtra galeria pelo valor selecionado            | Cor: ao selecionar "preto", só mostra renders de cor preta |
| `show_all` | Mostra todos os renders, independente da seleção | Lado: sempre mostra frente + costas                        |

### Exemplo prático

```
Option "color" (inputType: color_picker, displayBehavior: filter)
  → Frontend renderiza círculos coloridos (usando hexColor de cada value)
  → Ao clicar em "Preto", filtra galeria para só mostrar renders pretos

Option "side" (inputType: radio, displayBehavior: show_all)
  → Frontend renderiza botões "Frente" / "Costas"
  → Galeria sempre mostra ambos os lados, independente da seleção
```

## Desativação e impacto

Todos os deletes são **soft delete** (`is_active = false`). A desativação **não é automática em cascata**.

### Desativar um Asset

| Recurso afetado | O que acontece | Automático? |
| --- | --- | --- |
| **ProductVariant** com esse asset | Continua existindo, mas não deveria ser vendida | Não — admin desativa manualmente |
| **Template** com esse asset | Continua existindo, mas não deveria ser usado | Não — admin desativa manualmente |

:::info
Desativar um asset é raro (parar de fabricar um tamanho). O admin deve desativar a variant e os templates associados.
:::

### Desativar uma Option

| Recurso afetado | O que acontece | Automático? |
| --- | --- | --- |
| **ProductVariant** | Nenhum impacto — variants não têm options | — |
| **Template** com essa option | A API filtra options inativas ao retornar dados públicos | Sim |

:::tip
Desativar uma option é mais seguro — como options não afetam fabricação nem preço, o impacto é apenas visual.
:::

### Resumo de desativação

| Recurso desativado | Impacto em cascata |
| --- | --- |
| Asset | Nenhum automático — admin desativa variants/templates manualmente |
| Option | API filtra automaticamente nos endpoints públicos |
| Option Value | Value desaparece do seletor, templates não afetados |
| Variant | API bloqueia criação de novas vendas |
| ProductType | API impede criação de novos seller products |

---

## Regras rápidas

- Assets afetam fabricação e custo → definem **o que é produzido**
- Options são puramente visuais → **nunca afetam preço**
- Uma value por key → formato `{"key": "value"}`, nunca arrays
- Options não ficam na variant → variant define **apenas** assets
- Options não afetam qual SKU é selecionado → SKU = combinação de assets
- Desativação não é automática em cascata → admin desativa manualmente
