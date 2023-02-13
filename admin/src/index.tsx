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

    app.customFields.register({
      name,
      pluginId,
      type: 'json',
      icon: PluginIcon,
      intlLabel: {
        id: getTrad('icon-picker.label'),
        defaultMessage: pluginId,
      },
      intlDescription: {
        id: getTrad('icon-picker.description'),
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
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'options.advanced.requiredField',
                type: 'checkbox',
                description: {
                  id: getTrad(
                    'icon-picker.options.advanced.requiredField.description'
                  ),
                  defaultMessage:
                    "You won't be able to create an entry if this field is empty",
                },
                intlLabel: {
                  id: getTrad('icon-picker.options.advanced.requiredField'),
                  defaultMessage: 'Required field',
                },
              },
            ],
          },
          {
            sectionTitle: {
              id: getTrad('icon-picker.options.advanced.packages.list.title'),
              defaultMessage: 'Icon packages to use',
            },
            items: iconPacks.map((pack) => {
              return {
                name: `options.${pack}`,
                type: 'checkbox',
                defaultValue: true,
                intlLabel: {
                  id: getTrad(`icon-picker.iconFamily.${pack}`),
                  defaultMessage: pack,
                },
                options: [],
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
