# E-Commerce frontend

Read-only views for Products, Customers, Inventory, Orders, Payments, and Notifications.
Each card displays every field in the corresponding backend response DTO.

## Run

From this directory:

```powershell
npm ci
npm run dev
```

Open http://localhost:5173. Start the backend services and their required infrastructure separately. API ports: order 8081, customer 8082, product 8083, inventory 8084, payment 8085, notification 8086. A service that is offline shows an error in its section without blocking other sections.

## Structure

- `src/api`: GET request functions, with optional abort signals.
- `src/components`: one card per service, displaying all response fields.
- `src/pages`: one stateful read-only page per service.
- `src/pages/css`: six service-specific CSS files, including card styles.
- `src/App.css`: shared application layout and navigation.
- `src/index.css`: global defaults.

Navigation links jump to the service sections on the same screen. Forms and mutations are intentionally left for the next stage. Vite proxy routes are development-only; production hosting needs equivalent API routing.

## Verify

```powershell
npm run lint
npm run build
```
