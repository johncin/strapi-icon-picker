import { StyledIcon } from 'styled-icons/types';

async function iconLoader(family: string): Promise<StyledIcon[] | undefined>;
async function iconLoader(
  family: string,
  name: string
): Promise<StyledIcon | undefined>;
async function iconLoader(
  family: string,
  name?: string
): Promise<StyledIcon | StyledIcon[] | undefined> {
  try {
    const module = await import('styled-icons');
    const moduleFamily = module[family];

    if (!moduleFamily) {
      throw 'Icon import returned undefined';
    }

    const icons = Object.values(moduleFamily) as StyledIcon[];

    if (name) {
      const icon = icons.find((item) => item.displayName === name);

      return icon;
    }

    return icons;
  } catch (err) {
    console.warn('Import error: ', err);
  }
}

export default iconLoader;
