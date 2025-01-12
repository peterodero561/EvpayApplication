"""added s attribute profile pic for user

Revision ID: 72ac8cfc3cdb
Revises: 1746925b8389
Create Date: 2024-10-29 10:20:53.324977

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '72ac8cfc3cdb'
down_revision = '1746925b8389'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_profile_pic', sa.String(length=100), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('user_profile_pic')

    # ### end Alembic commands ###