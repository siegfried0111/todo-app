"""create todos table

Revision ID: 001
Revises:
Create Date: 2025-10-30

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create Todos table with PascalCase naming"""
    op.create_table(
        'Todos',
        sa.Column('Id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('Title', sa.String(length=200), nullable=False),
        sa.Column('Content', sa.Text(), nullable=False, server_default=''),
        sa.Column('CreatedAt', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('CompletedAt', sa.DateTime(timezone=True), nullable=True),
        sa.Column('IsCompleted', sa.Boolean(), sa.Computed('"CompletedAt" IS NOT NULL', persisted=True)),
        sa.CheckConstraint('LENGTH(TRIM("Title")) > 0', name='title_not_empty'),
        sa.PrimaryKeyConstraint('Id')
    )

    # Create indexes
    op.create_index('idx_todos_created_at', 'Todos', ['CreatedAt'], unique=False, postgresql_using='btree', postgresql_ops={'CreatedAt': 'DESC'})
    op.create_index('idx_todos_is_completed', 'Todos', ['IsCompleted'], unique=False, postgresql_using='btree')


def downgrade() -> None:
    """Drop Todos table and indexes"""
    op.drop_index('idx_todos_is_completed', table_name='Todos')
    op.drop_index('idx_todos_created_at', table_name='Todos')
    op.drop_table('Todos')
