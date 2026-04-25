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
  onLoginSuccess?: (userData: { uid: number; username: string; roleId: number; accessToken: string; refreshToken: string }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [userId, setUserId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!userId || !pin) {
      setError('Please enter both User ID and PIN');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await loginUseCase.execute({ userId, pin });
      console.log('Login successful:', response);
      // Here you would typically store the token and redirect
      if (onLoginSuccess) {
        onLoginSuccess({ 
          uid: response.user.id, 
          username: response.user.fullName,
          roleId: response.user.roleId,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken
        });

      } else {
        alert(`Welcome, ${response.user.fullName}!`);
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
            label="User ID"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="e.g. M001"
            disabled={isLoading}
          />
          
          <InputField
            label="PIN"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••••"
            disabled={isLoading}
          />
          
          <div className="form-actions">
            <a href="#" className="forgot-password">Forgot PIN?</a>
          </div>

          <Button type="submit" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <a href="#">Contact Support</a></p>
          <div className="demo-hint">
            <small>Demo Credentials: <code>M001</code> / <code>123456</code></small>
          </div>
        </div>
      </div>
    </div>
  );
};
