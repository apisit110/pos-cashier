# Login — offline mode / online mode

[← กลับไปหน้ารวม](./README.md)

Login เป็น local-only เสมอ ตรวจสอบ username/pin กับ SQLite ของ `cashier-authen-service` โดยตรง **ไม่มีการเรียก pos-center ใน flow นี้เลย** ไม่ว่าจะออนไลน์หรือออฟไลน์ผลลัพธ์จึงเหมือนกันทุกประการ (เพราะ staff ถูก provision ไว้ในเครื่อง local ล่วงหน้าแล้วตอน onboard/create staff)

**Config `APP_MODE`:** ไม่มีผลกับการตรวจ login — `cashier-authen-service` ไม่มีการเรียกออกไปหา `pos-center` เลย; มีผลแค่ `online` จะ enqueue `sync-pull` หลัง login สำเร็จ (ไม่รอผล ถ้า enqueue ไม่ได้ login ก็ยังสำเร็จ) ดู [sync pull](./08-sync-pull.md)

```mermaid
sequenceDiagram
    actor User as ผู้ใช้ (Cashier/Manager)
    participant App as cashier-app
    participant GW as api-gateway
    participant Auth as cashier-authen-service
    participant DB as SQLite (staff table)
    participant Queue as Redis (sync-queue / BullMQ)

    User->>App: กรอก username + pin
    App->>App: LoginUseCase.execute({username, pin})<br/>แนบ tid ที่ได้จากหน้า terminal setup (localStorage)
    App->>GW: POST /api/v1/authen/auth/login
    GW->>Auth: proxy -> POST /auth/login
    Auth->>DB: findByTid(tid)
    DB-->>Auth: terminal record (tid, mid, sid)
    Auth->>DB: findByUsername(username)
    DB-->>Auth: staff record (pinHash)

    alt ไม่พบ terminal, ไม่พบ staff หรือ pin ไม่ตรง
        Auth-->>GW: 401 Unauthorized
        GW-->>App: 401 Unauthorized
        App-->>User: แจ้ง error เข้าสู่ระบบไม่สำเร็จ
    else pin ถูกต้อง
        Auth->>Auth: jwt.sign(accessToken 60m, refreshToken 30d)<br/>payload มี tid, mid, sid ให้ orders-service ใช้
        opt APP_MODE=online
            Auth-)Queue: add 'sync-pull' (ไม่รอผล, ดู 08-sync-pull)
        end
        Auth-->>GW: 200 {staff, accessToken, refreshToken}
        GW-->>App: 200 {staff, accessToken, refreshToken}
        App->>App: เก็บ session ใน localStorage
        App-->>User: เข้าสู่ระบบสำเร็จ
    end

    Note over Auth,DB: pos-center ไม่ถูกเรียกใช้ใน flow นี้เลย<br/>ผล login ทั้ง online/offline เหมือนกัน 100%
```
