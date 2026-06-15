import { ISyncOutboxRepository } from '../../domain/repositories/ISyncOutboxRepository';
import { IProductSyncGateway } from '../../domain/repositories/IProductSyncGateway';

export class OutboxWorker {
  private intervalId: NodeJS.Timeout | null = null;

  constructor(
    private readonly outboxRepository: ISyncOutboxRepository,
    private readonly productSyncGateway: IProductSyncGateway,
    private readonly intervalMs = 30 * 1000,
  ) {}

  start(): void {
    this.intervalId = setInterval(() => void this.process(), this.intervalMs);
    console.log(`[OutboxWorker] Started, polling every ${this.intervalMs / 1000}s`);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async process(): Promise<void> {
    const entries = await this.outboxRepository.getPending();
    if (entries.length === 0) return;

    console.log(`[OutboxWorker] Processing ${entries.length} pending sync entries`);

    for (const entry of entries) {
      try {
        await this.productSyncGateway.pushProduct(entry.product);
        await this.outboxRepository.markDone(entry.id);
        console.log(`[OutboxWorker] Synced product ${entry.product.id}`);
      } catch (error) {
        console.error(`[OutboxWorker] Failed to sync product ${entry.product.id} (attempt ${entry.retryCount + 1}):`, error);
        await this.outboxRepository.markFailed(entry.id);
      }
    }
  }
}
