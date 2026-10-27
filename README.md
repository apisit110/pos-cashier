pos-cashier

เป็นโปรเจคเกี่ยวกับเครื่องขายสินค้าหรือ point of sales ทำหน้าที่ ขายสินค้าโดยการสแกน barcode 1D จากรายการสินค้าที่กำหนดไว้พร้อมราคา

> barcode 1D คือ บาร์โค้ด แถบยาว
> barcode 2D คือ บาร์โค้ด สี่เหลี่ยม

---


# Functional

## Backlog

[] stock system
[] member system
[] promotion system
[] discount on sales
[] Purchase with Purchase (PWP)
[] hold order

Senario
- Cashier scan barcode to create order for Alice 
- Alice wait a moment to grap other product
- Cashier Hold Order
- Cashier scan barcode to create a new order for Bob
- Cashier complete order of Bob
- Cashier switch back to order of Alice

> Can hold more then 1 order?

[] QR_PROMPTPAY Payment Method
[] 1 bill can pay with multi payment

- Bill = 100
- CASH = 5
- QR_PROMPTPAY = 95



## Dashboard

[x] daily summary
[x] trend weeky

## Sales

[x] sale

## Transaction

[x] view/search transaction
[x] view transaction detail

## Product Management

[x] create product
[x] edit product

## Staff Management

[x] login
[x] logout
[x] role permission
[x] create staff

## Offline mode

[x] can login event if offline
[x] can sales event if offline
[x] can manage product event if offline

## Online mode

[x] sync pull staff
[x] sync pull product
[x] sync push product
[x] sync push order
[x] sync push transaction

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

---

```bash
docker build -f apps/<โฟลเดอร์ service>/Dockerfile -t pos-cashier/<ชื่อ image> .

docker build -f apps/cashier-api-gateway/Dockerfile          -t pos-cashier/cashier-api-gateway .
docker build -f apps/cashier-authen-service/Dockerfile       -t pos-cashier/cashier-authen-service .
docker build -f apps/cashier-members-service/Dockerfile      -t pos-cashier/cashier-members-service .
docker build -f apps/cashier-orders-service/Dockerfile       -t pos-cashier/cashier-orders-service .
docker build -f apps/cashier-products-service/Dockerfile     -t pos-cashier/cashier-products-service .
docker build -f apps/cashier-terminal-service/Dockerfile     -t pos-cashier/cashier-terminal-service .
docker build -f apps/cashier-transactions-service/Dockerfile -t pos-cashier/cashier-transactions-service .
docker build -f apps/cashier-sync-service/Dockerfile         -t pos-cashier/cashier-sync-service .
```

```bash
docker run --rm -p 3000:3000 \
  -e AUTHEN_SERVICE_URL=http://host.docker.internal:3005 \
  -e MEMBERS_SERVICE_URL=http://host.docker.internal:3004 \
  -e ORDERS_SERVICE_URL=http://host.docker.internal:3002 \
  -e PRODUCTS_SERVICE_URL=http://host.docker.internal:3001 \
  -e TERMINAL_SERVICE_URL=http://host.docker.internal:3007 \
  -e TRANSACTIONS_SERVICE_URL=http://host.docker.internal:3006 \
  pos-cashier/cashier-api-gateway:1.0.0
```

```bash
# first deploy, or after the schema changes
RELEASE=1.0.0 docker compose run --rm db-migrate
RELEASE=1.0.0 docker compose run --rm db-seed

RELEASE=1.0.0 docker compose up -d

# down and remove volume (for remove sqlite file)
RELEASE=1.0.0 docker compose down
RELEASE=1.0.0 docker compose down -v
```