# Database Management & Automation System

## 🔥 Current Issue - Your Duplicate Accounts

Based on your data, you have **2 duplicate user preferences**:

1. **Record 1**: `ObjectId('669b82abdbdc46a68b45a56')`
   - userId: `"lawsonhart"`
   - spotifyId: `"lawsonhart"`
   - Created: 2025-08-12T18:06:34.745+00:00

2. **Record 2**: `ObjectId('669b82acdbdc46a68b45a59')`
   - userId: `"669b82aa50d69629e065cfe7"` (This looks like an ObjectId as a string - likely wrong)
   - spotifyId: `"lawsonhart"`
   - Created: 2025-08-12T18:06:35.734+00:00

**Recommendation**: Keep Record 1 (the one with readable userId "lawsonhart") and delete Record 2.

## 🛠️ How to Fix Your Duplicates

### Option 1: Use the Admin Panel (Easiest)
1. Go to `/admin` in your app
2. Click the "Duplicates" tab
3. Click "Analyze My Account"
4. Review the duplicates found
5. Click "Delete This Duplicate" on the wrong one

### Option 2: Use API Directly
```bash
# Analyze your duplicates
GET /api/user/analyze-duplicates

# Delete a specific duplicate
DELETE /api/user/analyze-duplicates
{
  "preferenceIdToDelete": "669b82acdbdc46a68b45a59"
}
```

### Option 3: Run System Maintenance
```bash
POST /api/admin/maintenance
{
  "taskName": "cleanup-duplicates"
}
```

## 🤖 Automated Cron Jobs Setup

I've set up a **daily maintenance cron job** that runs at **2 AM every day**:

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/maintenance",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### What the Cron Job Does Daily:

1. **🔍 Find & Fix Duplicates** - Automatically removes duplicate user accounts
2. **🔗 Validate Linking** - Ensures accounts and preferences are properly linked
3. **🧹 Cleanup Old Sessions** - Removes expired sessions older than 30 days
4. **🗑️ Remove Orphaned Tokens** - Deletes verification tokens older than 24 hours
5. **🔧 Fix Malformed User IDs** - Fixes preferences with ObjectId strings as userIds
6. **📊 Generate Stats** - Updates database statistics

### Manual Maintenance APIs:

- **`GET /api/admin/maintenance`** - List available maintenance tasks
- **`POST /api/admin/maintenance`** - Run all maintenance tasks
- **`POST /api/admin/maintenance {"taskName": "cleanup-duplicates"}`** - Run specific task

## 🎯 Additional Recommended Cron Jobs

You might also want to add these cron jobs:

### Weekly Deep Clean (Sundays at 3 AM)
```json
{
  "path": "/api/cron/weekly-maintenance",
  "schedule": "0 3 * * 0"
}
```

### Monthly Analytics Cleanup (1st of month at 4 AM)
```json
{
  "path": "/api/cron/monthly-cleanup",
  "schedule": "0 4 1 * *"
}
```

### Backup Verification (Daily at 5 AM)
```json
{
  "path": "/api/cron/backup-check",
  "schedule": "0 5 * * *"
}
```

## 📋 Complete API Endpoints Added

### User Management:
- `GET /api/user/analyze-duplicates` - Analyze your account for duplicates
- `DELETE /api/user/analyze-duplicates` - Delete specific duplicate
- `DELETE /api/user/delete-account` - Enhanced comprehensive deletion

### Admin Tools:
- `POST /api/admin/fix-duplicates` - Find and fix all duplicate users
- `POST /api/admin/validate-linking` - Validate user-account linking
- `GET /api/admin/database-diagnostic` - Database health check
- `POST /api/admin/comprehensive-test` - Run all health checks
- `POST /api/admin/maintenance` - Run maintenance tasks

### Cron Jobs:
- `/api/cron/maintenance` - Daily automated maintenance

## 🚀 Next Steps

1. **Fix your duplicates first** using the admin panel
2. **Test the delete account function** to make sure it works completely
3. **Deploy to production** to activate the daily cron job
4. **Monitor the maintenance logs** in the `maintenance_logs` collection

## 🔒 Security Note

The cron job endpoint checks for a `CRON_SECRET` environment variable. Make sure to set this in production:

```bash
CRON_SECRET=your-super-secret-key-here
```

All maintenance operations are logged to the `maintenance_logs` collection for auditing.
