# 🤖 Cron-Job.org Setup Guide for Spotify Util

## 🎯 **Why cron-job.org is Better Than Vercel Crons**
- ✅ **Free**: No additional costs
- ✅ **Reliable**: Dedicated cron service
- ✅ **Flexible**: More scheduling options
- ✅ **Monitoring**: Email notifications on failures
- ✅ **Logs**: Detailed execution logs

## 📋 **Step-by-Step Setup**

### **1. Create Account**
1. Go to [https://cron-job.org](https://cron-job.org)
2. Click **"Sign Up"**
3. Use your email and create password
4. Verify email

### **2. Set Environment Variable**
In your Vercel dashboard → Settings → Environment Variables:
```
CRON_SECRET=MySecretKey123!@#
```
*Choose a strong, unique secret key*

### **3. Create Daily Maintenance Cron Job**

**Click "Create cronjob" and fill in:**

| Field | Value |
|-------|-------|
| **Title** | `Spotify Util - Daily Maintenance` |
| **URL** | `https://your-app.vercel.app/api/cron/maintenance?secret=MySecretKey123!@#` |
| **Method** | `POST` |
| **Schedule** | `Daily` |
| **Time** | `02:00` (2 AM) |
| **Timezone** | Your timezone |
| **Timeout** | `60 seconds` |

**Advanced Settings:**
- **Retries**: `3`
- **Request Headers**: `User-Agent: cron-job.org`
- **Failure Notifications**: ✅ Email me on failures

### **4. Test Your Setup**

**Test URL (in browser):**
```
https://your-app.vercel.app/api/cron/maintenance?secret=MySecretKey123!@#
```

Should return:
```json
{
  "success": true,
  "message": "Cron endpoint is working",
  "timestamp": "2025-08-12T..."
}
```

### **5. Optional: Create Additional Cron Jobs**

#### **Weekly Deep Clean (Sundays 3 AM)**
- **Title**: `Spotify Util - Weekly Deep Clean`
- **URL**: `https://your-app.vercel.app/api/admin/maintenance?taskName=cleanup-duplicates`
- **Schedule**: `Weekly` → `Sunday` → `03:00`

#### **Monthly Analytics Reset (1st of month 4 AM)**
- **Title**: `Spotify Util - Monthly Analytics`
- **URL**: `https://your-app.vercel.app/api/admin/maintenance?taskName=database-stats`
- **Schedule**: `Monthly` → `1st` → `04:00`

## 🔧 **What Each Cron Job Does**

### **Daily Maintenance** (2 AM)
- 🔍 Find and fix duplicate users
- 🔗 Validate user-account linking
- 🧹 Remove expired sessions (30+ days old)
- 🗑️ Delete old verification tokens (24+ hours)
- 🔧 Fix malformed user IDs
- 📊 Generate database statistics
- 📝 Log all results

### **Weekly Deep Clean** (Sunday 3 AM)
- 🔍 Deep duplicate scan
- 🗑️ Remove orphaned data
- 📊 Full database health check

## 🎯 **Fix Your Current Slug Issue**

Your issue: The slug is being read from the wrong duplicate (the one without 'lawsonhart' userId).

### **Quick Fix Options:**

#### **Option 1: Use Auto-Fix (Recommended)**
1. Go to `/admin` → `Duplicates` tab
2. Click "Analyze My Account"
3. Click **"Auto-Fix My Duplicates"** (new green button)
4. This will:
   - Keep the record with userId "lawsonhart"
   - Copy the slug from the wrong record to the correct one
   - Delete the wrong record

#### **Option 2: Manual API Call**
```bash
POST /api/user/fix-my-duplicates
```

#### **Option 3: Run Maintenance**
```bash
POST /api/admin/maintenance
{
  "taskName": "cleanup-duplicates"
}
```

## 📊 **Monitoring Your Cron Jobs**

### **In cron-job.org Dashboard:**
- **Execution History**: See all runs, success/failure
- **Logs**: View response from your endpoint
- **Statistics**: Success rate, average execution time
- **Alerts**: Email notifications on failures

### **In Your App:**
- **Maintenance Logs**: Check `/api/admin/database-diagnostic`
- **Database Collection**: `maintenance_logs` stores all results

## 🚨 **Troubleshooting**

### **Common Issues:**

| Problem | Solution |
|---------|----------|
| "Unauthorized" error | Check your `CRON_SECRET` environment variable |
| Timeout errors | Increase timeout to 120 seconds |
| No response | Verify your app URL is correct |
| Wrong timezone | Set timezone in cron-job.org to match your preference |

### **Test Commands:**
```bash
# Test GET endpoint
curl "https://your-app.vercel.app/api/cron/maintenance?secret=YourSecret"

# Test POST endpoint
curl -X POST "https://your-app.vercel.app/api/cron/maintenance?secret=YourSecret"
```

## ⚡ **Quick Start Checklist**

- [ ] Set `CRON_SECRET` environment variable in Vercel
- [ ] Create cron-job.org account
- [ ] Create daily maintenance cron job
- [ ] Test the endpoint URL
- [ ] Fix your current duplicates using auto-fix
- [ ] Monitor first few executions

**Your cron job URL will be:**
```
https://your-app.vercel.app/api/cron/maintenance?secret=YourSecretHere
```

Replace `your-app.vercel.app` with your actual domain and `YourSecretHere` with your secret!
