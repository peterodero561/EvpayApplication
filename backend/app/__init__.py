from flask import Flask
from flask_cors import CORS
from .extensions import db, login_manager, migrate
from .blueprints.auth.auth_routes import auth_bp
from .blueprints.profiles.profile_routes import profiles_bp
from .blueprints.payments.payment_routes import payments_bp
from app.config_app import Config


def create_app(config_name='config'):
    app = Flask(__name__)
    # configuring app with the database
    from app.config_app import config
    app.config.from_object(config[config_name])
    app.config['UPLOAD_FOLDER'] = '/home/peterdetech/alx/EvpayApplication/app/static/images/profiles'

    # Enable Cross-Origin Resorce Shaing (CORS) for frontend communication
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(profiles_bp, url_prefix='/api/profiles')
    app.register_blueprint(payments_bp, url_prefix='/api/payments')

    return app