# Product — edit — offline mode / online mode

[← กลับไปหน้ารวม](./README.md)

รูปแบบเดียวกับ "[product create](./02-product-create.md)" ทุกประการ ต่างกันแค่เป็นการ update แทน insert รวมถึง config `APP_MODE` ก็ตัวเดียวกัน (ใช้ `OutboxWorker` ร่วมกันในเซอร์วิสเดียวกัน)

```mermaid
sequenceDiagram
    actor User as ผู้ใช้ (Manager)
    participant App as cashier-app
    participant GW as api-gateway
    participant Prod as cashier-products-service
    participant DB as SQLite (product, syncOutbox)
    participant Worker as OutboxWorker (poll 30s)
    participant Center as pos-center

    User->>App: แก้ไขข้อมูลสินค้า แล้วกด บันทึก
    App->>GW: PUT /api/v1/products/:id
    GW->>Prod: proxy -> PUT /products/:id
    Prod->>DB: findById(id)
    alt ไม่พบสินค้า
        Prod-->>App: 404 Not Found
    else พบสินค้า
        Prod->>DB: update product (local)
        Prod->>DB: enqueue syncOutbox (status: PENDING)
        Prod-->>GW: 200 OK (product)
        GW-->>App: 200 OK
        App-->>User: แก้ไขสินค้าสำเร็จ
    end

    loop ทุก 30 วินาที (background)
        Worker->>DB: getPending() outbox entries
        Worker->>Center: POST /v1/sync/products/receive
        alt Online
            Center-->>Worker: 200 OK
            Worker->>DB: markDone(entry)
        else Offline
            Center--xWorker: network error / timeout
            Worker->>DB: markFailed(entry)
        end
    end
```
