# Nirvaha Password Reset & Email Deliverability Guide

To transition your authentication recovery flow from a development environment to a polished, professional production system, you must update specific settings in your **Firebase Console** and configure **DNS settings** once you acquire a domain name. 

---

## 1. Firebase Console Configurations

Since Firebase handles email sending server-side, follow these steps in the [Firebase Console](https://console.firebase.google.com/):

### Step A: Update Project Public Name
By default, Firebase emails use your project ID (e.g., `nirvaha-8a8e4`). Update this to your real brand name:
1. Go to **Project Settings** (gear icon next to Project Overview).
2. Under the **General** tab, look for **Public-facing name**.
3. Edit and change this to **Nirvaha**.
4. Click **Save**.

### Step B: Configure Email Templates & Sender Identity
1. Go to **Authentication** in the left sidebar, and select the **Templates** tab.
2. Select the **Password Reset** email template.
3. Click the edit icon (pencil) in the top-right of the template card.
4. Update the fields as follows:
   * **Sender Name:** `Nirvaha Support`
   * **Reply-To:** *(Input your support or contact email, e.g., `support@yourdomain.com` or a Gmail address until you purchase a domain)*
   * **Subject:** `Reset your Nirvaha password` or `Password Reset Request • Nirvaha`
5. Toggle the template editor to **HTML** (if visible) or paste the customized HTML body below.

---

## 2. Branded HTML Email Template

This HTML email template is designed to match Nirvaha's premium visual scheme (`#2D5A4C` healing green accents and `#F8F6F0` background theme):

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Nirvaha Password</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #F8F6F0;
      color: #2A3B32;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #FFFFFF;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(45, 90, 76, 0.05);
      border: 1px solid rgba(45, 90, 76, 0.08);
    }
    .header {
      background-color: #2D5A4C;
      padding: 32px;
      text-align: center;
    }
    .header img {
      max-height: 48px;
      margin-bottom: 8px;
    }
    .content {
      padding: 40px 32px;
    }
    .title {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #2A3B32;
    }
    .text {
      font-size: 15px;
      line-height: 24px;
      color: #5A6E63;
      margin-bottom: 28px;
    }
    .button-container {
      text-align: center;
      margin-bottom: 32px;
    }
    .btn-primary {
      background-color: #2D5A4C;
      color: #FFFFFF !important;
      padding: 16px 36px;
      text-decoration: none;
      font-size: 16px;
      font-weight: 500;
      border-radius: 16px;
      display: inline-block;
    }
    .divider {
      height: 1px;
      background-color: rgba(45, 90, 76, 0.1);
      margin: 32px 0;
    }
    .footer {
      padding: 0 32px 32px;
      text-align: center;
      font-size: 12px;
      color: #A3BDB1;
      line-height: 18px;
    }
    .footer a {
      color: #2D5A4C;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <!-- Nirvaha logo: Replace LOGO_URL with the public URL you generate in Step C below -->
      <img src="LOGO_URL" alt="Nirvaha Logo">
    </div>
    <div class="content">
      <h1 class="title">Password Reset Request</h1>
      <p class="text">Hello,</p>
      <p class="text">We received a request to reset the password for your Nirvaha account. Click the button below to choose a new password. If you did not request this change, you can safely ignore this email.</p>
      <div class="button-container">
        <a href="%LINK%" class="btn-primary">Reset Password</a>
      </div>
      <p class="text" style="font-size: 13px;">For security reasons, this link will expire automatically after 1 hour. It can only be used once.</p>
      <div class="divider"></div>
      <p class="text">Warmly,<br><strong>The Nirvaha Team</strong></p>
    </div>
    <div class="footer">
      <p>This email was sent to you by Nirvaha as part of account recovery.<br>
      Need support? Contact us at <a href="mailto:support@yourdomain.com">support@yourdomain.com</a>.</p>
    </div>
  </div>
</body>
</html>
```

### Step C: How to Host Your Logo (`LOGO_URL`)
Since email clients require a public URL to load images, you cannot use your local path `app/pages/images/nirvaha-logo.png` directly in the HTML.
To generate a public URL using **Firebase Storage**:
1. In your Firebase Console, click on **Storage** in the left-hand menu.
2. Click **Get Started** and enable it if you haven't already.
3. Create a folder named `branding` and upload your logo image `nirvaha-logo.png`.
4. Click on the uploaded file and copy the **Tokenized File URL** or **File Location** link.
5. Replace `LOGO_URL` in the HTML template above with this copied link.

---

## 3. Production Deliverability Guide (When You Buy a Domain)

Once you purchase a domain name, you must configure a custom sending identity and set the correct DNS records to guarantee deliverability and prevent recovery emails from ending up in spam folders.

### Step A: Connect Custom Domain to Firebase Auth
1. Go to **Authentication** > **Templates** > **Password Reset**.
2. Click on the edit icon next to **Sender Email**.
3. Choose **Customize Domain**.
4. Enter your custom domain (e.g. `auth.yourdomain.com` or `yourdomain.com`).
5. Firebase will generate DNS TXT records. Add these keys to your domain's DNS manager (e.g., Cloudflare, GoDaddy, Namecheap) to verify domain ownership.

### Step B: Configure SPF, DKIM, and DMARC records
Add the following TXT records in your DNS management zone:

1. **SPF (Sender Policy Framework)**
   * **Type:** `TXT`
   * **Host:** `@` (or empty)
   * **Value:** `v=spf1 include:_spf.google.com ~all` (Allows Google's server to send mail on behalf of your domain).
   
2. **DKIM (DomainKeys Identified Mail)**
   * **Type:** `TXT`
   * **Host:** *(Provided by Firebase Console during domain verification)*
   * **Value:** *(Cryptographic key value provided by Firebase)*
   
3. **DMARC (Domain-based Message Authentication)**
   * **Type:** `TXT`
   * **Host:** `_dmarc`
   * **Value:** `v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc-reports@yourdomain.com`
