# sync

## download

- product
- promotion

|                |                                                                    |
| -------------- | ------------------------------------------------------------------ |
| Check Version. | วันละครั้ง (หรือรอบใหญ่) เพื่อความแม่นยำ 100% (Baseline)           |
| Notify.        | ทันทีที่มีการเปลี่ยนแปลง เพื่อความรวดเร็ว (Agility)                |
| Effective.     | Date ตลอดเวลา (ตาม Logic) เพื่อความต่อเนื่อง 24 ชม. (Availability) |

---

## upload

ต้องรับประกันว่า "ข้อมูลต้องไม่หาย (Zero Data Loss)" และ "ต้องไม่ซ้ำ (No Duplication)"

- transaction
- order

- ตอน commit ลง db ใน local ให้กำหนด flag เป็น pending sync queue แล้ว add queue
- ทำ batch upload เพื่อ add queue

**การป้องกันข้อมูลซ้ำ (Idempotency) - สำคัญมาก**

ในโลกของ Distributed System ปัญหาที่พบบ่อยคือ "ส่งไปแล้ว Server ได้รับแล้ว แต่เครื่อง POS ไม่ได้รับคำยืนยัน (Ack)" ทำให้เครื่อง POS พยายามส่งซ้ำ

- Client-Generated ID: เครื่อง POS ต้องสร้าง UUID (เช่น order_id: "550e8400-e29b...") ประจำ Order ตั้งแต่ที่สาขา
- Idempotency Key: เมื่อส่ง API ให้แนบ ID นี้ไปด้วย
- Server Logic: เมื่อ Server ได้รับ ID ที่เคยบันทึกไปแล้ว จะตอบกลับว่า 200 OK (สำเร็จ) ทันทีโดยไม่บันทึกซ้ำ หรือตัดสต็อกซ้ำ

> เชื่อเวลาของเครื่อง POS (Local Time) ไม่ใช่เวลาที่ Server ได้รับข้อมูล

- **Normal:** ขายจบ -> บันทึก Local -> ยิง API -> Server ตอบ OK -> เปลี่ยนสถานะเป็น Synced (ใช้เวลา < 1 วินาที)
- **Offline:** ขายจบ -> บันทึก Local -> ยิง API (Fail) -> เก็บใน Queue -> (1 ชั่วโมงผ่านไป) -> เน็ตกลับมา -> Background Task ตรวจพบ -> ยิง API ซ้ำ -> Server ตอบ OK -> เปลี่ยนสถานะเป็น Synced

[ ] - sync fail

[ ] - users
[ ] - transactions
[ ] - products
[ ] - promotions

pin_hash ยังไม่ได้ hash

1. center

- ระบบกลางมีหลาย merchant
- หนึ่ง merchant มีหลาย product
- หนึ่ง merchant มีหลาย พนักงาน
- หนึ่ง merchant มีหลาย store
- หนึ่ง store มีหลาย สินค้า

set up

- สร้าง merchant
- สร้าง product ใน merchant นั้นๆ
- สร้าง store
- map merchant กับ product

หลังจากสร้าง store ต้อง generate secret key ใช้สำหรับ encrypt หรือ verify signature ของ store นั้นๆ

2. cashier

set up

- set env & initial
  - merchant
  - store
  - default user
- sync product (download)
- create user role staff

```bash
# remove drizzle folder and generate again
rm -rf apps/*/drizzle

pnpm --filter cashier-payment-service exec drizzle-kit generate
pnpm --filter cashier-authen-service exec drizzle-kit generate
pnpm --filter cashier-products-service exec drizzle-kit generate
pnpm --filter cashier-members-service exec drizzle-kit generate
pnpm --filter cashier-transactions-service exec drizzle-kit generate
pnpm --filter cashier-orders-service exec drizzle-kit generate
pnpm run dev
```