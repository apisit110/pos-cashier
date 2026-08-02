# Product — create — offline mode / online mode

[← กลับไปหน้ารวม](./README.md)

ส่วนหน้าบ้าน (foreground) เหมือนกันทั้ง offline/online: บันทึกสินค้าลง SQLite local แล้วตอบกลับผู้ใช้ทันที พร้อมกับ enqueue รายการเข้า `syncOutbox` การ sync ไป `pos-center` เกิดขึ้นภายหลังโดย `OutboxWorker` (poll ทุก 30 วินาที) — จุดนี้คือจุดที่ offline/online แยกออกจากกัน

**Config `APP_MODE` (`cashier-products-service/.env`):** `online` (default) เริ่ม `OutboxWorker` ตามปกติ, `offline` จะไม่เริ่ม worker เลย (ไม่มีการพยายามยิงออก `pos-center` แม้แต่ครั้งเดียว) รายการใน `syncOutbox` ยังถูก enqueue ตามปกติและรอ sync เมื่อรีสตาร์ทเซอร์วิสเป็นโหมด `online`

**กรณีเช็คแล้วซ้ำ (barcode ซ้ำ):** `CreateProductUseCase` เช็คด้วย `findByBarcode` ก่อนเสมอ ถ้าพบว่ามีสินค้าที่ barcode นี้อยู่แล้วจะ `throw Error` ทันที **ไม่ insert ซ้ำ และไม่ enqueue เข้า syncOutbox** — ปัจจุบันโค้ด catch เป็น error ทั่วไปแล้วตอบกลับเป็น `500` (ไม่ได้แยกเป็น `409 Conflict` ตามหลัก REST) ฝั่ง `cashier-app` จึงต้องอ่านจาก `message` เพื่อนำไปแสดงผู้ใช้ว่าเป็นกรณีข้อมูลซ้ำ

```mermaid
sequenceDiagram
    actor User as ผู้ใช้ (Manager)
    participant App as cashier-app
    participant GW as api-gateway
    participant Prod as cashier-products-service
    participant DB as SQLite (product, syncOutbox)
    participant Worker as OutboxWorker (poll 30s)
    participant Center as pos-center

    User->>App: กรอกข้อมูลสินค้า แล้วกด บันทึก
    App->>GW: POST /api/v1/products
    GW->>Prod: proxy -> POST /products
    Prod->>Prod: authMiddleware ตรวจ JWT
    Prod->>DB: findByBarcode (เช็คซ้ำ)
    DB-->>Prod: ผลการค้นหา

    alt เจอ barcode ซ้ำ (มีสินค้านี้อยู่แล้ว)
        Prod->>Prod: throw Error("Product with barcode ... already exists")
        Prod-->>GW: 500 {message: "Product with barcode ... already exists"}
        GW-->>App: 500 (error message)
        App-->>User: แจ้ง error บาร์โค้ดนี้มีสินค้าอยู่แล้ว ไม่บันทึกซ้ำ
    else ไม่ซ้ำ
        Prod->>DB: insert product (local)
        Prod->>DB: enqueue syncOutbox (status: PENDING)
        Prod-->>GW: 201 Created (product)
        GW-->>App: 201 Created
        App-->>User: บันทึกสินค้าสำเร็จ
    end

    loop ทุก 30 วินาที (background)
        Worker->>DB: getPending() outbox entries
        Worker->>Center: POST /v1/sync/products/receive
        alt Online: pos-center ตอบสำเร็จ
            Center-->>Worker: 200 OK
            Worker->>DB: markDone(entry)
        else Offline: เรียกไม่สำเร็จ / เครือข่ายล่ม
            Center--xWorker: network error / timeout
            Worker->>DB: markFailed(entry) (retryCount++, สูงสุด 5 ครั้ง)
            Note over Worker,Center: จะ retry รอบถัดไปอัตโนมัติ<br/>จนกว่าจะ online หรือครบ MAX_RETRIES
        end
    end
```
