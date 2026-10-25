# Product — sync — online mode

[← กลับไปหน้ารวม](./README.md)

ทิศทางตรงข้ามกับ create/edit: ดึงข้อมูลสินค้าจาก `pos-center` เข้ามาที่เครื่อง local (pull) สั่งงานด้วยตนเองผ่านปุ่ม "Sync" บนหน้าจอ ต้องออนไลน์เท่านั้น หากล้มเหลวจะถือเป็นความล้มเหลวของการ sync ครั้งนั้น (ไม่มี fallback แบบ offline)

งานดึงสินค้าจริงทำอยู่ที่ `cashier-sync-service` — `cashier-products-service` แค่ enqueue job `sync-products` เข้า `sync-queue` (BullMQ) แล้วรอผลด้วย `job.waitUntilFinished` (timeout `SYNC_PRODUCTS_TIMEOUT_MS`, default 60s) เพื่อให้ API ยังตอบ `{success, count}` แบบ synchronous เหมือนเดิม

**Config `APP_MODE`:** ถ้า `cashier-products-service` ตั้งเป็น `offline` จะไม่ enqueue job เลย ตอบกลับ `{success: false, count: 0}` ทันที; ถ้า `cashier-sync-service` เป็น `offline` จะไม่มี worker มารับ job → รอจน timeout แล้วตอบ `{success: false, count: 0}` (job ถูกลบออกจาก queue)

```mermaid
sequenceDiagram
    actor User as ผู้ใช้ (Manager)
    participant App as cashier-app
    participant GW as api-gateway
    participant Prod as cashier-products-service
    participant Queue as Redis (sync-queue / BullMQ)
    participant Sync as cashier-sync-service
    participant DB as SQLite (product, syncMetadata)
    participant Center as pos-center

    User->>App: กดปุ่ม "Sync สินค้า"
    App->>GW: POST /api/v1/products/sync
    GW->>Prod: proxy -> POST /products/sync
    Prod->>Queue: add job 'sync-products'
    Prod->>Queue: waitUntilFinished (timeout)
    Queue->>Sync: worker รับ job 'sync-products'
    Sync->>DB: getLatest() syncMetadata (lastSyncVersion)
    Sync->>DB: updateStatus('SYNCING')
    Sync->>Center: POST /api/v1/sync/pull/products {syncVersion} (mid, sid มาจาก token)

    alt Online: pos-center ตอบสำเร็จ
        Center-->>Sync: 200 {products[], newSyncVersion}
        Sync->>DB: upsertMany(products)
        Sync->>DB: updateStatus('SUCCESS', newSyncVersion)
        Sync-->>Queue: job completed {success: true, count}
        Queue-->>Prod: {success: true, count}
        Prod-->>GW: 200 {success: true, count}
        GW-->>App: 200 {success: true, count}
        App->>App: โหลดรายการสินค้าใหม่
        App-->>User: sync สำเร็จ พร้อมจำนวนที่อัปเดต
    else Offline / เกิด error ระหว่าง sync / timeout
        Center--xSync: network error / timeout
        Sync->>DB: updateStatus('ERROR')
        Sync-->>Queue: job completed {success: false, count: 0}
        Queue-->>Prod: {success: false, count: 0}
        Prod-->>GW: 200 {success: false, count: 0}
        GW-->>App: 200 {success: false, count: 0}
        App-->>User: sync ไม่สำเร็จ กรุณาลองใหม่
    end
```
