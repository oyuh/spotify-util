# Development API Routes

This directory contains development and debugging routes that are **NOT deployed to production**.

## Organization

- `debug/` - Debug utilities for development
- `test/` - Test endpoints for development
- Other debug routes (debug-session, debug-preferences, diagnostic)

## Routes Overview

### Debug Routes (`/api/dev/debug/`)
- `accounts` - View all Spotify accounts
- `all-users` - List all users in database
- `analyze-users` - Analyze user data patterns
- `cleanup-duplicate` - Clean up duplicate user records
- `cleanup-users` - General user cleanup utilities
- `display-test` - Test display functionality
- `fix-account-mismatch` - Fix account/user mismatches
- `fix-mismatch` - General mismatch fixes
- `fix-real-user` - Fix real user data issues
- `fix-user-mismatch` - Fix user mismatch issues
- `force-delete-duplicate` - Force delete duplicate records
- `mismatch` - View mismatch issues
- `privacy` - Debug privacy settings
- `slug-account` - Debug slug/account relationships
- `test-slug-generation` - Test slug generation
- `types` - Debug type information
- `user-data` - View user data
- `user-prefs` - View user preferences

### Test Routes (`/api/dev/test/`)
- `auth` - Test authentication
- `cookies` - Test cookie handling
- `db` - Test database connections
- `session` - Test session management
- `spotify` - Test Spotify API integration

### Other Dev Routes
- `debug-session` - Debug session information
- `debug-preferences` - Debug user preferences
- `diagnostic` - System diagnostics

## Production Safety

These routes are blocked in production via:

1. **Middleware blocking** - `middleware.ts` returns 404 for `/api/dev/*` in production
2. **Vercel ignore** - `.vercelignore` excludes `src/app/api/dev/` from deployment
3. **Environment check** - Routes check `NODE_ENV` before executing

## Usage in Development

Access these routes directly:
```
http://localhost:3000/api/dev/debug/accounts
http://localhost:3000/api/dev/test/auth
http://localhost:3000/api/dev/debug-session
```

## Adding New Dev Routes

When adding new development routes:
1. Place them in `/api/dev/debug/` or `/api/dev/test/`
2. Add environment checks if needed
3. Document the route purpose in this README
