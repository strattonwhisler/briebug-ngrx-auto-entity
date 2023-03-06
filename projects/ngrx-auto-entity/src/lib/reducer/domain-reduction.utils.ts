import {
  Domain,
  DomainInfo,
  ICursorDomain,
  IIndexDomain,
  isCursorDomain,
  isIndexDomain,
  isTimeDomain,
  ITimeDomain
} from '../models';
import { EntityIdentity } from '../types/entity-identity';

/** clones domains */
export const cloneDomains = (domains: DomainInfo[] | undefined): DomainInfo[] =>
  (domains ? [...domains] : []);

export const continuousIndexDomain = (a: IIndexDomain, b: IIndexDomain): boolean =>
  (a.start >= b.start && a.start <= b.end) ||
  (b.start >= a.start && b.start <= a.end);

export const continuousTimeDomain = (a: ITimeDomain, b: ITimeDomain): boolean =>
  (a.start >= b.start && a.start <= b.end) ||
  (b.start >= a.start && b.start <= a.end);

/** checks if two domains are continuous */
export const continuousDomain = (a: Domain, b: Domain): boolean =>
    (isIndexDomain(a) && isIndexDomain(b)) ? continuousIndexDomain(a, b)
  : (isCursorDomain(a) && isCursorDomain(b)) ? false // NOTE: Unable to programmatically compare cursors.
  : (isTimeDomain(a) && isTimeDomain(b))  ? continuousTimeDomain(a, b)
  : (warnDomainTypeMissmatch(a, b), false);

export const containsIndexDomain = (a: IIndexDomain, b: IIndexDomain): boolean =>
  a.start <= b.start && a.end >= b.end;

export const containsCursorDomain = (a: ICursorDomain, b: ICursorDomain): boolean =>
  a.start === b.start && a.end === b.end;

export const containsTimeDomain = (a: ITimeDomain, b: ITimeDomain): boolean =>
  a.start <= b.start && a.end >= b.end;

/** checks if domain A is fully contained in domain B */
export const containsDomain = (a: Domain, b: Domain): boolean =>
    (isIndexDomain(a) && isIndexDomain(b)) ? containsIndexDomain(a, b)
  : (isCursorDomain(a) && isCursorDomain(b)) ? containsCursorDomain(a, b)
  : (isTimeDomain(a) && isTimeDomain(b))  ? containsTimeDomain(a, b)
  : (warnDomainTypeMissmatch(a, b), false);

export const concatUnique = <T>(as: T[], bs: T[]): T[] =>
  as.concat(bs.filter(b => !as.includes(b)));

export const mergeIndexDomain = (
  domainA: IIndexDomain, idsA: EntityIdentity[],
  domainB: IIndexDomain, idsB: EntityIdentity[]
): DomainInfo => ({
  domain: {
    start: Math.min(domainA.start, domainB.start),
    end: Math.max(domainA.end, domainB.end)
  },
  ids:
    domainA.start <= domainB.start
      ? concatUnique(idsA, idsB)
      : concatUnique(idsB, idsA)
});

export const mergeTimeDomain = (
  domainA: ITimeDomain, idsA: EntityIdentity[],
  domainB: ITimeDomain, idsB: EntityIdentity[]
): DomainInfo => ({
  domain: {
    start: domainA.start <= domainB.start ? domainA.start : domainB.start,
    end: domainA.end >= domainB.end ? domainA.end : domainB.end,
  },
  ids:
    domainA.start <= domainB.start
      ? concatUnique(idsA, idsB)
      : concatUnique(idsB, idsA)
});

/** merges two ranges. requires that the ranges are continuous. */
export const mergeDomain = (a: DomainInfo, b: DomainInfo): DomainInfo =>
    (isIndexDomain(a.domain) && isIndexDomain(b.domain)) ? mergeIndexDomain(a.domain, a.ids, b.domain, b.ids)
  : (isCursorDomain(a.domain) && isCursorDomain(b.domain)) ? a
  : (isTimeDomain(a.domain) && isTimeDomain(b.domain))  ? mergeTimeDomain(a.domain, a.ids, b.domain, b.ids)
  : errorDomainTypeMissmatch(a.domain, b.domain);

export const mergeSingleDomain = (currentDomains: DomainInfo[], newDomain: DomainInfo): DomainInfo[] => {
  const continuousDomains: number[] = [];

  // NOTE: Use for loop for faster iterations
  for (let i = 0; i < currentDomains.length; i++) {
    if (continuousDomain(currentDomains[i].domain, newDomain.domain)) {
      continuousDomains.push(i);
    }
  }

  if (continuousDomains.length > 0) {
    const domains = cloneDomains(currentDomains);
    domains.splice(
      continuousDomains[0],
      continuousDomains.length,
      continuousDomains.reduce((domain, i) => mergeDomain(domain, currentDomains[i]), newDomain)
    );
    return domains;
  } else {
    const domains = cloneDomains(currentDomains);
    domains.push(newDomain);
    return domains;
  }
};

const domainTypeToString = (domain: Domain): string =>
    isIndexDomain(domain) ? 'IIndexDomain'
  : isCursorDomain(domain) ? 'ICursorDomain'
  : isTimeDomain(domain) ? 'ITimeDomain'
  : 'unknown'
;

export const errorDomainTypeMissmatch = (a: Domain, b: Domain): never => {
  console.error(
    // tslint:disable-next-line:max-line-length
    `[NGRX-AE] Using a '${domainTypeToString(a)}' domain with a '${domainTypeToString(b)}' domain is not supported. Ensure that you are using only one type of domain. Unable to fallback back to a safe default.`
  );
  throw new TypeError(`[NGRX-AE] Tried to use a '${domainTypeToString(a)}' domain with a '${domainTypeToString(b)}' domain.`);
};

export const warnDomainTypeMissmatch = (a: Domain, b: Domain): void =>
  console.warn(
    // tslint:disable-next-line:max-line-length
    `[NGRX-AE] Using a '${domainTypeToString(a)}' domain with a '${domainTypeToString(b)}' domain is not supported. Ensure that you are using only one type of domain.`
  );
