import { useState } from 'react'
import { mockLogin, mockRegister } from '@/actions/auth.action'

export default function Login() {
  const [mode, setMode] = useState<'login'|'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'login') {
        await mockLogin(email, password)
      } else {
        await mockRegister(email, password)
      }
      // redirect or show success (replace with real logic)
      window.location.href = '/checkout'
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-stone-50'>
      <form onSubmit={handleSubmit} className='bg-white p-8 rounded shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6'>{mode === 'login' ? 'Login' : 'Register'}</h2>
        <div className='mb-4'>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='w-full px-4 py-2 border rounded'
            required
          />
        </div>
        <div className='mb-6'>
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
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
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
        </button>
        <div className='mt-4 text-center'>
          <button
            type='button'
            className='text-blue-600 underline text-sm'
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Create an account' : 'Already have an account? Login'}
          </button>
        </div>
      </form>
    </div>
  )
}
