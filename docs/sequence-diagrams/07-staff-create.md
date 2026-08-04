# Staff — create — offline mode / online mode

[← กลับไปหน้ารวม](./README.md)

บันทึกพนักงานลง SQLite local ก่อนเสมอ (`status: 'pending_sync'`) แล้ว**พยายาม sync ไป `pos-center` ทันทีแบบ synchronous ในคำขอเดียวกัน** (ไม่ใช่ outbox worker แบบ product และไม่ใช่ BullMQ queue แบบ order/transaction) หาก sync สำเร็จจะอัปเดตสถานะเป็น `active` ทันที หาก sync ล้มเหลว (offline หรือ `pos-center` ล่ม) exception จะถูก catch ไว้ภายใน `SyncStaffsUseCase` เอง — request ยังคง response `201 Created` กลับไปให้ผู้ใช้เสมอ โดยพนักงานที่เพิ่งสร้างจะค้างสถานะ `pending_sync` ต่อไป

**ข้อควรระวัง (ต่างจาก flow อื่นในระบบนี้):**

- **ไม่มี retry อัตโนมัติ** — ต่างจาก product (`OutboxWorker` retry ทุก 30s) และ order/transaction (BullMQ backoff) กรณี sync staff ล้มเหลวจะไม่มีอะไรลองใหม่ให้อัตโนมัติ ต้องเรียก `POST /authen/staffs/sync` ซ้ำเอง (endpoint นี้มีอยู่จริงทั้งฝั่ง backend และ `ApiStaffRepository.syncStaffs()`/`SyncStaffUseCase` ฝั่ง frontend แต่**ปัจจุบันไม่มีปุ่มหรือจุดใดในหน้าจอเรียกใช้งาน** — เป็น dead code ที่ยังไม่ได้ผูก UI)
- **PIN ไม่ได้ถูก hash** — แม้ field/variable จะตั้งชื่อว่า `pinHash` ทั้งใน DB (`staff_pins.pin_hash`) และโค้ด แต่ค่าที่บันทึกจริงคือ PIN แบบ plaintext ที่รับมาจาก request ตรงๆ ไม่มีการเข้ารหัสใดๆ
- **ไม่มี auth middleware** คุ้มครอง route `POST /staffs` ต่างจาก products service ที่มี `authMiddleware` ตรวจ JWT ก่อนเสมอ

```mermaid
sequenceDiagram
    actor User as ผู้ใช้ (Manager)
    participant App as cashier-app
    participant GW as api-gateway
    participant Authen as cashier-authen-service
    participant DB as SQLite (staffs, staff_pins)
    participant Center as pos-center

    User->>App: กรอกชื่อ, เลือก role, ตั้ง PIN แล้วกด "Create & Sync Staff"
    App->>App: validate fullName ไม่ว่าง, pin ยาว >= 4 หลัก
    App->>GW: POST /api/v1/authen/staffs {fullName, roleId, pin}
    GW->>Authen: proxy -> POST /staffs (ไม่มี authMiddleware)
    Authen->>DB: countAll() staffs (สำหรับ gen username)
    Authen->>Authen: username = MID + running number (4 หลัก)
    Authen->>DB: insert staffs (status: 'pending_sync')
    Authen->>DB: insert staff_pins (pin_hash = pin แบบ plaintext)
    Authen->>DB: findAllToSync() staff ที่ status = 'pending_sync'
    Authen->>Center: POST /v1/sync/users {userId, fullName, pinHash, roleId, branchIds, status}

    alt Online: pos-center ตอบสำเร็จ
        Center-->>Authen: 200 {results: [...]}
        Authen->>DB: updateSyncStatus(staffId, 'active')
        Authen-->>GW: 201 Created (staff, status: active)
        GW-->>App: 201 Created
        App-->>User: สร้างพนักงานสำเร็จ (sync แล้ว)
    else Offline / pos-center ล่ม / timeout
        Center--xAuthen: network error / timeout
        Note over Authen: catch error ภายใน SyncStaffsUseCase<br/>ไม่ throw ออกไปนอก use case
        Authen->>DB: staff แถวนี้ยังคง status = 'pending_sync'
        Authen-->>GW: 201 Created (staff, status: pending_sync)
        GW-->>App: 201 Created
        App-->>User: สร้างพนักงานสำเร็จในเครื่อง (ยังไม่ sync กับส่วนกลาง)
    end

    Note over App,Center: ปัจจุบันไม่มีกลไก retry อัตโนมัติสำหรับ staff ที่ค้าง pending_sync<br/>ต้องเรียก POST /authen/staffs/sync ซ้ำเอง (endpoint มีอยู่แต่ไม่ถูกผูกกับ UI ใดๆ)
```
