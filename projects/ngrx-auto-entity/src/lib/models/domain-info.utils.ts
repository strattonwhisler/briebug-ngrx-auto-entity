import { Domain, IIndexDomain, ICursorDomain, ITimeDomain } from './domain-info';
import { IPage } from './page-info';
import { Range, IFirstLastRange, ISkipTakeRange, IStartEndRange } from './range-info';
import { isFirstLastRange, isSkipTakeRange, isStartEndRange } from './range-info.utils';

export const isIndexDomain = (domain: Domain): domain is IIndexDomain =>
  typeof domain.start === 'number' && typeof domain.end === 'number';

export const isCursorDomain = (domain: Domain): domain is ICursorDomain =>
  typeof domain.start === 'string' && typeof domain.end === 'string';

export const isTimeDomain = (domain: Domain): domain is ITimeDomain =>
  domain.start instanceof Date && domain.end instanceof Date;

// TODO: Fix typings
// @ts-ignore
export const mapStartEndRangeToDomain: {
  (range: { start: number, end: number }): IIndexDomain,
  (range: { start: string, end: string }): ICursorDomain,
  (range: { start: Date, end: Date }): ITimeDomain,
  (range: { start: any, end: any }): never,
} = (range: IStartEndRange): any | never =>
  (typeof range.start === 'number' && typeof range.end === 'number') ||
  (typeof range.start === 'string' && typeof range.end === 'string') ||
  (range.start instanceof Date && range.end instanceof Date)
    ? ({ start: range.start, end: range.end })
    : errorInvalidConversion(range);

// TODO: Fix typings
// @ts-ignore
export const mapFirstLastRangeToDomain: {
  (range: { first: number, last: number }): IIndexDomain,
  (range: { first: string, last: string }): ICursorDomain,
  (range: { first: Date, last: Date }): ITimeDomain,
  (range: { first: any, last: any }): never,
} = (range: IFirstLastRange): any | never =>
  (typeof range.first === 'number' && typeof range.last === 'number') ||
  (typeof range.first === 'string' && typeof range.last === 'string') ||
  (range.first instanceof Date && range.last instanceof Date)
    ? ({ start: range.first, end: range.last })
    : errorInvalidConversion(range);

export const mapSkipTakeRangeToDomain = (range: ISkipTakeRange): IIndexDomain => ({
  start: range.skip,
  end: range.skip + range.take
});

export const mapRangeToDomain = (range: Range): Domain =>
    isStartEndRange(range) ? mapStartEndRangeToDomain(range)
  : isFirstLastRange(range) ? mapFirstLastRangeToDomain(range)
  : mapSkipTakeRangeToDomain(range);

export const mapPageToDomain = (page: IPage): IIndexDomain => ({
  start: page.page * page.size,
  end: (page.page * page.size) + page.size
});

export const errorInvalidConversion = (a: object): never => {
  console.error(
    // tslint:disable-next-line:max-line-length
    `[NGRX-AE] Unable to convert '${JSON.stringify(a)}' to a domain. Please ensure that both values have matching types.`
  );
  throw new TypeError(`[NGRX-AE] Tried to to convert '${JSON.stringify(a)}' to a domain.`);
};
