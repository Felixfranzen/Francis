/** Types generated for queries found in "src/auth/queries/index.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetFullUserByEmail' parameters type */
export interface IGetFullUserByEmailParams {
  email: string | null | void;
}

/** 'GetFullUserByEmail' return type */
export interface IGetFullUserByEmailResult {
  id: string;
  email: string;
  password: string;
  role: string;
  is_verified: boolean | null;
}

/** 'GetFullUserByEmail' query type */
export interface IGetFullUserByEmailQuery {
  params: IGetFullUserByEmailParams;
  result: IGetFullUserByEmailResult;
}

const getFullUserByEmailIR: any = {"name":"getFullUserByEmail","params":[{"name":"email","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":73,"b":77,"line":2,"col":42}]}}],"usedParamSet":{"email":true},"statement":{"body":"SELECT * FROM user_account WHERE email = :email LIMIT 1","loc":{"a":31,"b":85,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM user_account WHERE email = :email LIMIT 1
 * ```
 */
export const getFullUserByEmail = new PreparedQuery<IGetFullUserByEmailParams,IGetFullUserByEmailResult>(getFullUserByEmailIR);


/** 'CreateUser' parameters type */
export interface ICreateUserParams {
  email: string | null | void;
  password: string | null | void;
  role: string | null | void;
}

/** 'CreateUser' return type */
export interface ICreateUserResult {
  id: string;
}

/** 'CreateUser' query type */
export interface ICreateUserQuery {
  params: ICreateUserParams;
  result: ICreateUserResult;
}

const createUserIR: any = {"name":"createUser","params":[{"name":"email","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":170,"b":174,"line":5,"col":58}]}},{"name":"password","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":178,"b":185,"line":5,"col":66}]}},{"name":"role","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":189,"b":192,"line":5,"col":77}]}}],"usedParamSet":{"email":true,"password":true,"role":true},"statement":{"body":"INSERT INTO user_account (email, password, role) VALUES (:email, :password, :role) RETURNING id","loc":{"a":112,"b":206,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO user_account (email, password, role) VALUES (:email, :password, :role) RETURNING id
 * ```
 */
export const createUser = new PreparedQuery<ICreateUserParams,ICreateUserResult>(createUserIR);


/** 'CreateVerificationToken' parameters type */
export interface ICreateVerificationTokenParams {
  userId: string | null | void;
  token: string | null | void;
}

/** 'CreateVerificationToken' return type */
export type ICreateVerificationTokenResult = void;

/** 'CreateVerificationToken' query type */
export interface ICreateVerificationTokenQuery {
  params: ICreateVerificationTokenParams;
  result: ICreateVerificationTokenResult;
}

const createVerificationTokenIR: any = {"name":"createVerificationToken","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":303,"b":308,"line":8,"col":57}]}},{"name":"token","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":312,"b":316,"line":8,"col":66}]}}],"usedParamSet":{"userId":true,"token":true},"statement":{"body":"INSERT INTO verification_token (user_id, token) VALUES (:userId, :token)","loc":{"a":246,"b":317,"line":8,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO verification_token (user_id, token) VALUES (:userId, :token)
 * ```
 */
export const createVerificationToken = new PreparedQuery<ICreateVerificationTokenParams,ICreateVerificationTokenResult>(createVerificationTokenIR);


/** 'GetVerificationToken' parameters type */
export interface IGetVerificationTokenParams {
  token: string | null | void;
}

/** 'GetVerificationToken' return type */
export interface IGetVerificationTokenResult {
  id: string;
  user_id: string;
  token: string;
  created_at: Date;
}

/** 'GetVerificationToken' query type */
export interface IGetVerificationTokenQuery {
  params: IGetVerificationTokenParams;
  result: IGetVerificationTokenResult;
}

const getVerificationTokenIR: any = {"name":"getVerificationToken","params":[{"name":"token","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":402,"b":406,"line":11,"col":48}]}}],"usedParamSet":{"token":true},"statement":{"body":"SELECT * FROM verification_token WHERE token = :token","loc":{"a":354,"b":406,"line":11,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM verification_token WHERE token = :token
 * ```
 */
export const getVerificationToken = new PreparedQuery<IGetVerificationTokenParams,IGetVerificationTokenResult>(getVerificationTokenIR);


/** 'UpdateVerification' parameters type */
export interface IUpdateVerificationParams {
  verified: boolean | null | void;
  userId: string | null | void;
}

/** 'UpdateVerification' return type */
export type IUpdateVerificationResult = void;

/** 'UpdateVerification' query type */
export interface IUpdateVerificationQuery {
  params: IUpdateVerificationParams;
  result: IUpdateVerificationResult;
}

const updateVerificationIR: any = {"name":"updateVerification","params":[{"name":"verified","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":480,"b":487,"line":14,"col":39}]}},{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":501,"b":506,"line":14,"col":60}]}}],"usedParamSet":{"verified":true,"userId":true},"statement":{"body":"UPDATE user_account SET is_verified = :verified WHERE id = :userId","loc":{"a":441,"b":506,"line":14,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * UPDATE user_account SET is_verified = :verified WHERE id = :userId
 * ```
 */
export const updateVerification = new PreparedQuery<IUpdateVerificationParams,IUpdateVerificationResult>(updateVerificationIR);


