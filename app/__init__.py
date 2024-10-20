from flask import Flask
from .extensions import db, login_manager, migrate
from .blueprints.auth.routes import auth_bp
# from .blueprints.profiles.routes import profiles_bp
# from .blueprints.payments.routes import payments_bp
from app.config_app import Config


def create_app(config_name='config_app.py'):
    app = Flask(__name__)
    # configuring app with the database
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    # app.register_blueprint(profiles_bp, url_prefix='/auth')
    # app.register_blueprint(payments_bp, url_prefix='/auth')

    return app