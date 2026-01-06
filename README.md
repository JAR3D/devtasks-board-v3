# DevTasks Board v3

DevTasks Board is a full-stack task board built with Next.js, MongoDB, and TypeScript. It includes a kanban-style board, filters, and CRUD APIs for tasks.

## Features

- Create, edit, delete tasks with title, description, tags, status, and priority
- Kanban-style board grouped by status (Backlog, In Progress, Done)
- Filter by status and priority, plus text search
- REST API for tasks powered by Next.js route handlers
- UI and API route coverage with Jest + Testing Library

## Tech Stack

- Next.js App Router
- React 19 + TypeScript
- MongoDB + Mongoose
- styled-components
- Jest + Testing Library

## Project Structure

```
app/
  api/tasks/            # REST routes for tasks
  tasks/ui/             # Task board UI components
lib/
  db.ts                 # Mongo connection
  models/Task.ts         # Task schema
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
```

### Install and Run

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` and navigate to `/tasks`.

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

Base URL: `/api/tasks`

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

## Data Model

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
