import React, { useState } from 'react';
import './LoginPage.css';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { LoginUseCase } from '../../../domain/use-cases/LoginUseCase';
import { ApiAuthRepository } from '../../../data/repositories/ApiAuthRepository';

// For simplicity, instantiating dependencies here.
// In a larger app, we would use a DI container or React Context.
const authRepository = new ApiAuthRepository();
const loginUseCase = new LoginUseCase(authRepository);

interface LoginPageProps {
  onLoginSuccess?: (userData: { uid: string; username: string; role: string; accessToken: string; refreshToken: string }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginUseCase.execute({ email, password });
      console.log('Login successful:', response);
      // Here you would typically store the token and redirect
      if (onLoginSuccess) {
        onLoginSuccess({ 
          uid: response.user.id, 
          username: response.user.name,
          role: response.user.role,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken
        });

      } else {
        alert(`Welcome, ${response.user.name}!`);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Decorative background elements for premium feel */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="bg-shape shape-3"></div>

      <div className="login-card">
        <div className="login-header">
          <div className="brand-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <h1>Lightning POS</h1>
          <p>Sign in to access your dashboard</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <InputField
            label="Username / Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            disabled={isLoading}
          />
          
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isLoading}
          />
          
          <div className="form-actions">
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          <Button type="submit" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <a href="#">Contact Support</a></p>
          <div className="demo-hint">
            <small>Demo Credentials: <code>staff</code> / <code>staff</code></small>
          </div>
        </div>
      </div>
    </div>
  );
};
