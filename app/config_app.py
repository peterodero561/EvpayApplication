'''Class for the database instance to be used'''

class Config:
    SECRET_KEY = 'peterdev1234'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://peterdev:Peter0dero!@localhost/evpay_db'
