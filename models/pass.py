from flask_sqlalchemy import SQLAlchemy
from models.db import db

class Passenger(db.Model):
    pass_id = db.Column(db.Integer, primary_key=True)
    pass_name = db.Column(db.String(50), nullable=False)
    pass_email = db.Column(db.String(50), nullable=False, unique=True)

    def __init__(self, id=None, name=None, email=None):
        self.pass_id = id
        self.pass_name = name
        self.pass_email = email

    def __repr__(self):
        return f'Passenger(passName: {self.pass_name})'
    
    def to_dict(self):
        return {
            'passId': self.pass_id,
            'passName': self.pass_name,
            'passEmail': self.pass_email
        }