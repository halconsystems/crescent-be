🧠 1. Big Picture Flow (Crescent Inventory System)
Your system runs in this order:
SETUP → ITEM MASTER → PROCUREMENT (PR → PO → GRN) → STOCK MOVEMENT → REPORTING
Everything else is supporting that pipeline.
________________________________________
🏗️ 2. Step-by-step System Flow
🟢 STEP 1: SYSTEM SETUP (Foundation layer)
Before anything happens, you configure the system:
APIs used:
•	Stores
•	Categories
•	Groups
•	Vendors
POST /stores
POST /categories
POST /groups
POST /vendors
🧠 What this means:
You are defining:
•	where items exist (stores)
•	what type they are (categories/groups)
•	who supplies them (vendors)
👉 Without this, inventory has no structure.
________________________________________
📦 STEP 2: ITEM MASTER CREATION
Now you define actual inventory items.
APIs:
POST /items
GET /items
GET /items/{id}
Optional:
GET /items/search?q=
GET /items/sku/{sku}
🧠 Meaning:
You are creating the catalog of all stockable goods
Example:
•	Laptop
•	Printer
•	A4 paper
________________________________________
🛒 STEP 3: PURCHASE REQUEST (PR)
This is where demand starts.
APIs:
POST /purchase-requests
Flow:
•	Department/user requests items
•	System creates PR
Then:
POST /purchase-requests/{id}/approve
POST /purchase-requests/{id}/reject
🧠 Meaning:
“We need items”
This is internal demand generation
________________________________________
📑 STEP 4: PURCHASE ORDER (PO)
After PR approval, procurement creates PO.
APIs:
POST /purchase-orders
Approval flow:
POST /purchase-orders/{id}/approve
POST /purchase-orders/{id}/reject
🧠 Meaning:
“We are officially ordering from vendor”
This is external commitment
________________________________________
🚚 STEP 5: GOODS RECEIVING (GRN)
This is where physical stock arrives.
APIs:
POST /grn
GET /grn/{id}
Confirmation:
POST /grn/{id}/confirm
Optional:
GET /grn/purchase-order/{po_id}
🧠 Meaning:
“Goods received and verified”
This step:
•	increases stock
•	validates PO delivery
________________________________________
📊 STEP 6: STOCK BECOMES AVAILABLE (Inventory Card updates)
Now inventory is updated.
API:
GET /inventory-card?item_id=&store_id=
🧠 Meaning:
This is your live stock ledger view:
Shows:
•	current stock
•	inflow (GRN)
•	outflow (issuance/return/transfer)
________________________________________
📤 STEP 7: STOCK USAGE (ISSUANCE / RETURN / TRANSFER)
Now inventory is consumed or moved.
________________________________________
🔹 ISSUANCE (stock going OUT)
POST /issuance
Example:
•	office uses 10 laptops
•	store issues them
________________________________________
🔹 RETURN (stock coming back)
POST /returns
Example:
•	unused items returned
________________________________________
🔹 TRANSFER (store to store movement)
POST /transfers
Example:
•	Warehouse A → Warehouse B
________________________________________
🧠 Meaning of this layer:
This is real-time stock movement control
________________________________________
📊 STEP 8: REPORTING LAYER
Now system generates insights.
APIs:
GET /reports/stock
GET /reports/issuance
GET /reports/returns
GET /reports/transfers
GET /reports/purchase
Filters:
•	date_from
•	date_to
•	store_id
•	item_id
________________________________________
🧠 Meaning:
This is decision intelligence layer
Used for:
•	audits
•	management reports
•	forecasting
________________________________________
⚙️ STEP 9: UTILITY + FAST ACCESS
These APIs are shortcuts for UI:
GET /dropdown/stores
GET /dropdown/items
GET /dropdown/vendors
GET /dropdown/categories
And search:
GET /items/search?q=
GET /guards/search?service_no=
________________________________________
📊 STEP 10: OPTIONAL ADVANCED FEATURES
GET /dashboard/stats
GET /low-stock-items
GET /out-of-stock-items
POST /bulk/items
POST /bulk/issuance
🧠 Meaning:
•	dashboard analytics
•	alerts
•	bulk operations
________________________________________
🔁 3. FULL SYSTEM FLOW (END-TO-END)
Here is your complete lifecycle:
1. Setup (stores, vendors, categories)
        ↓
2. Create Items
        ↓
3. Purchase Request (PR)
        ↓
4. Approve PR
        ↓
5. Purchase Order (PO)
        ↓
6. Approve PO
        ↓
7. GRN (Receive goods)
        ↓
8. Inventory updated
        ↓
9. Issuance / Return / Transfer
        ↓
10. Reports + Dashboard
•	/permission flow
________________________________________

