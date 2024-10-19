"""import Bus class in defination of Driver class

Revision ID: 3e1714d75fcc
Revises: 68aa58aee811
Create Date: 2024-10-19 12:53:05.006984

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3e1714d75fcc'
down_revision = '68aa58aee811'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('buses',
    sa.Column('busId', sa.Integer(), nullable=False),
    sa.Column('busModel', sa.String(length=50), nullable=False),
    sa.Column('busPlateNo', sa.String(length=50), nullable=False),
    sa.Column('busBatteryModel', sa.String(length=50), nullable=False),
    sa.Column('busSeatsNo', sa.Integer(), nullable=False),
    sa.Column('busDriverId', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['busDriverId'], ['drivers.driver_id'], ),
    sa.PrimaryKeyConstraint('busId'),
    sa.UniqueConstraint('busPlateNo')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('buses')
    # ### end Alembic commands ###
