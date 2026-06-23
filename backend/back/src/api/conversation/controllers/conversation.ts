import { factories } from '@strapi/strapi';

const DEFAULT_POPULATE = { tab: true, tags: true, models: true };

export default factories.createCoreController('api::conversation.conversation', () => ({
  async find(ctx) {
    ctx.query.populate ??= DEFAULT_POPULATE;
    return super.find(ctx);
  },
  async findOne(ctx) {
    ctx.query.populate ??= DEFAULT_POPULATE;
    return super.findOne(ctx);
  },
}));
