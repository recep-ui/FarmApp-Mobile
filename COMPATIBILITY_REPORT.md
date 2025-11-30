# System Compatibility & Variable Analysis Report

## 1. Database Schema Analysis
The database uses a consistent **`snake_case`** convention for all tables and columns.

| Table | Key Columns (snake_case) |
|-------|--------------------------|
| `users` | `user_id`, `username`, `first_name`, `last_name`, `password_hash`, `is_active` |
| `animals` | `animal_id`, `barn_id`, `tag_number`, `birth_date` |
| `barns` | `barn_id`, `name`, `capacity` |

## 2. Backend API Analysis
The backend exhibits a **mixed convention** depending on the controller.

### A. Auth Controller (`authController.js`)
*   **Login/Register:** Performs manual mapping.
    *   **Output:** `camelCase` (`userId`, `firstName`, `lastName`).
*   **Get Profile:** Returns raw DB rows.
    *   **Output:** `snake_case` (`user_id`, `first_name`, `last_name`).
    *   **⚠️ WARNING:** This is inconsistent with Login/Register.

### B. Resource Controllers (`animalController.js`, `barnController.js`, `userController.js`)
*   **All Endpoints:** Return raw DB rows.
    *   **Output:** `snake_case` (`animal_id`, `barn_id`, `user_id`, `first_name`).

## 3. Frontend Compatibility Analysis
The frontend code has been written to handle these inconsistencies, but it requires developer awareness.

*   **`Login.js` / `AuthContext.js`**: Correctly handles `camelCase` responses from Login.
*   **`Users.js` (Admin Page)**: Correctly handles `snake_case` responses from `userController`.
*   **`Animals.js` / `Barns.js`**: Correctly handles `snake_case` responses from their respective controllers.

## 4. Critical Recommendations

### Fix `getProfile` Inconsistency
In `backend/controllers/authController.js`, the `getProfile` function should be updated to return `camelCase` to match the `login` response structure. This ensures that if the frontend refreshes the user profile from the server, it receives the same data structure as a fresh login.

**Current `getProfile` return:**
```json
{
  "user_id": 1,
  "first_name": "Admin",
  "last_name": "User"
}
```

**Recommended `getProfile` return:**
```json
{
  "userId": 1,
  "firstName": "Admin",
  "lastName": "User"
}
```
