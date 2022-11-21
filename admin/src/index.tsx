import React from 'react';
import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';
import IconPicker from './components/IconPicker/index';
import getTrad from './utils/getTrad';

const iconPacks = [
  'bootstrap',
  'boxiconsLogos',
  'boxiconsRegular',
  'boxiconsSolid',
  'crypto',
  'entypo',
  'entypoSocial',
  'evaiconsOutline',
  'evaiconsSolid',
  'evil',
  'faBrands',
  'faRegular',
  'faSolid',
  'feather',
  'fluentuiSystemFilled',
  'fluentuiSystemRegular',
  'foundation',
  'heroiconsOutline',
  'heroiconsSolid',
  'icomoon',
  'ioniconsOutline',
  'ioniconsSharp',
  'ioniconsSolid',
  'material',
  'materialOutlined',
  'materialRounded',
  'materialSharp',
  'materialTwotone',
  'octicons',
  'openIconic',
  'remixEditor',
  'remixFill',
  'remixLine',
  'simpleIcons',
  'typicons',
  'zondicons',
];

export default {
  register(app) {
    const name = pluginPkg.strapi.name;

    const pluginDescription =
      pluginPkg.strapi.description || pluginPkg.description;

    const plugin = {
      description: pluginDescription,
      intlLabel: {
        id: pluginId,
        defaultMessage: pluginId,
      },
      id: pluginId,
      initializer: Initializer,
      isReady: true,
      name,
    };

    app.registerPlugin(plugin);

    app.customFields.register({
      name,
      pluginId,
      type: 'json',
      intlLabel: {
        id: getTrad('strapi-icon-picker.label'),
        defaultMessage: pluginId,
      },
      intlDescription: {
        id: getTrad('strapi-icon-picker.description'),
        defaultMessage: pluginDescription,
      },
      components: {
        Input: async () =>
          import(
            /* webpackChunkName: "icon-picker-input-component" */ './components/IconPicker/index'
          ),
      },
      options: {
        advanced: [
          {
            sectionTitle: {
              id: getTrad(
                'strapi-icon-picker.options.advanced.packages.list.title'
              ),
              defaultMessage: 'Icon packages to use',
            },
            items: iconPacks.map((pack) => {
              return {
                name: pack,
                type: 'checkbox',
                value: 'checked',
                withDefaultValue: true,
                checked: true,
                intlLabel: {
                  id: getTrad(`strapi-icon-picker.iconFamily.${pack}`),
                  defaultMessage: pack,
                },
              };
            }),
          },
        ],
      },
    });
  },
  bootstrap(app) {},
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
