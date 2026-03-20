# Admin Credentials

## Default Admin Login

As specified in the coursework requirements:

**Email:** `ec@referendum.gov.sr`  
**Password:** `Shangrilavote&2025@`

These credentials are pre-configured in the database schema.

## First-Time Setup

1. Run the database schema:
   ```bash
   mysql -u root -p suryadb < backend/database/schema.sql
   ```

2. Admin account is automatically created with the credentials above

3. Login at: http://localhost:3000/admin/login

## Change Password (Optional)

### Method 1: Using API
```bash
curl -X POST http://localhost:5000/api/setup/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ec@referendum.gov.sr",
    "password": "YourNewPassword123!"
  }'
```

### Method 2: Using Script
```bash
cd backend
npm install
node generate-admin-hash.js
```

Then copy the hash and run in MySQL:
```sql
USE suryadb;
UPDATE users 
SET password_hash = 'PASTE_HASH_HERE' 
WHERE email = 'ec@referendum.gov.sr';
```

## Troubleshooting

### Cannot Login?

1. **Verify database setup:**
   ```sql
   USE suryadb;
   SELECT * FROM users WHERE role='EC';
   ```

2. **Reset password using API:**
   ```bash
   cd backend
   npm start
   # In another terminal:
   curl -X POST http://localhost:5000/api/setup/create-admin \
     -H "Content-Type: application/json" \
     -d '{"email":"ec@referendum.gov.sr","password":"Shangrilavote&2025@"}'
   ```

3. **Check backend logs:**
   - Look for authentication errors
   - Verify bcrypt is installed: `npm list bcryptjs`

### Password Special Characters

The default password contains special characters: `&`, `@`
- When using in terminal/scripts, wrap in single quotes: `'Shangrilavote&2025@'`
- When typing in browser, enter as-is: `Shangrilavote&2025@`

## Security Note

⚠️ **Important:** Change the default password after first login in production environments.

The default password is publicly documented in the coursework specifications and should only be used for development/testing.
