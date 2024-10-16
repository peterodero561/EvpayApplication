# Neccesary imports
from flask import Blueprint, render_template, redirect, url_for, flash, request, session
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.user import User
from app.extensions import db, login_manager

auth_bp = Blueprint('auth', __name__, template_folder='templates')

# route for LOGIN 
@auth_bp.route('/login', strict_slashes=False, methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))

    msg = ''
    if request.method == "POST" and 'email' in request.form and 'password' in request.form:
        email = request.form['email']
        passwd = request.form['password']

        # Querry the database
        account = User.query.filter_by(email).first()

        # confirm if the password matches
        if account and check_password_hash(account.password, passwd):
            login_user(account)
            session['loggedin'] = True
            session['id'] = account.id
            session['name'] = account.name
            session['email'] = account.email
            msg = 'Logged in successfully!'
            return render_template('home.html', msg = msg)
        elif account:
            msg = 'Incorrect Password'
        else:
            msg = 'Account does not exist'
    
    return render_template('home.html', msg = msg)

# route for logout
@auth_bp.route('/logout', strict_slashes=False)
@login_required
def logout():
    logout_user()
    msg = 'Logout successful'
    return redirect(url_for('auth.login'))

# route for register
@auth_bp.route('/register', strict_slashes=False, methods=['GET', 'POST'])
def register():
    if request.method == 'POST' and 'name' in request.form and 'password' in request.form and 'email' in request.form:
        name = request.form['name']
        email = request.form['email']
        passwd = request.form['password']
        msg = ''

        # Check if account exists by looking if email exists
        existing_email = User.query.filter_by('email').first()

        if existing_email:
            msg = 'Account with the email entered already exists'
        elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            msg = 'Invalid email address !'
        elif not re.match(r'[A-Za-z0-9]+', name):
            msg = 'Name must contain only characters and numbers !'
        elif not name or not password or not email:
            msg = 'Please fill out the form !'
        else:
            try:
                # creating a new user
                new_user = User(user_name = name, user_password = passwd, user_email=email)
                db.session.add(new_user)
                db.session.commit()
                msg = 'You have successfully registered. Procced to Sign In'
            except IntegrityError:
                db.session.rollback()
                msg = 'An Intergity error occurred during registration. Please try again, with unique details'

    elif request.method == 'POST':
        msg = 'Please fill out the form'
    return render_template('home.html', msg=msg)