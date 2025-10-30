"""FastAPI application entry point.

This module initializes the FastAPI application with CORS middleware
and registers all API routes.
"""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.src.database import close_db, init_db

# Create FastAPI app
app = FastAPI(
    title="Todo API",
    description="API for managing todo items with CRUD operations",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
# In development, allow all origins. In production, restrict to specific origins.
CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:3000"  # Vite default, CRA default
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


@app.on_event("startup")
async def startup_event() -> None:
    """Initialize database on application startup.

    In development, this creates tables if they don't exist.
    In production, use Alembic migrations instead.
    """
    # Only auto-create tables in development
    if os.getenv("ENVIRONMENT", "development") == "development":
        await init_db()


@app.on_event("shutdown")
async def shutdown_event() -> None:
    """Close database connections on application shutdown."""
    await close_db()


@app.get("/", tags=["health"])
async def root() -> dict[str, str]:
    """Health check endpoint.

    Returns:
        dict: Simple health check response.
    """
    return {"status": "ok", "message": "Todo API is running"}


@app.get("/health", tags=["health"])
async def health_check() -> dict[str, str]:
    """Health check endpoint for monitoring.

    Returns:
        dict: Health status of the API.
    """
    return {"status": "healthy"}


# TODO: Register API routers here
# Example:
# from backend.src.api.routes import todos
# app.include_router(todos.router, prefix="/api", tags=["todos"])
