# Inventory Frontend Use-Case Flow Guide

This document is for frontend product flow, not endpoint catalog reference.  
Use it to build screens around real user journeys.

## Global Setup (once)

- Backend base URL: `http://localhost:3000/api/v1`
- Login using `POST /auth/login`
- Store `accessToken` and send `Authorization: Bearer <token>` for all inventory calls.
- Seeded full-access account:
  - `admin@halcon.com` / `Admin123`

---

## Use Case 1: First-Time Inventory Setup (Admin)

### Goal
Prepare master data so procurement users can start working.

### User journey
1. Open **Setup** screen
2. Create stores
3. Create categories and groups
4. Create inventory vendors
5. Verify all dropdown sources are available

### API flow
1. `POST /stores`
2. `POST /categories`
3. `POST /groups`
4. `POST /inventory-vendors`
5. `GET /dropdowns?resources=stores,categories,vendors`

### UI notes
- Keep setup tables editable inline (`PUT /.../:id`).
- Prevent hard delete if referenced data exists (show backend message).

---

## Use Case 2: Item Onboarding (Inventory Officer)

### Goal
Add stockable items before any purchase request.

### User journey
1. Open **Items** screen
2. Fill SKU/name/category/group/default store/reorder level
3. Save item
4. Search by keyword or SKU to verify

### API flow
1. `GET /dropdowns?resources=stores,categories`
2. `POST /items`
3. `GET /items/search?q=<term>` or `GET /items/sku/:sku`

### UI notes
- SKU should be unique; show duplicate error clearly.
- Prefer `GET /items` for listing and `GET /items/search` for search box typing.

---

## Use Case 3: Replenishment Request to PO to GRN (Core Procurement)

### Goal
Move from internal demand to physically received stock.

### Actors
- Requester (creates PR)
- Approver (approves PR/PO)
- Receiving team (creates and confirms GRN)

### User journey and API sequence
1. **Create PR**
   - `POST /purchase-requests`
2. **Approve PR**
   - `POST /purchase-requests/:id/approve`
3. **Create PO from approved PR**
   - `POST /purchase-orders` (include `purchaseRequestId`)
4. **Approve PO**
   - `POST /purchase-orders/:id/approve`
5. **Create GRN**
   - `POST /grn` (include `purchaseOrderId`)
6. **Confirm GRN**
   - `POST /grn/:id/confirm`

### Business rules frontend should enforce
- Do not show “Create PO” action unless PR status is `APPROVED`.
- Do not show “Confirm GRN” action once GRN status is `CONFIRMED`.
- After confirm, refresh inventory card/stock widgets.

---

## Use Case 4: Day-to-Day Stock Movement (Operations)

### Goal
Consume, return, and move stock between stores.

### A) Issue stock
1. Open **Issuance** form
2. Select store + items + qty
3. Submit
4. Confirm ledger impact

API flow:
- `POST /issuance`
- `GET /inventory-card?store_id=<id>&item_id=<id>`

### B) Return stock
API flow:
- `POST /returns`
- `GET /inventory-card?...`

### C) Transfer stock
API flow:
- `POST /transfers`
- `GET /inventory-card?store_id=<fromStore>`
- `GET /inventory-card?store_id=<toStore>`

### UI notes
- Backend blocks insufficient stock on issuance/transfer.
- Show source and destination balances after successful transfer.

---

## Use Case 5: Management Visibility (Reports + Dashboard)

### Goal
Enable supervisors to track stock health and movement trends.

### User journey
1. Open dashboard cards
2. Drill into low-stock/out-of-stock
3. Filter movement/purchase reports by date/store/item
4. Export/report from frontend if needed

### API flow
- Dashboard:
  - `GET /dashboard/stats`
  - `GET /low-stock-items`
  - `GET /out-of-stock-items`
- Reports:
  - `GET /reports/stock`
  - `GET /reports/issuance`
  - `GET /reports/returns`
  - `GET /reports/transfers`
  - `GET /reports/purchase`
- Detailed ledger:
  - `GET /inventory-card?item_id=&store_id=&date_from=&date_to=`

---

## Use Case 6: Bulk Operations (Power User)

### Goal
Upload many items or large issuance batches quickly.

### API flow
- Bulk item creation: `POST /bulk/items`
- Bulk issuance: `POST /bulk/issuance`

### UI notes
- Show row-level failures if backend rejects partial data.
- Add pre-submit client checks (required fields, positive quantities).

---

## Use Case 7: Legacy Screen Compatibility

If old frontend screens still exist, these aliases can be used temporarily:

- `GET /overview/items`
- `GET /overview/purchase-requests`
- `GET /dropdown/stores`
- `GET /dropdown/items`
- `GET /dropdown/vendors`
- `GET /dropdown/categories`

For new UI work, use canonical routes (`/items`, `/purchase-requests`, `/dropdowns?...`).

---

## Frontend Workflow State Model (Recommended)

### PR/PO/GRN statuses
- PR/PO: `DRAFT` -> `APPROVED` or `REJECTED`
- GRN: `DRAFT` -> `CONFIRMED`

### Button visibility matrix
- PR:
  - `DRAFT`: show Approve/Reject/Edit/Delete
  - `APPROVED`: hide Approve/Reject/Edit
  - `REJECTED`: show Clone/Create New
- PO:
  - `DRAFT`: show Approve/Reject/Edit/Delete
  - `APPROVED`: allow GRN creation
- GRN:
  - `DRAFT`: show Confirm
  - `CONFIRMED`: read-only

---

## Minimal QA Script (Happy Path)

1. Login as admin
2. Setup store/category/group/vendor
3. Create item
4. Create + approve PR
5. Create + approve PO
6. Create + confirm GRN
7. Create issuance
8. Create return
9. Create transfer
10. Verify dashboard + stock report + inventory card reflect all movements
