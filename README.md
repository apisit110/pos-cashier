pos-cashier

เป็นโปรเจคเกี่ยวกับเครื่องขายสินค้าหรือ point of sales ทำหน้าที่ ขายสินค้าโดยการสแกน barcode 1D จากรายการสินค้าที่กำหนดไว้พร้อมราคา

> barcode 1D คือ บาร์โค้ด แถบยาว
> barcode 2D คือ บาร์โค้ด สี่เหลี่ยม

Functional

- [x] - login
- [x] - ขายสินค้า
  - [x] - สร้างคำสั่งซื้อ Order
    - [x] - ส่งข้อมูลการสร้างคำสั่งซื้อไปยัง pos-center
  - [x] - สร้างรายการชำระเงิน Transaction
    - [x] - ส่งข้อมูลการสร้างคำสั่งซื้อไปยัง pos-center
- [x] - ดูรายการขาย
- [x] - ดูรายการสินค้า
- [x] - ดึงรายการสินค้าจาก pos-center
- [x] - ดูพนักงานในระบบ
- [x] - สร้างพนักงานในระบบ

---

### onboard - offline mode

- กำหนด env ใน cashier แล้วใช้ได้เลย
- MANAGER_USERNAME
- MANAGER_NAME
- MANAGER_PIN
- MID
- MERCHANT_ID
- STORE_ID
- TERMINAL_ID

### onboard - online mode

- สร้างที่ center แล้วได้ค่าต่างมากำหนด env ใน cashier

### login - offline mode

- ใช้ username pin ตอน onboard

### login - online mode

- ใช้ username pin ตอน onboard
- จากนั้นเช็คกับ center

### product - create - offline mode

### product - create - online mode

สร้างสินค้าแล้ว sync ไปยัง center ด้วย

### product - edit - offline mode

### product - edit - online mode

### product - sync - online mode

### sell - create - offline mode

### sell - create - online mode

---

Set up

environment

- MID คือ merchant id ได้มาจาก pos-center สร้างให้
- SID คือ store id ได้มาจาก pos-center สร้างให้
- TID คือ terminal id ได้มาจาก pos-center สร้างให้

User Access Management (UAM)

| Action           | Guest | Manager | Cashier |
| ---------------- | ----- | ------- | ------- |
| login            | [x]   | [ ]     | [ ]     |
| dashboard:view   | [ ]   | [x]     | [ ]     |
| sell:create      | [ ]   | [x]     | [x]     |
| transaction:view | [ ]   | [x]     | [ ]     |
| products:view    | [ ]   | [x]     | [ ]     |
| product:create   | [ ]   | [x]     | [ ]     |
| products:sync    | [ ]   | [x]     | [ ]     |
| staff:view       | [ ]   | [x]     | [ ]     |
| staff:create     | [ ]   | [x]     | [ ]     |

---

All services share a single SQLite database (`pos-cashier.db` at the repo root):

- `packages/model` (`@lightning-pos/model`) defines the schema (drizzle tables) for every service.
- `packages/database` (`@lightning-pos/database`) owns the drizzle migrations and connects/migrates the shared db (`createDatabase()`), plus domain-specific seed functions (`seedAuth`, `seedTerminal`) that services call at startup.

```bash
# remove drizzle folder and generate again
rm -rf packages/database/drizzle
rm -f pos-cashier.db pos-cashier.db-*

pnpm --filter @lightning-pos/model build
pnpm --filter @lightning-pos/database db:generate
pnpm run dev
```

todo

- [ ] - report summary daily
- [ ] - report summary weekly
- [ ] - report summary monthly
- [ ] - report summary yearly

- [x] - theme light
- [x] - theme dark

- [x] - create product
- [x] - sync product (upload)
- [x] - update product + sync (upload)

- [x] - sync order (upload)
- [x] - sync transaction (upload)
- [ ] - sync user (upload)
- [ ] - sync promotion (download)

- [ ] - receipt
- [ ] - void (HOLD)

- client -> order-service - /checkout
- order-service -> payment-service - /payment/internal
- order-service -> sync-service - addOrderSyncJob
- order-service -> transactions-service - /internal/v1/transactions
- order-service -> sync-service - addTransactionSyncJob
  - sync-service -> center - /v1/sync/orders
  - sync-service -> order-service - /internal/v1/orders/:id/synced
  - sync-service -> center - /v1/sync/transactions
  - sync-service -> transactions-service - /internal/v1/transactions/:id/synced

[ ] - check id and order id generator of /checkout (doing)
