# To-Do App

A full-stack to-do app: a GraphQL backend, a React web app and a React Native (Expo) mobile app. Each user has their own private task list.

## Live links

- Web app (Vercel): https://todo-app-beige-six-38.vercel.app/
- Backend (Render): https://todo-app-9wan.onrender.com

**Note:** The backend is hosted on Render's free tier, which spins down when idle. The first request after a pause can take up to a minute, so the web and mobile apps may take a while on first load. Data is stored in memory, so all accounts and tasks are also reset whenever the server restarts, including after it wakes from idle. If the tasks screen shows "You must be logged in", log out and sign up again.

## Project structure

- `backend/`: Node.js + Apollo Server (GraphQL), in-memory data
- `web/`: React + Vite + Tailwind CSS + Apollo Client
- `mobile/`: React Native + Expo Router + Apollo Client

## Features

- Sign up, log in and log out
- Create, view, complete and delete tasks
- Tasks are scoped to the logged-in user

## Setup

The `.env` files are git-ignored, so the web and mobile apps each need one to know which backend to call. By default, point them at the deployed backend. To use a local backend, run it first and use `http://localhost:4000` (web) or `http://YOUR_COMPUTER_IP:4000` (mobile).

### Backend

```bash
cd backend
npm install
npm run codegen
npm run dev
```

The server runs at `http://localhost:4000`.

### Web

```bash
cd web
npm install
npm run codegen
```

Create `web/.env.local` with the backend URL:

```
VITE_API_URL=https://todo-app-9wan.onrender.com
```

Then start the app:

```bash
npm run dev
```

To use a local backend instead, change the value to `http://localhost:4000` and restart `npm run dev`.

### Mobile

```bash
cd mobile
npm install
npm run codegen
```

Create `mobile/.env` with the backend URL:

```
EXPO_PUBLIC_API_URL=https://todo-app-9wan.onrender.com
```

Then start the app:

```bash
npm run start
```

Scan the QR code with the Expo Go app on your phone, or press `a` for an Android emulator or `i` for the iOS simulator.

To use a local backend instead, change the value to `http://YOUR_COMPUTER_IP:4000` and restart Expo with `npm run start -- -c`. The phone and computer must be on the same Wi-Fi. To find your IP, run `ipconfig` (Windows) or `ipconfig getifaddr en0` (Mac) and use the IPv4 address. `localhost` won't work, because on a phone or emulator it points at the device itself.

Note: the iOS simulator needs a Mac. I developed on Windows, so I tested with an Android emulator via Android Studio.

## Architecture decisions

### GraphQL schema first, with code generation

There is a single schema file, `backend/schema.graphql`, and all three apps run GraphQL Code Generator against it:

- **Backend:** generates the `Resolvers` type, so every resolver's arguments and return values are type-checked against the schema.
- **Web and mobile:** use the `client` preset. Queries and mutations are written with the generated `graphql()` function, so `useQuery`, `useMutation` and their variables are fully typed. Types like `Task` are derived from the query result, so none are written by hand.

If the schema changes, TypeScript shows an error everywhere that needs updating, and the apps can't drift from the API.

### Apollo Client cache as the source of truth for the UI

Web and mobile use the same Apollo `InMemoryCache` setup. Instead of refetching the task list after every change, each mutation updates the cache directly, so the UI updates immediately and the app makes fewer network requests.

- **Add:** the mutation's `update` function appends the new task to the cached `allTasks` list.
- **Delete:** the `update` function evicts the task from the cache and runs `cache.gc()`, which removes it from the list and cleans up the leftover reference.
- **Toggle completed:** this needs no extra code. Each task is cached by its type and `id`, and the update mutation returns the task's `id`, `text` and `completed`, so Apollo updates the cached task and every component showing it re-renders.
- **List merging:** a `merge` function on `allTasks` makes it explicit that a fresh server result replaces the cached list rather than being combined with it.
- **Logout:** the cache is cleared with `client.clearStore()`, so a second user on the same device never sees the previous user's tasks.

The trade-off is that the cache lives in memory only. It starts empty when the app is reopened, and nothing is available offline.

### Dummy auth with server-side sessions

The task asks for dummy auth, so I kept it simple but still made it work end to end:

- **Sessions:** `signup` and `login` create a random token (a UUID) and store it in a server-side `Map` of token to user ID. The server rejects duplicate emails on signup.
- **Bearer token:** the apps send the token with every request as `Authorization: Bearer <token>`. The Apollo link attaches it on both web and mobile, and the server resolves it to a user for each request.
- **User-scoped data:** every task stores a `userId`. Each task resolver first calls `requireUser`, which throws an `UNAUTHENTICATED` error when there is no valid session, and then filters or checks by that ID. A user can't read, update or delete another user's tasks.
- **No sensitive fields exposed:** resolvers return a `PublicUser` without the password, and `userId` isn't part of the GraphQL `Task` type.

Each app stores the token in the way that suits its platform:

- **Web:** `localStorage`. Reading it is synchronous, so `ProtectedRoute` and `PublicOnlyRoute` can check it during render and redirect immediately. Logging out calls the `logout` mutation, which deletes the session on the server, then clears the token.
- **Mobile:** `expo-secure-store`, which uses the device's secure storage. Reading it is async, so an `AuthContext` loads the token once at startup and exposes an `isLoading` flag, which prevents a flash of the login screen for users who are already logged in. Expo Router's `Stack.Protected` guards then show either the tasks screen or the login and signup screens. Logging out clears the token on the device and the Apollo cache. It does not call the `logout` mutation, so the session stays valid on the server (see trade-offs below).

Trade-offs:

- Passwords are stored in plain text and sessions never expire. A production version would hash passwords (bcrypt or argon2) and use expiring tokens.
- Mobile logout only clears the token on the device. Unlike web, it doesn't call the `logout` mutation, so the server session stays valid until the server restarts. The fix is to call the `LOGOUT` mutation in the mobile `LogoutButton` before clearing the token, as web does. I didn't have time to make that change.

### Mobile navigation: Expo Router (built on React Navigation)

The mobile app uses Expo Router, which is built on top of React Navigation, so it still uses React Navigation underneath. I chose it because routes are files (`src/app/index.tsx`, `login.tsx`, `signup.tsx`), which keeps navigation simple and mirrors the pages in the web app.

- **Route guards:** `Stack.Protected` plays the same role as `ProtectedRoute` and `PublicOnlyRoute` on web. When the user is logged in, only the tasks screen is reachable. When logged out, only login and signup are.
- **No manual redirects:** `signIn` and `signOut` update the auth state, the guards change, and Expo Router moves the user to the right screen. The screens never call `navigate`.
- **Startup:** the layout renders nothing until `AuthContext` has read the saved token, so the wrong screen never flashes.
- **Header:** the logout button is set as `headerRight` on the tasks screen only.

## AWS deployment plan

The backend is currently live on Render. This is how I would host it on AWS instead.

**Region:** Asia Pacific (Malaysia), `ap-southeast-5` is the closest. It has to be enabled in the AWS console first. Singapore (`ap-southeast-1`) is the fallback.

**Architecture**

```
Web (Vercel) / Mobile (Expo)
          │ HTTPS
      CloudFront
          │ HTTP :4000
 EC2 t3.micro (Node.js + PM2)
```

**Why EC2 and not Lambda:** the server keeps users, sessions and tasks in memory, so it needs one long-running process. Lambda would give each instance its own empty state. Moving to Lambda would need a database such as DynamoDB first.

**Steps**

1. Launch an EC2 `t3.micro` (Amazon Linux 2023). Security group: SSH from my IP only, port 4000 open.
2. Install Node.js, clone the repo, then run `npm install`, `npm run codegen` and build the backend.
3. Run the server with PM2, and run `pm2 startup` and `pm2 save` so it restarts after a crash or reboot.
4. Create a CloudFront distribution with the instance's public DNS name as the origin (HTTP, port 4000). Allow POST requests, disable caching, and forward all headers so `Authorization` reaches the server. CloudFront provides HTTPS on a free `*.cloudfront.net` domain, which is needed because the Vercel site is HTTPS and browsers block calls to plain-HTTP APIs.
5. Set `VITE_API_URL` in Vercel and `EXPO_PUBLIC_API_URL` in the mobile app to the CloudFront URL.

**Estimated cost (per month)**

Calculated using https://calculator.aws/. Calculator figures are in USD, converted at about RM4.1 per US$1.

| Item                  | Cost                                   |
| --------------------- | -------------------------------------- |
| EC2 `t3.micro` (24/7) | ~RM36                                  |
| Public IPv4 address   | ~RM15                                  |
| 8 GB EBS volume       | ~RM4                                   |
| CloudFront            | RM0 (within the always-free allowance) |
| **Total**             | **~RM55**                              |

A new AWS account's free-plan credits would cover the first months.

## Time taken

- Backend: 89 minutes
- Backend Deployment: 8 minutes
- Web: 88 minutes
- Web Deployment: 6 minutes
- Mobile: 125 minutes
- AWS deployment plan: 38 minutes
