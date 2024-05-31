import { request, response } from 'express'

export const haveRol = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: 'We need a token to verify a Role'
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: `The service requires one of the following authorized roles ${roles}`
      })
    }

    next()
  }
}