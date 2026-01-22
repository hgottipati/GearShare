# Email Notifications Troubleshooting

## Issue: Emails work locally but not in production

### Step 1: Verify Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Verify these are set for **Production** environment:
   - `RESEND_API_KEY` ✅
   - `RESEND_FROM_EMAIL` ✅
   - `SUPABASE_SERVICE_ROLE_KEY` ✅
   - `NEXT_PUBLIC_APP_URL` ✅ (should be your Vercel URL, e.g., `https://your-app.vercel.app`)

3. **Important**: After adding/updating environment variables, you must **redeploy**:
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Click **Redeploy**

### Step 2: Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project → **Logs**
2. Filter by function: `marketplace-email`
3. Look for errors like:
   - `Missing required env var: ...`
   - `Email send failed: ...`
   - `Unauthorized: No user ID`

### Step 3: Check Browser Console

1. Open your deployed app
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Send a message
5. Look for errors:
   - `Email notification failed: ...`
   - `Email notification error: ...`

### Step 4: Verify Resend API Key

1. Go to [resend.com](https://resend.com) → Dashboard
2. Check **API Keys** section
3. Verify your API key is active
4. Check **Emails** section to see if emails are being sent (even if they fail)

### Step 5: Test API Route Directly

Test the API route with a real message ID:

```bash
# Get a message ID from your database, then:
curl -X POST https://your-app.vercel.app/api/marketplace-email \
  -H "Content-Type: application/json" \
  -d '{"type":"message","messageId":"actual-message-id-here"}'
```

**Note**: This will fail with 401 Unauthorized if you're not logged in, which is expected. But it will show if the route is accessible.

### Step 6: Common Issues

#### Issue: "Missing required env var: RESEND_API_KEY"
**Fix**: Add `RESEND_API_KEY` in Vercel environment variables and redeploy

#### Issue: "Missing required env var: SUPABASE_SERVICE_ROLE_KEY"
**Fix**: 
1. Go to Supabase Dashboard → Settings → API
2. Copy the **service_role** key (NOT the anon key)
3. Add it to Vercel as `SUPABASE_SERVICE_ROLE_KEY`
4. Redeploy

#### Issue: "Unauthorized: No user ID"
**Fix**: This means the user session isn't being passed correctly. Check:
- User is logged in
- Cookies are being sent with the request
- Supabase auth is configured correctly

#### Issue: Emails sent but not received
**Fix**:
- Check Resend dashboard → Emails to see delivery status
- Check spam folder
- Verify `RESEND_FROM_EMAIL` is correct format
- For production, verify your domain in Resend

### Step 7: Enable Debug Logging

The API route now logs errors. Check Vercel logs for:
- `[marketplace-email] Unauthorized: No user ID`
- `[marketplace-email] Email send failed: ...`
- `[marketplace-email] Error: ...`

## Quick Checklist

- [ ] All environment variables set in Vercel
- [ ] Environment variables set for **Production** environment
- [ ] Redeployed after adding environment variables
- [ ] `NEXT_PUBLIC_APP_URL` is your Vercel URL (not localhost)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is the service_role key (not anon key)
- [ ] Resend API key is valid and active
- [ ] Checked Vercel function logs for errors
- [ ] Checked browser console for errors
- [ ] Checked Resend dashboard for email delivery status

## Still Not Working?

1. Check Vercel logs for the exact error message
2. Verify all environment variables are correct
3. Test with a simple curl request (if you have a message ID)
4. Check Resend dashboard to see if emails are being attempted
5. Verify the user receiving the email has `notify_messages = true` in their notification settings
