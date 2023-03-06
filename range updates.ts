import { EntityAction, EntityIdentity, ISkipTakeRange, Range } from '@briebug/ngrx-auto-entity';
import { filter } from 'rxjs/operators';
import { getKeyFromModel, LoadAllSuccess } from './dist/ngrx-auto-entity';
import { DomainInfo } from '@briebug/ngrx-auto-entity/src/lib/models';
import { containsDomain } from '@briebug/ngrx-auto-entity/src/lib/reducer/domain-reduction.utils';

//TODO: Convert to a selector factory
export const getCachedEntities = <TModel>(
  range: ISkipTakeRange,
  idRanges: DomainInfo[],
  entities: Record<EntityIdentity, TModel>
): TModel[] | undefined => {
  const cachedRange = idRanges?.find((r) => containsDomain(r.domain, range));
  return cachedRange?.ids
    .slice(range.skip - cachedRange.domain.skip, range.skip + range.take - cachedRange.domain.skip)
    .map((id) => entities[id]);
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ofCorrelationId = <T extends EntityAction<IntentionalAny>>(correlationId: string) =>
  filter<T>((action) => action.correlationId === correlationId);
