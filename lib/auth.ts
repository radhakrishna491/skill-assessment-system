import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret-fallback'

export interface JwtPayload {
  userId: string
  role: string
  email: string
}

// Create a token valid for 7 days
export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// Verify a token
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch (error) {
    return null
  }
}