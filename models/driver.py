from flask_sqlalchemy import SQLAlchemy
from models.db import db

class Driver(db.Model):
    driverId = db.Column(db.Integer, primary_key=True)
    driverNo = db.Column(db.String(20), nullable=True)
    driverName = db.Column(db.String(50), nullable=False)
    driverEmail = db.Column(db.String(50), nullable=False, unique=True)

    def __init__(self, Name, email, Number, id=None):
        self.driverId = id
        self.driverEmail = email
        self.driverName = Name
        self.driverNo = Number

    def __repr__(self):
        return f'Driver(driverName:{self.driverName})'
    
    def to_dict(self):
        return {
            'driverId': self.driverId,
            'driverName': self.driverName,
            'driverEmail': self.driverEmail,
            'driverNumber': self.driverNo
        }
