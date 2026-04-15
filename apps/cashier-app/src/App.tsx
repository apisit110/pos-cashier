import { useState, useEffect } from 'react';
import { LoginPage } from './presentation/pages/login/LoginPage';
import { CreateOrderPage } from './presentation/pages/create-order/CreateOrderPage';
import { GetSessionUseCase } from './domain/use-cases/GetSessionUseCase';
import { ApiAuthRepository } from './data/repositories/ApiAuthRepository';
import './App.css';

// For simplicity, instantiating dependencies here.
const authRepository = new ApiAuthRepository();
const getSessionUseCase = new GetSessionUseCase(authRepository);

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'create-order'>('login');
  const [user, setUser] = useState<{ uid: string; username: string; accessToken: string; refreshToken?: string } | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSessionUseCase.execute();
        if (session) {
          setUser({
            uid: session.user.id,
            username: session.user.name,
            accessToken: session.accessToken,
            refreshToken: session.refreshToken
          });
          setCurrentView('create-order');
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    checkSession();
  }, []);

  const handleLoginSuccess = (userData: { uid: string; username: string; accessToken: string; refreshToken: string }) => {
    setUser(userData);
    setCurrentView('create-order');
  };

  const handleLogout = async () => {
    try {
      await authRepository.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setCurrentView('login');
    }
  };

  if (isInitializing) {
    return <div className="initializing">Loading...</div>;
  }

  return (
    <div className="app">
      {currentView === 'login' && <LoginPage onLoginSuccess={handleLoginSuccess} />}
      {currentView === 'create-order' && <CreateOrderPage onLogout={handleLogout} user={user} />}
    </div>
  );
}

export default App;
