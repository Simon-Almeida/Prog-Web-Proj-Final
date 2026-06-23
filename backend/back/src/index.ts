import type { Core } from '@strapi/strapi';

const CONTENT_TYPES = ['machine', 'model', 'tab', 'tag', 'conversation', 'message'];
const CRUD_ACTIONS  = ['find', 'findOne', 'create', 'update', 'delete'];

const SIMON_EMAIL    = 'school_sga@proton.me';
const SIMON_USERNAME = 'Simon';
const SIMON_ROLE     = { name: 'Simon', description: 'Super Admin', type: 'simon' };

export default {
  register({ strapi: _strapi }: { strapi: Core.Strapi }) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await openPublicPermissions(strapi);
    await ensureSimonRole(strapi);
    await seedData(strapi);
  },
};

// ---- helpers ----------------------------------------------------------------

async function upsertPermission(
  strapi: Core.Strapi,
  action: string,
  roleId: number,
) {
  const existing = await strapi.db
    .query('plugin::users-permissions.permission')
    .findOne({ where: { action, role: roleId } });

  if (existing) {
    if (!existing.enabled) {
      await strapi.db
        .query('plugin::users-permissions.permission')
        .update({ where: { id: existing.id }, data: { enabled: true } });
    }
  } else {
    await strapi.db
      .query('plugin::users-permissions.permission')
      .create({ data: { action, role: roleId, enabled: true } });
  }
}

async function openPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) return;

  for (const ct of CONTENT_TYPES) {
    for (const action of CRUD_ACTIONS) {
      await upsertPermission(strapi, `api::${ct}.${ct}.${action}`, publicRole.id);
    }
  }
}

async function ensureSimonRole(strapi: Core.Strapi) {
  // Find or create the Simon role
  let role = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: SIMON_ROLE.type } });

  if (!role) {
    role = await strapi.db
      .query('plugin::users-permissions.role')
      .create({ data: SIMON_ROLE });
  }

  // Grant all CRUD actions on every registered API content type.
  // Runs on every boot so new content types are covered automatically.
  const apiUids = Object.keys(strapi.contentTypes).filter(uid =>
    uid.startsWith('api::'),
  );

  for (const uid of apiUids) {
    for (const action of CRUD_ACTIONS) {
      await upsertPermission(strapi, `${uid}.${action}`, role.id);
    }
  }

  // Create the Simon user if not present and SIMON_PASSWORD env var is set
  const password = process.env.SIMON_PASSWORD;
  if (!password) return;

  const existing = await strapi.db
    .query('plugin::users-permissions.user')
    .findOne({ where: { email: SIMON_EMAIL } });

  if (existing) return;

  const hashed = await strapi
    .plugin('users-permissions')
    .service('user')
    .hashPassword(password);

  await strapi.db.query('plugin::users-permissions.user').create({
    data: {
      username: SIMON_USERNAME,
      email: SIMON_EMAIL,
      password: hashed,
      role: role.id,
      confirmed: true,
      blocked: false,
    },
  });
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
      { name: 'mistral',  displayName: 'Mistral',   paramSize: '7B', machine: simon.id },
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
