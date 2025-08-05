import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useRole } from '../contexts/RoleContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useRole();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/rolling-forecast');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Image Section */}
      <div className="hidden lg:flex w-1/2 bg-yellow-500 justify-center items-center p-8">
        <img src="/assets/images/superdoll_logo.jpeg" alt="Login visual" className="w-[500px]" />
      </div>

      {/* Right Form Section */}
      <div className="flex w-full lg:w-1/2 justify-center items-center p-8 bg-gray-50">
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center">
            <img src="/assets/images/superdoll_logo.jpeg" alt="Logo" className="w-48 mx-auto lg:hidden mb-4" />
            <h4 className="text-xl font-semibold">Welcome to Sales Budgeting & Rolling Forecast</h4>
            <p className="text-gray-600 mt-2">Please sign-in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-300 rounded px-4 py-2"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  autoComplete="current-password"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" onClick={togglePassword}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="remember" 
                className="mr-2" 
                checked={formData.remember}
                onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
              />
              <label htmlFor="remember" className="text-sm">Remember Me</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            {(error || authError) && (
              <p className="text-red-500 text-sm mt-2 text-center">{error || authError}</p>
            )}
          </form>

          <div className="mt-6 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
              <p className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</p>
              <p className="text-xs text-blue-600">admin@example.com / admin123</p>
              <p className="text-xs text-blue-600">manager@example.com / manager123</p>
              <p className="text-xs text-blue-600">salesman@example.com / sales123</p>
            </div>
            <img
              src="/assets/images/superdoll_logo.jpeg"
              width="70"
              alt="STM Logo"
              className="h-8 mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
