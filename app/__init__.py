from flask import Flask
from .extensions import db, login_manager, migrate
from .blueprints.auth import auth
from .blueprints.profiles import profiles
from .blueprints.payments import payments

def create_app(config_file=None):
    app = Flask(__name__)
    
    if config_file:
        app.config.from_pyfile(config_file)

    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    app.register_blueprint(auth)
    app.register_blueprint(profiles)
    app.register_blueprint(payments, url_prefix='/payments')

    return app
