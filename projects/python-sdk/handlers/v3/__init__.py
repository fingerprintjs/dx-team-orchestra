from flask import Blueprint

from handlers.v3.get_events import get_events
from handlers.v3.search_events import search_events
from handlers.v3.update_event import update_event
from handlers.v3.get_related_visitors import get_related_visitors
from handlers.v3.get_visits import get_visits
from handlers.v3.delete_visitor_data import delete_visitor_data
from handlers.v3.unseal import unseal

v3_blueprint = Blueprint('v3', __name__)

v3_blueprint.route('/getEvents', methods=['GET'])(get_events)
v3_blueprint.route('/searchEvents', methods=['GET'])(search_events)
v3_blueprint.route('/updateEvent', methods=['GET'])(update_event)
v3_blueprint.route('/getRelatedVisitors', methods=['GET'])(get_related_visitors)
v3_blueprint.route('/getVisits', methods=['GET'])(get_visits)
v3_blueprint.route('/deleteVisitorData', methods=['GET'])(delete_visitor_data)
v3_blueprint.route('/unseal', methods=['POST'])(unseal)
