---
sidebar_position: 1
slug: /
title: Visão Geral
---

# Labanana API

Construa produtos print-on-demand usando nossa plataforma.

Labanana é um marketplace de print-on-demand. Artistas fazem upload de suas artes e as aplicam em produtos (canecas, camisetas, posters). A plataforma cuida da fabricação e entrega.

## Quem faz o quê

```mermaid
graph LR
    subgraph Admin
        PT[ProductType] --> Assets
        PT --> Options
        Assets --> Variants
        PT --> Templates
    end

    subgraph Seller
        AW[Artwork] --> SP[SellerProduct]
        SP --> Renders
        SP --> Preços
    end

    subgraph Cliente
        Loja --> Compra
    end

    Templates --> Renders
    Variants --> SP
    Renders --> Loja
```

| Perfil | O que faz | Guia |
|--------|-----------|------|
| **Admin** | Configura catálogo: tipos de produto, assets, options, variants, templates | [Guia do Admin](/docs/flows/admin-setup) |
| **Seller (artista)** | Upload de arte, cria produtos, configura renders, define preços, publica | [Guia do Seller](/docs/flows/seller-product) |
| **Cliente** | Navega a loja, escolhe variantes/opções, compra | [Frontend](/docs/frontend/public-page) |

## Comece por aqui

<div className="row">
  <div className="col col--4">

### Quickstart

Novo na Labanana? Configure seu primeiro produto em 5 minutos.

[Ir para o Quickstart](/docs/getting-started/quickstart)

  </div>
  <div className="col col--4">

### Conceitos

Entenda a distinção entre Assets e Options — o coração da plataforma.

[Ver Conceitos](/docs/concepts/assets-and-options)

  </div>
  <div className="col col--4">

### Sou Seller

Já tem acesso? Vá direto para o fluxo de criação de produto.

[Guia do Seller](/docs/flows/seller-product)

  </div>
</div>

:::tip API Interativa
Acesse a documentação interativa: [Swagger UI](https://api.labanana.art/docs) | [ReDoc](https://api.labanana.art/redoc)
:::
