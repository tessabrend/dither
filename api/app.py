from crypt import methods
import random
import string
from flask import Flask, jsonify, request
from itsdangerous import json
from models import *
from util import *
from pony.flask import Pony

app = Flask(__name__, static_url_path='')
Pony(app)

@app.route('/', methods=["GET"])
def test():
    return jsonify({"hello": "world"})

### Groups ###

@app.route('/group/create', methods=["POST"])
def create_group():
    provided_fields = ['id', 'TimeLimit', 'GroupEntryCode']
    if not confirm_fields(request.form, Group, exceptions=provided_fields):
        return {'message': f"Required form item(s) not present: {', '.join(field_difference(request.form, Group, exceptions=provided_fields))}"}, 400

    # If a time limit is not provided, use the default value of 30 minutes
    group = Group(GroupName=request.form['GroupName'], 
                GroupEntryCode=''.join(random.choice(string.ascii_letters) for _ in range(8)),
                TimeLimit=request.form.get('TimeLimit', 30))
    try:
        commit()
    except TransactionIntegrityError as e:
        return {'message': f"Could not create group in database: {str(e).split('DETAIL:')[1]}".replace('\n', '')}, 400
    return render_object(group)

### End Groups ###

@app.route("/session/selection", methods=["POST"])
def setSessionSelection():
    provided_fields = ['id']
    if not confirm_fields(request.form, SessionSelections, exceptions=provided_fields):
        return {'message': f"Required form item(s) not present: {', '.join(field_difference(request.form, SessionSelections, exceptions=provided_fields))}"}, 400

    sessionSelection = SessionSelections(UserId=request.form["UserId"], 
        SessionId=request.form["SessionId"], RestaurantId=request.form["RestaurantId"],
        GroupId=request.form["GroupId"], TypeOfFeedback=request.form["TypeOfFeedback"])

    try:
        commit()
    except TransactionIntegrityError as e:
        return {'message': f"Could not add user choice to database: {str(e).split('DETAIL:')[1]}".replace('\n', '')}, 400
        
    if(request.form["TypeOfFeedback"] == 'like' or request.form["TypeOfFeedback"] == 'crave'): # if the user didn't like/crave no need to check
        restaurantLikes = select(count(ss.id) for ss in SessionSelections if (int(ss.SessionId) == 
            int(request.form["SessionId"]) and int(ss.RestaurantId) == int(request.form["RestaurantId"]) and 
            (ss.TypeOfFeedback == 'like' or ss.TypeOfFeedback == 'crave'))) # get the number of likes/craves on the restaurant in the session
        numGroupMembers = select(count(gm.id) for gm in GroupMembers if (int(gm.GroupId) == int(request.form["GroupId"]))) # get the number of members in the group
        if(restaurantLikes.first() >= numGroupMembers.first()):
            return jsonify({"match": True})
    return jsonify({"match": False})

if __name__ == "__main__":
    app.run(debug=True)
