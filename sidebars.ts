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
      link: {type: 'generated-index', title: 'Guia do Seller', description: 'Upload de arte, criacao de produto, renders e publicacao.'},
      items: [
        'flows/seller-product',
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
      ],
    },

    {
      type: 'category',
      label: 'Frontend',
      collapsed: true,
      link: {type: 'generated-index', title: 'Frontend', description: 'Logica de renderizacao, galeria e types.'},
      items: [
        'frontend/public-page',
        'frontend/gallery',
        'frontend/types',
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

    'faq',
  ],
};

export default sidebars;
