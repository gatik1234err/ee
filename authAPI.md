# Auth & Backend Setup

This app uses **Firebase Auth** for authentication (Google + email/password) and **Supabase** as the backend database for orders.

---

## Firebase Setup

### Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** (or select an existing one)
3. Enter a project name (e.g. "GrapheneLabs")
4. Disable **Google Analytics** (optional)
5. Click **"Create project"**

### Step 2: Register Your Web App

1. In the Firebase Console, click the **"Web"** icon (`</>`) on the project overview page
2. Enter an app nickname (e.g. "GrapheneLabs Web")
3. **Do NOT** check "Also set up Firebase Hosting"
4. Click **"Register app""
5. Copy the config object:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

### Step 3: Enable Google Sign-In

1. Firebase Console → **Authentication** → **Sign-in method**
2. Click **"Add new provider"** → **"Google"**
3. Toggle **Enable**, set a **Project support email**
4. Click **"Save"**

### Step 4: Enable Email/Password Sign-In

1. Firebase Console → **Authentication** → **Sign-in method**
2. Click **"Email/Password"** → **Enable** → **Save**

### Step 5: Configure Password Reset Email

1. Firebase Console → **Authentication** → **Templates** → **Password reset**
2. Set the **"From email"** and **"Reply to"** addresses
3. The reset link will point to your app's domain. For local dev, it defaults to `http://localhost:5173`

To set a custom reset link URL, go to **Authentication → Settings → Authorized domains** and add your domain. Firebase automatically appends `?mode=resetPassword&oobCode=...` to the reset URL.

### Step 6: Add Environment Variables

In `Electrolarynxx/.env.local`:

```bash
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...
```

---

## Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign in
2. Click **"New project"**
3. Enter a name (e.g. "GrapheneLabs")
4. Set a **Database Password** (save it securely)
5. Choose a region close to you
6. Click **"Create new project"** (takes ~1 minute)

### Step 2: Get Your API Credentials

1. In the Supabase Dashboard, go to **Project Settings → API**
2. Find your **Project URL** and **anon public key**
3. Add them to `.env.local`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### Step 3: Create the Orders Table

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Paste and run:

```sql
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  order_number TEXT NOT NULL,
  product_name TEXT NOT NULL,
  color_variant TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  card_last4 TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed'
);
```

4. Click **"Run"**

> **Security tip:** For production, set up Row Level Security (RLS) policies to restrict access to the `orders` table. Start with:
> ```sql
> ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
> CREATE POLICY "Enable insert for authenticated users only"
>   ON orders FOR INSERT
>   TO authenticated
>   WITH CHECK (true);
> CREATE POLICY "Enable select for authenticated users only"
>   ON orders FOR SELECT
>   TO authenticated
>   USING (true);
> ```

---

## Full `.env.local` Setup

```bash
# Firebase
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

---

## How Auth Works in the Code

| Flow | Method | File |
|---|---|---|
| Google sign-in | `signInWithPopup(auth, googleProvider)` | `AuthContext.jsx` |
| Email/password login | `signInWithEmailAndPassword(auth, email, password)` | `Login.jsx` |
| Email/password sign up | `createUserWithEmailAndPassword(auth, email, password)` | `Register.jsx` |
| Password reset email | `sendPasswordResetEmail(auth, email)` | `ForgotPassword.jsx` |
| Confirm password reset | `confirmPasswordReset(auth, oobCode, newPassword)` | `ResetPassword.jsx` |
| Auth state listener | `onAuthStateChanged(auth, callback)` | `AuthContext.jsx` |
| Sign out | `signOut(auth)` | `AuthContext.jsx` |

## How Supabase Works in the Code

- `Checkout.jsx` inserts a new order row: `supabase.from("orders").insert({...}).select().single()`
- `OrderConfirmation.jsx` fetches the order: `supabase.from("orders").select("*").eq("id", orderId).single()`

---

## Order Confirmation Email Setup

When a customer places an order, the app calls a **Supabase Edge Function** that sends a confirmation email via **Resend** from your own domain.

### Step 1: Set Up Resend

1. Go to [Resend](https://resend.com) and sign up
2. Verify your custom domain:
   - Go to **Domains** → **Add Domain**
   - Enter your domain (e.g. `graphenelabs.com`)
   - Add the provided DNS records (DKIM, SPF, MX) with your DNS provider
   - Wait for verification (takes a few minutes)
3. Create an API key:
   - Go to **API Keys** → **Create API Key**
   - Name it (e.g. "Supabase Edge Function")
   - Copy the key — you'll need it for Step 2

### Step 2: Set Supabase Secrets

Install the Supabase CLI if you haven't already:

```bash
npm install -g supabase
```

Then log in and set secrets:

```bash
supabase login
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxx
supabase secrets set FROM_EMAIL="GrapheneLabs <orders@yourdomain.com>"
```

### Step 3: Deploy the Edge Function

```bash
supabase functions deploy send-order-email
```

### Step 4: Make the Function Accessible

By default, Supabase Edge Functions require authentication. To allow unauthenticated calls (from your checkout page), update the function settings:

```bash
supabase secrets set --env-file ./supabase/.env.local
```

Or set the function to allow anonymous access in the Supabase Dashboard:
- Go to **Edge Functions** → **send-order-email**
- Under **Permissions**, enable **"Allow anonymous access"**

Alternatively, modify your Checkout page to pass the user's auth token, but for this simple flow, anonymous access is fine.

### How It Works

1. Customer submits checkout → `Checkout.jsx` inserts order into Supabase `orders` table
2. After successful insert, it calls `supabase.functions.invoke("send-order-email")` with the order data
3. The Edge Function uses Resend's API to send a branded HTML email from your custom domain
4. The email contains order number, product details, shipping info, and total

### Customizing the Email Template

Edit `supabase/functions/send-order-email/index.ts` to change the HTML email template, subject line, or add additional content.

## Troubleshooting

**"auth/operation-not-allowed"** — Google or Email/Password sign-in not enabled in Firebase Console.

**"auth/unauthorized-domain"** — Add your domain in Firebase Console → Authentication → Settings → Authorized domains.

**"auth/expired-action-code"** — The password reset link has expired. Request a new one.

**Supabase 401/403** — Check that RLS is either disabled or properly configured for the `orders` table.

**Popup blocked** — Allow popups for the site in your browser settings.
