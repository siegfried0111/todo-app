# Database Setup Guide

## Using Local PostgreSQL 17

This project uses your local PostgreSQL 17 installation at `D:\PostgreSQL\17`.

## Initial Setup

### 1. Create Database

Open **pgAdmin 4** or use **psql** command line:

```bash
# Using psql (from D:\PostgreSQL\17\bin\psql.exe)
psql -U postgres

# Then run:
CREATE DATABASE todo_db;

# Verify:
\l
```

Or using **SQL Query** in pgAdmin:
```sql
CREATE DATABASE todo_db;
```

### 2. Update Backend Configuration

Edit `backend/.env` and replace `YOUR_PASSWORD` with your actual PostgreSQL password:

```env
DATABASE_URL=postgresql+asyncpg://postgres:your_actual_password@localhost:5432/todo_db
```

### 3. Run Database Migrations

```bash
cd backend

# Run Alembic migrations to create the Todos table
uv run alembic upgrade head
```

### 4. Verify Database Connection

```bash
# Test connection using psql
psql -U postgres -d todo_db

# List tables (should see "Todos" table)
\dt

# Check table structure
\d "Todos"

# Exit
\q
```

## Database Schema

The migration creates a `Todos` table with:

```sql
CREATE TABLE "Todos" (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(200) NOT NULL,
    "Content" TEXT DEFAULT '',
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "CompletedAt" TIMESTAMP WITH TIME ZONE,
    "IsCompleted" BOOLEAN GENERATED ALWAYS AS ("CompletedAt" IS NOT NULL) STORED,
    CONSTRAINT "title_not_empty" CHECK (LENGTH(TRIM("Title")) > 0)
);

-- Indexes
CREATE INDEX "idx_todos_created_at" ON "Todos"("CreatedAt" DESC);
CREATE INDEX "idx_todos_is_completed" ON "Todos"("IsCompleted");
```

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL service is running
- Check Windows Services: `PostgreSQL 17` should be "Running"
- Or start manually: `pg_ctl -D "D:\PostgreSQL\17\data" start`

### Authentication Failed
- Double-check password in `backend/.env`
- Verify PostgreSQL user exists: `psql -U postgres`

### Port Already in Use
- Default port is 5432
- Check if another service is using it: `netstat -ano | findstr :5432`
- Update `DATABASE_URL` if PostgreSQL is on a different port

### Database Doesn't Exist
- Run: `CREATE DATABASE todo_db;` in psql or pgAdmin
- Then run migrations: `uv run alembic upgrade head`

## Reset Database

If you need to start fresh:

```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS todo_db;"
psql -U postgres -c "CREATE DATABASE todo_db;"

# Run migrations again
cd backend
uv run alembic upgrade head
```

## PostgreSQL Tools

- **pgAdmin 4**: GUI tool (likely installed with PostgreSQL)
  - URL: http://localhost:16543 (or check your installation)

- **psql**: Command-line tool
  - Location: `D:\PostgreSQL\17\bin\psql.exe`
  - Add to PATH for easier access

## Connection String Format

```
postgresql+asyncpg://[user]:[password]@[host]:[port]/[database]

Example:
postgresql+asyncpg://postgres:mypassword@localhost:5432/todo_db
```

- **Driver**: `asyncpg` (async PostgreSQL driver for Python)
- **User**: `postgres` (default superuser)
- **Host**: `localhost` (local machine)
- **Port**: `5432` (PostgreSQL default)
- **Database**: `todo_db` (our application database)
