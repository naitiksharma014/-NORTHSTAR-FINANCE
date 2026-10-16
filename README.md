# Global FPO-inspired website — MERN stack

A customizable corporate website starter built with **MongoDB, Express, React and Node.js**. The layout is inspired by a corporate finance-services website, but the brand, wording and assets are intended to be replaced with your own. It is not affiliated with Global FPO.

## What's included

- **Public website:** Home, Services, About Us and Contact Us. There is no sign-up or login for visitors.
- **Admin workspace:** A single administrator login at `/admin/login` with a dashboard.
- **Website content editor:** Edit brand details, contact information, hero content, core headings and descriptions, logo and hero/about images, plus repeatable homepage lists (stats, features and process steps).
- **Manageable collections:** Create, edit, hide/show and delete Services, Team Members, Testimonials and FAQs.
- **Image uploads:** An authenticated endpoint for JPG, PNG, WEBP, GIF and SVG images (5 MB maximum).
- **Contact inbox + Nodemailer:** Public visitors can submit an enquiry; messages are saved in MongoDB, the admin inbox receives an email notification, the visitor can receive an automatic acknowledgement, and the admin can send replies from the dashboard through SMTP.
- **Security foundations:** Password hash using bcrypt, HTTP-only admin session cookie, JWT verification, login/contact rate limiting, Helmet security headers, protected write routes, CORS configuration, contact-field validation and a honeypot spam trap. Uploads accept raster images only; SVG uploads are disabled to avoid active-content risks.
- **Separation of concerns:** Frontend pages/components, API routes, controllers, models, middleware, config and scripts each have their own files.

## Requirements

- Node.js 20 or newer (Node 22 recommended)
- npm
- MongoDB running locally **or** a MongoDB Atlas connection string

## Setup

### 1. Install dependencies

From the project root (`globalfpo-mern`):

```bash
npm run install:all
```

If you prefer, run `npm install` in the root, then `npm install` in both `server` and `client` folders separately.

### 2. Configure the server

Copy `server/.env.example` to `server/.env` and change at least:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/globalfpo_clone
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace-this-with-a-long-random-secret
ADMIN_NAME=Your Name
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=use-a-unique-password-at-least-12-characters-long
```

Generate a strong random value for `JWT_SECRET`; do not publish or commit `.env`. For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

### 2a. Configure email delivery with Nodemailer (SMTP)

Add the SMTP settings below to `server/.env`. Example for Gmail:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-business-email@gmail.com
SMTP_PASS=your-16-character-google-app-password
MAIL_FROM=your-business-email@gmail.com
CONTACT_TO=your-business-email@gmail.com
MAIL_SEND_AUTO_REPLY=true
MAIL_SIGNATURE=The Website Team
```

For Gmail, enable 2-Step Verification on the sender Google account and create an **App Password**. Use that App Password for `SMTP_PASS`, not your regular Gmail password. If you use another provider, use that provider's SMTP host, port, secure setting and credentials. `MAIL_FROM` should be an address the SMTP provider allows you to send from. `CONTACT_TO` is where new website enquiries are delivered; it defaults to `SMTP_USER`. Keep all credentials only in `server/.env`, never in frontend code or a public repository. Restart the backend after changing environment variables.

When a visitor submits the contact form, the server stores the message in MongoDB, emails the configured inbox, and (when enabled) sends an acknowledgement to the visitor. If SMTP is not configured or delivery fails, the contact message is still saved in MongoDB and remains visible in the admin inbox. The admin can write and send a reply from the message detail panel. Email delivery depends on valid SMTP credentials and provider policies.

### 3. Configure the client (optional for local development)

`client/.env.example` documents the API URL. The Vite app defaults to `http://localhost:5000/api`, so no client `.env` is required for a standard local setup. If you create `client/.env`, set:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Create the administrator and starter content

From the project root:

```bash
npm run seed:admin
```

(You can also run `npm run seed:admin --prefix server`.)

This explicitly loads `server/.env` regardless of the terminal working directory, hashes the password, and creates/updates that administrator. Use a password of at least 12 characters and a `JWT_SECRET` of at least 24 characters. Re-run this command any time you change `ADMIN_EMAIL` or `ADMIN_PASSWORD`; the seed script updates the existing admin account. It seeds starter site content and sample service/team/testimonial/FAQ records only when those collections are empty. **There is no public admin registration page.** Run the seed command only from a trusted development/administrative environment.

### 5. Start frontend and backend

From the project root:

```bash
npm run dev
```

Local URLs:

- Public website: <http://localhost:5173>
- Admin sign-in: <http://localhost:5173/admin/login>
- API health check: <http://localhost:5000/api/health>

The public website never requires a visitor account. Only the administrator signs in.

## Folder structure

```text
globalfpo-mern/
├── client/
│   ├── public/
│   └── src/
│       ├── api/              # Axios API client
│       ├── components/       # Navbar, footer, layouts, reusable fields
│       ├── context/          # Admin session state
│       ├── data/             # Frontend fallback/demo content
│       ├── pages/
│       │   ├── public/        # Home, Services, About, Contact
│       │   └── admin/         # Login, dashboard, CMS, CRUD pages, inbox
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
├── server/
│   ├── uploads/               # Uploaded images in local development
│   └── src/
│       ├── config/            # Database and seed content
│       ├── controllers/       # Request handlers
│       ├── middleware/        # Admin auth, optional auth, errors
│       ├── models/            # Mongoose schemas
│       ├── routes/            # API endpoints
│       ├── scripts/           # Admin/content seed script
│       └── server.js
├── .gitignore
└── package.json
```

## Admin usage

1. Visit `/admin/login`.
2. Sign in using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `server/.env`.
3. Use **Website content** to update brand/hero/page copy and image URLs.
4. Use **Services**, **Team members**, **Testimonials** and **FAQs** to add or edit entries. Turn off “Visible on website” to hide an entry without deleting it.
5. Use **Contact messages** to review submissions. “Reply by email” opens your own email app; mark replied after handling it.
6. Sign out from the admin sidebar when finished.

The API is also protected independently of the frontend. Hiding an admin page in React is not the security boundary; server-side middleware protects the admin endpoints. The backend exposes `/api/health/ready` to report MongoDB readiness and whether SMTP is configured. In the admin Contact messages screen, use **Test email delivery** to send a test message to `CONTACT_TO` (or `SMTP_USER`) and confirm the inbox is receiving mail.

## Where to customize

- Public navigation: `client/src/components/Navbar.jsx` (exactly Home, Services, About Us and Contact Us)
- Public page layout and sections: `client/src/pages/public/`
- Main visual styling: `client/src/index.css`
- Initial site content: `server/src/config/defaultData.js` and `client/src/data/defaultContent.js`
- API endpoints: `server/src/routes/`
- Database models: `server/src/models/`
- Admin editor and lists: `client/src/pages/admin/`

Replace **NORTHSTAR FINANCE**, all sample business claims, sample team profiles, and testimonial text with your actual approved content before publishing. Do not present the starter statistics or sample testimonials as genuine results or customers.

## Notes before production

This is a development starter, not a finished production deployment. Before launch, configure HTTPS and production CORS, use a strong private `JWT_SECRET`, set cookie options correctly (`COOKIE_SECURE=true`; use `COOKIE_SAME_SITE=none` only when frontend and API are cross-site), protect the MongoDB account, back up the database and uploaded files, review privacy/retention rules for contact data, verify SMTP delivery from the admin panel, and deploy uploads to persistent object storage if your host has an ephemeral filesystem. Also configure a real domain, production `CLIENT_URL`/`VITE_API_URL`, monitoring, and a database backup/restore plan. The project cannot be production-live until you provide and verify your own MongoDB, SMTP and hosting credentials. Do not commit `.env` files. Consider adding audit logs and an admin password-rotation flow for a multi-admin or larger production site.


## Troubleshooting admin login

- **`MONGODB_URI is missing`:** confirm the file is named exactly `server/.env` (not `.env.txt`). The server and seed script now load this path explicitly.
- **`Invalid admin email or password`:** confirm `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `server/.env`, then run `npm run seed:admin` again from the project root. Use the exact same email and password on the login page. The password must be at least 12 characters.
- **`JWT_SECRET is missing or too short`:** replace the placeholder with a private random string of at least 24 characters, then restart the server and run `npm run seed:admin` again.
- **Login says Network Error:** start both processes with `npm run dev`, then open `http://localhost:5173` and verify `http://localhost:5000/api/health` returns JSON.
- **Atlas connection fails:** confirm the database user's password in the Atlas URI, add your current IP to Atlas Network Access, and URL-encode reserved characters in the database password.
- **Image upload succeeds but image is missing:** restart the backend and confirm uploads are being written under `server/uploads`; the updated route resolves this directory relative to the server source file regardless of the terminal's current directory.
- **Email test fails:** confirm `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` and `CONTACT_TO`; for Gmail, use a Google App Password. Check the server terminal for the SMTP provider's rejection details.

Never share or commit `server/.env`. If a MongoDB password or JWT secret has been exposed, rotate it before using the app beyond local testing.


## Real-world launch checklist

Do not treat a successful local run as proof that a production website is ready. Before launch, complete and verify each item below:

- [ ] Replace all starter brand details, sample stats, sample team profiles and testimonial placeholders with truthful approved content.
- [ ] Use a production MongoDB Atlas database user with least-privilege access, a strong password, IP/network restrictions and automated backups.
- [ ] Set a unique random `JWT_SECRET`; set `NODE_ENV=production`; configure secure cookies for the actual frontend/API deployment arrangement.
- [ ] Set `CLIENT_URL` to the exact production frontend origin(s), comma-separated if needed, and `VITE_API_URL` to the deployed API base URL ending in `/api`.
- [ ] Configure SMTP credentials as deployment secrets, then sign in to the admin inbox and use **Test email delivery**. Confirm notification, visitor acknowledgement and admin reply all arrive; check spam folders.
- [ ] Submit a real test enquiry, confirm it is saved in MongoDB, and verify it appears in the admin inbox even when email delivery is unavailable.
- [ ] Upload an image and confirm it remains accessible after a server restart and redeploy. For hosts with ephemeral storage, replace local uploads with persistent object storage (for example S3-compatible storage or Cloudinary).
- [ ] Test login failures, session expiry, logout, protected write APIs, resource create/edit/hide/delete, contact status updates and email replies.
- [ ] Enable HTTPS, domain renewal, uptime/error monitoring, database backup/restore drills, log retention, privacy notice and a process for handling/deleting contact data.
- [ ] Run `npm run build` and fix all warnings/errors before deployment. Run dependency/security audits and keep dependencies updated.

### Health checks

- `GET /api/health` checks that the API process responds.
- `GET /api/health/ready` reports MongoDB connection readiness and whether SMTP variables are configured. SMTP being configured does not prove delivery; use the admin **Test email delivery** action for a real delivery test.

The app intentionally cannot ship with working third-party credentials embedded. MongoDB, SMTP and hosting must be configured with your own private credentials, and end-to-end delivery/deployment must be tested in your environment.
