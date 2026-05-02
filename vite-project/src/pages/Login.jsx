import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await login(data.email, data.password)
      navigate('/')
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Welcome to Newstube</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:border-brand-500 outline-none"
              />
            </div>
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:border-brand-500 outline-none"
              />
            </div>
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-700 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {loading ? 'Signing in...' : <><FiLogIn /> Sign In</>}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login