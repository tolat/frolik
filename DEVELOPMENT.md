# Running frolik locally

Requires Node 20 (`.nvmrc`). Node 22+ breaks the `web-push` dependency.
On this Mac: `export PATH=/opt/homebrew/opt/node@20/bin:$PATH`.

```bash
npm install && npm --prefix client install   # once
npm run db        # local MongoDB on :27017 (data persisted in .dev-db/)
npm run seed      # wipe + load sample users/outings/images
npm run dev       # API + sockets on :3001 (nodemon)
npm run client    # React dev server on :3000
```

- `.env` is created from `.env.example`. With `STORAGE=local` (or no real
  `AWS_BUCKET`), images are stored in `local-storage/` instead of S3.
- With no Gmail credentials, emails fail quietly. Verification and password-reset
  links are printed to the server console in development.
- Seed users: any `seeds/user.js` email (e.g. `torin@gmail.com`), password `getout1*`.
