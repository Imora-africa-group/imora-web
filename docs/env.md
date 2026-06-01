# Environment Variables — IMORA AFRICA
> Reference doc. Load with @docs/env.md when setting up environments.

## Root `.env.example`
```bash
# ── Database ──────────────────────────────────────────────────────────────────
DATABASE_URL="mysql://user:password@host:3306/imora"

# ── Auth (Admin app) ──────────────────────────────────────────────────────────
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3001"   # Change to admin domain in production

# ── Cloudinary ────────────────────────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# ── ExchangeRate-API ──────────────────────────────────────────────────────────
EXCHANGE_RATE_API_KEY="your-api-key"   # https://www.exchangerate-api.com

# ── Telegram ──────────────────────────────────────────────────────────────────
TELEGRAM_BOT_TOKEN="123456:ABC-DEF..."
TELEGRAM_CHAT_ID="-100123456789"       # Negative number for channels

# ── Cron security ─────────────────────────────────────────────────────────────
CRON_SECRET="generate-with: openssl rand -base64 32"

# ── Public vars (exposed to browser) ─────────────────────────────────────────
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
```

## Vercel: apps/web environment variables
All of the above except `NEXTAUTH_SECRET` and `NEXTAUTH_URL`.

## Vercel: apps/admin environment variables
All of the above.
Set `NEXTAUTH_URL="https://admin.imoraafricagroup.com"` in production.

## Where each variable is used
| Variable | Used in |
|---|---|
| `DATABASE_URL` | packages/db (both apps) |
| `NEXTAUTH_SECRET` | apps/admin |
| `NEXTAUTH_URL` | apps/admin |
| `CLOUDINARY_*` | packages/db/src/cloudinary.ts |
| `EXCHANGE_RATE_API_KEY` | packages/db/src/exchange.ts |
| `TELEGRAM_BOT_TOKEN` | packages/db/src/telegram.ts |
| `TELEGRAM_CHAT_ID` | packages/db/src/telegram.ts |
| `CRON_SECRET` | apps/web/app/api/cron/exchange-rates |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | apps/web and apps/admin (CldImage) |

## Local development setup
1. Copy `.env.example` to `.env` at the monorepo root
2. Fill in real values (DATABASE_URL, Cloudinary keys, etc.)
3. Run `pnpm db:push` to sync schema to MySQL
4. Run `pnpm db:seed` to load seed data
5. Run `pnpm dev` to start both apps
