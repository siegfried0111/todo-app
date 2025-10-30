"""Pytest configuration and fixtures.

This module provides shared fixtures for testing the Todo API,
including database session management and test client setup.
"""

import asyncio
from typing import AsyncGenerator, Generator

import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from backend.src.database import get_db
from backend.src.main import app
from backend.src.models import Base

# Test database URL (use in-memory SQLite for fast tests)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

# Create test engine
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=False,  # Disable SQL logging in tests
    future=True,
)

# Create test session factory
TestSessionLocal = async_sessionmaker(
    test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    """Create event loop for async tests.

    Pytest-asyncio requires a session-scoped event loop fixture
    to run async tests efficiently.

    Yields:
        asyncio.AbstractEventLoop: Event loop for running async tests.
    """
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Create a clean database session for each test.

    This fixture:
    1. Creates all tables before the test
    2. Provides a database session
    3. Rolls back all changes after the test
    4. Drops all tables to ensure clean state

    Yields:
        AsyncSession: Database session for testing.

    Example:
        async def test_create_todo(db_session: AsyncSession):
            todo = Todo(Title="Test", Content="Test content")
            db_session.add(todo)
            await db_session.commit()
            assert todo.Id is not None
    """
    # Create tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Create session
    async with TestSessionLocal() as session:
        try:
            yield session
        finally:
            await session.rollback()
            await session.close()

    # Drop tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def async_client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Create an async HTTP client for testing API endpoints.

    This fixture overrides the database dependency to use the test database.

    Args:
        db_session: Test database session fixture.

    Yields:
        AsyncClient: HTTP client for making API requests.

    Example:
        async def test_list_todos(async_client: AsyncClient):
            response = await async_client.get("/api/todos")
            assert response.status_code == 200
    """

    async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
        """Override the database dependency with test database."""
        yield db_session

    # Override dependency
    app.dependency_overrides[get_db] = override_get_db

    # Create client
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

    # Clean up
    app.dependency_overrides.clear()


# Test utilities


def assert_todo_response(data: dict, title: str, content: str = "") -> None:
    """Assert that a todo response has expected fields and values.

    Args:
        data: Response data dictionary.
        title: Expected title.
        content: Expected content (default: empty string).

    Example:
        response = await async_client.post("/api/todos", json={"title": "Test"})
        assert_todo_response(response.json(), title="Test")
    """
    assert "id" in data
    assert data["title"] == title
    assert data["content"] == content
    assert "created_at" in data
    assert "is_completed" in data
    assert data["is_completed"] is False
    assert data["completed_at"] is None


def assert_validation_error(data: dict, field: str, error_type: str) -> None:
    """Assert that a validation error response contains expected error.

    Args:
        data: Response data dictionary.
        field: Field name that failed validation.
        error_type: Expected error type.

    Example:
        response = await async_client.post("/api/todos", json={"title": ""})
        assert response.status_code == 422
        assert_validation_error(response.json(), field="title", error_type="string_too_short")
    """
    assert "detail" in data
    errors = data["detail"]
    assert isinstance(errors, list)
    assert len(errors) > 0

    # Find error for specified field
    field_error = next(
        (err for err in errors if field in str(err.get("loc", []))),
        None
    )
    assert field_error is not None, f"No validation error found for field: {field}"
    assert error_type in field_error.get("type", ""), \
        f"Expected error type '{error_type}' not found in {field_error}"
