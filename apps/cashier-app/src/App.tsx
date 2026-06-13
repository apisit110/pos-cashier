import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LoginPage } from './presentation/pages/login/LoginPage';
import { TerminalSetupPage } from './presentation/pages/terminal-setup/TerminalSetupPage';
import { CreateOrderPage } from './presentation/pages/create-order/CreateOrderPage';
import { DashboardPage } from './presentation/pages/dashboard/DashboardPage';
import { CreateStaffPage } from './presentation/pages/create-staff/CreateStaffPage';
import { StaffListPage } from './presentation/pages/staff-list/StaffListPage';
import { TransactionListPage } from './presentation/pages/transaction-list/TransactionListPage';
import { ProductListPage } from './presentation/pages/product-list/ProductListPage';
import { CreateProductPage } from './presentation/pages/create-product/CreateProductPage';
import { GetSessionUseCase } from './domain/use-cases/GetSessionUseCase';
import { CreateStaffUseCase } from './domain/use-cases/CreateStaffUseCase';
import { GetStaffsUseCase } from './domain/use-cases/GetStaffsUseCase';
import { GetTransactionsUseCase } from './domain/use-cases/GetTransactionsUseCase';
import { GetTransactionByIdUseCase } from './domain/use-cases/GetTransactionByIdUseCase';
import { GetProductsUseCase } from './domain/use-cases/GetProductsUseCase';
import { SyncProductsUseCase as SyncProductsAppUseCase } from './domain/use-cases/SyncProductsUseCase';
import { CreateProductUseCase } from './domain/use-cases/CreateProductUseCase';
import { ApiAuthRepository } from './infrastructure/repositories/ApiAuthRepository';
import { ApiStaffRepository } from './infrastructure/repositories/ApiStaffRepository';
import { ApiTransactionRepository } from './infrastructure/repositories/ApiTransactionRepository';
import { ApiProductRepository } from './infrastructure/repositories/ApiProductRepository';
import { MainLayout } from './presentation/layouts/MainLayout';
import { TransactionDetailPage } from './presentation/pages/transaction-detail/TransactionDetailPage';

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
const staffRepository = new ApiStaffRepository();
const transactionRepository = new ApiTransactionRepository();
const productRepository = new ApiProductRepository();

const getSessionUseCase = new GetSessionUseCase(authRepository);
const createStaffUseCase = new CreateStaffUseCase(staffRepository);
const getStaffsUseCase = new GetStaffsUseCase(staffRepository);
const getTransactionsUseCase = new GetTransactionsUseCase(transactionRepository);
const getTransactionByIdUseCase = new GetTransactionByIdUseCase(transactionRepository);
const getProductsUseCase = new GetProductsUseCase(productRepository);
const syncProductsAppUseCase = new SyncProductsAppUseCase(productRepository);
const createProductUseCase = new CreateProductUseCase(productRepository);

const TERMINAL_STORAGE_KEY = 'lightning_pos_terminal';

function App() {
  const [hasTerminal, setHasTerminal] = useState(() => !!localStorage.getItem(TERMINAL_STORAGE_KEY));
  const [currentView, setCurrentView] = useState<'login' | 'create-order' | 'dashboard' | 'create-staff' | 'staff-list' | 'transaction-list' | 'transaction-detail' | 'product-list' | 'create-product'>('login');
  const [staff, setStaff] = useState<{ uid: string; username: string; role: string; roleId: number; accessToken: string; refreshToken?: string } | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSessionUseCase.execute();
        if (session) {
          const staffData = {
            uid: session.staff.id.toString(),
            username: session.staff.fullName,
            roleId: session.staff.roleId,
            role: session.staff.roleId === 1 ? 'manager' : 'cashier',
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
          };
          setStaff(staffData);

          if (staffData.roleId === 1) {
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

  useEffect(() => {
    if (staff && staff.role === 'cashier') {
      const restrictedViews = ['dashboard', 'create-staff', 'staff-list', 'product-list', 'create-product', 'transaction-list', 'transaction-detail'];
      if (restrictedViews.includes(currentView)) {
        setCurrentView('create-order');
      }
    }
  }, [currentView, staff]);

  const handleLoginSuccess = (staffData: { uid: string; username: string; roleId: number; accessToken: string; refreshToken: string }) => {
    const mappedStaff = {
      uid: staffData.uid.toString(),
      username: staffData.username,
      roleId: staffData.roleId,
      role: staffData.roleId === 1 ? 'manager' : 'cashier',
      accessToken: staffData.accessToken,
      refreshToken: staffData.refreshToken,
    };
    setStaff(mappedStaff);

    if (staffData.roleId === 1) {
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
      setStaff(null);
      setCurrentView('login');
    }
  };



  if (!hasTerminal) {
    return <TerminalSetupPage onComplete={() => setHasTerminal(true)} />;
  }

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
          staff={staff}
          onNavigate={setCurrentView}
          onLogout={handleLogout}
        >
          {currentView === 'dashboard' && (
            <DashboardPage
              staff={staff}
            />
          )}
          {currentView === 'create-order' && (
            <CreateOrderPage
              onBack={staff?.role === 'manager' ? () => setCurrentView('dashboard') : undefined}
              onLogout={handleLogout}
              staff={staff}
            />
          )}
          {currentView === 'create-staff' && (
            <CreateStaffPage
              onBack={() => setCurrentView('staff-list')}
              createStaffUseCase={createStaffUseCase}
            />
          )}
          {currentView === 'staff-list' && (
            <StaffListPage
              onBack={staff?.role === 'manager' ? () => setCurrentView('dashboard') : () => setCurrentView('create-order')}
              onNavigateToCreateStaff={() => setCurrentView('create-staff')}
              getStaffsUseCase={getStaffsUseCase}
            />
          )}
          {currentView === 'transaction-list' && (
            <TransactionListPage
              onBack={staff?.role === 'manager' ? () => setCurrentView('dashboard') : () => setCurrentView('create-order')}
              onViewDetail={(id: string) => {
                setSelectedTransactionId(id);
                setCurrentView('transaction-detail');
              }}
              getTransactionsUseCase={getTransactionsUseCase}
            />
          )}
          {currentView === 'transaction-detail' && selectedTransactionId && (
            <TransactionDetailPage
              transactionId={selectedTransactionId}
              onBack={() => setCurrentView('transaction-list')}
              getTransactionByIdUseCase={getTransactionByIdUseCase}
            />
          )}
          {currentView === 'product-list' && (
            <ProductListPage
              onBack={staff?.role === 'manager' ? () => setCurrentView('dashboard') : () => setCurrentView('create-order')}
              onNavigateToCreateProduct={() => setCurrentView('create-product')}
              getProductsUseCase={getProductsUseCase}
              syncProductsUseCase={syncProductsAppUseCase}
            />
          )}
          {currentView === 'create-product' && (
            <CreateProductPage
              onBack={() => setCurrentView('product-list')}
              createProductUseCase={createProductUseCase}
            />
          )}
        </MainLayout>
      )}
    </AppContainer>
  );
}

export default App;
