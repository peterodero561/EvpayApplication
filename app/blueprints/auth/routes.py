# Neccesary imports
from flask import Blueprint, render_template, redirect, url_for, flash, request, session
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.user import User
from app.models.driver import Driver
from app.extensions import db, login_manager
from sqlalchemy.exc import IntegrityError
import re

auth_bp = Blueprint('auth', __name__, template_folder='templates')

# route for LOGIN 
@auth_bp.route('/login', strict_slashes=False, methods=['GET', 'POST'])
def login():
    # if current_user.is_authenticated:
    #     return redirect(url_for('home'))

    msg = ''
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
            msg = 'Logged in successfully!'
            return render_template('home.html', msg = msg)
        elif account:
            msg = 'Incorrect Password'
        else:
            msg = 'Account does not exist'
    
    return msg, 200

# route for logout
@auth_bp.route('/logout', strict_slashes=False)
@login_required
def logout():
    logout_user()
    msg = 'Logout successful'
    return redirect(url_for('auth.login'))

# defining register logi
def register_logic(name, email, passwd):
    '''function to register a user'''
    if not name or not email or not passwd:
        return 'Please fill out the form'
    # check if ther is an existing account
    existing_email = User.query.filter_by(user_email=email).first()
    if existing_email:
        return 'An account with this email already exists'
    
    # check if email is valid
    if not re.match(r'[^@]+@[^@]+\.[^@]+', email):
        return 'Invalid email address !'
    
    # check if name contains valid characters
    if not re.match(r'[A-Za-z0-9]+', name):
        return 'Name must contain only characters and numbers!'
    
    # since eveything checks out enter data
    try:
        new_user = User(name=name, email=email, passwd=passwd)
        db.session.add(new_user)
        db.session.commit()
        return 'You have successfully registered. Procced to Sign In'
    except IntegrityError:
        db.session.rollback()
        return 'An Intergity error occurred during registration. Please try again, with unique details'
    

# route for registering a user 
@auth_bp.route('/register_user', strict_slashes=False, methods=['GET', 'POST'])
def register_user():
    msg = ''
    if request.method == 'POST':
        # check for the parameters in form data
        name = request.form.get('name')
        email = request.form.get('email')
        passwd = request.form.get('password')

        # if the data is not in form data check for querry parameters
        if not name or not email or not passwd:
            name = request.args.get('name')
            email = request.args.get('email')
            passwd = request.args.get('password')

        msg = register_logic(name, email, passwd)

    return msg, 200

# router for registering a Driver
@auth_bp.route('/register_driver', methods=['POST', 'GET'], strict_slashes=False)
def register_driver():
    msg = 'New'
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        passwd = request.form.get('password')
        no = request.form.get('Number')

        # if the data is not in form data look for data in parameters
        if not name or not email or not passwd or not no:
            name = request.args.get('name')
            email = request.args.get('email')
            passwd = request.args.get('password')
            no = request.args.get('number')

        # register driver first as a user
        msg = register_logic(name, email, passwd)
        user = User.query.filter_by(user_email=email).first()

        # create driver record
        try:
            new_driver = Driver(name=name, email=email, number=no, user_id=user.user_id)
            db.session.add(new_driver)
            db.session.commit()
            msg = 'You have successfully registered. Procced to Sign In'
        except IntegrityError:
            db.session.rollback()
            msg = 'An Intergity error occurred during registration. Please try again, with unique details'

    return msg, 200