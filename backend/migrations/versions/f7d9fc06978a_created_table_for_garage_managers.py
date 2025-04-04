"""Created table for garage managers

Revision ID: f7d9fc06978a
Revises: e994167716b0
Create Date: 2024-11-11 15:27:35.707724

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f7d9fc06978a'
down_revision = 'e994167716b0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('garages',
    sa.Column('garId', sa.Integer(), nullable=False),
    sa.Column('garName', sa.String(length=50), nullable=False),
    sa.Column('garLocation', sa.String(length=50), nullable=False),
    sa.Column('garServices', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('garId'),
    sa.UniqueConstraint('garLocation'),
    sa.UniqueConstraint('garName')
    )
    op.create_table('garManagers',
    sa.Column('managerId', sa.Integer(), nullable=False),
    sa.Column('managerName', sa.String(length=50), nullable=False),
    sa.Column('managerEmail', sa.String(length=50), nullable=False),
    sa.Column('managerNo', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.user_id'], ),
    sa.PrimaryKeyConstraint('managerId')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('garManagers')
    op.drop_table('garages')
    # ### end Alembic commands ###
