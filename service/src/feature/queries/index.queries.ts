/** Types generated for queries found in "src/feature/queries/index.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'CreateFeature' parameters type */
export interface ICreateFeatureParams {
  userId: string | null | void;
  name: string | null | void;
  key: string | null | void;
}

/** 'CreateFeature' return type */
export interface ICreateFeatureResult {
  id: string;
}

/** 'CreateFeature' query type */
export interface ICreateFeatureQuery {
  params: ICreateFeatureParams;
  result: ICreateFeatureResult;
}

const createFeatureIR: any = {"name":"createFeature","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":76,"b":81,"line":2,"col":50}]}},{"name":"name","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":85,"b":88,"line":2,"col":59}]}},{"name":"key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":92,"b":94,"line":2,"col":66}]}}],"usedParamSet":{"userId":true,"name":true,"key":true},"statement":{"body":"INSERT INTO feature (user_id, name, key) VALUES (:userId, :name, :key) RETURNING ID","loc":{"a":26,"b":108,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO feature (user_id, name, key) VALUES (:userId, :name, :key) RETURNING ID
 * ```
 */
export const createFeature = new PreparedQuery<ICreateFeatureParams,ICreateFeatureResult>(createFeatureIR);


/** 'CreateFlag' parameters type */
export interface ICreateFlagParams {
  featureId: string | null | void;
  name: string | null | void;
  enabled: boolean | null | void;
  predicates: Json | null | void;
}

/** 'CreateFlag' return type */
export interface ICreateFlagResult {
  id: string;
}

/** 'CreateFlag' query type */
export interface ICreateFlagQuery {
  params: ICreateFlagParams;
  result: ICreateFlagResult;
}

const createFlagIR: any = {"name":"createFlag","params":[{"name":"featureId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":201,"b":209,"line":5,"col":66}]}},{"name":"name","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":213,"b":216,"line":5,"col":78}]}},{"name":"enabled","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":220,"b":226,"line":5,"col":85}]}},{"name":"predicates","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":230,"b":239,"line":5,"col":95}]}}],"usedParamSet":{"featureId":true,"name":true,"enabled":true,"predicates":true},"statement":{"body":"INSERT INTO flag (feature_id, name, enabled, predicates) VALUES (:featureId, :name, :enabled, :predicates) RETURNING ID","loc":{"a":135,"b":253,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO flag (feature_id, name, enabled, predicates) VALUES (:featureId, :name, :enabled, :predicates) RETURNING ID
 * ```
 */
export const createFlag = new PreparedQuery<ICreateFlagParams,ICreateFlagResult>(createFlagIR);


/** 'DeleteFeature' parameters type */
export interface IDeleteFeatureParams {
  id: string | null | void;
}

/** 'DeleteFeature' return type */
export type IDeleteFeatureResult = void;

/** 'DeleteFeature' query type */
export interface IDeleteFeatureQuery {
  params: IDeleteFeatureParams;
  result: IDeleteFeatureResult;
}

const deleteFeatureIR: any = {"name":"deleteFeature","params":[{"name":"id","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":315,"b":316,"line":8,"col":32}]}}],"usedParamSet":{"id":true},"statement":{"body":"DELETE FROM feature WHERE id = :id","loc":{"a":283,"b":316,"line":8,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM feature WHERE id = :id
 * ```
 */
export const deleteFeature = new PreparedQuery<IDeleteFeatureParams,IDeleteFeatureResult>(deleteFeatureIR);


/** 'SelectFlagsByFeatureKey' parameters type */
export interface ISelectFlagsByFeatureKeyParams {
  key: string | null | void;
}

/** 'SelectFlagsByFeatureKey' return type */
export interface ISelectFlagsByFeatureKeyResult {
  name: string;
  enabled: boolean;
  predicates: Json;
}

/** 'SelectFlagsByFeatureKey' query type */
export interface ISelectFlagsByFeatureKeyQuery {
  params: ISelectFlagsByFeatureKeyParams;
  result: ISelectFlagsByFeatureKeyResult;
}

const selectFlagsByFeatureKeyIR: any = {"name":"selectFlagsByFeatureKey","params":[{"name":"key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":470,"b":472,"line":14,"col":13}]}}],"usedParamSet":{"key":true},"statement":{"body":"SELECT flag.name as name, enabled, predicates\nFROM feature\nJOIN flag ON flag.feature_id = feature.id\nWHERE key = :key","loc":{"a":356,"b":472,"line":11,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT flag.name as name, enabled, predicates
 * FROM feature
 * JOIN flag ON flag.feature_id = feature.id
 * WHERE key = :key
 * ```
 */
export const selectFlagsByFeatureKey = new PreparedQuery<ISelectFlagsByFeatureKeyParams,ISelectFlagsByFeatureKeyResult>(selectFlagsByFeatureKeyIR);


/** 'SelectFeaturesByUserId' parameters type */
export interface ISelectFeaturesByUserIdParams {
  userId: string | null | void;
}

/** 'SelectFeaturesByUserId' return type */
export interface ISelectFeaturesByUserIdResult {
  id: string;
  user_id: string;
  name: string;
  key: string;
}

/** 'SelectFeaturesByUserId' query type */
export interface ISelectFeaturesByUserIdQuery {
  params: ISelectFeaturesByUserIdParams;
  result: ISelectFeaturesByUserIdResult;
}

const selectFeaturesByUserIdIR: any = {"name":"selectFeaturesByUserId","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":550,"b":555,"line":19,"col":17}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT *\nFROM feature\nWHERE user_id = :userId","loc":{"a":511,"b":555,"line":17,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM feature
 * WHERE user_id = :userId
 * ```
 */
export const selectFeaturesByUserId = new PreparedQuery<ISelectFeaturesByUserIdParams,ISelectFeaturesByUserIdResult>(selectFeaturesByUserIdIR);


