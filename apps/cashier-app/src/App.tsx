import { useState, useEffect } from 'react';
import { LoginPage } from './presentation/pages/login/LoginPage';
import { CreateOrderPage } from './presentation/pages/create-order/CreateOrderPage';
import { DashboardPage } from './presentation/pages/dashboard/DashboardPage';
import { CreateUserPage } from './presentation/pages/create-user/CreateUserPage';
import { UserListPage } from './presentation/pages/user-list/UserListPage';
import { TransactionListPage } from './presentation/pages/transaction-list/TransactionListPage';
import { GetSessionUseCase } from './domain/use-cases/GetSessionUseCase';
import { CreateUserUseCase } from './application/use-cases/CreateUserUseCase';
import { SyncUserUseCase } from './application/use-cases/SyncUserUseCase';
import { GetUsersUseCase } from './application/use-cases/GetUsersUseCase';
import { GetTransactionsUseCase } from './application/use-cases/GetTransactionsUseCase';
import { ApiAuthRepository } from './data/repositories/ApiAuthRepository';
import { ApiUserRepository } from './data/repositories/ApiUserRepository';
import { MockTransactionRepository } from './data/repositories/MockTransactionRepository';
import './App.css';

// For simplicity, instantiating dependencies here.
const authRepository = new ApiAuthRepository();
const userRepository = new ApiUserRepository();
const transactionRepository = new MockTransactionRepository();

const getSessionUseCase = new GetSessionUseCase(authRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);
const syncUserUseCase = new SyncUserUseCase(userRepository);
const getUsersUseCase = new GetUsersUseCase(userRepository);
const getTransactionsUseCase = new GetTransactionsUseCase(transactionRepository);

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'create-order' | 'dashboard' | 'create-user' | 'user-list' | 'transaction-list'>('login');
  const [user, setUser] = useState<{ uid: string; username: string; role: string; roleId: number; accessToken: string; refreshToken?: string } | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSessionUseCase.execute();
        if (session) {
          const userData = {
            uid: session.user.id.toString(),
            username: session.user.fullName,
            roleId: session.user.roleId,
            role: session.user.roleId === 1 ? 'manager' : 'cashier',
            accessToken: session.accessToken,
            refreshToken: session.refreshToken
          };
          setUser(userData);
          
          if (userData.roleId === 1) {
            setCurrentView('dashboard');
          } else {
            setCurrentView('create-order');
          }
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    checkSession();
  }, []);

  const handleLoginSuccess = (userData: { uid: number; username: string; roleId: number; accessToken: string; refreshToken: string }) => {
    const mappedUser = {
      uid: userData.uid.toString(),
      username: userData.username,
      roleId: userData.roleId,
      role: userData.roleId === 1 ? 'manager' : 'cashier',
      accessToken: userData.accessToken,
      refreshToken: userData.refreshToken
    };
    setUser(mappedUser);
    
    if (userData.roleId === 1) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('create-order');
    }
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

  const handleNavigateToSell = () => {
    setCurrentView('create-order');
  };

  if (isInitializing) {
    return <div className="initializing">Loading...</div>;
  }

  return (
    <div className="app">
      {currentView === 'login' && <LoginPage onLoginSuccess={handleLoginSuccess} />}
      {currentView === 'dashboard' && (
        <DashboardPage 
          onLogout={handleLogout} 
          onNavigateToSell={handleNavigateToSell} 
          onNavigateToCreateUser={() => setCurrentView('create-user')}
          onNavigateToUserList={() => setCurrentView('user-list')}
          onNavigateToTransactionList={() => setCurrentView('transaction-list')}
          user={user} 
        />
      )}
      {currentView === 'create-order' && <CreateOrderPage onLogout={handleLogout} user={user} />}
      {currentView === 'create-user' && (
        <CreateUserPage 
          onBack={() => setCurrentView('dashboard')}
          createUserUseCase={createUserUseCase}
          syncUserUseCase={syncUserUseCase}
        />
      )}
      {currentView === 'user-list' && (
        <UserListPage 
          onBack={() => setCurrentView('dashboard')}
          getUsersUseCase={getUsersUseCase}
        />
      )}
      {currentView === 'transaction-list' && (
        <TransactionListPage 
          onBack={() => setCurrentView('dashboard')}
          getTransactionsUseCase={getTransactionsUseCase}
        />
      )}
    </div>
  );
}

export default App;
