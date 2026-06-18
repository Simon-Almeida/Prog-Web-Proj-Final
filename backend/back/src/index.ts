import type { Core } from '@strapi/strapi';

const CONTENT_TYPES = ['machine', 'model', 'tab', 'tag', 'conversation', 'message'];
const PUBLIC_ACTIONS = ['find', 'findOne', 'create', 'update', 'delete'];

export default {
  register({ strapi: _strapi }: { strapi: Core.Strapi }) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await openPublicPermissions(strapi);
    await seedData(strapi);
  },
};

async function openPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) return;

  const actions = CONTENT_TYPES.flatMap(ct =>
    PUBLIC_ACTIONS.map(a => `api::${ct}.${ct}.${a}`)
  );

  const permissions = await strapi.db
    .query('plugin::users-permissions.permission')
    .findMany({
      where: {
        action: { $in: actions },
        role: { id: publicRole.id },
      },
    });

  for (const perm of permissions) {
    await strapi.db
      .query('plugin::users-permissions.permission')
      .update({ where: { id: perm.id }, data: { enabled: true } });
  }
}

async function seedData(strapi: Core.Strapi) {
  const machineCount = await strapi.db.query('api::machine.machine').count({});
  if (machineCount > 0) return;

  const simon = await strapi.db.query('api::machine.machine').create({
    data: { name: 'Simon (RTX 2060)', baseUrl: 'http://localhost:11434' },
  });
  const rodrigo = await strapi.db.query('api::machine.machine').create({
    data: { name: 'Rodrigo (RTX 4060)', baseUrl: 'http://localhost:11434' },
  });

  await strapi.db.query('api::model.model').createMany({
    data: [
      { name: 'llama3.2', displayName: 'Llama 3.2', paramSize: '3B', machine: simon.id },
      { name: 'mistral', displayName: 'Mistral', paramSize: '7B', machine: simon.id },
      { name: 'llama3.1', displayName: 'Llama 3.1', paramSize: '8B', machine: rodrigo.id },
      { name: 'deepseek-r1', displayName: 'DeepSeek R1', paramSize: '7B', machine: rodrigo.id },
    ],
  });

  await strapi.db.query('api::tab.tab').createMany({
    data: [
      {
        key: 'general',
        label: 'General',
        systemPrompt: 'You are a helpful assistant.',
        accent: '#6366f1',
      },
      {
        key: 'code',
        label: 'Code',
        systemPrompt: 'You are an expert software engineer. Provide concise, correct code.',
        accent: '#10b981',
      },
      {
        key: 'creative',
        label: 'Creative',
        systemPrompt: 'You are a creative writing assistant. Be imaginative and expressive.',
        accent: '#f59e0b',
      },
    ],
  });
}
