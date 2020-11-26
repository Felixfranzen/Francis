/* @name getFullUserByEmail */
SELECT * FROM user_account WHERE email = :email LIMIT 1;

/* @name createUser */
INSERT INTO user_account (email, password, role) VALUES (:email, :password, :role) RETURNING id;

/* @name createVerificationToken */
INSERT INTO verification_token (user_id, token) VALUES (:userId, :token);

/* @name getVerificationToken */
SELECT * FROM verification_token WHERE token = :token;

/* @name updateVerification */
UPDATE user_account SET is_verified = :verified WHERE id = :userId;