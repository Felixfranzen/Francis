/** Types generated for queries found in "src/feature/queries/index.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'CreateFeature' parameters type */
export interface ICreateFeatureParams {
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

const createFeatureIR: any = {"name":"createFeature","params":[{"name":"name","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":67,"b":70,"line":2,"col":41}]}},{"name":"key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":74,"b":76,"line":2,"col":48}]}}],"usedParamSet":{"name":true,"key":true},"statement":{"body":"INSERT INTO feature (name, key) VALUES (:name, :key) RETURNING ID","loc":{"a":26,"b":90,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO feature (name, key) VALUES (:name, :key) RETURNING ID
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

const createFlagIR: any = {"name":"createFlag","params":[{"name":"featureId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":183,"b":191,"line":5,"col":66}]}},{"name":"name","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":195,"b":198,"line":5,"col":78}]}},{"name":"enabled","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":202,"b":208,"line":5,"col":85}]}},{"name":"predicates","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":212,"b":221,"line":5,"col":95}]}}],"usedParamSet":{"featureId":true,"name":true,"enabled":true,"predicates":true},"statement":{"body":"INSERT INTO flag (feature_id, name, enabled, predicates) VALUES (:featureId, :name, :enabled, :predicates) RETURNING ID","loc":{"a":117,"b":235,"line":5,"col":0}}};

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

const deleteFeatureIR: any = {"name":"deleteFeature","params":[{"name":"id","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":297,"b":298,"line":8,"col":32}]}}],"usedParamSet":{"id":true},"statement":{"body":"DELETE FROM feature WHERE id = :id","loc":{"a":265,"b":298,"line":8,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM feature WHERE id = :id
 * ```
 */
export const deleteFeature = new PreparedQuery<IDeleteFeatureParams,IDeleteFeatureResult>(deleteFeatureIR);


/** 'GetFlagsByFeatureKey' parameters type */
export interface IGetFlagsByFeatureKeyParams {
  key: string | null | void;
}

/** 'GetFlagsByFeatureKey' return type */
export interface IGetFlagsByFeatureKeyResult {
  name: string;
  enabled: boolean;
  predicates: Json;
}

/** 'GetFlagsByFeatureKey' query type */
export interface IGetFlagsByFeatureKeyQuery {
  params: IGetFlagsByFeatureKeyParams;
  result: IGetFlagsByFeatureKeyResult;
}

const getFlagsByFeatureKeyIR: any = {"name":"getFlagsByFeatureKey","params":[{"name":"key","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":449,"b":451,"line":13,"col":55}]}}],"usedParamSet":{"key":true},"statement":{"body":"SELECT flag.name as name, enabled, predicates\nFROM feature\nJOIN flag ON flag.feature_id = feature.id WHERE key = :key","loc":{"a":335,"b":451,"line":11,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT flag.name as name, enabled, predicates
 * FROM feature
 * JOIN flag ON flag.feature_id = feature.id WHERE key = :key
 * ```
 */
export const getFlagsByFeatureKey = new PreparedQuery<IGetFlagsByFeatureKeyParams,IGetFlagsByFeatureKeyResult>(getFlagsByFeatureKeyIR);


