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

Set up

environment

- MID คือ merchant id ได้มาจาก pos-center สร้างให้
- SID คือ store id ได้มาจาก pos-center สร้างให้
- TID คือ terminal id ได้มาจาก pos-center สร้างให้

User Access Management (UAM)

| Action           | Manager | Cashier |
| ---------------- | ------- | ------- |
| Login            | [x]     | [x]     |
| View Dashboard   | [x]     | [ ]     |
| Sell             | [x]     | [x]     |
| View Transaction | [x]     | [ ]     |
| View Products    | [x]     | [ ]     |
| Sync Products    | [x]     | [ ]     |
| Create Product   | [x]     | [ ]     |
| View Staff       | [x]     | [ ]     |
| Create Staff     | [x]     | [ ]     |

---

```bash
# remove drizzle folder and generate again
rm -rf apps/*/drizzle
rm -rf apps/*/*-service.db

pnpm --filter pos-cashier-payment-service exec drizzle-kit generate --name pos-cashier-payment-service.db
pnpm --filter pos-cashier-authen-service exec drizzle-kit generate --name pos-cashier-authen-service.db
pnpm --filter pos-cashier-products-service exec drizzle-kit generate --name pos-cashier-products-service.db
pnpm --filter pos-cashier-members-service exec drizzle-kit generate --name pos-cashier-members-service.db
pnpm --filter pos-cashier-transactions-service exec drizzle-kit generate --name pos-cashier-transactions-service.db
pnpm --filter pos-cashier-orders-service exec drizzle-kit generate --name pos-cashier-orders-service.db
pnpm --filter pos-cashier-terminal-service exec drizzle-kit generate --name pos-cashier-terminal-service.db
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