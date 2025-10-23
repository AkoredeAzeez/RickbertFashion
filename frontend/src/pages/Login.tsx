import { useState } from 'react'
import { login, register } from '@/actions/auth.action'
import { useCart } from '../state/CartContext'
import { useToast } from '@/state/ToastContext'

export default function Login() {
  const { attachUser } = useCart()
  const { show } = useToast()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      let auth
      if (mode === 'login') {
        auth = await login(email, password)
      } else {
        auth = await register(username, email, password)
      }

      if (auth && auth.user && attachUser) {
        attachUser(String(auth.user.id), true)
        show(`Welcome, ${auth.user.username}!`)
      }
      window.location.href = '/checkout'
    } catch (err: any) {
      const message =
        err?.response?.data?.error?.message ||
        err.message ||
        'Login/Registration failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-stone-50'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded shadow-md w-full max-w-md'
      >
        <h2 className='text-2xl font-bold mb-6'>
          {mode === 'login' ? 'Login' : 'Register'}
        </h2>

        {mode === 'register' && (
          <div className='mb-4'>
            <input
              type='text'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full px-4 py-2 border rounded'
              required
            />
          </div>
        )}

        <div className='mb-4'>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-4 py-2 border rounded'
            required
          />
        </div>
        <div className='mb-6'>
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-4 py-2 border rounded'
            required
          />
        </div>
        {error && <div className='text-red-600 mb-4'>{error}</div>}
        <button
          type='submit'
          className='w-full bg-black text-white py-2 rounded font-semibold disabled:opacity-50'
          disabled={loading}
        >
          {loading
            ? 'Please wait...'
            : mode === 'login'
            ? 'Login'
            : 'Register'}
        </button>
        <div className='mt-4 text-center'>
          <button
            type='button'
            className='text-blue-600 underline text-sm'
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login'
              ? 'Create an account'
              : 'Already have an account? Login'}
          </button>
        </div>
      </form>
    </div>
  )
}