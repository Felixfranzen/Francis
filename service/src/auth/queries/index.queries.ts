/** Types generated for queries found in "src/auth/queries/index.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'SelectFullUserByEmail' parameters type */
export interface ISelectFullUserByEmailParams {
  email: string | null | void;
}

/** 'SelectFullUserByEmail' return type */
export interface ISelectFullUserByEmailResult {
  id: string;
  email: string;
  password: string;
  role: string;
  is_verified: boolean;
}

/** 'SelectFullUserByEmail' query type */
export interface ISelectFullUserByEmailQuery {
  params: ISelectFullUserByEmailParams;
  result: ISelectFullUserByEmailResult;
}

const selectFullUserByEmailIR: any = {"name":"selectFullUserByEmail","params":[{"name":"email","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":76,"b":80,"line":2,"col":42}]}}],"usedParamSet":{"email":true},"statement":{"body":"SELECT * FROM user_account WHERE email = :email LIMIT 1","loc":{"a":34,"b":88,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM user_account WHERE email = :email LIMIT 1
 * ```
 */
export const selectFullUserByEmail = new PreparedQuery<ISelectFullUserByEmailParams,ISelectFullUserByEmailResult>(selectFullUserByEmailIR);


/** 'InsertUser' parameters type */
export interface IInsertUserParams {
  email: string | null | void;
  password: string | null | void;
  role: string | null | void;
}

/** 'InsertUser' return type */
export interface IInsertUserResult {
  id: string;
}

/** 'InsertUser' query type */
export interface IInsertUserQuery {
  params: IInsertUserParams;
  result: IInsertUserResult;
}

const insertUserIR: any = {"name":"insertUser","params":[{"name":"email","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":173,"b":177,"line":5,"col":58}]}},{"name":"password","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":181,"b":188,"line":5,"col":66}]}},{"name":"role","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":192,"b":195,"line":5,"col":77}]}}],"usedParamSet":{"email":true,"password":true,"role":true},"statement":{"body":"INSERT INTO user_account (email, password, role) VALUES (:email, :password, :role) RETURNING id","loc":{"a":115,"b":209,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO user_account (email, password, role) VALUES (:email, :password, :role) RETURNING id
 * ```
 */
export const insertUser = new PreparedQuery<IInsertUserParams,IInsertUserResult>(insertUserIR);


/** 'InsertVerificationToken' parameters type */
export interface IInsertVerificationTokenParams {
  userId: string | null | void;
  token: string | null | void;
}

/** 'InsertVerificationToken' return type */
export type IInsertVerificationTokenResult = void;

/** 'InsertVerificationToken' query type */
export interface IInsertVerificationTokenQuery {
  params: IInsertVerificationTokenParams;
  result: IInsertVerificationTokenResult;
}

const insertVerificationTokenIR: any = {"name":"insertVerificationToken","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":306,"b":311,"line":8,"col":57}]}},{"name":"token","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":315,"b":319,"line":8,"col":66}]}}],"usedParamSet":{"userId":true,"token":true},"statement":{"body":"INSERT INTO verification_token (user_id, token) VALUES (:userId, :token)","loc":{"a":249,"b":320,"line":8,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO verification_token (user_id, token) VALUES (:userId, :token)
 * ```
 */
export const insertVerificationToken = new PreparedQuery<IInsertVerificationTokenParams,IInsertVerificationTokenResult>(insertVerificationTokenIR);


/** 'SelectVerificationToken' parameters type */
export interface ISelectVerificationTokenParams {
  token: string | null | void;
}

/** 'SelectVerificationToken' return type */
export interface ISelectVerificationTokenResult {
  id: string;
  user_id: string;
  token: string;
  created_at: Date;
}

/** 'SelectVerificationToken' query type */
export interface ISelectVerificationTokenQuery {
  params: ISelectVerificationTokenParams;
  result: ISelectVerificationTokenResult;
}

const selectVerificationTokenIR: any = {"name":"selectVerificationToken","params":[{"name":"token","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":408,"b":412,"line":11,"col":48}]}}],"usedParamSet":{"token":true},"statement":{"body":"SELECT * FROM verification_token WHERE token = :token","loc":{"a":360,"b":412,"line":11,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM verification_token WHERE token = :token
 * ```
 */
export const selectVerificationToken = new PreparedQuery<ISelectVerificationTokenParams,ISelectVerificationTokenResult>(selectVerificationTokenIR);


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

const updateVerificationIR: any = {"name":"updateVerification","params":[{"name":"verified","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":486,"b":493,"line":14,"col":39}]}},{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":507,"b":512,"line":14,"col":60}]}}],"usedParamSet":{"verified":true,"userId":true},"statement":{"body":"UPDATE user_account SET is_verified = :verified WHERE id = :userId","loc":{"a":447,"b":512,"line":14,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * UPDATE user_account SET is_verified = :verified WHERE id = :userId
 * ```
 */
export const updateVerification = new PreparedQuery<IUpdateVerificationParams,IUpdateVerificationResult>(updateVerificationIR);


