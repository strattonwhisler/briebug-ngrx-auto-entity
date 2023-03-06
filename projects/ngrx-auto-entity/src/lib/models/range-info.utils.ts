import { Range, IStartEndRange, IFirstLastRange, ISkipTakeRange } from './range-info';

export const isStartEndRange = (range: Range): range is IStartEndRange =>
  'start' in range && 'end' in range;

export const isFirstLastRange = (range: Range): range is IFirstLastRange =>
  'first' in range && 'last' in range;

export const isSkipTakeRange = (range: Range): range is ISkipTakeRange =>
  'skip' in range && 'take' in range;
