'''Class Activity'''
from datetime import datetime
from app.extensions import db
from flask_sqlalchemy import SQLAlchemy

class Activity(db.Model):
    '''Class that creates the activity table in database'''
    __tablename__ = 'activities'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    description = db.Column(db.String(256), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "description": self.description,
            "timestamp": self.timestamp
        }