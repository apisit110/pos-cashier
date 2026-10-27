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
- MID

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

- คัดลอก `.env.example` เป็น `.env` ในทุก app และ `packages/database` แล้วใส่ค่าจริง (`JWT_SECRET` ต้องเหมือนกันทุก service, `SYNC_CLIENT_ID` / `SYNC_CLIENT_SECRET` ได้จาก pos-center)

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
| product:edit     | [ ]   | [x]     | [ ]     |
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
pnpm --filter @lightning-pos/database db:migrate
pnpm --filter @lightning-pos/database db:seed all
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

---

```bash
docker build -f apps/<โฟลเดอร์ service>/Dockerfile -t <ชื่อ image> .

docker build -f apps/cashier-api-gateway/Dockerfile          -t cashier-api-gateway .
docker build -f apps/cashier-authen-service/Dockerfile       -t cashier-authen-service .
docker build -f apps/cashier-members-service/Dockerfile      -t cashier-members-service .
docker build -f apps/cashier-orders-service/Dockerfile       -t cashier-orders-service .
docker build -f apps/cashier-products-service/Dockerfile     -t cashier-products-service .
docker build -f apps/cashier-terminal-service/Dockerfile     -t cashier-terminal-service .
docker build -f apps/cashier-transactions-service/Dockerfile -t cashier-transactions-service .
docker build -f apps/cashier-sync-service/Dockerfile         -t cashier-sync-service .
```

```bash
docker run --rm cashier-api-gateway:1.0.0
docker run --rm -it <xxx> sh
```


```bash
docker rm -f charming_cohen

docker run --rm -p 3000:3000 \
  -e AUTHEN_SERVICE_URL=http://host.docker.internal:3005 \
  -e MEMBERS_SERVICE_URL=http://host.docker.internal:3004 \
  -e ORDERS_SERVICE_URL=http://host.docker.internal:3002 \
  -e PRODUCTS_SERVICE_URL=http://host.docker.internal:3001 \
  -e TERMINAL_SERVICE_URL=http://host.docker.internal:3007 \
  -e TRANSACTIONS_SERVICE_URL=http://host.docker.internal:3006 \
  cashier-api-gateway:1.0.0

docker compose up -d --no-deps cashier-api-gateway
```

```bash
# first deploy, or after the schema changes
RELEASE=1.0.0 docker compose run --rm db-migrate
RELEASE=1.0.0 docker compose run --rm db-seed      # only if you need it

# start the services
RELEASE=1.0.0 docker compose up -d
```