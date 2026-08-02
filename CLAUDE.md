# CLAUDE.md

This file gives Claude Code persistent context and rules for this repository. Read this before doing any work, every session.

---

## Project overview

We're building an e-commerce + organization website for a **wholesaler of laptops, mini PCs, thin clients, and related IT hardware** across multiple brands (Dell, Lenovo, HP, Acer, etc.).

**Reference site:** https://www.egreentechnology.in/ — a B2B catalog for a wholesaler selling Dell Wyse Thin Clients, Dell OptiPlex Mini PCs, Lenovo Mini ThinkCentres, HP ProDesk/Mini PCs/Thin Clients, organized as Brand → Category → Model, with a "Send Enquiry" flow. We're building a full custom platform (own backend, database, auth, and online purchasing) rather than a hosted catalog.

### Client requirements

1. Admin has full access to the site — full control over products, orders, users.
2. Admin can add/update/remove/view products and descriptions, and can issue/create bills (invoices) for orders.
3. Products are categorized by brand (Dell, Lenovo, HP, Acer, etc.), with further categorization by product type/model line within each brand.
4. The site must be user-friendly. Customers can buy products directly AND enquire about a product (for info or a custom quote before purchasing). The admin side must be able to see and respond to enquiries.
5. The site must be fully secure — JWT-based authentication is the chosen approach.

### Team structure (4 people, one shared repo)

- **Me (this account):** customer/user backend (auth, products API, cart, orders, enquiries), login/register frontend pages, and the database schema.
- **Teammate 1:** admin interface + backend — product CRUD, order/billing management, staff management, RBAC (Admin/Manager/Employee).
- **Teammate 2:** frontend — home page and product listing/detail pages (already built).
- **Teammate 3:** frontend — About Us and Contact pages.

**My scope in this repo is the customer-facing backend, the login/register frontend, and the shared database schema.** Do not build admin dashboards, admin product CRUD, admin billing UI, or the About/Contact pages — that's other teammates' work. The schema must still contain the fields those modules will need (e.g. `Invoice`, `Product` fields), even though I'm not building the logic for them.

---

## Tech stack

**Frontend:** React.js + Vite, Tailwind CSS, shadcn/ui
**Backend:** Node.js + Express.js
**Database:** PostgreSQL, hosted on Neon, via Prisma ORM
**Auth:** JWT (1-day expiry, no refresh tokens for now) + bcrypt for password hashing
**Images:** Cloudinary — only the returned URL + `public_id` are stored in Postgres, never binary image data
**Validation:** Zod
**Security middleware:** helmet, express-rate-limit (login/register endpoints), cors locked to the actual frontend origin
**API testing:** Postman
**Deployment (planned):** frontend on Vercel, database on Neon

### Why these choices (don't relitigate without a good reason)

- Postgres was chosen over MongoDB because order/inventory/product data is relational and needs ACID transactions (stock decrement + order creation + cart clearing must be atomic), and admin reporting needs JOIN/aggregate-heavy queries.
- JSONB columns may be used for variable product specs, but the core schema (Users, Products, Orders, etc.) stays relational.
- Neon was chosen for serverless scaling, a generous free tier, and DB branching (useful across worktrees — see below).

---

## Database schema (current core entities)

- `User` — id, name, email, passwordHash, phone, address, role (default `CUSTOMER`), timestamps
- `Brand` — id, name, logoUrl
- `Category` — id, name, parentId (nullable)
- `Product` — id, brandId, categoryId, name, sku, description, price, stockQty, imageUrl, imagePublicId, isActive, timestamps
- `CartItem` — id, userId, productId, quantity
- `Order` — id, userId, status, totalAmount, timestamps
- `OrderItem` — id, orderId, productId, quantity, unitPrice
- `Invoice` — id, orderId, invoiceNumber, issuedAt, status (fields only — Teammate 1 owns invoice generation logic)
- `Enquiry` — id, userId (nullable, supports guest enquiries), productId (nullable), name, email, phone, message, status (default `OPEN`), timestamps

Treat this as the source of truth for `schema.prisma`. If a task requires changing this schema, state the change clearly in your summary so it can be communicated to the rest of the team — don't silently rename or drop fields other modules may depend on (especially `Product` and `Invoice`, which Teammate 1's admin module reads/writes).

## Folder structure (backend)

```
server/
 ├── prisma/
 │    └── schema.prisma
 ├── routes/
 ├── controllers/
 ├── middleware/
 ├── services/
 ├── utils/
 └── uploads/
```

## Environment variables

- `.env` must always contain `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN=1d`, `PORT`, `CLIENT_URL`.
- `DATABASE_URL` is provided by me manually after Neon setup — never invent, hardcode, or auto-fill a fake/placeholder connection string.
- `.env` must always be in `.gitignore`. Never commit secrets. If you ever see a secret about to be committed, stop and flag it instead of proceeding.

## Security requirements (non-negotiable for this project)

- bcrypt for all password hashing (cost factor 10+); passwords are never logged or returned in any API response.
- JWT expiry is exactly 1 day, read from `JWT_EXPIRES_IN`, not hardcoded. No silent refresh/renewal — expired tokens require a fresh login.
- Every request body validated with Zod at the route boundary.
- Rate-limit `/api/auth/login` and `/api/auth/register`.
- cors restricted to `CLIENT_URL`, never `*`.
- Generic "invalid email or password" on login failure — never reveal whether an email exists in the system.
- Never use `$queryRawUnsafe` or any unsanitized raw SQL with user input.

---

## Git & commit conventions

**Every commit in this repository must be authored using this git identity — do not change it, do not override it, do not add anything to it:**

```
git config user.name  "Nik-ERROR-exe"
git config user.email "wnikhil146@gmail.com"
```

Rules:

- **Do not add a `Co-Authored-By: Claude` line, an Anthropic attribution footer, or any mention of Claude/AI assistance in any commit message.** Commit messages should read as if I wrote and made the change myself.
- **Do not add Claude, Anthropic, or any bot account as a collaborator, committer, or contributor on this repository** in any form (no GitHub App install, no collaborator invite, no bot commit identity).
- Before committing, confirm the local `user.name`/`user.email` match the values above. If a global git config differs, set the local repo config explicitly (`git config user.name`/`user.email`, without `--global`) rather than changing global settings, so other repos/tools aren't affected.
- Write clear, conventional commit messages (e.g. `feat: add JWT login endpoint`, `fix: correct cart quantity validation`) — no filler, no AI-flavored commentary in the message body.
- Never force-push to `main`/`master`. Never rewrite shared history on a branch other Claude sessions or teammates might be using.
- Never `git push` without being asked to, unless a task explicitly says to push. Committing locally is fine as part of finishing a task; pushing is a separate, deliberate action.

---

## Working with `git worktree` (multiple parallel Claude Code sessions)

I run multiple Claude Code sessions at once using `git worktree`, each on its own branch/worktree directory, to parallelize work. Keep this in mind on every task:

- **Assume other Claude sessions may be running concurrently in sibling worktrees of the same repo, possibly editing overlapping files** (especially `prisma/schema.prisma`, shared `.env`-adjacent config, and shared utils/middleware). Prefer additive, narrowly-scoped changes over broad refactors of shared files unless the task specifically asks for one.
- **Never modify git config, hooks, or remotes globally** — anything you set with `git config` must be local to the current worktree/repo, not `--global`, since a global change would silently affect every other running session and my own machine.
- **Don't assume you're the only writer to the database.** If a task involves running Prisma migrations, treat this as a shared, sequential resource — call it out clearly in your summary rather than running migrations silently, since a concurrent session running a conflicting migration at the same time can corrupt the migration history.
- **Stay inside your assigned task/branch scope.** If a task would require touching files clearly owned by a different in-progress feature (e.g. admin-module files if you're on a customer-backend branch), stop and flag it rather than merging concerns across worktrees.
- **Commit only what belongs to the current task.** Don't run repo-wide formatting/linting fixes across the whole codebase from one worktree — that creates merge conflicts for every other active worktree/session.
- When finishing a task, leave a clear, short summary of exactly what changed and which files were touched, so I can reconcile work across worktrees quickly.

---

## General working process for any task in this repo

1. Read relevant existing code first (frontend files, existing schema, existing routes) before writing anything — never guess field names or API shapes that already exist elsewhere in the repo.
2. State any schema or shared-file changes clearly before or alongside making them.
3. Stay within the scope described in the task prompt — do not build admin/RBAC features, About/Contact pages, or invoice-generation logic unless explicitly asked.
4. Do not run database migrations or push to remote without being asked.
5. Follow the git identity and worktree rules above on every commit, every session, without exception.