import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  documentation: {
    enabled: true,
    config: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Local AI Chat API',
        description: 'REST API for the Local AI Chat web app (Programacao Web, IPT)',
      },
      'x-strapi-config': {
        plugins: null,
        mutateDocumentation: null,
      },
    },
  },
});

export default config;
