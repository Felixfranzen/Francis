/* @name selectFullUserByEmail */
SELECT * FROM user_account WHERE email = :email LIMIT 1;

/* @name selectUserById */
SELECT id, email, role, is_verified FROM user_account WHERE id = :userId;

/* @name insertUser */
INSERT INTO user_account (email, password, role) VALUES (:email, :password, :role) RETURNING id;

/* @name insertVerificationToken */
INSERT INTO verification_token (user_id, token) VALUES (:userId, :token);

/* @name selectVerificationToken */
SELECT * FROM verification_token WHERE token = :token AND user_id = :user_id;

/* @name updateVerification */
UPDATE user_account SET is_verified = :verified WHERE id = :userId;