# Task Manager

A lightweight full-stack task management application built with Next.js, Prisma, and PostgreSQL.

## Features

- **CRUD Operations**: Create, read, update, and delete tasks
- **Task Properties**: Each task has title, description, status (todo/in-progress/done), priority (low/medium/high), and creation date
- **Filtering**: Filter tasks by status and priority without page reload
- **Inline Updates**: Change task status directly from the list
- **Validation**: Input validation on both client and server
- **Error Handling**: Proper HTTP status codes and error messages
- **Auth (Bonus)**: Simple API key authentication via `x-api-key` header

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Inline styles (minimal, responsive)
- **Runtime**: Node.js with Next.js dev server

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskdb"
```

### Installation

```bash
npm install
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

| Method | Endpoint                         | Description                      |
| ------ | -------------------------------- | -------------------------------- |
| GET    | `/api/tasks?status=&priority=` | List tasks with optional filters |
| POST   | `/api/tasks`                   | Create new task                  |
| PATCH  | `/api/tasks/:id`               | Update task fields               |
| DELETE | `/api/tasks/:id`               | Delete task                      |

## Trade-offs & Decisions

1. **Inline Styles**: Used inline styles instead of Tailwind/CSS modules to keep the codebase minimal and focused on functionality.
2. **Simple Auth**: Implemented a basic API key header check rather than JWT sessions — sufficient for a demo and easy to extend.
3. **No Tests**: Skipped unit tests to focus on core features within the time constraint. Would add Jest + React Testing Library with more time.
4. **Prisma Driver Adapter**: Used `@prisma/adapter-pg` with `pg` Pool for PostgreSQL connection, as required by Prisma v7.
5. **No Drag-and-Drop**: Did not implement the bonus drag-and-drop feature to prioritize core CRUD and filtering functionality.

## What I'd Improve With More Time

- Add proper test coverage (API routes + components)
- Implement optimistic UI updates for smoother UX
- Add loading states and better error messages in the UI
- Add pagination for large task lists
- Implement proper session-based authentication
- Add drag-and-drop task reordering
