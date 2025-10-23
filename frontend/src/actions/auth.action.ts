import axios from 'axios'
import { User } from '../types'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
export const AUTH_KEY = 'rickbert-auth'

export interface Auth {
  jwt: string
  user: User
}

export function getAuth(): Auth | null {
  const auth = localStorage.getItem(AUTH_KEY)
  if (!auth) return null
  try {
    return JSON.parse(auth)
  } catch (e) {
    return null
  }
}

export async function login(
  identifier: string,
  password: string,
): Promise<Auth> {
  const res = await axios.post(`${BACKEND_URL}/api/auth/local`, {
    identifier,
    password,
  })

  if (!res.data.jwt) throw new Error('Login failed: No token received')

  const auth = {
    jwt: res.data.jwt,
    user: res.data.user,
  }

  localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
  return auth
}

export async function register(
  username: string,
  email: string,
  password: string,
): Promise<Auth> {
  const res = await axios.post(`${BACKEND_URL}/api/auth/local/register`, {
    username,
    email,
    password,
  })

  if (!res.data.jwt) throw new Error('Registration failed: No token received')

  const auth = {
    jwt: res.data.jwt,
    user: res.data.user,
  }

  localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
  return auth
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
}
