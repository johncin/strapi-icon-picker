import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('strapi-icon-picker')
      .service('myService')
      .getWelcomeMessage();
  },
});
