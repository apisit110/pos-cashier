# Product — sync — online mode

[← กลับไปหน้ารวม](./README.md)

ทิศทางตรงข้ามกับ create/edit: ดึงข้อมูลสินค้าจาก `pos-center` เข้ามาที่เครื่อง local (pull) สั่งงานด้วยตนเองผ่านปุ่ม "Sync" บนหน้าจอ ต้องออนไลน์เท่านั้น หากล้มเหลวจะถือเป็นความล้มเหลวของการ sync ครั้งนั้น (ไม่มี fallback แบบ offline)

**Config `APP_MODE` (`cashier-products-service/.env`):** ถ้าตั้งเป็น `offline` `SyncProductsUseCase` จะไม่พยายามยิง HTTP ไป `pos-center` เลย ตอบกลับ `{success: false, count: 0}` ทันทีพร้อม set สถานะ `ERROR` (ต่างจากตอน online-แต่-เน็ตล่ม ที่ยังพยายามยิงจริงก่อนถึงจะ fail)

```mermaid
sequenceDiagram
    actor User as ผู้ใช้ (Manager)
    participant App as cashier-app
    participant GW as api-gateway
    participant Prod as cashier-products-service
    participant DB as SQLite (product, syncMetadata)
    participant Center as pos-center

    User->>App: กดปุ่ม "Sync สินค้า"
    App->>GW: POST /api/v1/products/sync {mid, sid}
    GW->>Prod: proxy -> POST /products/sync
    Prod->>DB: getLatest() syncMetadata (lastSyncVersion)
    Prod->>DB: updateStatus('SYNCING')
    Prod->>Center: POST /v1/sync/products {mid, sid, syncVersion}

    alt Online: pos-center ตอบสำเร็จ
        Center-->>Prod: 200 {products[], newSyncVersion}
        Prod->>DB: upsertMany(products)
        Prod->>DB: updateStatus('SUCCESS', newSyncVersion)
        Prod-->>GW: 200 {success: true, count}
        GW-->>App: 200 {success: true, count}
        App->>App: โหลดรายการสินค้าใหม่
        App-->>User: sync สำเร็จ พร้อมจำนวนที่อัปเดต
    else Offline / เกิด error ระหว่าง sync
        Center--xProd: network error / timeout
        Prod->>DB: updateStatus('ERROR')
        Prod-->>GW: 200 {success: false, count: 0}
        GW-->>App: 200 {success: false, count: 0}
        App-->>User: sync ไม่สำเร็จ กรุณาลองใหม่
    end
```
