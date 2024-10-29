from flask import Blueprint, redirect, url_for, render_template, jsonify, request
from flask_login import login_required, current_user
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
from flask import current_app
from app.extensions import db
from app.models.user import User
from app.models.bus import Bus
import os

profiles_bp = Blueprint('profiles', __name__, template_folder='templates')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# function to check allowed upload file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@profiles_bp.route('/user_profile', methods=['GET'], strict_slashes=False)
@login_required
def user_profile():
    if current_user.user_role != 'user':
        return redirect(url_for('auth.login'))
    return render_template('passengers_home.html', user=current_user)

@profiles_bp.route('driver_profile', strict_slashes=False, methods=['GET'])
@login_required
def driver_profile():
    if current_user.user_role != 'driver':
        redirect(url_for('auth.login'))
    return render_template('owners_home.html', driver=current_user)

@profiles_bp.route('/account', methods=['GET'], strict_slashes=False)
@login_required
def account():
    # serve the my acount page
    return render_template('profile.html', user=current_user)

@profiles_bp.route('/account_data', methods=['GET'], strict_slashes=False)
@login_required
def account_data():
    # return current user information
    return jsonify(current_user.to_dict())

@profiles_bp.route('/account_update', strict_slashes=False, methods=['POST'])
@login_required
def account_update():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        newPasswd = request.form.get('password')

        # chack if a file is uploaded for the profile pic
        if 'pic' in request.files:
            pic_file = request.files['pic']
            if pic_file and allowed_file(pic_file.filename):
                # save file in the profile images directory
                pic_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], secure_filename(pic_file.filename)))
                pic = pic_file.filename

        role = current_user.user_role
        # update with the given data
        user = User.query.get(current_user.user_id)
        #check if there is a user with the given email
        existing_email = User.query.filter_by(user_email=email).first()
        if existing_email and existing_email.user_email != current_user.user_email:
            return jsonify({'status': 'error', 'message': 'An account with this email already exists', 'code': 403})
        if user:
            user.user_name = name
            user.user_email = email
            user.user_password = generate_password_hash(newPasswd)
            user.user_role = role
            user.user_profile_pic = pic
            # commit
            db.session.commit()
            return jsonify({'status': 'success', 'message': 'Account Update Sucessfully', 'code': 200})
    return jsonify({'status': 'error', 'message': 'Incorect Request Method', 'code': 403})
        

@profiles_bp.route('/battery_charge', strict_slashes=False, methods=['GET'])
@login_required
def battery_charge():
    # servers the charge page
    return render_template('battery_charging.html')

@profiles_bp.route('/battery_maintanance', strict_slashes=False, methods=['GET'])
@login_required
def battery_maintain():
    # serve battery maintenace page
    return render_template('battery_maintanance.html')


@profiles_bp.route('/account_bus', strict_slashes=False, methods=['GET'])
@login_required
def account_bus():
    id = current_user.user_id
    bus = Bus.query.filter_by(driver_id=id).first()
    if bus:
        return jsonify(bus.to_dict())
    else:
        return jsonify({'busId': 'Null'})