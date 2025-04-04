# Neccesary imports
from flask import Blueprint, render_template, redirect, url_for, flash, request, session, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.user import User
from app.models.bus import Bus
from app.models.driver import Driver
from app.models.garage_manager import GarageManager
from app.models.garage import Garage
from app.models.activity import Activity
from app.extensions import db, login_manager
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import re 

auth_bp = Blueprint('auth', __name__, template_folder='templates')

#route to check session of a user
@auth_bp.route('/check_session', methods=['GET'])
@jwt_required()
def check_session():
    user = get_jwt_identity()
    return jsonify({'status': 'success', 'user': user}), 200

# route for LOGIN 
@auth_bp.route('/login_pass', strict_slashes=False, methods=['POST'])
def login_pass():
    # if current_user.is_authenticated:
    #     return redirect(url_for('home'))

    msg = {}
    if request.method == "POST":
        # retrive email & password from form data
        data = request.get_json() or request.form
        email = data.get('email')
        passwd = data.get('password')

        # if the email and password are not in form or JSON take look in querry parameters
        if not email or not passwd:
            email = request.args.get('email')
            passwd = request.args.get('password')

        # Querry the database
        account = User.query.filter_by(user_email=email).first()

        # confirm if the password matches
        if account and check_password_hash(account.user_password, passwd):
            login_user(account)
            session['loggedin'] = True
            session['id'] = account.user_id
            session['name'] = account.user_name
            session['email'] = account.user_email
            # genarate jwt token
            token = create_access_token(identity=str(account.user_id), additional_claims={'email': account.user_email})

            msg = {'status': 'success',
                   'message': 'Logged in successfully!',
                   'role': account.user_role,
                   'user': account.to_dict(),
                   'token': token
                }
            new_activity = Activity(user_id=account.user_id, description="Login")
            db.session.add(new_activity)
            db.session.commit()
            return jsonify(msg), 200
        elif account:
            msg = {'status': 'error', 'message': 'Incorrect Password'}
            return jsonify(msg), 400
        else:
            msg = {'status': 'error', 'message': 'Account does not exist'}
            return jsonify(msg), 400
    
    return jsonify({'status': 'error', 'message': 'Invalid request'}), 400

# route to serve the sign up page
@auth_bp.route('/register', strict_slashes = False, methods=['GET'])
def register():
    return render_template('signup.html')

# route to serve the home page
@auth_bp.route('/', strict_slashes=False, methods=['GET'])
@auth_bp.route('/home', strict_slashes=False, methods=['GET'])
def home():
    return render_template('home.html')

# route to serve login page
@auth_bp.route('/login', strict_slashes=False, methods=['GET'])
def login():
    return render_template('login.html')

# route for logout
@auth_bp.route('/logout', strict_slashes=False)
@login_required
def logout():
    logout_user()
    msg = 'Logout successful'
    return redirect(url_for('auth.login'))

# defining register logi
def register_logic(name, email, passwd, role):
    '''function to register a user'''
    if not name or not email or not passwd:
        return None, {'status': 'error', 'message': 'Missing important important details', 'code': 400}
    # check if ther is an existing account
    existing_email = User.query.filter_by(user_email=email).first()
    if existing_email:
        return None, {'status': 'error', 'message': 'An account with this email already exists', 'code': 403}
    
    # check if email is valid
    if not re.match(r'[^@]+@[^@]+\.[^@]+', email):
        return None, {'status': 'error', 'message': 'Invalid email address!', 'code': 403}
    
    # check if name contains valid characters
    if not re.match(r'[A-Za-z0-9]+', name):
        return None, {'status': 'error', 'message': 'Name must contain only characters and numbers!', 'code': 403}
    
    # since eveything checks out enter data
    try:
        new_user = User(name=name, email=email, passwd=generate_password_hash(passwd), role=role)
        db.session.add(new_user)
        db.session.commit()
        return new_user, {'status': 'success', 'message': 'You have successfully registered. Procced to Sign In', 'code': 200}
    except IntegrityError:
        db.session.rollback()
        return None, {'status': 'error', 'message': 'An Intergity error occurred during registration. Please try again, with unique details', 'code': 403}
    

# route for registering a user 
@auth_bp.route('/register_user', strict_slashes=False, methods=['POST'])
def register_user():
    '''method to record a user in a table'''
    msg = {}
    if request.method == 'POST':
        # get data from JSON data
        try:
            data = request.get_json()
            if not data:
                raise ValueError("No JSON data received")
            name = data['name']
            passwd = data['password']
            email = data['email']
            role = 'user'
        except:
            return jsonify({'status': 'error', 'message': 'Missing important important details'}), 400

        new_user, msg = register_logic(name, email, passwd, role)

        return jsonify(msg), msg['code']

    return jsonify({'status': 'error', 'message': 'Invalid request'}), 400

# router for registering a Driver
@auth_bp.route('/register_driver', methods=['POST'], strict_slashes=False)
def register_driver():
    '''method to record a driver in a table'''
    if request.method == 'POST':
        # Get data from JSON data
        try:
            data = request.get_json()
            name = data['name']
            email = data['email']
            passwd = data['password']
            no = data['number']
            role = 'driver'
        except:
            return jsonify({'status': 'error', 'message': 'Missing important details'}), 400

        # register driver first as a user
        user, msg = register_logic(name, email, passwd, role)

        # check if the user creation was success
        if msg['status'] == 'error':
            return jsonify(msg), msg['code']

        # create driver record
        try:
            new_driver = Driver(name=name, email=email, number=no, passwd=passwd, user_id=user.user_id)
            db.session.add(new_driver)
            db.session.commit()
            return jsonify({'status': 'success', 'message': 'You have successfully registered. Sign In'}), 200
        except IntegrityError:
            db.session.rollback()
            return jsonify({'status': 'error', 'message': 'An Intergity error occurred during registration. Please try again, with unique details'}), 403

    return jsonify({'status': 'error', 'message': 'Invalid request'}), 400


@auth_bp.route('/register_manager', methods = ['POST'])
def register_manager():
    '''Registers a garage manager'''
    if request.method == 'POST':
        # get data from JSON data
        try:
            data = request.get_json()
            name = data['name']
            email = data['email']
            passwd = data['password']
            no = data['number']
            role = 'garage manager'
        except:
            return jsonify({'status': 'error', 'message': 'Missing important details'}), 400
        
        # register the manager as a user first
        user, msg = register_logic(name, email, passwd, role)

        # check if the manager was successfully created as user
        if msg['status'] == 'error':
            return jsonify(msg), msg['code']
        
        # since the manager is now a user create manager record
        try:
            new_garage_manager = GarageManager(name=name, email=email, number=no, user_id=user.user_id)
            db.session.add(new_garage_manager)
            db.session.commit()
            return jsonify({'status': 'success', 'message': 'You have successfully registered. Sign In'}), 200
        except IntegrityError:
            db.session.rollback()
            return jsonify({'status': 'error', 'message': 'An Intergity error occurred during registration. Please try again, with unique details'}), 403
    
    return jsonify({'status': 'error', 'message': 'Invalid request'}), 400
        

@auth_bp.route('/register_bus', strict_slashes=False, methods=['POST'])
def register_bus():
    '''methods to record a bus in the table'''
    if request.method == 'POST':
        try:
            data = request.get_json()
            bus_model = data['busModel']
            plate = data['plate']
            battery_model = data['batteryModel']
            battery_company = data['batteryCompany']
            seats = data['busSeats']
            userId = current_user.user_id
            driver = Driver.query.filter_by(user_id=userId).first()
            driverId = driver.driver_id
        except:
            return jsonify({'status': 'error', 'message': 'Missing important details'}), 403

        if bus_model and plate and battery_model and battery_company and seats:
            bus = Bus.query.filter_by(busPlateNo=plate).first()
            if bus:
                return jsonify({'status': 'error', 'message': 'A bus with this Plate Number already exists'}), 403
            try:
                new_bus = Bus(model=bus_model, plate=plate, battery_model=battery_model, battery_company=battery_company, seatsNo=seats, driverId=driverId)
                new_activity = Activity(user_id=userId, description="Added a new bus")
                db.session.add(new_activity)
                db.session.add(new_bus)
                db.session.commit()
                return jsonify({'status': 'success', 'message': 'Sucessfully Added bus'}), 200
            except IntegrityError:
                db.session.rollback()
                return jsonify({'status': 'error', 'message': 'Integrity Error in creating bus'}), 403
        return jsonify({'status': 'error', 'message': 'Missing important details'}), 403
    return jsonify({'status': 'error', 'message': 'Wrong Request Method'}), 403


@auth_bp.route('/register_garage', methods=['POST'], strict_slashes=False)
@login_required
def register_garage():
    if request.method == 'POST':
        try:
            data = request.get_json()
            location = data['garage-location']
            name = data['garage-name']
            services = data['Services']
            userId = current_user.user_id
            garageManager = GarageManager.query.filter_by(user_id=userId).first()
            garageManagerId = garageManager.managerId
        except:
            return jsonify({'status': 'error', 'message': 'Missing important details'}), 403
            
        
        try:
            new_garage = Garage(garName=name, garLocation=location, garServices=services, managerId=garageManagerId)
            new_activity = Activity(user_id=userId, description="Added a garage")
            db.session.add(new_activity)
            db.session.add(new_garage)
            db.session.commit()
            return jsonify({'status': 'success', 'message': 'Garage created successfully'}), 200
        except IntegrityError:
            db.session.rollback()
            return jsonify({'status': 'error', 'message': 'Integrity Error'}), 403
    return jsonify({'status': 'error', 'message': 'Wrong Request Method'}), 403