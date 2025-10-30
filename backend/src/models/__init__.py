"""SQLAlchemy models package.

This module exports the declarative base and all model classes.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models.

    All model classes should inherit from this base class.
    Provides common functionality and configuration for all models.
    """

    pass


# Export Base for use in other modules
__all__ = ["Base"]
