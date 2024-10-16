from app.extensions import db
from flask_login import UserMixin

class User(UserMixin, db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(50), nullable=False)
    user_email = db.Column(db.String(50), nullable=False, unique=True)
    user_password = db.Column(db.String(128), nullable=False)
    user_role = db.Column(db.String(20), nullable=True)

    def __init__(self, id=None, name=None, email=None, passwd=None, role=None):
        self.user_id = id
        self.user_name = name
        self.user_email = email
        self.user_role = role
        self.user_password = passwd

    def __repr__(self):
        return f'Passenger(passName: {self.pass_name})'
    
    def to_dict(self):
        return {
            'userId': self.user_id,
            'userName': self.user_name,
            'userEmail': self.user_email,
            'userRole': self.user_role
        }
