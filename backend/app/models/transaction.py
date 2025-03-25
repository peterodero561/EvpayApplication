"""Class to store transaction details"""

from app.extensions import db
from datetime import datetime


class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    checkout_request_id = db.Column(db.String(255), unique=True, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    phone_number = db.Column(db.String(20))
    status = db.Column(db.String(20), default='pending')
    result_code = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, onupdate=datetime.now)