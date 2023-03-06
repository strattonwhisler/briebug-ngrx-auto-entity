import { EntityIdentity } from '../types/entity-identity';

export interface IIndexDomain {
  start: number;
  end: number;
}

export interface ICursorDomain {
  start: string;
  end: string;
}

export interface ITimeDomain {
  start: Date;
  end: Date;
}

export type Domain =
  | IIndexDomain
  | ICursorDomain
  | ITimeDomain
  ;

export interface DomainInfo {
  domain: Domain;
  ids: EntityIdentity[];
}


