# LuxLawn Care Auth Setup

The app uses Supabase Auth. Add these variables locally in `.env.local` and in Vercel Project Settings → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe for the browser. Never expose the service role key in client code.

## Supabase URL Settings

In Supabase → Authentication → URL Configuration:

- Site URL, local: `http://localhost:3000`
- Site URL, production: your Vercel domain
- Redirect URLs:
  - `http://localhost:3000/dashboard`
  - `http://localhost:3000/dashboard/settings`
  - `https://your-vercel-domain.vercel.app/dashboard`
  - `https://your-vercel-domain.vercel.app/dashboard/settings`

## Email Confirmation

If email confirmation is enabled, signup will show:

“Account created. Please check your email and verify your account before logging in.”

Users should confirm the email before logging in.

## Google OAuth

In Supabase → Authentication → Providers → Google:

1. Enable Google.
2. Add your Google OAuth client ID and secret.
3. Add the Supabase callback URL shown by Supabase to Google Cloud Console.
4. Save and test with “Continue with Google”.

## Apple OAuth

In Supabase → Authentication → Providers → Apple:

1. Enable Apple.
2. Configure Sign in with Apple in the Apple Developer portal.
3. Add the service ID, team ID, key ID, and private key required by Supabase.
4. Add the Supabase callback URL shown by Supabase to Apple.
5. The UI should say “Continue with Apple”, not iCloud.
