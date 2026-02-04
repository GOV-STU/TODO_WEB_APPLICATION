# Vercel Deployment Guide

## Prerequisites
- GitHub repository: https://github.com/GOV-STU/hackathon_two_phase_3
- Vercel account (sign up at https://vercel.com)
- Backend deployed on Hugging Face: https://hanzalagov-todoweb-phase-3.hf.space

## Deployment Steps

### 1. Import Repository to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select or authorize your GitHub account
4. Import: `GOV-STU/hackathon_two_phase_3`

### 2. Configure Project Settings

When prompted, configure the following:

**Framework Preset:** Next.js

**Root Directory:** `frontend`
- Click "Edit" next to Root Directory
- Enter: `frontend`
- This tells Vercel that your Next.js app is in the frontend folder

**Build Command:** (Leave default)
```
npm run build
```

**Output Directory:** (Leave default)
```
.next
```

**Install Command:** (Leave default)
```
npm install
```

### 3. Environment Variables

Add the following environment variable in Vercel:

**Variable Name:** `NEXT_PUBLIC_API_URL`
**Value:** `https://hanzalagov-todoweb-phase-3.hf.space`

To add environment variables:
1. In the project configuration screen, scroll to "Environment Variables"
2. Click "Add" or enter the variable name and value
3. Select all environments (Production, Preview, Development)
4. Click "Add"

### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 2-3 minutes)
3. Once deployed, you'll get a URL like: `https://your-project.vercel.app`

### 5. Custom Domain (Optional)

After deployment, you can add a custom domain:
1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Post-Deployment

### Testing the Deployment

1. Visit your Vercel URL
2. Test the following:
   - Landing page loads with robotic theme
   - Sign up functionality works
   - Login functionality works
   - Dashboard displays correctly
   - Task creation/editing works
   - Chatbot widget appears and functions

### Troubleshooting

**Issue: API calls failing**
- Check that `NEXT_PUBLIC_API_URL` is set correctly in Vercel environment variables
- Verify the Hugging Face backend is running
- Check browser console for CORS errors

**Issue: Build fails**
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

**Issue: 404 errors**
- Ensure Root Directory is set to `frontend`
- Check that all routes are properly configured

## Branch Deployments

Vercel automatically deploys:
- **Production:** Commits to `main` branch
- **Preview:** Commits to other branches (like `001-ai-chat-integration`)

Each pull request gets its own preview URL for testing.

## Environment Variables Reference

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://hanzalagov-todoweb-phase-3.hf.space` | Backend API URL on Hugging Face |

## Useful Commands

**Redeploy:** Push to GitHub or click "Redeploy" in Vercel dashboard

**View Logs:** Go to Deployments → Select deployment → View Function Logs

**Rollback:** Go to Deployments → Select previous deployment → Promote to Production

## Support

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Project Repository: https://github.com/GOV-STU/hackathon_two_phase_3
