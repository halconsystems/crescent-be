This is actually a **good starting schema** — but for your sales workflow, it needs **one important shift**:

## Right now your RBAC is only **role assignment**

But your portal needs **workflow-aware RBAC**:

Not just:

> “User has role = Accounts Officer”

But also:

> “Accounts Officer can edit only Accounts stage fields of Sale X”

That means you need to add **stage-based ownership + permissions**, not just user-role tables.

---

# Big picture: what should stay vs what should change

## Keep these (good)

You already have solid master/setup tables:

* `Role`
* `AppUser`
* `UserRole`
* `ClientCategory`
* `Package`
* `Product`
* `Zone`
* `Office`
* `Employee`
* `ZoneEmployee`
* `Bank`
* `BankAccount`
* `City`
* `Vendor`

These are useful and should stay.

---

# What needs improvement

## 1) `AppUser` and `Employee` are split awkwardly

Right now you have:

* `AppUser` → system login
* `Employee` → HR/person/personnel data

That’s okay **if intentional**, but for your workflow:

* Technician assignment
* Operations assignment
* zone mapping
* role mapping

…all need to clearly connect to the **actual logged-in user**.

Right now:

* `UserRole` points to `AppUser`
* `ZoneEmployee` points to `Employee`

So if you want:

> “Assign logged-in technician user to sale”

You currently have **two identity systems**.

That will become annoying very fast.

---

# Recommended fix:

## Link `Employee` to `AppUser`

Add this:

```prisma
model Employee {
  employeeId        Int              @id @default(autoincrement()) @map("EmployeeID")
  userId            Int?             @unique @map("UserID")
  emailId           String?          @unique @map("EmailID")
  primaryMobileNo   String?          @unique @map("PrimaryMobileNo")
  cnic              String           @unique @map("CNIC")
  designation       DesignationType  @map("Designation")
  nextOfKin         String?          @map("NextOfKin")
  nextOfKinContact  String?          @map("NextOfKinContact")
  isActive          Boolean          @default(true) @map("IsActive")
  createdAt         DateTime         @default(now()) @map("CreatedAt")
  updatedAt         DateTime         @updatedAt @map("UpdatedAt")

  user              AppUser?         @relation(fields: [userId], references: [userId])
  zoneEmployees     ZoneEmployee[]

  @@map("Employee")
}
```

And in `AppUser`:

```prisma
employee Employee?
```

### Why this matters

Now you can:

* login as an `AppUser`
* know which `Employee` record belongs to them
* assign them to zone / technician / operations tasks properly

That is a very important fix.

---

# 2) Your RBAC should add **permissions**, not only roles

Right now you have:

* `Role`
* `UserRole`

That’s okay for basic auth, but not enough for your use case.

Because your app needs checks like:

* Can create sale
* Can approve accounts
* Can assign technician
* Can complete installation
* Can hold a sale
* Can reopen a stage

That is **permission-based**, not just role-based.

---

# Add these 2 models

## `Permission`

```prisma
model Permission {
  permissionId   Int      @id @default(autoincrement()) @map("PermissionID")
  permissionCode String   @unique @map("PermissionCode")
  description    String?  @map("Description")
  isActive       Boolean  @default(true) @map("IsActive")
  createdAt      DateTime @default(now()) @map("CreatedAt")
  updatedAt      DateTime @updatedAt @map("UpdatedAt")

  rolePermissions RolePermission[]

  @@map("Permission")
}
```

## `RolePermission`

```prisma
model RolePermission {
  rolePermissionId Int      @id @default(autoincrement()) @map("RolePermissionID")
  roleId           Int      @map("RoleID")
  permissionId     Int      @map("PermissionID")
  createdAt        DateTime @default(now()) @map("CreatedAt")
  updatedAt        DateTime @updatedAt @map("UpdatedAt")

  role        Role       @relation(fields: [roleId], references: [roleId])
  permission  Permission @relation(fields: [permissionId], references: [permissionId])

  @@unique([roleId, permissionId])
  @@map("RolePermission")
}
```

---

# Recommended permissions for your portal

Examples:

```text
sales.create
sales.view
sales.edit.client
sales.edit.product
sales.submit.accounts

accounts.view
accounts.review
accounts.hold
accounts.approve
accounts.reject

operations.view
operations.assign.device
operations.assign.technician
operations.submit.technician

technician.view
technician.install.complete
technician.install.edit

sales.reopen
sales.audit.view
```

This gives you clean control.

---

# Now let’s model YOUR actual workflow in Prisma

This is the important part.

---

# SALES MODULE DESIGN (Prisma)

You should add these models:

---

# 1) Main Sale record

## `Sale`

```prisma
enum SaleStageCode {
  SALES
  ACCOUNTS
  OPERATIONS
  TECHNICIAN
}

enum StageStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  HELD
  REJECTED
}

enum SaleType {
  CREDIT
  CASH
  CHEQUE
  TRANSFER
}

model Sale {
  saleId        Int      @id @default(autoincrement()) @map("SaleID")
  saleCode      String   @unique @map("SaleCode")
  createdByUserId Int    @map("CreatedByUserID")
  createdAt     DateTime @default(now()) @map("CreatedAt")
  updatedAt     DateTime @updatedAt @map("UpdatedAt")
  isActive      Boolean  @default(true) @map("IsActive")

  createdBy     AppUser  @relation(fields: [createdByUserId], references: [userId])

  clientDetails        SaleClientDetails?
  productDetails       SaleProductDetails?
  accountsReview       SaleAccountsReview?
  operationsAssignment SaleOperationsAssignment?
  installation         SaleInstallation?
  stageStatuses        SaleStageStatus[]
  auditLogs            SaleAuditLog[]

  @@map("Sale")
}
```

---

# 2) Sales stage → Client details

## `SaleClientDetails`

```prisma
model SaleClientDetails {
  saleClientDetailsId Int       @id @default(autoincrement()) @map("SaleClientDetailsID")
  saleId              Int       @unique @map("SaleID")

  clientCategoryId    Int?      @map("ClientCategoryID")
  irNo                String?   @map("IRNo")
  fullName            String?   @map("FullName")
  cnicNo              String?   @map("CNICNo")
  phoneHome           String?   @map("PhoneHome")
  emailId             String?   @map("EmailID")
  address             String?   @map("Address")
  clientStatus        String?   @map("ClientStatus")
  cellNo              String?   @map("CellNo")
  fatherName          String?   @map("FatherName")
  dateOfBirth         DateTime? @map("DateOfBirth")
  phoneOffice         String?   @map("PhoneOffice")
  companyDepartment   String?   @map("CompanyDepartment")
  addressLine2        String?   @map("AddressLine2")

  sale               Sale             @relation(fields: [saleId], references: [saleId])
  clientCategory     ClientCategory?  @relation(fields: [clientCategoryId], references: [categoryId])

  @@map("SaleClientDetails")
}
```

---

# 3) Sales stage → Product & package details

## `SaleProductDetails`

```prisma
model SaleProductDetails {
  saleProductDetailsId Int       @id @default(autoincrement()) @map("SaleProductDetailsID")
  saleId               Int       @unique @map("SaleID")

  productId            Int?      @map("ProductID")
  saleAmount           Decimal?  @db.Decimal(12,2) @map("SaleAmount")
  saleType             SaleType? @map("SaleType")
  packageId            Int?      @map("PackageID")
  renewalCharges       Decimal?  @db.Decimal(12,2) @map("RenewalCharges")
  customTypeValue      Int?      @map("CustomTypeValue")
  salesRemarks         String?   @map("SalesRemarks")

  sale                 Sale      @relation(fields: [saleId], references: [saleId])
  product              Product?  @relation(fields: [productId], references: [productId])
  package              Package?  @relation(fields: [packageId], references: [packageId])

  @@map("SaleProductDetails")
}
```

---

# 4) Accounts stage

## `SaleAccountsReview`

```prisma
enum AccountsDecision {
  HOLD
  APPROVED
  REJECTED
  CONTINUE
}

model SaleAccountsReview {
  saleAccountsReviewId Int              @id @default(autoincrement()) @map("SaleAccountsReviewID")
  saleId               Int              @unique @map("SaleID")
  accountsRemark       String?          @map("AccountsRemark")
  decision             AccountsDecision? @map("Decision")
  reviewedByUserId     Int?             @map("ReviewedByUserID")
  reviewedAt           DateTime?        @map("ReviewedAt")

  sale                 Sale             @relation(fields: [saleId], references: [saleId])
  reviewedBy           AppUser?         @relation(fields: [reviewedByUserId], references: [userId])

  @@map("SaleAccountsReview")
}
```

---

# 5) Operations stage

You listed:

* zone
* device combo
* SIM
* accessories
* assigned technician
* device

This needs lookup tables too.

---

## Suggested lookup models

```prisma
model Device {
  deviceId    Int      @id @default(autoincrement()) @map("DeviceID")
  deviceName  String   @unique @map("DeviceName")
  isActive    Boolean  @default(true) @map("IsActive")
  createdAt   DateTime @default(now()) @map("CreatedAt")
  updatedAt   DateTime @updatedAt @map("UpdatedAt")

  @@map("Device")
}

model Sim {
  simId       Int      @id @default(autoincrement()) @map("SIMID")
  simName     String   @unique @map("SIMName")
  isActive    Boolean  @default(true) @map("IsActive")
  createdAt   DateTime @default(now()) @map("CreatedAt")
  updatedAt   DateTime @updatedAt @map("UpdatedAt")

  @@map("SIM")
}

model DeviceCombo {
  deviceComboId Int      @id @default(autoincrement()) @map("DeviceComboID")
  comboName     String   @unique @map("ComboName")
  isActive      Boolean  @default(true) @map("IsActive")
  createdAt     DateTime @default(now()) @map("CreatedAt")
  updatedAt     DateTime @updatedAt @map("UpdatedAt")

  @@map("DeviceCombo")
}

model Accessory {
  accessoryId   Int      @id @default(autoincrement()) @map("AccessoryID")
  accessoryName String   @unique @map("AccessoryName")
  isActive      Boolean  @default(true) @map("IsActive")
  createdAt     DateTime @default(now()) @map("CreatedAt")
  updatedAt     DateTime @updatedAt @map("UpdatedAt")

  @@map("Accessory")
}
```

---

## `SaleOperationsAssignment`

```prisma
model SaleOperationsAssignment {
  saleOperationsAssignmentId Int      @id @default(autoincrement()) @map("SaleOperationsAssignmentID")
  saleId                     Int      @unique @map("SaleID")

  productId                  Int?     @map("ProductID")
  zoneId                     Int?     @map("ZoneID")
  deviceComboId              Int?     @map("DeviceComboID")
  simId                      Int?     @map("SIMID")
  accessory1Id               Int?     @map("Accessory1ID")
  accessory2Id               Int?     @map("Accessory2ID")
  accessory3Id               Int?     @map("Accessory3ID")
  packageId                  Int?     @map("PackageID")
  assignedTechnicianUserId   Int?     @map("AssignedTechnicianUserID")
  deviceId                   Int?     @map("DeviceID")
  assignedByUserId           Int?     @map("AssignedByUserID")
  assignedAt                 DateTime? @default(now()) @map("AssignedAt")

  sale                       Sale        @relation(fields: [saleId], references: [saleId])
  product                    Product?    @relation(fields: [productId], references: [productId])
  zone                       Zone?       @relation(fields: [zoneId], references: [zoneId])
  deviceCombo                DeviceCombo? @relation(fields: [deviceComboId], references: [deviceComboId])
  sim                        Sim?        @relation(fields: [simId], references: [simId])
  accessory1                 Accessory?  @relation("Accessory1", fields: [accessory1Id], references: [accessoryId])
  accessory2                 Accessory?  @relation("Accessory2", fields: [accessory2Id], references: [accessoryId])
  accessory3                 Accessory?  @relation("Accessory3", fields: [accessory3Id], references: [accessoryId])
  package                    Package?    @relation(fields: [packageId], references: [packageId])
  assignedTechnician         AppUser?    @relation("AssignedTechnician", fields: [assignedTechnicianUserId], references: [userId])
  device                     Device?     @relation(fields: [deviceId], references: [deviceId])
  assignedBy                 AppUser?    @relation("AssignedByOperations", fields: [assignedByUserId], references: [userId])

  @@map("SaleOperationsAssignment")
}
```

---

# 6) Technician stage

Technician mostly **views** previous data and only fills:

* installation date
* renewal date
* registration no
* engine no
* transmission
* chassis no
* make/model
* year
* color

## `SaleInstallation`

```prisma
enum TransmissionType {
  AUTO
  MANUAL
}

model SaleInstallation {
  saleInstallationId Int              @id @default(autoincrement()) @map("SaleInstallationID")
  saleId             Int              @unique @map("SaleID")

  installationDate   DateTime?        @map("InstallationDate")
  renewalDate        DateTime?        @map("RenewalDate")
  registrationNo     String?          @map("RegistrationNo")
  engineNo           String?          @map("EngineNo")
  transmissionType   TransmissionType? @map("TransmissionType")
  chassisNo          String?          @map("ChassisNo")
  makeModel          String?          @map("MakeModel")
  vehicleYear        Int?             @map("VehicleYear")
  color              String?          @map("Color")
  installedByUserId  Int?             @map("InstalledByUserID")
  installedAt        DateTime?        @default(now()) @map("InstalledAt")

  sale               Sale             @relation(fields: [saleId], references: [saleId])
  installedBy        AppUser?         @relation(fields: [installedByUserId], references: [userId])

  @@map("SaleInstallation")
}
```

---

# 7) Workflow stage tracking

This is how you control what stage is open and editable.

## `SaleStageStatus`

```prisma
model SaleStageStatus {
  saleStageStatusId Int           @id @default(autoincrement()) @map("SaleStageStatusID")
  saleId            Int           @map("SaleID")
  stageCode         SaleStageCode @map("StageCode")
  status            StageStatus   @default(PENDING) @map("Status")
  updatedByUserId   Int?          @map("UpdatedByUserID")
  updatedAt         DateTime      @default(now()) @map("UpdatedAt")

  sale              Sale          @relation(fields: [saleId], references: [saleId])
  updatedBy         AppUser?      @relation(fields: [updatedByUserId], references: [userId])

  @@unique([saleId, stageCode])
  @@map("SaleStageStatus")
}
```

---

# 8) Audit log

## `SaleAuditLog`

```prisma
model SaleAuditLog {
  saleAuditLogId Int       @id @default(autoincrement()) @map("SaleAuditLogID")
  saleId         Int       @map("SaleID")
  stageCode      SaleStageCode? @map("StageCode")
  fieldName      String    @map("FieldName")
  oldValue       String?   @map("OldValue")
  newValue       String?   @map("NewValue")
  changedByUserId Int      @map("ChangedByUserID")
  changedAt      DateTime  @default(now()) @map("ChangedAt")

  sale           Sale      @relation(fields: [saleId], references: [saleId])
  changedBy      AppUser   @relation(fields: [changedByUserId], references: [userId])

  @@map("SaleAuditLog")
}
```

---

# Important RBAC behavior for your app

Now the important part is not just schema — it’s **how you enforce editing**.

---

# How to enforce role-based stage editing

## Rule:

### A user can only edit fields for their allowed stage.

---

# Example stage ownership

| Stage      | Who edits          |
| ---------- | ------------------ |
| Sales      | Sales Officer      |
| Accounts   | Accounts Officer   |
| Operations | Operations Officer |
| Technician | Technician         |

---

# Example backend checks

## Sales route

```ts
PATCH /sales/:id/sales-stage
```

Allow only:

* `sales.edit.client`
* `sales.edit.product`

---

## Accounts route

```ts
PATCH /sales/:id/accounts-stage
```

Allow only:

* `accounts.review`
* `accounts.hold`
* `accounts.approve`

---

## Operations route

```ts
PATCH /sales/:id/operations-stage
```

Allow only:

* `operations.assign.device`
* `operations.assign.technician`

---

## Technician route

```ts
PATCH /sales/:id/technician-stage
```

Allow only:

* `technician.install.edit`
* `technician.install.complete`

---

# VERY IMPORTANT: Don’t trust frontend tabs

Even if the frontend hides fields, backend must still enforce:

* current user role
* current sale stage
* current editable section
* allowed fields only

Otherwise one bored user with Postman becomes your internal chaos monkey.

---

# My strongest recommendation for your current schema

## Keep:

* `AppUser`
* `Role`
* `UserRole`
* master tables

## Add:

* `Permission`
* `RolePermission`
* `Sale`
* `SaleClientDetails`
* `SaleProductDetails`
* `SaleAccountsReview`
* `SaleOperationsAssignment`
* `SaleInstallation`
* `SaleStageStatus`
* `SaleAuditLog`

## Fix:

* Link `Employee` to `AppUser`

## Optional:

Remove this toy model because it doesn’t fit your actual design:

```prisma
model Client {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
  cnic  String @unique
  irNo  String @map("ir.no")
  phone String
}
```

This model is too simplistic for your real workflow and will probably confuse future you.

---

# Best architecture in one line

## Your portal is not just RBAC.

It is:

# **RBAC + workflow-state + stage-based ownership**

That’s the correct architecture.

---
