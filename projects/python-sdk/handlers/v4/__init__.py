from flask import Blueprint

from handlers.v4.get_event import get_event
from handlers.v4.search_events import search_events
from handlers.v4.update_event import update_event
from handlers.v4.delete_visitor_data import delete_visitor_data
from handlers.v4.unseal import unseal

v4_blueprint = Blueprint('v4', __name__)

v4_blueprint.route('/getEvent', methods=['GET'])(get_event)
v4_blueprint.route('/searchEvents', methods=['GET'])(search_events)
v4_blueprint.route('/updateEvent', methods=['GET'])(update_event)
v4_blueprint.route('/deleteVisitorData', methods=['GET'])(delete_visitor_data)
v4_blueprint.route('/unseal', methods=['POST'])(unseal)
