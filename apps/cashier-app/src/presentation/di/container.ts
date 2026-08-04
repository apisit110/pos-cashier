import { GetSessionUseCase } from '../../domain/use-cases/GetSessionUseCase';
import { CreateStaffUseCase } from '../../domain/use-cases/CreateStaffUseCase';
import { GetStaffsUseCase } from '../../domain/use-cases/GetStaffsUseCase';
import { SyncStaffUseCase } from '../../domain/use-cases/SyncStaffUseCase';
import { GetTransactionsUseCase } from '../../domain/use-cases/GetTransactionsUseCase';
import { GetTransactionByIdUseCase } from '../../domain/use-cases/GetTransactionByIdUseCase';
import { GetTransactionSummaryUseCase } from '../../domain/use-cases/GetTransactionSummaryUseCase';
import { GetProductsUseCase } from '../../domain/use-cases/GetProductsUseCase';
import { SyncProductsUseCase } from '../../domain/use-cases/SyncProductsUseCase';
import { CreateProductUseCase } from '../../domain/use-cases/CreateProductUseCase';
import { UpdateProductUseCase } from '../../domain/use-cases/UpdateProductUseCase';
import { ApiAuthRepository } from '../../infrastructure/repositories/ApiAuthRepository';
import { ApiStaffRepository } from '../../infrastructure/repositories/ApiStaffRepository';
import { ApiTransactionRepository } from '../../infrastructure/repositories/ApiTransactionRepository';
import { ApiProductRepository } from '../../infrastructure/repositories/ApiProductRepository';

// For simplicity, instantiating dependencies here as module-level singletons.
export const authRepository = new ApiAuthRepository();
export const staffRepository = new ApiStaffRepository();
export const transactionRepository = new ApiTransactionRepository();
export const productRepository = new ApiProductRepository();

export const getSessionUseCase = new GetSessionUseCase(authRepository);
export const createStaffUseCase = new CreateStaffUseCase(staffRepository);
export const getStaffsUseCase = new GetStaffsUseCase(staffRepository);
export const syncStaffUseCase = new SyncStaffUseCase(staffRepository);
export const getTransactionsUseCase = new GetTransactionsUseCase(transactionRepository);
export const getTransactionByIdUseCase = new GetTransactionByIdUseCase(transactionRepository);
export const getTransactionSummaryUseCase = new GetTransactionSummaryUseCase(transactionRepository);
export const getProductsUseCase = new GetProductsUseCase(productRepository);
export const syncProductsUseCase = new SyncProductsUseCase(productRepository);
export const createProductUseCase = new CreateProductUseCase(productRepository);
export const updateProductUseCase = new UpdateProductUseCase(productRepository);
