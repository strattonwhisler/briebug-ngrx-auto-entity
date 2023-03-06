import { Page, IPage } from './page-info';

export const isPage = (page: Page): page is IPage =>
  'page' in page && 'size' in page;
