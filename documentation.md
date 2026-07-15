# Buddy Script — Documentation

A social media platform built as Appifylab's Full Stack Engineer selection task. Users can register, log in, create posts with multiple images, react with Like/Haha/Heart, comment, reply, and toggle between dark and light themes.

---

## Tech Stack & Why

| Layer | Choice | Why |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | React-based (required), SSR support, API routes eliminate a separate backend server — single deployment |
| **Language** | TypeScript | Type safety across frontend and API, catches bugs at compile time |
| **Database** | PostgreSQL (Neon) | Relational model fits social data (users → posts → comments → likes), free hosted tier via Neon |
| **ORM** | Prisma 7.8 | Type-safe database queries, auto-generated types from schema, easy migrations |
| **Auth** | iron-session (encrypted HttpOnly cookies) | Same-origin app doesn't need JWT complexity; HttpOnly cookies are immune to XSS, automatically sent with every request |
| **Password Hashing** | bcryptjs | Industry standard, resistant to brute-force with configurable salt rounds |
| **Image Storage** | Cloudinary (free tier: 25 GB) | CDN-backed image hosting, wrapped in a `uploadImage()` utility — swap provider by changing one file |
| **Styling** | Tailwind CSS v4 | Utility-first, built-in responsive breakpoints, custom theme tokens via `@theme` for dark/light mode switching |
| **Deployment** | Vercel | Zero-config Next.js deployment, free tier |

---

## Authentication System

### How It Works

```
User enters email + password
        ↓
POST /api/auth/login
        ↓
Server finds user by email → bcrypt.compare(password, hash)
        ↓
On success: iron-session encrypts user data into an HttpOnly cookie
        ↓
Cookie is auto-sent with every subsequent request
        ↓
API routes read the session from the cookie to identify the user
```

### Why Session-Based Auth (Not JWT)

- **HttpOnly cookies** — JavaScript cannot read them, so XSS attacks cannot steal tokens
- **No token storage** — nothing in localStorage or sessionStorage to leak
- **Automatic** — browser sends the cookie with every request, no manual `Authorization` header needed
- **Server-controlled expiry** — sessions can be invalidated server-side (JWTs cannot until they expire)
- **Simpler** — no refresh token rotation, no token blacklisting

### Session Config

```typescript
// src/lib/auth.ts
{
  password: process.env.SESSION_SECRET,  // 32+ char secret for encryption
  cookieName: "buddy-script-session",
  cookieOptions: {
    secure: true,       // HTTPS only in production
    httpOnly: true,      // not accessible via JavaScript
    sameSite: "lax",     // CSRF protection
    maxAge: 7 days       // auto-expire after 1 week
  }
}
```

### Auth Flow by Page

| Route | Not Logged In | Logged In |
|---|---|---|
| `/` | → Redirect to `/login` | → Redirect to `/feed` |
| `/login` | Show login form | → Redirect to `/feed` |
| `/register` | Show register form | → Redirect to `/feed` |
| `/feed` | → Redirect to `/login` | Show feed |

### API Route Protection

Every API route that needs auth follows this pattern:

```typescript
const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
if (!session.userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
// session.userId is now the authenticated user's ID
```

---

## Database Schema

### Tables Overview

```
User ──┬── Post ──┬── PostLike (with ReactionType: LIKE | HAHA | HEART)
       │          └── Comment ──┬── CommentLike
       │                        └── Comment (replies via parentId self-reference)
       ├── PostLike
       ├── Comment
       └── CommentLike
```

### Key Design Decisions

**1. Denormalized Counters** — `Post.likesCount`, `Post.commentsCount`, `Comment.likesCount`

Instead of running `COUNT(*)` on every feed load (expensive at scale), we store the count directly on the post/comment and update it atomically when a like/comment is added or removed:

```typescript
prisma.$transaction([
  prisma.postLike.create({ data: { postId, userId } }),
  prisma.post.update({ where: { id: postId }, data: { likesCount: { increment: 1 } } })
]);
```

**2. Cursor-Based Pagination** — not OFFSET

OFFSET-based pagination (`SKIP 1000`) gets slower the deeper you scroll because the database must scan and discard all skipped rows. Cursor-based pagination uses `(createdAt, id)` as a composite cursor and performs consistently regardless of depth:

```
WHERE (createdAt, id) < (cursor_time, cursor_id)
ORDER BY createdAt DESC, id DESC
LIMIT 20
```

**3. Unique Constraints** — prevent double-likes

`@@unique([postId, userId])` on PostLike ensures a user can only like a post once at the database level, not just application level.

**4. Multiple Images** — `imageUrls String[]`

Posts support multiple images stored as a PostgreSQL text array. Images are uploaded to Cloudinary individually, and their URLs are stored in the array. The UI displays them in a responsive grid (1 image = full width, 2 = side by side, 3+ = 2-column grid, 4+ = 2x2 with "+N" overlay).

**5. Reaction Types** — `ReactionType` enum

Instead of a simple boolean like, users can react with LIKE (thumbs up), HAHA (laughing face), or HEART (red heart). Clicking the same reaction again removes it. Clicking a different reaction switches the type without changing the count.

### Indexes

| Index | Purpose |
|---|---|
| `idx_post_feed (createdAt DESC, id)` | Fast feed pagination |
| `idx_post_author (authorId, createdAt DESC)` | User's own posts |
| `idx_post_visibility (visibility, createdAt DESC)` | Filter public posts |
| `idx_postlike_post (postId)` | Count likes per post |
| `idx_postlike_user_post (userId, postId)` | "Did I like this?" lookup |
| `idx_comment_post (postId, createdAt)` | Load comments for a post |
| `idx_comment_parent (parentId, createdAt)` | Load replies for a comment |
| `idx_user_email (email)` | Login lookup |

---

## Dark / Light Theme

### How It Works

Tailwind CSS v4 has two modes for custom theme tokens:

- `@theme inline` — values are **hardcoded** into utility classes at build time (e.g., `text-primary` → `color: #1890FF`). Cannot be overridden at runtime.
- `@theme` (without inline) — values use **CSS variable references** (e.g., `text-text-heading` → `color: var(--color-text-heading)`). Can be overridden at runtime.

We split tokens into:
- **Static** (`@theme inline`): brand colors, shadows, radii, fonts — never change with theme
- **Switchable** (`@theme`): text colors, surface colors, borders — overridden in `[data-theme="dark"]`

```css
@theme inline { --color-primary: #1890FF; }          /* always blue */
@theme { --color-text-heading: #1A202C; }             /* light mode default */
:root[data-theme="dark"] { --color-text-heading: #e6edf3; }  /* dark override */
```

### Theme Persistence

1. User clicks toggle → sets `data-theme="dark"` on `<html>` + saves to `localStorage`
2. On page load, an inline `<script>` in `<head>` reads localStorage and sets the attribute **before paint** — no flash of wrong theme

---

## API Endpoints

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account (firstName, lastName, email, password) |
| POST | `/api/auth/login` | Login (email, password) → sets session cookie |
| POST | `/api/auth/logout` | Destroy session cookie |
| GET | `/api/auth/me` | Get current user from session |

### Posts

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/posts?cursor=&limit=` | Feed with cursor-based pagination |
| POST | `/api/posts` | Create post (content, imageUrls[], visibility) |
| PUT | `/api/posts/[id]` | Edit post (owner only) |
| DELETE | `/api/posts/[id]` | Delete post (owner only) |
| POST | `/api/posts/[id]/like` | Toggle reaction (reactionType: LIKE/HAHA/HEART) |

### Comments

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/posts/[id]/comments` | Get comments for a post |
| POST | `/api/posts/[id]/comments` | Add comment (parentId for replies) |
| POST | `/api/posts/[id]/comments/[commentId]/like` | Toggle like on comment |

### Upload

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload` | Upload image to Cloudinary (max 5MB, images only) |

---

## Project Structure

```
buddy-script/
├── prisma/
│   └── schema.prisma              # Database schema
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout, fonts, theme script
│   │   ├── page.tsx               # / → redirects to /feed or /login
│   │   ├── login/page.tsx         # Login page with auth guard
│   │   ├── register/page.tsx      # Register page with auth guard
│   │   ├── feed/page.tsx          # Feed page
│   │   ├── globals.css            # Tailwind theme tokens + dark mode
│   │   └── api/                   # All API routes
│   ├── components/
│   │   ├── auth/                  # LoginForm, RegisterForm
│   │   ├── feed/                  # PostCard, CreatePost, CommentSection, etc.
│   │   └── layout/               # AuthLayout (login/register wrapper)
│   ├── context/
│   │   └── AuthContext.tsx        # Auth state provider
│   ├── hooks/
│   │   └── useInfiniteScroll.ts   # Intersection Observer for infinite scroll
│   └── lib/
│       ├── auth.ts                # Session config
│       ├── prisma.ts              # Prisma client singleton
│       ├── upload.ts              # Cloudinary upload wrapper
│       └── timeago.ts             # Relative time formatting
```

---

## Environment Variables

```env
DATABASE_URL=            # PostgreSQL connection string (Neon)
SESSION_SECRET=          # 32+ character secret for iron-session encryption
CLOUDINARY_CLOUD_NAME=   # Cloudinary account
CLOUDINARY_API_KEY=      # Cloudinary API key
CLOUDINARY_API_SECRET=   # Cloudinary API secret
```

---

## Running Locally

```bash
npm install
npx prisma migrate deploy
npx prisma generate
npm run dev
```

---

## Key Decisions Summary

| Decision | Alternative Considered | Why We Chose This |
|---|---|---|
| Session cookies over JWT | JWT in localStorage | HttpOnly cookies are XSS-immune, simpler for same-origin apps |
| Cursor pagination over offset | OFFSET/LIMIT | Constant performance regardless of page depth |
| Denormalized counters | COUNT(*) queries | Avoids expensive aggregations on every feed load |
| Cloudinary behind abstraction | Direct S3/R2 upload | One-file swap to change providers; free tier sufficient |
| Tailwind `@theme` (not inline) for colors | CSS-in-JS, Styled Components | Native CSS variables enable runtime theme switching |
| PostgreSQL array for imageUrls | Separate PostImage table | Simpler schema, no joins needed, sufficient for this use case |
| Client-side auth guards | Next.js middleware | iron-session requires async cookie decryption not available in Edge middleware |
