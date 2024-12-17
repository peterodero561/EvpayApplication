'''Adds data to the test database to help with testing routes
that require session'''

from app.models.user import User
from app.models.driver import Driver
from app.models.garage_manager import GarageManager
from app.extensions import db
from werkzeug.security import generate_password_hash


def setup_test_data():
    '''Adds data to the test database to help with testing routes
    that require session'''
    db.create_all()
    user_driver = User(
            email='testPeter@example.com',
            passwd=generate_password_hash('password1234'),
            name='testPeterDriver',
            role='driver',
            id=1
            )
    user_garage_manager = User(
            email='testSteve@example.com',
            name='testPeterManager',
            passwd=generate_password_hash('password1234'),
            role='garage manager',
            id=2
            )
    user = User(
            email='testMike@example.com',
            passwd=generate_password_hash('password1234'),
            name='testPetertUser',
            role='user',
            id=3
            )

    db.session.add(user_driver)
    db.session.add(user_garage_manager)
    db.session.add(user)
    db.session.commit()

    driver = Driver(
            email='testPeter@example.com',
            passwd=generate_password_hash('password1234'),
            name='testPeterDriver',
            number='0742325257',
            user_id=1
            )

    garage_manager = GarageManager(
            name='testPeterManager',
            email='testSteve@example.com',
            number='0742325257',
            user_id=2
            )
    db.session.add(driver)
    db.session.add(garage_manager)
    db.session.commit()
