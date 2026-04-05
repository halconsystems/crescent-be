# Database schema

The canonical definition lives in [`prisma/schema.prisma`](../prisma/schema.prisma). The app targets **PostgreSQL** via `DATABASE_URL`.

Prisma **model** names use PascalCase (for example `AppUser`). **Table** names in the database are set with `@@map` (for example `"Office"`, `"AppUser"`). **Columns** use `@map` so stored names match the onboarding spec (for example `OfficeID`, `EmailID`).

---

## Enum

| Enum | Values |
| ---- | ------ |
| `DesignationType` | `GM`, `Manager`, `Staff`, `Technician` |

---

## Reference and onboarding

### `Office` (`Office`)

| Column | Type | Notes |
| ------ | ---- | ----- |
| `OfficeID` | `SERIAL` / `INT` PK | autoincrement |
| `OfficeName` | `TEXT` | unique, required |
| `IsActive` | `BOOLEAN` | default `true` |
| `CreatedAt` | `TIMESTAMP` | default now |
| `UpdatedAt` | `TIMESTAMP` | maintained by Prisma |

**Relations:** one `Office` has many `Zone`.

### `Product` (`Product`)

Product master: `ProductID` PK, `ProductName` unique, `IsActive`, `CreatedAt`, `UpdatedAt`.

### `Bank` (`Bank`)

| Column | Type | Notes |
| ------ | ---- | ----- |
| `BankID` | PK | autoincrement |
| `BankName` | `TEXT` | unique, required |
| `BankCode` | `TEXT` | optional, unique when present |
| `IsActive`, `CreatedAt`, `UpdatedAt` | | as usual |

**Relations:** one `Bank` has many `BankAccount`.

### `BankAccount` (`BankAccount`)

| Column | Type | Notes |
| ------ | ---- | ----- |
| `BankAccountID` | PK | |
| `BankID` | FK → `Bank` | required |
| `AccountNo` | `TEXT` | required |
| `IBAN` | `TEXT` | optional, unique when present |
| `BranchCode`, `Branch` | `TEXT` | optional |
| `IsActive`, `CreatedAt`, `UpdatedAt` | | |

### `City` (`City`)

City master: `CityID` PK, `CityName` unique, `IsActive`, `CreatedAt`, `UpdatedAt`.

**Relations:** one `City` has many `Vendor`.

### `Vendor` (`Vendor`)

| Column | Type | Notes |
| ------ | ---- | ----- |
| `VendorID` | PK | |
| `VendorName` | `TEXT` | unique, required |
| `CityID` | FK → `City` | optional |
| `Address`, `EmailID`, `ContactPerson`, `PrimaryMobile`, `SecondaryMobile` | `TEXT` | optional |
| `IsActive`, `CreatedAt`, `UpdatedAt` | | |

### `Role` (`Role`)

| Column | Type | Notes |
| ------ | ---- | ----- |
| `RoleID` | PK | |
| `RoleName` | `TEXT` | unique, required |
| `Description` | `TEXT` | optional |
| `IsActive`, `CreatedAt`, `UpdatedAt` | | |

**Relations:** one `Role` has many `UserRole`.

---

## People and access control

### `Employee` (`Employee`)

| Column | Type | Notes |
| ------ | ---- | ----- |
| `EmployeeID` | PK | |
| `EmailID`, `PrimaryMobileNo` | `TEXT` | optional, unique when present |
| `CNIC` | `TEXT` | unique, required |
| `Designation` | enum `DesignationType` | required |
| `NextOfKin`, `NextOfKinContact` | `TEXT` | optional |
| `IsActive`, `CreatedAt`, `UpdatedAt` | | |

**Relations:** many `ZoneEmployee`.

### `AppUser` (`AppUser`)

| Column | Type | Notes |
| ------ | ---- | ----- |
| `UserID` | PK | |
| `EmailID` | `TEXT` | unique, required |
| `PasswordHash` | `TEXT` | required |
| `DOB` | `TIMESTAMP` | required |
| `CNIC` | `TEXT` | unique, required |
| `ContactNo` | `TEXT` | required |
| `Address` | `TEXT` | required |
| `CreatedAt`, `UpdatedAt` | `TIMESTAMP` | |

**Relations:**

- **Roles:** `UserRole` rows; assignment may reference `AssignedByUserID` → `AppUser`.
- **Auth artifacts:** `RefreshToken`.

### `RefreshToken` (`RefreshToken`)

| Column | Type | Notes |
| ------ | ---- | ----- |
| `RefreshTokenID` | PK | |
| `UserID` | FK → `AppUser` | required |
| `TokenHash` | `TEXT` | unique, required (SHA-256) |
| `IssuedAt` | `TIMESTAMP` | default now |
| `ExpiresAt` | `TIMESTAMP` | required |
| `RevokedAt` | `TIMESTAMP` | optional |
| `RevokedReason` | `TEXT` | optional |
| `ReplacedByTokenID` | FK → `RefreshToken` | optional (rotation chain) |
| `UserAgent`, `IPV4`, `IPV6` | `TEXT` | optional |

### `UserRole` (`UserRole`)

| Column | Type | Notes |
| ------ | ---- | ----- |
| `UserRoleID` | PK | |
| `UserID` | FK → `AppUser` | required |
| `RoleID` | FK → `Role` | required |
| `AssignedAt` | `TIMESTAMP` | default now |
| `AssignedByUserID` | FK → `AppUser` | optional |
| `CreatedAt`, `UpdatedAt` | | |

**Constraint:** unique pair `(UserID, RoleID)`.

---

## Clients and commercial

### `ClientCategory` (`ClientCategory`)

Category master: `CategoryID` PK, `CategoryName` unique, `IsActive`, `CreatedAt`, `UpdatedAt`.

### `Package` (`Package`)

| Column | Type | Notes |
| ------ | ---- | ----- |
| `PackageID` | PK | |
| `PackageName` | `TEXT` | unique, required |
| `MinCharges`, `MinRenewalCharges` | `NUMERIC(12,2)` | optional (`Decimal` in Prisma) |
| `IsActive`, `CreatedAt`, `UpdatedAt` | | |

**Intended rules:** non-negative amounts when present (see [Check constraints](#check-constraints)).

### `Zone` (`Zone`)

| Column | Type | Notes |
| ------ | ---- | ----- |
| `ZoneID` | PK | |
| `OfficeID` | FK → `Office` | required |
| `ZoneName` | `TEXT` | required |
| `IsActive`, `CreatedAt`, `UpdatedAt` | | |

**Constraint:** unique pair `(OfficeID, ZoneName)`.

**Relations:** one `Zone` has many `ZoneEmployee`.

### `ZoneEmployee` (`ZoneEmployee`)

| Column | Type | Notes |
| ------ | ---- | ----- |
| `ZoneEmployeeID` | PK | |
| `ZoneID` | FK → `Zone` | required |
| `EmployeeID` | FK → `Employee` | required |
| `CreatedAt`, `UpdatedAt` | | |

**Constraint:** unique pair `(ZoneID, EmployeeID)`.

---

## Legacy / existing `Client` table

The `Client` model maps to table `Client` (default naming from Prisma). It predates the onboarding `@@map` convention used elsewhere.

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | PK | autoincrement |
| `name`, `email`, `cnic`, `phone` | `TEXT` | `email` and `cnic` unique |
| `ir.no` | `TEXT` | mapped column name |

---

## Relationship overview

```text
Office ──< Zone ──< ZoneEmployee >── Employee
                    └── (optional City) Vendor
Bank ──< BankAccount
City ──< Vendor
Role ──< UserRole >── AppUser
AppUser ──< RefreshToken
```

---

## Check constraints

The following rules are part of the domain spec but are **not** declared in `schema.prisma`. Add them with raw SQL in a migration if you want them enforced by PostgreSQL:

| Table | Rule |
| ----- | ---- |
| `RefreshToken` | `ExpiresAt > IssuedAt` |
| `Package` | `MinCharges` / `MinRenewalCharges` non-negative when not null (typically `(col IS NULL OR col >= 0)`) |

---

## Migrations

After changing `schema.prisma`, run Prisma migrate against a database with `DATABASE_URL` set, for example:

```bash
npx prisma migrate dev
```

Regenerate the client when the schema changes:

```bash
npx prisma generate
```
