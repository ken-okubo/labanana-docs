import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',

    {
      type: 'category',
      label: 'Inicio Rapido',
      collapsed: false,
      items: [
        'getting-started/quickstart',
      ],
    },

    {
      type: 'category',
      label: 'Conceitos',
      collapsed: false,
      link: {type: 'generated-index', title: 'Conceitos', description: 'Os pilares da plataforma Labanana.'},
      items: [
        'concepts/assets-and-options',
        'concepts/variants',
        'concepts/templates',
        {type: 'doc', id: 'concepts/pricing', label: 'Modelo de Precos'},
      ],
    },

    {
      type: 'html',
      value: '<hr style="margin: 0.75rem 0;" />',
    },

    {
      type: 'category',
      label: 'Guia do Admin',
      collapsed: false,
      link: {type: 'generated-index', title: 'Guia do Admin', description: 'Configuracao do catalogo, templates e gestao de pedidos.'},
      items: [
        'flows/admin-setup',
        'flows/image-upload',
        {type: 'doc', id: 'api-reference/orders', label: 'Gerenciar Pedidos'},
      ],
    },

    {
      type: 'category',
      label: 'Guia do Seller',
      collapsed: false,
      link: {type: 'generated-index', title: 'Guia do Seller', description: 'Onboarding, upload de arte, criacao de produto, renders, dashboard e payouts.'},
      items: [
        'flows/seller-onboarding',
        'flows/seller-product',
        'flows/seller-dashboard',
      ],
    },

    {
      type: 'html',
      value: '<hr style="margin: 0.75rem 0;" />',
    },

    {
      type: 'category',
      label: 'Integracoes',
      collapsed: false,
      link: {type: 'generated-index', title: 'Integracoes', description: 'Gateways externos: pagamento (Asaas) e frete (Melhor Envio).'},
      items: [
        'integrations/payments-asaas',
        'integrations/shipping-melhor-envio',
      ],
    },

    {
      type: 'html',
      value: '<hr style="margin: 0.75rem 0;" />',
    },

    {
      type: 'category',
      label: 'API Reference',
      collapsed: true,
      items: [
        'api-reference/endpoints',
        'api-reference/auth',
        'api-reference/orders',
        'api-reference/social',
        'api-reference/discovery',
        'api-reference/catalog-consolidated',
        'api-reference/product-gallery',
        'api-reference/admin-users',
        'api-reference/power-tools',
      ],
    },

    {
      type: 'category',
      label: 'Frontend',
      collapsed: true,
      link: {type: 'generated-index', title: 'Frontend', description: 'Logica de renderizacao, galeria, checkout e tracking.'},
      items: [
        'frontend/public-page',
        'frontend/gallery',
        'frontend/types',
        'frontend/checkout-flow',
        'frontend/status-and-tracking',
      ],
    },

    {
      type: 'category',
      label: 'Regras de Negocio',
      collapsed: true,
      items: [
        'business-logic/overview',
        'business-logic/deactivation-impact',
      ],
    },

    {
      type: 'category',
      label: 'Desenvolvimento',
      collapsed: true,
      link: {type: 'generated-index', title: 'Desenvolvimento', description: 'Setup local, testes end-to-end, scripts e cron.'},
      items: [
        'development/local-testing-tunnel',
        'development/scripts-and-cron',
      ],
    },

    'faq',
  ],
};

export default sidebars;
