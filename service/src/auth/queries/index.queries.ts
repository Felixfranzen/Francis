/** Types generated for queries found in "src/auth/queries/index.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type user_role = 'user' | 'admin';

/** 'SelectFullUserByEmail' parameters type */
export interface ISelectFullUserByEmailParams {
  email: string | null | void;
}

/** 'SelectFullUserByEmail' return type */
export interface ISelectFullUserByEmailResult {
  id: string;
  email: string;
  password: string;
  role: user_role;
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


/** 'SelectUserById' parameters type */
export interface ISelectUserByIdParams {
  userId: string | null | void;
}

/** 'SelectUserById' return type */
export interface ISelectUserByIdResult {
  id: string;
  email: string;
  role: user_role;
  is_verified: boolean;
}

/** 'SelectUserById' query type */
export interface ISelectUserByIdQuery {
  params: ISelectUserByIdParams;
  result: ISelectUserByIdResult;
}

const selectUserByIdIR: any = {"name":"selectUserById","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":185,"b":190,"line":5,"col":66}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT id, email, role, is_verified FROM user_account WHERE id = :userId","loc":{"a":119,"b":190,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, email, role, is_verified FROM user_account WHERE id = :userId
 * ```
 */
export const selectUserById = new PreparedQuery<ISelectUserByIdParams,ISelectUserByIdResult>(selectUserByIdIR);


/** 'InsertUser' parameters type */
export interface IInsertUserParams {
  email: string | null | void;
  password: string | null | void;
  role: user_role | null | void;
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

const insertUserIR: any = {"name":"insertUser","params":[{"name":"email","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":275,"b":279,"line":8,"col":58}]}},{"name":"password","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":283,"b":290,"line":8,"col":66}]}},{"name":"role","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":294,"b":297,"line":8,"col":77}]}}],"usedParamSet":{"email":true,"password":true,"role":true},"statement":{"body":"INSERT INTO user_account (email, password, role) VALUES (:email, :password, :role) RETURNING id","loc":{"a":217,"b":311,"line":8,"col":0}}};

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

const insertVerificationTokenIR: any = {"name":"insertVerificationToken","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":408,"b":413,"line":11,"col":57}]}},{"name":"token","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":417,"b":421,"line":11,"col":66}]}}],"usedParamSet":{"userId":true,"token":true},"statement":{"body":"INSERT INTO verification_token (user_id, token) VALUES (:userId, :token)","loc":{"a":351,"b":422,"line":11,"col":0}}};

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
  user_id: string | null | void;
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

const selectVerificationTokenIR: any = {"name":"selectVerificationToken","params":[{"name":"token","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":510,"b":514,"line":14,"col":48}]}},{"name":"user_id","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":531,"b":537,"line":14,"col":69}]}}],"usedParamSet":{"token":true,"user_id":true},"statement":{"body":"SELECT * FROM verification_token WHERE token = :token AND user_id = :user_id","loc":{"a":462,"b":537,"line":14,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM verification_token WHERE token = :token AND user_id = :user_id
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

const updateVerificationIR: any = {"name":"updateVerification","params":[{"name":"verified","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":611,"b":618,"line":17,"col":39}]}},{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":632,"b":637,"line":17,"col":60}]}}],"usedParamSet":{"verified":true,"userId":true},"statement":{"body":"UPDATE user_account SET is_verified = :verified WHERE id = :userId","loc":{"a":572,"b":637,"line":17,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * UPDATE user_account SET is_verified = :verified WHERE id = :userId
 * ```
 */
export const updateVerification = new PreparedQuery<IUpdateVerificationParams,IUpdateVerificationResult>(updateVerificationIR);


