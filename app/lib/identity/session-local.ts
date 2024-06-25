import 'server-only'

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SessionPayload, User } from './definition'

const secretKey = process.env.AUTH_SECRET
if (!secretKey) throw Error('AUTH_SECRET not found')
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1hr')
    .sign(key)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    return null
  }
}

export async function createSession(user: User) {
  const session = await encrypt(
    {
      userId: user.rowKey,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      device: user.device,
      role: user.role,
      name: user.name,
      surname: user.surname,
    }
  )

  cookies().set('pretorian-session', session, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    sameSite: 'lax',
    path: '/',
  })

  redirect('/board')
}

export async function verifySession() {
  const cookie = cookies().get('pretorian-session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    redirect('/login')
  }

  return { 
    isAuth: true,
    userId: Number(session.userId),
    expiresAt: session.expiresAt,
    device: session.device,
    role : session.role,
    name: session.name
  }
}

export async function updateSession() {
  const session = cookies().get('session')?.value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  cookies().set('pretorian-session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}

export function deleteSession() {
  cookies().delete('pretorian-session')
  redirect('/login')
}