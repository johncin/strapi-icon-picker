import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => {
  // registeration phase
  strapi.customFields.register({
    name: 'strapi-icon-picker',
    plugin: 'strapi-icon-picker',
    type: 'json',
  });
};
