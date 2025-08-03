# Vercel Deployment Guide

## Pre-deployment Checklist

✅ **Environment Variables Setup**: All hardcoded localhost URLs have been made environment-aware
✅ **Dynamic URL Detection**: The app automatically detects Vercel URLs and custom domains
✅ **Favicon Files**: Placeholder favicon files created (replace with your designs)

## Deployment Steps

### 1. Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Vercel will automatically deploy your app

### 2. Set Environment Variables in Vercel

Go to your Vercel project settings and add these environment variables:

**Required Variables:**
```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your_very_long_random_secret_string
MONGODB_URI=your_mongodb_connection_string
```

**Optional Variables:**
```
APP_URL=https://your-app-name.vercel.app
AUTH_URL=https://your-app-name.vercel.app
```

### 3. Update Spotify App Settings

In your Spotify App Dashboard:

1. Update **Redirect URIs** to include:
   - `https://your-app-name.vercel.app/api/auth/callback/spotify`

2. If using a custom domain, also add:
   - `https://your-custom-domain.com/api/auth/callback/spotify`

### 4. Custom Domain (Optional)

If you want to use a custom domain:

1. Add your domain in Vercel project settings
2. Update environment variables to use your custom domain
3. Update Spotify redirect URIs

## Automatic Features

The app will automatically:
- ✅ Detect Vercel URLs vs custom domains
- ✅ Use the correct base URL in all components
- ✅ Work with both `.vercel.app` subdomains and custom domains
- ✅ Handle environment switching (dev/production)

## Testing

After deployment:
1. Test authentication flow
2. Test `/stream/[your-spotify-id]` URLs
3. Test `/display/[your-spotify-id]` URLs
4. Verify all environment variables are working

## Troubleshooting

**Common Issues:**
- Authentication not working → Check NEXTAUTH_URL matches your domain
- Redirect URI mismatch → Update Spotify app settings
- API calls failing → Check environment variables are set correctly

The app uses the `getBaseUrl()` utility function to automatically detect the correct URL for your deployment environment.
