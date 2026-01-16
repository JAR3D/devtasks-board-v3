# DevTasks Board v3

DevTasks Board is a full-stack task board built with Next.js, MongoDB, and TypeScript. It includes a kanban-style board, filters, and CRUD APIs for tasks, plus server actions for auth and task mutations.

## Features

- Create, edit, delete tasks with title, description, tags, status, and priority
- Tasks are scoped per user (each user only sees their own tasks)
- Kanban-style board grouped by status (Backlog, In Progress, Done)
- Filter by status and priority, plus text search
- REST API for tasks powered by Next.js route handlers
- Server Actions for login/register/logout and task mutations (create/update/delete)
- UI and API route coverage with Jest + Testing Library
- Redux Toolkit state management with slices and selectors
- JWT authentication with login/register and HttpOnly cookies

## Tech Stack

- Next.js App Router
- React 19 + TypeScript
- MongoDB + Mongoose
- styled-components
- Jest + Testing Library
- Redux Toolkit + React Redux
- JSON Web Token (jsonwebtoken) + bcrypt
- Next.js Server Actions

## State Management

This project uses Redux Toolkit for client state:
- tasks slice: task list updates (set/upsert/remove)
- tasksUi slice: filters, modal state, delete error
- selectors: memoized filtered/grouped task views
- server actions handle auth and task mutations

## Project Structure

```
app/
  providers.tsx         # Redux Provider setup
  actions/authActions.ts # Server actions for auth
  api/auth/             # Auth routes (register/login/logout)
  api/tasks/            # REST routes for tasks
  tasks/actions/        # Server actions for task mutations
  tasks/ui/             # Task board UI components
  ui/AuthLanding.tsx    # Landing page auth UI
lib/
  auth.ts               # JWT + bcrypt helpers
  authServer.ts         # Server-side cookie auth
  db.ts                 # Mongo connection
  models/Task.ts        # Task schema
  models/User.ts        # User schema
  store/                # Redux store, slices, selectors
tests/
  api/                  # API route tests
  components/           # UI tests
```

## Getting Started

### Prerequisites

- Node.js 18+ (or newer)
- pnpm (recommended) or npm/yarn
- A MongoDB database (local or hosted)

### Environment Variables

Create a `.env.local` file at the project root:

```bash
MONGODB_URI=mongodb://localhost:27017/devtasks
JWT_SECRET=your_long_random_secret
```

### Install and Run

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` to login/register. After authentication, you can access `/tasks`.

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm test
pnpm test:watch
```

## API

Base URL (tasks): `/api/tasks`

All task routes require authentication via the HttpOnly `auth_token` cookie.

### GET /api/tasks

Returns all tasks sorted by newest first.

### POST /api/tasks

Create a new task.

```json
{
  "title": "Ship v1",
  "description": "Finish the release checklist",
  "status": "BACKLOG",
  "priority": "MEDIUM",
  "tags": ["release", "frontend"]
}
```

### GET /api/tasks/:id

Returns a single task by id.

### PATCH /api/tasks/:id

Update task fields. Any subset of fields is accepted.

```json
{
  "status": "IN_PROGRESS",
  "priority": "HIGH"
}
```

### DELETE /api/tasks/:id

Deletes a task.

## Auth API

Base URL: `/api/auth`

### POST /api/auth/register

Create a new user and set the auth cookie.

```json
{
  "email": "you@company.com",
  "password": "yourpassword"
}
```

### POST /api/auth/login

Login and set the auth cookie.

```json
{
  "email": "you@company.com",
  "password": "yourpassword"
}
```

### POST /api/auth/logout

Clears the auth cookie.

## Data Model

- userId: ObjectId (required, task owner)
- title: string (required)
- description: string
- status: BACKLOG | IN_PROGRESS | DONE
- priority: LOW | MEDIUM | HIGH
- tags: string[]
- createdAt, updatedAt

## Tests

```bash
pnpm test
```

## Notes

- This project assumes a running MongoDB instance defined by `MONGODB_URI`.
- For production, configure a hosted MongoDB cluster and set the environment variable in your deployment target.
