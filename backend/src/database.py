"""Database connection and session management module.

This module provides async SQLAlchemy engine and session management
for the Todo application using PostgreSQL with asyncpg driver.
"""

import os
from typing import AsyncGenerator

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

# Load environment variables
load_dotenv()

# Database configuration
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@localhost:5432/todoapp"
)

# Create async engine
# echo=True enables SQL logging in development
engine = create_async_engine(
    DATABASE_URL,
    echo=os.getenv("SQL_ECHO", "false").lower() == "true",
    future=True,
    pool_size=10,
    max_overflow=20,
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for FastAPI routes to get database session.

    Yields:
        AsyncSession: Database session that will be automatically closed.

    Example:
        @app.get("/todos")
        async def list_todos(db: AsyncSession = Depends(get_db)):
            result = await db.execute(select(Todo))
            return result.scalars().all()
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """Initialize database tables.

    Creates all tables defined in SQLAlchemy models.
    This is useful for testing and development.
    In production, use Alembic migrations instead.
    """
    from backend.src.models import Base  # Import here to avoid circular imports

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db() -> None:
    """Close database engine and dispose of connection pool.

    Should be called during application shutdown.
    """
    await engine.dispose()
