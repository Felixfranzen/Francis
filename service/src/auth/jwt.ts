import { NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { Request, Response } from 'express'

const ONE_DAY_IN_SECONDS = 86400

export const createService = (secret: string) => {
  const sign = (
    params: Record<string, any>,
    expiresInSeconds = ONE_DAY_IN_SECONDS
  ) =>
    new Promise((resolve, reject) => {
      jwt.sign(
        params,
        secret,
        { expiresIn: expiresInSeconds },
        (err, token) => {
          if (err) {
            reject(err)
            return
          }
          resolve(token)
        }
      )
    })

  const verifyAndDecode = (token: string) =>
    new Promise((resolve, reject) => {
      jwt.verify(token, secret, {}, (err, decoded) => {
        if (err) {
          reject(err)
          return
        }
        resolve(decoded)
      })
    })

  return {
    sign,
    verifyAndDecode,
  }
}

export type JwtService = ReturnType<typeof createService>
