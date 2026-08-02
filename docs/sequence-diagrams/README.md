# Sequence Diagrams

เอกสารชุดนี้อธิบาย flow การทำงานหลักของระบบ pos-cashier ในรูปแบบ sequence diagram (mermaid) แยกเป็นไฟล์ต่อ 1 flow

สถาปัตยกรรมของระบบเป็นแบบ **local-first**: ทุก write (login, สร้าง/แก้ไขสินค้า, ขายสินค้า) จะเขียนลง SQLite ของแต่ละ service ก่อนแล้วตอบกลับผู้ใช้ทันที การ sync ไปยัง `pos-center` เป็นการทำงานเบื้องหลัง (async) ผ่าน outbox worker (สำหรับสินค้า) หรือ BullMQ queue (สำหรับ order/transaction) ดังนั้นในระบบนี้**ไม่มี flag `OFFLINE_MODE`** — โค้ดพาธเดียวกันถูกใช้ทั้ง offline/online โดยความแตกต่างอยู่ที่ผลลัพธ์ของการเรียก `pos-center` ในขั้นตอน background sync เท่านั้น

เนื่องจากทุก service ใช้ SQLite ตัวเดียวกัน (`pos-cashier.db`) การอ่าน/เขียนข้อมูลข้าม domain ภายในระบบเดียวกัน (เช่น order อ่านข้อมูล staff/payment/transaction) จึงแสดงเป็นการ query ตรงกับ DB กลาง ไม่แสดงเป็นการยิง API ระหว่าง service กันเอง

Participants ที่ใช้ร่วมกัน:

- `cashier-app` — frontend (Next.js)
- `api-gateway` — reverse proxy (`cashier-api-gateway`, port 3000)
- แต่ละ microservice (`cashier-authen-service`, `cashier-products-service`, `cashier-orders-service`, `cashier-transactions-service`, `cashier-terminal-service`, `cashier-members-service`) — `cashier-payment-service` ถูกลบทิ้งแล้ว (payment logic ถูกรวมเข้า `cashier-orders-service` และไม่มีใครเรียกเซอร์วิสนี้แยกอีก)
- `sync-service` — BullMQ worker (`cashier-sync-service`) สำหรับ order/transaction
- `pos-center` — ระบบส่วนกลาง (ภายนอก repo นี้)

## Flows

1. [Login — offline / online](./01-login.md)
2. [Product — create — offline / online](./02-product-create.md)
3. [Product — edit — offline / online](./03-product-edit.md)
4. [Product — sync — online](./04-product-sync.md)
5. [Sell (ขายสินค้า) — create/checkout — offline / online](./05-sell-checkout.md)

## สรุปแนวคิด offline vs online

| Flow | ส่วนที่ผู้ใช้เห็นผลทันที (local, ทำงานเหมือนกันเสมอ) | ส่วนที่แยก offline/online (background sync) |
| --- | --- | --- |
| Login | ตรวจ username/pin กับ SQLite local | — (ไม่มีการเรียก pos-center) |
| Product create/edit | บันทึก/แก้ไขสินค้าใน SQLite local + เข้าคิว outbox | `OutboxWorker` push ไป pos-center ทุก 30s |
| Product sync | — (flow นี้ต้องออนไลน์เท่านั้น) | เรียก pos-center ดึงสินค้าเข้ามา (pull) |
| Sell/checkout | สร้าง order, ประมวลผลชำระเงิน (รองรับแค่ `CASH`), สร้าง transaction ใน SQLite local, กัน retry ซ้ำด้วย `idempotencyKey` | BullMQ job `sync-order` / `sync-transaction` ไป pos-center |

ทุก flow ที่เป็น "write" ฝั่ง cashier จะสำเร็จและตอบผู้ใช้ได้ทันทีโดยไม่ขึ้นกับสถานะเครือข่าย ส่วนการซิงก์กับ `pos-center` เป็นเพียง eventual consistency ที่เกิดขึ้นเบื้องหลัง และมีกลไก retry (outbox retry / BullMQ backoff) รองรับกรณีออฟไลน์อยู่แล้ว
