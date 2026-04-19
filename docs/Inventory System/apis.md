CRESCENT INVENTORY MODULE
________________________________________
📘 INVENTORY MODULE – APIS TO BE CREATED
________________________________________
🔹 1. OVERVIEW APIs
Issuance Register
•	GET /issuance – List all issuance records
•	POST /issuance – Create issuance
•	GET /issuance/{id} – Get issuance by ID
•	PUT /issuance/{id} – Update issuance
•	DELETE /issuance/{id} – Delete issuance
Return Register
•	GET /returns – List all return records
•	POST /returns – Create return
•	GET /returns/{id} – Get return by ID
•	PUT /returns/{id} – Update return
•	DELETE /returns/{id} – Delete return
Transfer
•	GET /transfers – List transfers
•	POST /transfers – Create transfer
•	GET /transfers/{id} – Get transfer by ID
•	PUT /transfers/{id} – Update transfer
•	DELETE /transfers/{id} – Delete transfer
Items List (Overview)
•	GET /overview/items – List items
Purchase Requests (Overview)
•	GET /overview/purchase-requests – List purchase requests
Inventory Card
•	GET /inventory-card – Get inventory details (filters: item_id, store_id, date range)
________________________________________
🔹 2. ITEMS APIs
•	GET /items – List all items
•	POST /items – Create new item
•	GET /items/{id} – Get item by ID
•	PUT /items/{id} – Update item
•	DELETE /items/{id} – Delete item
Extra
•	GET /items/search?q= – Search items
•	GET /items/sku/{sku} – Get item by SKU
________________________________________
🔹 3. SETUP APIs
Stores
•	GET /stores – List stores
•	POST /stores – Create store
•	PUT /stores/{id} – Update store
•	DELETE /stores/{id} – Delete store
Categories
•	GET /categories – List categories
•	POST /categories – Create category
•	PUT /categories/{id} – Update category
•	DELETE /categories/{id} – Delete category
Groups / Sections
•	GET /groups – List groups
•	POST /groups – Create group
•	PUT /groups/{id} – Update group
•	DELETE /groups/{id} – Delete group
Vendors / Suppliers
•	GET /vendors – List vendors
•	POST /vendors – Create vendor
•	PUT /vendors/{id} – Update vendor
•	DELETE /vendors/{id} – Delete vendor
________________________________________
🔹 4. PURCHASE ORDER APIs
•	GET /purchase-orders – List purchase orders
•	POST /purchase-orders – Create purchase order
•	GET /purchase-orders/{id} – Get purchase order
•	PUT /purchase-orders/{id} – Update purchase order
•	DELETE /purchase-orders/{id} – Delete purchase order
Actions
•	POST /purchase-orders/{id}/approve – Approve PO
•	POST /purchase-orders/{id}/reject – Reject PO
________________________________________
🔹 5. PURCHASE REQUEST APIs
•	GET /purchase-requests – List requests
•	POST /purchase-requests – Create request
•	GET /purchase-requests/{id} – Get request
•	PUT /purchase-requests/{id} – Update request
•	DELETE /purchase-requests/{id} – Delete request
Actions
•	POST /purchase-requests/{id}/approve – Approve request
•	POST /purchase-requests/{id}/reject – Reject request
________________________________________
🔹 6. RECEIVE GRN APIs
•	GET /grn – List GRNs
•	POST /grn – Create GRN
•	GET /grn/{id} – Get GRN by ID
•	PUT /grn/{id} – Update GRN
•	DELETE /grn/{id} – Delete GRN
Actions
•	POST /grn/{id}/confirm – Confirm GRN
•	GET /grn/purchase-order/{po_id} – Get GRN by PO
________________________________________
🔹 7. REPORT APIs
•	GET /reports/stock – Stock report
•	GET /reports/issuance – Issuance report
•	GET /reports/returns – Returns report
•	GET /reports/transfers – Transfers report
•	GET /reports/purchase – Purchase report
Filters:
•	date_from
•	date_to
•	store_id
•	item_id
________________________________________
🔹 8. UTILITY APIs
Dropdowns
•	GET /dropdown/stores
•	GET /dropdown/items
•	GET /dropdown/vendors
•	GET /dropdown/categories
Search
•	GET /guards/search?service_no= – Search guard
•	GET /items/search?q= – Search item
________________________________________
🔹 9. OPTIONAL APIs
•	GET /dashboard/stats – Dashboard data
•	GET /low-stock-items – Low stock list
•	GET /out-of-stock-items – Out of stock list
•	POST /bulk/items – Bulk add items
•	POST /bulk/issuance – Bulk issuance
________________________________________
✅ TOTAL APIs: 77
________________________________________


