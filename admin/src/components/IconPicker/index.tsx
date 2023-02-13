import React, { useEffect, useMemo, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import type { StyledIcon } from 'styled-icons/types';
import {
  Box,
  BaseButton,
  Button,
  Stack,
  Flex,
  Field,
  FieldHint,
  FieldError,
  FieldLabel,
  FieldInput,
  FocusTrap,
  Popover,
  TextInput,
  Typography,
} from '@strapi/design-system';
import chunk from 'lodash-es/chunk';
import { FixedSizeGrid as Grid } from 'react-window';

import getTrad from '../../utils/getTrad';
import iconLoader from '../../utils/iconLoader';
import useIsDarkMode from '../../utils/useIsDarkMode';

type IconFamily = {
  family:
    | 'bootstrap'
    | 'boxiconsLogos'
    | 'boxiconsRegular'
    | 'boxiconsSolid'
    | 'crypto'
    | 'entypo'
    | 'entypoSocial'
    | 'evaiconsOutline'
    | 'evaiconsSolid'
    | 'evil'
    | 'faBrands'
    | 'faRegular'
    | 'faSolid'
    | 'feather'
    | 'fluentuiSystemFilled'
    | 'fluentuiSystemRegular'
    | 'foundation'
    | 'heroiconsOutline'
    | 'heroiconsSolid'
    | 'icomoon'
    | 'ioniconsOutline'
    | 'ioniconsSharp'
    | 'ioniconsSolid'
    | 'material'
    | 'materialOutlined'
    | 'materialRounded'
    | 'materialSharp'
    | 'materialTwotone'
    | 'octicons'
    | 'openIconic'
    | 'remixEditor'
    | 'remixFill'
    | 'remixLine'
    | 'simpleIcons'
    | 'typicons'
    | 'zondicons';
  icons?: StyledIcon[];
  visible?: boolean;
};

const includedIconFamilies: IconFamily['family'][] = [
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

const ICON_POPOVER_WIDTH = 300;
const ICON_POPOVER_HEIGHT = 300;

const ICON_GROUP_HEIGHT = 200;
const ICON_GROUP_COLS = 4;
const ICON_GROUP_ROW_HEIGHT = 44;
const ICON_GROUP_SPACING = 4;
const ICON_SIZE = '32px';

const ICON_FAMILY_OUTLINE = '#ffffffb3';
const ICON_FAMILY_OUTLINE_SELECTED = '#69ff33b3';

const styleUppercase = { textTransform: 'uppercase' };

const IconPreviewContainer = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);

  svg {
    width: 20px !important;
    height: 20px !important;
  }
`;

const IconPreview = ({ icon }: { icon?: { name: string; family: string } }) => {
  // console.log('in IconPreview', icon);
  const [LoadedIcon, setLoadedIcon] = useState<StyledIcon>();

  const isDarkMode = useIsDarkMode();

  useEffect(() => {
    if (!icon) {
      return;
    }

    iconLoader(icon.family, icon.name).then((res) => {
      if (res) {
        setLoadedIcon(res);
      }
    });
  }, [icon]);

  return (
    <IconPreviewContainer>
      {LoadedIcon && (
        <LoadedIcon size={'40px'} color={isDarkMode ? 'white' : 'black'} />
      )}
    </IconPreviewContainer>
  );
};

const IconPickerPopover = styled(Popover)`
  width: ${ICON_POPOVER_WIDTH}px;
  height: ${ICON_POPOVER_HEIGHT}px;
  overflow-y: scroll;
`;

const IconItem = styled.div`
  width: calc(100% - ${ICON_GROUP_SPACING}px);
  height: calc(100% - ${ICON_GROUP_SPACING}px);
  border: 1px solid white;
  border-radius: 4px;
  cursor: pointer;
`;

const IconDisplay = ({
  iconFamilies,
  onChange,
  onBlur,
}: {
  iconFamilies: IconFamily['family'][];
  onChange: (icon: string, family: string) => void;
  onBlur: (e) => void;
}) => {
  // console.log('in IconDisplay, icons', iconFamilies);

  const { formatMessage } = useIntl();
  const isDarkMode = useIsDarkMode();
  const topElementRef = useRef<typeof Stack>(null);
  const [loadedIconFamilies, setLoadedIconFamilies] = useState<IconFamily[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState<string>('');

  const isVisible = (family: IconFamily['family']) => {
    const loadedFamily = loadedIconFamilies.find(
      (item) => item.family === family
    );

    if (!loadedFamily) {
      return undefined;
    } else if (loadedFamily.visible) {
      return true;
    } else {
      return false;
    }
  };

  const toggleFamilyVisibility = (family: IconFamily['family']) => {
    const visible = isVisible(family);

    if (typeof visible === 'undefined') {
      // icon pack hasn't been loaded previously, create a new object for it
      const loadingIcons: IconFamily = {
        family,
        visible: true,
        icons: undefined,
      };

      // add the new object, without icons, to current state, to allow it to display 'loading'
      setLoadedIconFamilies((current) => [...current, loadingIcons]);

      iconLoader(family).then((res) => {
        if (res) {
          setLoadedIconFamilies((current) => {
            const familyIndex = current.findIndex(
              (item) => item.family === family
            );

            const updatedArray = [...current];
            updatedArray[familyIndex] = { ...current[familyIndex], icons: res };

            return updatedArray;
          });
        } else {
          // errored, removing from loaded icons
          setLoadedIconFamilies((current) => {
            return [...current.filter((item) => item.family !== family)];
          });
        }
      });
    } else if (visible) {
      // icon pack is visible - hide it
      setLoadedIconFamilies((current) => {
        const familyIndex = current.findIndex((item) => item.family === family);

        const updatedArray = [...current];
        updatedArray[familyIndex].visible = false;

        return updatedArray;
      });
    } else {
      // icon pack is hidden - show it
      setLoadedIconFamilies((current) => {
        const familyIndex = current.findIndex((item) => item.family === family);

        const updatedArray = [...current];
        updatedArray[familyIndex].visible = true;

        return updatedArray;
      });
    }
  };

  // helper fn to calculate the height an icon pack's box should be
  function calcIconBoxHeight(numberOfRows: number) {
    if (numberOfRows * ICON_GROUP_ROW_HEIGHT < ICON_GROUP_HEIGHT) {
      return numberOfRows * ICON_GROUP_ROW_HEIGHT;
    }
    return ICON_GROUP_HEIGHT;
  }

  useEffect(() => {
    if (topElementRef.current) {
      // focus top popover element in order for onBlur fn to work
      topElementRef.current.focus();
    }
  }, [topElementRef.current]);

  return (
    <Stack
      spacing={2}
      tabIndex={0}
      // onFocus={(e) => {
      //   console.log('focus', e);
      // }}
      ref={topElementRef}
      style={{ padding: '4px' }}
      onBlur={(e) => {
        // console.log('blur', e);
        onBlur(e);
      }}
    >
      <div>
        <Typography variant="pi" fontWeight="bold">
          {formatMessage({
            id: getTrad('icon-picker.display.label'),
            defaultMessage: 'Icon families',
          })}
        </Typography>
        <Flex wrap="wrap">
          {iconFamilies.map((family) => {
            return (
              <div
                key={family}
                style={{
                  borderRadius: '4px',
                  padding: '2px',
                  margin: '6px',
                  outline: isVisible(family)
                    ? `${ICON_FAMILY_OUTLINE_SELECTED} solid 1px`
                    : `${ICON_FAMILY_OUTLINE} solid 1px`,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={() => {
                  console.log('clicked on', family);
                  toggleFamilyVisibility(family);
                }}
              >
                <Typography>
                  {formatMessage({
                    id: getTrad(`icon-picker.iconFamily.${family}`),
                    defaultMessage: family,
                  })}
                </Typography>
              </div>
            );
          })}
        </Flex>
      </div>
      {loadedIconFamilies.filter((family) => {
        return family.visible;
      }).length > 0 && (
        <div style={{ width: '100%' }}>
          <TextInput
            label={formatMessage({
              id: getTrad('icon-picker.search.label'),
              defaultMessage: 'Icon search',
            })}
            name="Icon picker search"
            placeholder={formatMessage({
              id: getTrad('icon-picker.search.placeholder'),
              defaultMessage: 'Search here...',
            })}
            onChange={(e) => {
              // console.log('input', e.target.value);
              setSearchTerm(e.target.value);
            }}
          />
        </div>
      )}
      {loadedIconFamilies.map((family) => {
        if (isVisible(family.family) === false) {
          return null;
        }

        const iconsChunked: StyledIcon[][] = chunk(
          family.icons?.filter((IconItem) => {
            return !(
              !IconItem ||
              (searchTerm.length > 0 &&
                !IconItem.displayName
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()))
            );
          }),
          ICON_GROUP_COLS
        );

        const IconCell = ({
          columnIndex,
          rowIndex,
          style,
        }: {
          columnIndex: number;
          rowIndex: number;
          style: React.CSSProperties | undefined;
        }) => {
          // console.log('in IconCell', iconsChunked);
          // console.log({ columnIndex, rowIndex });

          const IconElement = iconsChunked[rowIndex][columnIndex];
          // console.log('IconElement', IconElement);

          if (!IconElement) {
            return null;
          }

          return (
            <div style={style}>
              <IconItem
                onClick={() => {
                  // console.log(
                  //   'clicked icon: ',
                  //   IconElement.displayName,
                  //   'of family:',
                  //   group.family
                  // );

                  if (IconElement.displayName) {
                    onChange(IconElement.displayName, family.family);
                  }
                }}
              >
                <IconElement
                  size={ICON_SIZE}
                  color={isDarkMode ? 'white' : 'black'}
                  style={{ display: 'block', margin: '4px auto' }}
                />
              </IconItem>
            </div>
          );
        };

        return (
          <div key={family.family} style={{ width: '100%' }}>
            <Flex marginBottom={2}>
              <Typography variant="pi" fontWeight="bold">
                {formatMessage({
                  id: getTrad(`icon-picker.iconFamily.${family.family}`),
                  defaultMessage: family.family,
                })}
                {!iconsChunked || !family.icons || family.icons.length === 0
                  ? ' - Loading...'
                  : iconsChunked.length === 0
                  ? ' - 0 icons'
                  : ` - ${
                      iconsChunked.length * ICON_GROUP_COLS +
                      (-4 + iconsChunked[iconsChunked.length - 1].length)
                    } icons`}
              </Typography>
            </Flex>
            {iconsChunked && iconsChunked.length > 0 && (
              <Grid
                columnCount={ICON_GROUP_COLS}
                columnWidth={(ICON_POPOVER_WIDTH - 40) / ICON_GROUP_COLS}
                height={calcIconBoxHeight(iconsChunked.length)}
                rowCount={iconsChunked.length}
                rowHeight={ICON_GROUP_ROW_HEIGHT}
                width={ICON_POPOVER_WIDTH - 20}
              >
                {IconCell}
              </Grid>
            )}
          </div>
        );
      })}
    </Stack>
  );
};

const IconPickerToggle = styled(BaseButton)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  svg {
    width: ${({ theme }) => theme.spaces[2]};
    height: ${({ theme }) => theme.spaces[2]};
  }

  svg > path {
    fill: ${({ theme }) => theme.colors.neutral500};
    justify-self: flex-end;
  }
`;

const IconPicker = ({
  name,
  onChange,
  value: valueString,
  intlLabel,
  labelAction,
  disabled,
  error,
  description,
  required,
  attribute,
}) => {
  const value = JSON.parse(valueString);
  const { formatMessage } = useIntl();
  // console.log('IconPicker');
  // console.log('value', value);
  // console.log('attribute', attribute);

  const [showIconPicker, setShowIconPicker] = useState(false);
  const IconPickerButtonRef = useRef(null);

  const handleBlur = (e) => {
    // console.log('handleBlur', e);
    // console.log('IconPickerButtonRef.current', IconPickerButtonRef.current);
    // console.log('target', e.target);
    // console.log('relatedtarget', e.relatedTarget);

    if (IconPickerButtonRef.current) {
      setShowIconPicker(false);
    }
  };

  const iconPacksToUse: IconFamily['family'][] = useMemo(() => {
    // console.log('iconPacksToUse', attribute);
    const selectedPacks: IconFamily['family'][] = [];

    Object.entries(attribute.options).forEach((keyValPair) => {
      // console.log('keyVal pair', keyValPair);

      if (
        includedIconFamilies.includes(keyValPair[0] as IconFamily['family'])
      ) {
        if (keyValPair[1] === true) {
          selectedPacks.push(keyValPair[0] as IconFamily['family']);
        }
      }
    });
    // console.log('returning', selectedPacks);

    return selectedPacks;
  }, [attribute]);

  return (
    <Field
      name={name}
      id={name}
      // GenericInput calls formatMessage and returns a string for the error
      error={error}
      hint={description && formatMessage(description)}
      required={required}
    >
      <Stack spacing={1} style={{ padding: 0 }}>
        <FieldLabel action={labelAction}>{formatMessage(intlLabel)}</FieldLabel>
        {required && (
          <Typography variant="pi" fontWeight="bold" textColor="danger600">
            *
          </Typography>
        )}
        <IconPickerToggle
          ref={IconPickerButtonRef}
          aria-label={formatMessage({
            id: getTrad('icon-picker.toggle.aria-label'),
            defaultMessage: 'Icon picker toggle',
          })}
          aria-controls="icon-picker-value"
          aria-haspopup="dialog"
          aria-expanded={showIconPicker}
          aria-disabled={disabled}
          disabled={disabled}
          onClick={(e) => {
            // console.log('clicked toggle', e);

            setShowIconPicker(!showIconPicker);
          }}
        >
          <Flex>
            <IconPreview icon={value} />
            <Typography
              style={styleUppercase}
              textColor={value ? null : 'neutral600'}
              variant="omega"
            >
              {value?.family &&
                formatMessage({
                  id: getTrad(`icon-picker.iconFamily.${value.family}`),
                  defaultMessage: value.family,
                })}
              {value && ' - '}
              {value?.name}
            </Typography>
          </Flex>
        </IconPickerToggle>
        {showIconPicker && (
          <IconPickerPopover
            id="IconPopover"
            role="dialog"
            source={IconPickerButtonRef}
            spacing={4}
          >
            {iconPacksToUse && (
              <IconDisplay
                iconFamilies={iconPacksToUse}
                onChange={(iconValue: string, iconFamily: string) =>
                  onChange({
                    target: {
                      name,
                      value: JSON.stringify({
                        name: iconValue,
                        family: iconFamily,
                      }),
                    },
                  })
                }
                onBlur={handleBlur}
              />
            )}
          </IconPickerPopover>
        )}
      </Stack>
    </Field>
  );
};

IconPicker.defaultProps = {
  description: null,
  disabled: false,
  error: null,
  labelAction: null,
  required: false,
  value: null,
};

IconPicker.propTypes = {
  description: PropTypes.shape({
    id: PropTypes.string,
    defaultMessage: PropTypes.string,
  }),
  disabled: PropTypes.bool,
  error: PropTypes.string,
  intlLabel: PropTypes.shape({
    id: PropTypes.string,
    defaultMessage: PropTypes.string,
  }),
  labelAction: PropTypes.object,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string,
  attribute: PropTypes.object,
};

export default IconPicker;
