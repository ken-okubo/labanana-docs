# LABANANA Docs

Documentacao da plataforma Labanana -- Print on Demand.

Built with [Docusaurus 3](https://docusaurus.io/).

## Setup

```bash
npm install
cp .env.example .env
```

## Development

```bash
npm start
```

Abre em `http://localhost:3000`. Mudancas em `.md`, `.mdx`, `.tsx` e `.css` atualizam automaticamente. Mudancas em `docusaurus.config.ts` e `sidebars.ts` precisam reiniciar o server.

## Build

```bash
npm run build
npm run serve   # preview do build local
```

## Estrutura

```
docs/
  getting-started/   Quickstart
  concepts/          Assets, Options, Variants, Templates, Pricing
  flows/             Guia Admin, Guia Seller, Upload de Imagens
  api-reference/     Endpoints, Auth, Orders
  frontend/          Pagina Publica, Galeria, TypeScript Types
  business-logic/    Regras, Impacto de Desativacao
  faq.md

src/
  components/        WaterfallChart, CoordinateSystem, FlowSteps
  pages/             Home, Legal (terms, privacy)
  css/               Custom theme
```

## Ambiente

| Variavel | Default | Descricao |
|---|---|---|
| `API_BASE_URL` | `https://api.labanana.art` | Base URL da API (muda links Swagger/ReDoc) |

## Deploy

Build gera arquivos estaticos em `build/`. Compativel com qualquer hosting (Vercel, Netlify, GitHub Pages, S3).
