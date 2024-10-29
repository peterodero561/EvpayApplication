# Neccesary imports
from flask import Blueprint, render_template, redirect, url_for, flash, request, session, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.user import User
from app.models.bus import Bus
from app.models.driver import Driver
from app.extensions import db, login_manager
from sqlalchemy.exc import IntegrityError
import re 

auth_bp = Blueprint('auth', __name__, template_folder='templates')

# route for LOGIN 
@auth_bp.route('/login_pass', strict_slashes=False, methods=['GET', 'POST'])
def login_pass():
    # if current_user.is_authenticated:
    #     return redirect(url_for('home'))

    msg = {}
    if request.method == "POST":
        # retrive email & password from form data
        email = request.form.get('email')
        passwd = request.form.get('password')

        # if the email and password are not in form date look in querry parameters
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
            msg = {'status': 'success', 'message': 'Logged in successfully!', 'role': account.user_role, 'code': 200}
            return jsonify(msg)
        elif account:
            print('password from form: ', passwd)
            print('password hash in database: ', account.user_password)
            print('hash check result: ', check_password_hash(account.user_password, passwd))
            msg = {'status': 'error', 'message': 'Incorrect Password', 'code': 403}
            return jsonify(msg)
        else:
            msg = {'status': 'error', 'message': 'Account does not exist', 'code': 403}
            return jsonify(msg)
    
    return jsonify({'status': 'error', 'message': 'Invalid request', 'code': 400})

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
        return None, {'status': 'error', 'message': 'Please fill out the form', 'code': 400}
    # check if ther is an existing account
    existing_email = User.query.filter_by(user_email=email).first()
    if existing_email:
        return None, {'status': 'error', 'message': 'An account with this email already exists', 'code': 403}
    
    # check if email is valid
    if not re.match(r'[^@]+@[^@]+\.[^@]+', email):
        return None, {'status': 'error', 'message': 'Invalid email address !', 'code': 403}
    
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
    msg = {}
    if request.method == 'POST':
        # check for the parameters in form data
        name = request.form.get('name')
        email = request.form.get('email')
        passwd = request.form.get('password')
        role = 'user'

        # if the data is not in form data check for querry parameters
        if not name or not email or not passwd:
            name = request.args.get('name')
            email = request.args.get('email')
            passwd = request.args.get('password')

        new_user, msg = register_logic(name, email, passwd, role)

        return jsonify(msg)

    return jsonify({'status': 'error', 'message': 'Invalid request', 'code': 400})

# router for registering a Driver
@auth_bp.route('/register_driver', methods=['POST'], strict_slashes=False)
def register_driver():
    msg = {}
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        passwd = request.form.get('password')
        no = request.form.get('number')
        role = 'driver'

        # if the data is not in form data look for data in parameters
        if not name or not email or not passwd or not no:
            name = request.args.get('name')
            email = request.args.get('email')
            passwd = request.args.get('password')
            no = request.args.get('number')

        # register driver first as a user
        user, msg = register_logic(name, email, passwd, role)

        # check if the user creation was success
        if msg['status'] == 'error':
            return jsonify(msg)

        # create driver record
        try:
            new_driver = Driver(name=name, email=email, number=no, user_id=user.user_id)
            db.session.add(new_driver)
            db.session.commit()
            return jsonify({'status': 'success', 'message': 'You have successfully registered. Procced to Sign In', 'code': 200})
        except IntegrityError:
            db.session.rollback()
            return jsonify({'status': 'error', 'message': 'An Intergity error occurred during registration. Please try again, with unique details', 'code': 403})

    return jsonify({'status': 'error', 'message': 'Invalid request', 'code': 400})


@auth_bp.route('/register_bus', strict_slashes=False, methods=['POST'])
@login_required
def register_bus():
    if request.method == 'POST':
        bus_model = request.form.get('busModel')
        plate = request.form.get('plate')
        battery_model = request.form.get('batteryModel')
        battery_company = request.form.get('batteryCompany')
        seats = request.form.get('busSeats')
        userId = current_user.user_id

        if bus_model and plate and battery_model and battery_company and seats:
            try:
                new_bus = Bus(bus_model, plate, battery_model, battery_company, seats, userId)
                db.session.add(new_bus)
                db.session.commit()
                return jsonify({'status': 'success', 'message': 'Sucessfully Added bus', 'code': 200})
            except IntegrityError:
                db.session.rollback()
                return jsonify({'status': 'error', 'message': 'Integrity Error in creating bus', 'code': 403})
        return jsonify({'status': 'error', 'message': 'No form data available', 'code': 403})
    return jsonify({'status': 'error', 'message': 'Wrong Request Method', 'code': 403})