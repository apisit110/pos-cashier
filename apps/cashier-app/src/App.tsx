import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LoginPage } from './presentation/pages/login/LoginPage';
import { CreateOrderPage } from './presentation/pages/create-order/CreateOrderPage';
import { DashboardPage } from './presentation/pages/dashboard/DashboardPage';
import { CreateUserPage } from './presentation/pages/create-user/CreateUserPage';
import { UserListPage } from './presentation/pages/user-list/UserListPage';
import { TransactionListPage } from './presentation/pages/transaction-list/TransactionListPage';
import { ProductListPage } from './presentation/pages/product-list/ProductListPage';
import { GetSessionUseCase } from './domain/use-cases/GetSessionUseCase';
import { CreateUserUseCase } from './application/use-cases/CreateUserUseCase';
import { SyncUserUseCase } from './application/use-cases/SyncUserUseCase';
import { GetUsersUseCase } from './application/use-cases/GetUsersUseCase';
import { GetTransactionsUseCase } from './application/use-cases/GetTransactionsUseCase';
import { GetProductsUseCase } from './application/use-cases/GetProductsUseCase';
import { SyncProductsUseCase as SyncProductsAppUseCase } from './application/use-cases/SyncProductsUseCase';
import { ApiAuthRepository } from './data/repositories/ApiAuthRepository';
import { ApiUserRepository } from './data/repositories/ApiUserRepository';
import { ApiTransactionRepository } from './data/repositories/ApiTransactionRepository';
import { ApiProductRepository } from './data/repositories/ApiProductRepository';
import { MainLayout } from './presentation/components/MainLayout';

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.semantics.colors.bg.main};
`;

const InitializingLoader = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
`;

// For simplicity, instantiating dependencies here.
const authRepository = new ApiAuthRepository();
const userRepository = new ApiUserRepository();
const transactionRepository = new ApiTransactionRepository();
const productRepository = new ApiProductRepository();

const getSessionUseCase = new GetSessionUseCase(authRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);
const syncUserUseCase = new SyncUserUseCase(userRepository);
const getUsersUseCase = new GetUsersUseCase(userRepository);
const getTransactionsUseCase = new GetTransactionsUseCase(transactionRepository);
const getProductsUseCase = new GetProductsUseCase(productRepository);
const syncProductsAppUseCase = new SyncProductsAppUseCase(productRepository);

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'create-order' | 'dashboard' | 'create-user' | 'user-list' | 'transaction-list' | 'product-list'>('login');
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
    return <InitializingLoader>Loading Lightning POS...</InitializingLoader>;
  }

  return (
    <AppContainer>
      {currentView === 'login' ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <MainLayout 
          currentView={currentView} 
          user={user} 
          onNavigate={setCurrentView}
          onLogout={handleLogout}
        >
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
          {currentView === 'create-order' && (
            <CreateOrderPage 
              onBack={() => setCurrentView('dashboard')}
              onLogout={handleLogout} 
              user={user} 
            />
          )}
          {currentView === 'create-user' && (
            <CreateUserPage 
              onBack={() => setCurrentView('user-list')}
              createUserUseCase={createUserUseCase}
              syncUserUseCase={syncUserUseCase}
            />
          )}
          {currentView === 'user-list' && (
            <UserListPage 
              onBack={() => setCurrentView('dashboard')}
              onNavigateToCreateUser={() => setCurrentView('create-user')}
              getUsersUseCase={getUsersUseCase}
            />
          )}
          {currentView === 'transaction-list' && (
            <TransactionListPage 
              onBack={() => setCurrentView('dashboard')}
              getTransactionsUseCase={getTransactionsUseCase}
            />
          )}
          {currentView === 'product-list' && (
            <ProductListPage 
              onBack={() => setCurrentView('dashboard')}
              getProductsUseCase={getProductsUseCase}
              syncProductsUseCase={syncProductsAppUseCase}
            />
          )}
        </MainLayout>
      )}
    </AppContainer>
  );
}

export default App;
