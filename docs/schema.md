# Database schema

The canonical definition lives in [`prisma/schema.prisma`](../prisma/schema.prisma). The app targets **PostgreSQL** via `DATABASE_URL`.

Prisma **model** names use PascalCase (for example `AppUser`). **Table** names in the database are set with `@@map` (for example `"Office"`, `"AppUser"`). **Columns** use `@map` so stored names match the onboarding spec (for example `OfficeID`, `UserName`).

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

**Relations:** optional one-to-one `AppUser`; many `ZoneEmployee`.

### `AppUser` (`AppUser`)

| Column | Type | Notes |
| ------ | ---- | ----- |
| `UserID` | PK | |
| `EmployeeID` | FK → `Employee` | optional, unique (at most one user per employee) |
| `UserName` | `TEXT` | unique, required |
| `PasswordHash` | `TEXT` | required |
| `IsTempPassword`, `MustChangePassword` | `BOOLEAN` | default `true` |
| `IsEmailVerified`, `IsMobileVerified` | `BOOLEAN` | default `false` |
| `IsActive` | `BOOLEAN` | default `true` |
| `IsLocked` | `BOOLEAN` | default `false` |
| `FailedLoginAttempts` | `INT` | default `0` |
| `LastLoginAt`, `LastPasswordChangedAt` | `TIMESTAMP` | optional |
| `CreatedAt`, `UpdatedAt` | `TIMESTAMP` | |
| `CreatedByUserID` | FK → `AppUser` | optional (self-reference) |

**Relations:**

- `Employee` (optional).
- **Created-by:** `CreatedByUserID` → another `AppUser`; inverse lists users created by this user.
- **Roles:** `UserRole` rows; assignment may reference `AssignedByUserID` → `AppUser`.
- **Auth artifacts:** `PasswordResetToken`, `UserPasswordHistory`, `UserSession`.

**Intended rule (enforce in DB if required):** `FailedLoginAttempts >= 0` (see [Check constraints](#check-constraints)).

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

### `PasswordResetToken` (`PasswordResetToken`)

| Column | Type | Notes |
| ------ | ---- | ----- |
| `ResetTokenID` | PK | |
| `UserID` | FK → `AppUser` | required |
| `TokenHash` | `TEXT` | required |
| `RequestedAt`, `ExpiresAt` | `TIMESTAMP` | `RequestedAt` defaults to now |
| `UsedAt` | `TIMESTAMP` | optional |
| `RequestedIP`, `RequestedUserAgent` | `TEXT` | optional |
| `IsActive` | `BOOLEAN` | default `true` |
| `CreatedAt` | `TIMESTAMP` | default now (no `UpdatedAt` on this model) |

**Intended rule:** `ExpiresAt > RequestedAt` (see [Check constraints](#check-constraints)).

### `UserPasswordHistory` (`UserPasswordHistory`)

| Column | Type | Notes |
| ------ | ---- | ----- |
| `PasswordHistoryID` | PK | |
| `UserID` | FK → `AppUser` | required |
| `PasswordHash` | `TEXT` | required |
| `CreatedAt` | `TIMESTAMP` | default now |

### `UserSession` (`UserSession`)

| Column | Type | Notes |
| ------ | ---- | ----- |
| `SessionID` | PK | |
| `UserID` | FK → `AppUser` | required |
| `RefreshTokenHash` | `TEXT` | required |
| `JwtID` | `TEXT` | optional, unique when present |
| `DeviceInfo`, `IPV4`, `IPV6`, `UserAgent` | `TEXT` | optional |
| `IssuedAt` | `TIMESTAMP` | default now |
| `ExpiresAt` | `TIMESTAMP` | required |
| `LastUsedAt`, `RevokedAt` | `TIMESTAMP` | optional |
| `RevokedReason` | `TEXT` | optional |
| `ReplacedBySessionID` | FK → `UserSession` | optional (session rotation / replacement chain) |
| `IsActive`, `CreatedAt`, `UpdatedAt` | | |

**Relations:** `ReplacedBySessionID` points to the replacing session; the inverse collection lists sessions that this session replaced.

**Intended rule:** `ExpiresAt > IssuedAt` (see [Check constraints](#check-constraints)).

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
Office ──< Zone ──< ZoneEmployee >── Employee >── AppUser
                    └── (optional City) Vendor
Bank ──< BankAccount
City ──< Vendor
Role ──< UserRole >── AppUser ──< PasswordResetToken
                    ├── UserPasswordHistory
                    ├── UserSession (self-FK for replacement)
                    └── (optional) Employee
```

---

## Check constraints

The following rules are part of the domain spec but are **not** declared in `schema.prisma`. Add them with raw SQL in a migration if you want them enforced by PostgreSQL:

| Table | Rule |
| ----- | ---- |
| `AppUser` | `FailedLoginAttempts >= 0` |
| `PasswordResetToken` | `ExpiresAt > RequestedAt` |
| `UserSession` | `ExpiresAt > IssuedAt` |
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
