User (userRepository, PasswordUtils)
  create: (email, password, role) => User (-password)
  isValidCredentials: (email, password) => boolean
  getById (userId) => User (-password)
  setIsVerified: (userId, isVerified) => void


Verification (verificationRepository)
  create: (userId) => Token
  getByToken: (token) => Token


Session (sessionRepository)
  createSession: (userId) => SessionId
  getById: (sessionId) => UserId | null

Password
  encrypt
  compare

// Note: acts as an abstraction for the user and verification layer to make it easier to consume/mock in routes??
Auth (User, Verification)
  signUp: (email, password) =>
    id = User.create(email, password)
    token = Verification.create(id)
    return { id, token }

  isValidUser: (email, password) =>
    return User.isValidCredentials(email, password)

  verifyUser: (token) =>
    tokenData = Verification.getByToken(token)
    tokenData.created_at > YESTERDAY
      User.setIsVerified(tokenData.userId, true)


AuthMiddleware(User, Session)
  isAuthed: (sessionId) =>
    id=Session.get(sessionId)
    user=User.getById(id)
    return !!user

  hasRole: (role) => (sessionId) =>
    id=Session.get(sessionId)
    user=User.getById(id)
    return user.role === role


AuthRoutes (Auth, Session)
  /signup
    id = Auth.signup(...)
    sessId = Session.create(id)
    res.cookie=sessId
    res.send(200)
  /login
    id = Auth.isValidUser(...)
    sessId = Session.create(id)
    res.cookie=sessId
    res.send(200)
  /logout
    Session.remove(...)
    res.send(200)