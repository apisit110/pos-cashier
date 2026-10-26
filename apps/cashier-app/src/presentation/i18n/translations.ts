export interface Translations {
  common: {
    ok: string;
    cancel: string;
    error: string;
    success: string;
    edit: string;
    save: string;
    creating: string;
    active: string;
    loadingApp: string;
  };
  mainLayout: {
    appName: string;
    dashboard: string;
    posTerminal: string;
    transactions: string;
    products: string;
    staffs: string;
    createStaff: string;
    logout: string;
  };
  login: {
    title: string;
    subtitle: string;
    username: string;
    usernamePlaceholder: string;
    pin: string;
    forgotPin: string;
    signIn: string;
    noAccount: string;
    contactSupport: string;
    demoCredentials: string;
    errorRequired: string;
    errorFailed: string;
  };
  terminalSetup: {
    title: string;
    subtitle: string;
    terminalId: string;
    terminalIdPlaceholder: string;
    activate: string;
    hint: string;
    errorRequired: string;
    errorFailed: string;
  };
  dashboard: {
    welcomeBack: string;
    subtitle: string;
    admin: string;
    todayRevenue: string;
    todayOrders: string;
    rangeRevenue: string;
    rangeOrders: string;
    hourlyChartTitle: string;
    dailyChartTitle: string;
    loading: string;
    noSalesToday: string;
    noSalesRecent: string;
  };
  createOrder: {
    title: string;
    member: string;
    memberId: string;
    memberIdPlaceholder: string;
    identify: string;
    points: string;
    currentOrder: string;
    itemsCount: string;
    columnNumber: string;
    columnBarcode: string;
    columnName: string;
    columnQty: string;
    columnPrice: string;
    columnTotal: string;
    columnAction: string;
    noProducts: string;
    promo: string;
    total: string;
    amountDue: string;
    receivedAmount: string;
    paymentMethod: string;
    cash: string;
    change: string;
    clear: string;
    delete: string;
    enter: string;
    errorInsufficientAmount: string;
    proceedToPayment: string;
    errorProductNotFound: string;
    errorMemberNotFound: string;
    errorIdentifyMember: string;
    editPriceTitle: string;
    save: string;
    errorPriceInvalid: string;
    errorUpdatePrice: string;
  };
  createStaff: {
    title: string;
    fullName: string;
    fullNamePlaceholder: string;
    pinCode: string;
    role: string;
    manager: string;
    managerDesc: string;
    cashier: string;
    cashierDesc: string;
    createAndSync: string;
    errorFullNameRequired: string;
    errorPinInvalid: string;
    successMessage: string;
    errorFailed: string;
  };
  staffList: {
    title: string;
    totalStaffs: string;
    createNewStaff: string;
    syncStaffs: string;
    syncing: string;
    syncFailedTitle: string;
    syncingLabel: string;
    columnUsername: string;
    columnFullName: string;
    columnRole: string;
    columnStatus: string;
    emptyMessage: string;
  };
  transactionList: {
    title: string;
    totalTransactions: string;
    dateRange: string;
    startDate: string;
    endDate: string;
    transactionId: string;
    transactionIdPlaceholder: string;
    orderId: string;
    orderIdPlaceholder: string;
    method: string;
    methodAll: string;
    methodCash: string;
    methodCredit: string;
    methodQr: string;
    amountRange: string;
    amountRangeAny: string;
    status: string;
    statusAll: string;
    statusPending: string;
    statusApproved: string;
    statusFailed: string;
    statusVoided: string;
    statusRefunded: string;
    search: string;
    clearFilters: string;
    columnDate: string;
    columnTime: string;
    columnTransactionId: string;
    columnOrderId: string;
    columnAmount: string;
    columnStatus: string;
    columnActions: string;
    viewDetails: string;
    emptyMessage: string;
  };
  transactionDetail: {
    title: string;
    loading: string;
    errorNotFound: string;
    amountTotal: string;
    transactionId: string;
    orderReference: string;
    dateTime: string;
    staffMember: string;
    paymentMethod: string;
    status: string;
    orderItems: string;
    columnNumber: string;
    columnProduct: string;
    columnUnitPrice: string;
    columnQty: string;
    columnTotal: string;
    emptyMessage: string;
  };
  productList: {
    title: string;
    totalProducts: string;
    createProduct: string;
    syncProducts: string;
    syncing: string;
    columnBarcode: string;
    columnName: string;
    columnBrand: string;
    columnPrice: string;
    columnActions: string;
    filterBarcode: string;
    filterBarcodePlaceholder: string;
    filterName: string;
    filterNamePlaceholder: string;
    filterBrand: string;
    filterBrandPlaceholder: string;
    filterPrice: string;
    filterPricePlaceholder: string;
    search: string;
    clearFilters: string;
    emptyMessage: string;
    syncFailedTitle: string;
    syncingLabel: string;
  };
  createProduct: {
    title: string;
    columnsHint: string;
    chooseFile: string;
    downloadTemplate: string;
    previewTitle: string;
    itemsCount: string;
    invalidCount: string;
    clear: string;
    importButton: string;
    importingLabel: string;
    errorNoFile: string;
    errorEmptyFile: string;
    errorRow: string;
    resultTitle: string;
    resultSummary: string;
    columnRow: string;
    columnBarcode: string;
    columnName: string;
    columnBrand: string;
    columnPrice: string;
    columnStatus: string;
    statusValid: string;
    errorBarcodeRequired: string;
    errorNameRequired: string;
    errorPriceInvalid: string;
  };
  editProduct: {
    title: string;
    barcode: string;
    name: string;
    namePlaceholder: string;
    brand: string;
    brandPlaceholder: string;
    price: string;
    saveButton: string;
    updatingLabel: string;
    errorNameRequired: string;
    errorPriceInvalid: string;
    errorFailed: string;
    successMessage: string;
    errorTitle: string;
    successTitle: string;
  };
}

export const en: Translations = {
  common: {
    ok: 'OK',
    cancel: 'Cancel',
    error: 'Error',
    success: 'Success',
    edit: 'Edit',
    save: 'Save',
    creating: 'Creating...',
    active: 'Active',
    loadingApp: 'Loading Lightning POS...',
  },
  mainLayout: {
    appName: 'POS Cashier',
    dashboard: 'Dashboard',
    posTerminal: 'POS Terminal',
    transactions: 'Transactions',
    products: 'Products',
    staffs: 'Staffs',
    createStaff: 'Staffs',
    logout: 'Logout',
  },
  login: {
    title: 'Lightning POS',
    subtitle: 'Sign in to access your dashboard',
    username: 'Username',
    usernamePlaceholder: 'Enter your username',
    pin: 'PIN Code',
    forgotPin: 'Forgot PIN?',
    signIn: 'Sign In',
    noAccount: "Don't have an account?",
    contactSupport: 'Contact Support',
    demoCredentials: 'Demo Credentials:',
    errorRequired: 'Please enter both Username and PIN',
    errorFailed: 'Login failed. Please try again.',
  },
  terminalSetup: {
    title: 'Terminal Setup',
    subtitle: 'Enter your Terminal ID to activate this POS',
    terminalId: 'Terminal ID',
    terminalIdPlaceholder: 'e.g. T1',
    activate: 'Activate Terminal',
    hint: "Contact your manager if you don't know your Terminal ID",
    errorRequired: 'Please enter a Terminal ID',
    errorFailed: 'Terminal activation failed. Please try again.',
  },
  dashboard: {
    welcomeBack: 'Welcome back, {name}',
    subtitle: "Here's what's happening with your store today.",
    admin: 'Admin',
    todayRevenue: "Today's Revenue",
    todayOrders: "Today's Orders",
    rangeRevenue: 'Last {days} Days Revenue',
    rangeOrders: 'Last {days} Days Orders',
    hourlyChartTitle: 'Sales by Hour (Today)',
    dailyChartTitle: 'Sales by Day (Last {days} Days)',
    loading: 'Loading summary...',
    noSalesToday: 'No sales yet today.',
    noSalesRecent: 'No sales in this period.',
  },
  createOrder: {
    title: 'POS Terminal',
    member: 'Member',
    memberId: 'Member ID',
    memberIdPlaceholder: 'Enter Member ID (M001-M003)',
    identify: 'Identify',
    points: 'points',
    currentOrder: 'Current Order',
    itemsCount: '{count} items',
    columnNumber: '#',
    columnBarcode: 'Barcode',
    columnName: 'Name',
    columnQty: 'Qty',
    columnPrice: 'Price',
    columnTotal: 'Total',
    columnAction: 'Action',
    noProducts: 'No products added yet. Scan a product to begin.',
    promo: 'Promo',
    total: 'Total',
    amountDue: 'Amount Due',
    receivedAmount: 'Received Amount',
    paymentMethod: 'Payment Method',
    cash: 'Cash',
    change: 'Change',
    clear: 'Cancel',
    delete: 'Delete',
    enter: 'Enter',
    errorInsufficientAmount: 'Received amount is less than the total.',
    proceedToPayment: 'Proceed to Payment',
    errorProductNotFound: 'Product not found.',
    errorMemberNotFound: 'Member not found.',
    errorIdentifyMember: 'Error identifying member.',
    editPriceTitle: 'Edit Price',
    save: 'Save',
    errorPriceInvalid: 'Please enter a valid price.',
    errorUpdatePrice: 'Failed to update price.',
  },
  createStaff: {
    title: 'Create New Staff',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Enter employee full name',
    pinCode: 'PIN Code (6 digits)',
    role: 'Role',
    manager: 'Manager',
    managerDesc: 'Full access to dashboard',
    cashier: 'Cashier',
    cashierDesc: 'Access to POS',
    createAndSync: 'Create & Sync Staff',
    errorFullNameRequired: 'Please enter a full name',
    errorPinInvalid: 'Please enter a valid PIN (at least 4 digits)',
    successMessage: 'Staff "{fullName}" created successfully! Username: {userId}. Data synced to cloud.',
    errorFailed: 'Failed to create staff',
  },
  staffList: {
    title: 'Manage Staffs',
    totalStaffs: 'Total: {count} Staffs',
    createNewStaff: 'Create New Staff',
    syncStaffs: 'Sync to Manager',
    syncing: 'Syncing...',
    syncFailedTitle: 'Sync Failed',
    syncingLabel: 'Synchronizing staff data...',
    columnUsername: 'Username',
    columnFullName: 'Full Name',
    columnRole: 'Role',
    columnStatus: 'Status',
    emptyMessage: 'No staffs found.',
  },
  transactionList: {
    title: 'Sales History',
    totalTransactions: 'Total: {count} Transactions',
    dateRange: 'Date Range',
    startDate: 'Start Date',
    endDate: 'End Date',
    transactionId: 'Transaction ID',
    transactionIdPlaceholder: 'Enter ID',
    orderId: 'Order ID',
    orderIdPlaceholder: 'Enter Order ID',
    method: 'Method',
    methodAll: 'All Methods',
    methodCash: 'Cash',
    methodCredit: 'Credit Card',
    methodQr: 'QR PromptPay',
    amountRange: 'Amount Range',
    amountRangeAny: 'Any Amount',
    status: 'Status',
    statusAll: 'All Status',
    statusPending: 'Pending',
    statusApproved: 'Approved',
    statusFailed: 'Failed',
    statusVoided: 'Voided',
    statusRefunded: 'Refunded',
    search: 'Search',
    clearFilters: 'Clear Filters',
    columnDate: 'Date',
    columnTime: 'Time',
    columnTransactionId: 'Transaction ID',
    columnOrderId: 'Order ID',
    columnAmount: 'Amount',
    columnStatus: 'Status',
    columnActions: 'Actions',
    viewDetails: 'View Details',
    emptyMessage: 'No transactions found.',
  },
  transactionDetail: {
    title: 'Transaction Details',
    loading: 'Loading transaction details...',
    errorNotFound: 'Could not find transaction details. Please try again.',
    amountTotal: 'Amount Total',
    transactionId: 'Transaction ID',
    orderReference: 'Order Reference',
    dateTime: 'Date & Time',
    staffMember: 'Staff Member',
    paymentMethod: 'Payment Method',
    status: 'Status',
    orderItems: 'Order Items ({count})',
    columnNumber: '#',
    columnProduct: 'Product',
    columnUnitPrice: 'Unit Price',
    columnQty: 'Qty',
    columnTotal: 'Total',
    emptyMessage: 'No order items available.',
  },
  productList: {
    title: 'Products Inventory',
    totalProducts: 'Total: {count} Products',
    createProduct: '+ Import Products',
    syncProducts: 'Sync Products',
    syncing: 'Syncing...',
    columnBarcode: 'Barcode',
    columnName: 'Product Name',
    columnBrand: 'Brand',
    columnPrice: 'Price',
    columnActions: 'Actions',
    filterBarcode: 'Barcode',
    filterBarcodePlaceholder: 'Search barcode...',
    filterName: 'Product Name',
    filterNamePlaceholder: 'Search product name...',
    filterBrand: 'Brand',
    filterBrandPlaceholder: 'Search brand...',
    filterPrice: 'Price',
    filterPricePlaceholder: 'Search price...',
    search: 'Search',
    clearFilters: 'Clear Filters',
    emptyMessage: 'No products found matching your filters.',
    syncFailedTitle: 'Sync Failed',
    syncingLabel: 'Synchronizing data...',
  },
  createProduct: {
    title: 'Import Products',
    columnsHint: 'Upload an .xlsx file with a header row and columns: barcode, name, brand (optional), price',
    chooseFile: 'Choose .xlsx file',
    downloadTemplate: 'Download sample file',
    previewTitle: 'Preview Products',
    itemsCount: '{count} items',
    invalidCount: '{count} invalid',
    clear: 'Clear',
    importButton: 'Import {count} Product(s)',
    importingLabel: 'Importing products...',
    errorNoFile: 'Please choose an .xlsx file',
    errorEmptyFile: 'The file has no data rows',
    errorRow: 'Row {row}: {message}',
    resultTitle: 'Import Result',
    resultSummary: 'Imported {success} of {total} products',
    columnRow: 'Row',
    columnBarcode: 'Barcode',
    columnName: 'Product Name',
    columnBrand: 'Brand',
    columnPrice: 'Price',
    columnStatus: 'Status',
    statusValid: 'OK',
    errorBarcodeRequired: 'Barcode is required',
    errorNameRequired: 'Product name is required',
    errorPriceInvalid: 'Price is invalid',
  },
  editProduct: {
    title: 'Edit Product',
    barcode: 'Barcode',
    name: 'Product Name',
    namePlaceholder: 'Enter product name',
    brand: 'Brand',
    brandPlaceholder: 'Enter brand (optional)',
    price: 'Price',
    saveButton: 'Save Changes',
    updatingLabel: 'Updating product...',
    errorNameRequired: 'Please enter a product name',
    errorPriceInvalid: 'Please enter a valid price',
    errorFailed: 'Failed to update product',
    successMessage: 'Product updated successfully',
    errorTitle: 'Error',
    successTitle: 'Success',
  },
};

export const th: Translations = {
  common: {
    ok: 'ตกลง',
    cancel: 'ยกเลิก',
    error: 'ข้อผิดพลาด',
    success: 'สำเร็จ',
    edit: 'แก้ไข',
    save: 'บันทึก',
    creating: 'กำลังสร้าง...',
    active: 'ใช้งานอยู่',
    loadingApp: 'กำลังโหลด Lightning POS...',
  },
  mainLayout: {
    appName: 'POS แคชเชียร์',
    dashboard: 'แดชบอร์ด',
    posTerminal: 'เครื่องขาย POS',
    transactions: 'รายการขาย',
    products: 'สินค้า',
    staffs: 'พนักงาน',
    createStaff: 'พนักงาน',
    logout: 'ออกจากระบบ',
  },
  login: {
    title: 'Lightning POS',
    subtitle: 'เข้าสู่ระบบเพื่อเข้าถึงแดชบอร์ดของคุณ',
    username: 'ชื่อผู้ใช้',
    usernamePlaceholder: 'กรอกชื่อผู้ใช้ของคุณ',
    pin: 'รหัส PIN',
    forgotPin: 'ลืมรหัส PIN?',
    signIn: 'เข้าสู่ระบบ',
    noAccount: 'ยังไม่มีบัญชี?',
    contactSupport: 'ติดต่อฝ่ายสนับสนุน',
    demoCredentials: 'บัญชีทดลองใช้งาน:',
    errorRequired: 'กรุณากรอกชื่อผู้ใช้และรหัส PIN',
    errorFailed: 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',
  },
  terminalSetup: {
    title: 'ตั้งค่าเครื่องขาย',
    subtitle: 'กรอกรหัสเครื่องขาย (Terminal ID) เพื่อเปิดใช้งาน POS นี้',
    terminalId: 'รหัสเครื่องขาย',
    terminalIdPlaceholder: 'เช่น T1',
    activate: 'เปิดใช้งานเครื่องขาย',
    hint: 'ติดต่อผู้จัดการหากคุณไม่ทราบรหัสเครื่องขาย',
    errorRequired: 'กรุณากรอกรหัสเครื่องขาย',
    errorFailed: 'เปิดใช้งานเครื่องขายไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',
  },
  dashboard: {
    welcomeBack: 'ยินดีต้อนรับกลับ, {name}',
    subtitle: 'นี่คือความเคลื่อนไหวของร้านคุณในวันนี้',
    admin: 'ผู้ดูแลระบบ',
    todayRevenue: 'ยอดขายวันนี้',
    todayOrders: 'จำนวนออเดอร์วันนี้',
    rangeRevenue: 'ยอดขาย {days} วันล่าสุด',
    rangeOrders: 'จำนวนออเดอร์ {days} วันล่าสุด',
    hourlyChartTitle: 'ยอดขายรายชั่วโมง (วันนี้)',
    dailyChartTitle: 'ยอดขายรายวัน ({days} วันล่าสุด)',
    loading: 'กำลังโหลดข้อมูลสรุป...',
    noSalesToday: 'ยังไม่มียอดขายวันนี้',
    noSalesRecent: 'ไม่มียอดขายในช่วงเวลานี้',
  },
  createOrder: {
    title: 'เครื่องขาย POS',
    member: 'สมาชิก',
    memberId: 'รหัสสมาชิก',
    memberIdPlaceholder: 'กรอกรหัสสมาชิก (M001-M003)',
    identify: 'ตรวจสอบ',
    points: 'คะแนน',
    currentOrder: 'รายการสั่งซื้อปัจจุบัน',
    itemsCount: '{count} รายการ',
    columnNumber: '#',
    columnBarcode: 'บาร์โค้ด',
    columnName: 'ชื่อสินค้า',
    columnQty: 'จำนวน',
    columnPrice: 'ราคา',
    columnTotal: 'รวม',
    columnAction: 'จัดการ',
    noProducts: 'ยังไม่มีสินค้าที่เพิ่ม สแกนสินค้าเพื่อเริ่มต้น',
    promo: 'โปรโมชั่น',
    total: 'ยอดรวม',
    amountDue: 'ยอดที่ต้องชำระ',
    receivedAmount: 'เงินที่รับมา',
    paymentMethod: 'วิธีชำระเงิน',
    cash: 'เงินสด',
    change: 'เงินทอน',
    clear: 'ยกเลิก',
    delete: 'ลบ',
    enter: 'ตกลง',
    errorInsufficientAmount: 'เงินที่รับมาไม่เพียงพอ',
    proceedToPayment: 'คิดเงิน',
    errorProductNotFound: 'ไม่พบสินค้า',
    errorMemberNotFound: 'ไม่พบสมาชิก',
    errorIdentifyMember: 'เกิดข้อผิดพลาดในการตรวจสอบสมาชิก',
    editPriceTitle: 'แก้ไขราคา',
    save: 'บันทึก',
    errorPriceInvalid: 'กรุณากรอกราคาให้ถูกต้อง',
    errorUpdatePrice: 'แก้ไขราคาไม่สำเร็จ',
  },
  createStaff: {
    title: 'สร้างพนักงานใหม่',
    fullName: 'ชื่อ-นามสกุล',
    fullNamePlaceholder: 'กรอกชื่อ-นามสกุลพนักงาน',
    pinCode: 'รหัส PIN (6 หลัก)',
    role: 'ตำแหน่ง',
    manager: 'ผู้จัดการ',
    managerDesc: 'เข้าถึงแดชบอร์ดได้ทั้งหมด',
    cashier: 'แคชเชียร์',
    cashierDesc: 'เข้าถึงเครื่องขาย POS',
    createAndSync: 'สร้างและซิงค์พนักงาน',
    errorFullNameRequired: 'กรุณากรอกชื่อ-นามสกุล',
    errorPinInvalid: 'กรุณากรอกรหัส PIN ที่ถูกต้อง (อย่างน้อย 4 หลัก)',
    successMessage: 'สร้างพนักงาน "{fullName}" สำเร็จ! ชื่อผู้ใช้: {userId} ข้อมูลถูกซิงค์ขึ้นคลาวด์แล้ว',
    errorFailed: 'สร้างพนักงานไม่สำเร็จ',
  },
  staffList: {
    title: 'จัดการพนักงาน',
    totalStaffs: 'ทั้งหมด: {count} คน',
    createNewStaff: 'สร้างพนักงานใหม่',
    syncStaffs: 'ซิงค์พนักงาน',
    syncing: 'กำลังซิงค์...',
    syncFailedTitle: 'ซิงค์ไม่สำเร็จ',
    syncingLabel: 'กำลังซิงค์ข้อมูลพนักงาน...',
    columnUsername: 'ชื่อผู้ใช้',
    columnFullName: 'ชื่อ-นามสกุล',
    columnRole: 'ตำแหน่ง',
    columnStatus: 'สถานะ',
    emptyMessage: 'ไม่พบพนักงาน',
  },
  transactionList: {
    title: 'ประวัติการขาย',
    totalTransactions: 'ทั้งหมด: {count} รายการ',
    dateRange: 'ช่วงวันที่',
    startDate: 'วันที่เริ่มต้น',
    endDate: 'วันที่สิ้นสุด',
    transactionId: 'รหัสรายการ',
    transactionIdPlaceholder: 'กรอกรหัส',
    orderId: 'รหัสคำสั่งซื้อ',
    orderIdPlaceholder: 'กรอกรหัสคำสั่งซื้อ',
    method: 'ช่องทางชำระเงิน',
    methodAll: 'ทุกช่องทาง',
    methodCash: 'เงินสด',
    methodCredit: 'บัตรเครดิต',
    methodQr: 'QR พร้อมเพย์',
    amountRange: 'ช่วงยอดเงิน',
    amountRangeAny: 'ทุกยอดเงิน',
    status: 'สถานะ',
    statusAll: 'ทุกสถานะ',
    statusPending: 'รอดำเนินการ',
    statusApproved: 'อนุมัติ',
    statusFailed: 'ล้มเหลว',
    statusVoided: 'ยกเลิก',
    statusRefunded: 'คืนเงินแล้ว',
    search: 'ค้นหา',
    clearFilters: 'ล้างตัวกรอง',
    columnDate: 'วันที่',
    columnTime: 'เวลา',
    columnTransactionId: 'รหัสรายการ',
    columnOrderId: 'รหัสคำสั่งซื้อ',
    columnAmount: 'ยอดเงิน',
    columnStatus: 'สถานะ',
    columnActions: 'จัดการ',
    viewDetails: 'ดูรายละเอียด',
    emptyMessage: 'ไม่พบรายการขาย',
  },
  transactionDetail: {
    title: 'รายละเอียดการขาย',
    loading: 'กำลังโหลดรายละเอียดการขาย...',
    errorNotFound: 'ไม่พบรายละเอียดรายการนี้ กรุณาลองใหม่อีกครั้ง',
    amountTotal: 'ยอดรวมทั้งหมด',
    transactionId: 'รหัสรายการ',
    orderReference: 'รหัสอ้างอิงคำสั่งซื้อ',
    dateTime: 'วันที่และเวลา',
    staffMember: 'พนักงาน',
    paymentMethod: 'ช่องทางชำระเงิน',
    status: 'สถานะ',
    orderItems: 'รายการสินค้า ({count})',
    columnNumber: '#',
    columnProduct: 'สินค้า',
    columnUnitPrice: 'ราคาต่อหน่วย',
    columnQty: 'จำนวน',
    columnTotal: 'รวม',
    emptyMessage: 'ไม่มีรายการสินค้า',
  },
  productList: {
    title: 'คลังสินค้า',
    totalProducts: 'ทั้งหมด: {count} รายการ',
    createProduct: '+ นำเข้าสินค้า',
    syncProducts: 'ซิงค์สินค้า',
    syncing: 'กำลังซิงค์...',
    columnBarcode: 'บาร์โค้ด',
    columnName: 'ชื่อสินค้า',
    columnBrand: 'แบรนด์',
    columnPrice: 'ราคา',
    columnActions: 'จัดการ',
    filterBarcode: 'บาร์โค้ด',
    filterBarcodePlaceholder: 'ค้นหาบาร์โค้ด...',
    filterName: 'ชื่อสินค้า',
    filterNamePlaceholder: 'ค้นหาชื่อสินค้า...',
    filterBrand: 'แบรนด์',
    filterBrandPlaceholder: 'ค้นหาแบรนด์...',
    filterPrice: 'ราคา',
    filterPricePlaceholder: 'ค้นหาราคา...',
    search: 'ค้นหา',
    clearFilters: 'ล้างตัวกรอง',
    emptyMessage: 'ไม่พบสินค้าที่ตรงกับตัวกรองของคุณ',
    syncFailedTitle: 'ซิงค์ไม่สำเร็จ',
    syncingLabel: 'กำลังซิงค์ข้อมูล...',
  },
  createProduct: {
    title: 'นำเข้าสินค้า',
    columnsHint: 'อัปโหลดไฟล์ .xlsx ที่มีแถวหัวคอลัมน์: barcode, name, brand (ไม่บังคับ), price',
    chooseFile: 'เลือกไฟล์ .xlsx',
    downloadTemplate: 'ดาวน์โหลดไฟล์ตัวอย่าง',
    previewTitle: 'ตัวอย่างสินค้า',
    itemsCount: '{count} รายการ',
    invalidCount: 'ไม่ถูกต้อง {count}',
    clear: 'ล้าง',
    importButton: 'นำเข้าสินค้า {count} รายการ',
    importingLabel: 'กำลังนำเข้าสินค้า...',
    errorNoFile: 'กรุณาเลือกไฟล์ .xlsx',
    errorEmptyFile: 'ไฟล์ไม่มีข้อมูล',
    errorRow: 'แถว {row}: {message}',
    resultTitle: 'ผลการนำเข้า',
    resultSummary: 'นำเข้าสำเร็จ {success} จาก {total} รายการ',
    columnRow: 'แถว',
    columnBarcode: 'บาร์โค้ด',
    columnName: 'ชื่อสินค้า',
    columnBrand: 'แบรนด์',
    columnPrice: 'ราคา',
    columnStatus: 'สถานะ',
    statusValid: 'ปกติ',
    errorBarcodeRequired: 'กรุณากรอกบาร์โค้ด',
    errorNameRequired: 'กรุณากรอกชื่อสินค้า',
    errorPriceInvalid: 'ราคาไม่ถูกต้อง',
  },
  editProduct: {
    title: 'แก้ไขสินค้า',
    barcode: 'บาร์โค้ด',
    name: 'ชื่อสินค้า',
    namePlaceholder: 'กรอกชื่อสินค้า',
    brand: 'แบรนด์',
    brandPlaceholder: 'กรอกแบรนด์ (ไม่บังคับ)',
    price: 'ราคา',
    saveButton: 'บันทึกการเปลี่ยนแปลง',
    updatingLabel: 'กำลังอัปเดตสินค้า...',
    errorNameRequired: 'กรุณากรอกชื่อสินค้า',
    errorPriceInvalid: 'กรุณากรอกราคาที่ถูกต้อง',
    errorFailed: 'อัปเดตสินค้าไม่สำเร็จ',
    successMessage: 'อัปเดตสินค้าสำเร็จ',
    errorTitle: 'ข้อผิดพลาด',
    successTitle: 'สำเร็จ',
  },
};
