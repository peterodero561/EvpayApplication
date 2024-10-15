from flask import Blueprint

payments = Blueprint('payments', __name__, template_folder='templates', static_folder='static')

from . import routes
