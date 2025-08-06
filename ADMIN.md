# Development Admin Tools

**⚠️ DEVELOPMENT ONLY**: These admin tools are only available when `NODE_ENV !== 'production'` and are blocked in production via Vercel configuration.

## Admin API Routes

### User Management

#### 1. List Users
**GET** `/api/dev/admin/users/list`

Query parameters:
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Results per page (default: 10, max: 100)
- `search` (optional): Search users by name or email

Response:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_id",
        "name": "User Name",
        "email": "user@example.com",
        "isActive": true,
        "isLocked": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "spotifyId": "spotify_user_id",
        "accountProvider": "spotify",
        "hasPreferences": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### 2. Delete User
**DELETE** `/api/dev/admin/users/delete`

Query parameters:
- `userId` (required): User ID to delete
- `confirm` (required): Must be "DELETE_USER_CONFIRMED"

Response:
```json
{
  "success": true,
  "message": "User deleted successfully",
  "deletedCounts": {
    "user": 1,
    "accounts": 1,
    "preferences": 1,
    "sessions": 2
  }
}
```

#### 3. Manage User & Preferences
**GET** `/api/dev/admin/users/manage?userId=USER_ID`

Get user details and preferences.

**PUT** `/api/dev/admin/users/manage?userId=USER_ID`

Update user settings and preferences:
```json
{
  "userSettings": {
    "isActive": true,
    "isLocked": false,
    "name": "New Name",
    "email": "new@email.com"
  },
  "preferences": {
    "publicDisplaySettings": {
      "showCurrentTrack": true,
      "numberOfRecentTracks": 5
    },
    "privacySettings": {
      "isPublic": false,
      "customSlug": "my-custom-slug"
    }
  }
}
```

**POST** `/api/dev/admin/users/manage?userId=USER_ID&action=ACTION`

User actions:
- `action=reset-preferences`: Reset user preferences to default
- `action=lock`: Lock and deactivate user
- `action=unlock`: Unlock and activate user

### System Management

#### 4. System Statistics
**GET** `/api/dev/admin/system?action=stats`

Get comprehensive system statistics:
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 100,
      "active": 95,
      "locked": 5,
      "withAccounts": 100,
      "withPreferences": 98
    },
    "privacy": {
      "public": 80,
      "private": 18
    },
    "customization": {
      "customSlugs": 25,
      "backgroundImages": 30
    },
    "recent": [...]
  }
}
```

#### 5. System Health
**GET** `/api/dev/admin/system?action=health`

Check database and collection health:
```json
{
  "success": true,
  "data": {
    "database": "connected",
    "collections": {
      "users": {
        "status": "healthy",
        "count": 100,
        "lastUpdated": "2024-01-01T00:00:00.000Z"
      }
    }
  }
}
```

#### 6. System Maintenance
**POST** `/api/dev/admin/system?action=cleanup-orphaned`

Clean up orphaned records (accounts, preferences, sessions without users).

**POST** `/api/dev/admin/system?action=reset-all-preferences`

Reset ALL user preferences to default (requires confirmation):
```json
{
  "confirm": "RESET_ALL_PREFERENCES"
}
```

## Security Features

### Development-Only Access
- All admin routes check `process.env.NODE_ENV === 'production'` and return 404 if true
- Vercel configuration blocks `/api/dev/*` routes in production
- Double security layer prevents accidental production access

### User Locking
- Locked users: `isLocked: true` and `isActive: false`
- Locked users cannot authenticate or access services
- Unlock restores both flags to allow access

### Safe Deletion
- Requires explicit confirmation parameter
- Cascading deletion across all related collections
- Returns detailed deletion counts for verification

### Orphaned Data Cleanup
- Identifies and removes accounts, preferences, and sessions without corresponding users
- Safe operation that preserves data integrity

## Usage Examples

### Lock a problematic user:
```bash
curl -X POST "http://localhost:3000/api/dev/admin/users/manage?userId=USER_ID&action=lock"
```

### Get system stats:
```bash
curl "http://localhost:3000/api/dev/admin/system?action=stats"
```

### Delete a user (with confirmation):
```bash
curl -X DELETE "http://localhost:3000/api/dev/admin/users/delete?userId=USER_ID&confirm=DELETE_USER_CONFIRMED"
```

### Search for users:
```bash
curl "http://localhost:3000/api/dev/admin/users/list?search=john&page=1&limit=20"
```

### Clean up orphaned data:
```bash
curl -X POST "http://localhost:3000/api/dev/admin/system?action=cleanup-orphaned"
```

## Production Safety

The admin tools are completely blocked in production through:

1. **Code-level checks**: All routes return 404 if `NODE_ENV === 'production'`
2. **Vercel configuration**: Routes are excluded from deployment
3. **URL rewrites**: Any `/api/dev/*` requests redirect to 404

This ensures no admin functionality is available in production environments.
