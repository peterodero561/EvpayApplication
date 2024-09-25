from flask_sqlalchemy import SQLAlchemy
import json
from models.db import db

class Garage(db.Model):
    garId = db.Column(db.Integer, primary_key=True)
    garName = db.Column(db.String(50), nullable=False, unique=True)
    garLocation = db.Column(db.String(50), nullable=False, unique=True)
    garServices = db.Column(db.Text, nullable=False)
    garManagerName = db.Column(db.String(50), nullable=False)
    garManagerEmail = db.Column(db.String(50), nullable=False)
    garManagerNo = db.Column(db.Integer, nullable=False)

    def __init__(self, id=None, garName=None, garLocation=None, garServices=None, managerName=None, managerEmail=None, managerNo=None):
        self.garId = id
        self.garName = garName
        self.garLocation = garLocation
        self.garServices = json.dumps(garServices)
        self.garManagerName = managerName
        self.garManagerEmail = managerEmail
        self.garManagerNo = managerNo

    def __repr__(self):
        return f'Garage(garageName={self.garName}, garageManage: {self.garManagerName})'
    
    def to_dict(self):
        return {
            'garId': self.garId,
            'garName': self.garName,
            'garLocation': self.garLocation,
            'garServices': json.loads(self.garServices),
            'garManagerName': self.garManagerName,
            'garManagerEmail': self.garManagerEmail,
            'garManagerNo': self.garManagerNo
        }