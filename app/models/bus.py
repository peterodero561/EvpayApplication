from flask_sqlalchemy import SQLAlchemy
from models.db import db
from models.driver import Driver

class Bus(db.Model):
    busId = db.Column(db.Integer, primary_key=True)
    busModel = db.Column(db.String(50), nullable=False)
    busPlateNo = db.Column(db.String(50), nullable=False, unique=True)
    busBatteryModel = db.Column(db.String(50), nullable=False)
    busSeatsNo = db.Column(db.Integer, nullable=False)
    # Foreign key linking to Driver model, referenced as a string
    busDriverId = db.Column(db.Integer, db.ForeignKey('driver.driverId'), nullable=False)

    # Relationship to the Driver model
    driver = db.relationship('Driver', backref='buses')

    def __init__(self, id=None, model=None, plate=None, battery=None, seatsNo=None, driverId=None):
        self.busId = id
        self.busModel = model
        self.busPlateNo = plate
        self.busBatteryModel= battery
        self.busSeatsNo = seatsNo
        self.busDriverId = driverId

    def __repr__(self):
        return f'Bus(busPlate: {self.busPlateNo}, busModel: {self.busModel}, busDriverName: {self.driver.driverName})'
    
    def to_dict(self):
        return {
            'busId': self.busId,
            'busModel': self.busModel,
            'busPlateNo': self.busPlateNo,
            'busBatteryModel': self.busBatteryModel,
            'busSeatsNo': self.busSeatsNo,
            'busDriveId': self.busDriverId
        }
