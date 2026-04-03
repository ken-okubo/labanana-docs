import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import 'dotenv/config';

const apiBaseUrl = process.env.API_BASE_URL || 'https://api.labanana.art';

const config: Config = {
  customFields: {
    apiBaseUrl,
    apiDocsUrl: `${apiBaseUrl}/docs`,
    apiRedocUrl: `${apiBaseUrl}/redoc`,
  },
  title: 'LABANANA Docs',
  tagline: 'Documentação da plataforma Labanana - Print on Demand',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.labanana.art',
  baseUrl: '/',

  organizationName: 'labanana',
  projectName: 'labanana-docs',

  onBrokenLinks: 'throw',

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR', 'en'],
    localeConfigs: {
      'pt-BR': {
        label: 'Português',
        htmlLang: 'pt-BR',
      },
      en: {
        label: 'English',
        htmlLang: 'en',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/labanana-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'LABANANA',
      logo: {
        alt: 'Labanana Logo',
        src: 'img/LABANANA-logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentação',
        },
        {
          type: 'dropdown',
          label: 'API Interativa',
          position: 'left',
          items: [
            {
              href: `${apiBaseUrl}/docs`,
              label: 'Swagger UI',
            },
            {
              href: `${apiBaseUrl}/redoc`,
              label: 'ReDoc',
            },
          ],
        },
        {
          type: 'dropdown',
          label: 'Legal',
          position: 'left',
          items: [
            {
              to: '/legal/terms',
              label: 'Termos de Uso',
            },
            {
              to: '/legal/privacy',
              label: 'Política de Privacidade',
            },
          ],
        },
        {
          href: 'https://github.com/ken-okubo/labanana-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentação',
          items: [
            {
              label: 'Início Rápido',
              to: '/docs/getting-started/quickstart',
            },
            {
              label: 'Conceitos',
              to: '/docs/concepts/assets-and-options',
            },
            {
              label: 'Fluxos',
              to: '/docs/flows/admin-setup',
            },
            {
              label: 'API Reference',
              to: '/docs/api-reference/endpoints',
            },
          ],
        },
        {
          title: 'API',
          items: [
            {
              label: 'Swagger UI',
              href: `${apiBaseUrl}/docs`,
            },
            {
              label: 'ReDoc',
              href: `${apiBaseUrl}/redoc`,
            },
          ],
        },
        {
          title: 'Legal',
          items: [
            {
              label: 'Termos de Uso',
              to: '/legal/terms',
            },
            {
              label: 'Política de Privacidade',
              to: '/legal/privacy',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Labanana. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript', 'http'],
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
