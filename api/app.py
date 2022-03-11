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

@app.route('/group/join', methods=["PUT"])
def add_to_group():
    # check find if group exists
    group = Group.get(GroupEntryCode=request.form['groupEntryCode'])

    if group is not None:
        # check if user already in group
        if not select(group_member for group_member in GroupMembers if group_member.UserId.id == request.form['UserId'] and group_member.GroupId.id == group.id).exists():
            # if not in, add user to group 
            try: 
                user = User(Name=request.form['UserName'], Password="NO_ACCOUNT")
                flush()
                group_member = GroupMembers(GroupId=group, UserId=user)
                commit()
            except TransactionIntegrityError as e:
                return {'message': f"Could not add user to group in database: {str(e).split('DETAIL:')[1]}".replace('\n', '')}, 400
        else:
            return {'message': f"User already in group in database"}, 400
    else:
        return {'message': f"Group does not exist in database"}, 400
    return {'message': f"User added in group in database"}, 400

@app.route('/group/find', methods=["GET"])
def find_groups():
    to_return = []
    if 'User' in request.args.keys():
        # If searching by user, return all the groups of which the user is a member
        groups = select(group_member for group_member in GroupMembers if group_member.UserId == request.args.get('User'))
        for group_id in groups:
            to_return.append(render_object(get(group for group in Group if group.id == group_id)))
    elif 'id' in request.args.keys():
        # If searching by ID, return the group with the corresponding ID
        to_return.append(render_object(get(group for group in Group if group.id == request.args.get('id'))))
    elif 'GroupName' in request.args.keys():
        # If searching by name, return all groups with the corresponding name
        to_return.append(render_object(get(group for group in Group if group.GroupName == request.args.get('GroupName'))))
    elif 'GroupEntryCode' in request.args.keys():
        # If searching by code, return the group with the corresponding entry code
        to_return.append(render_object(get(group for group in Group if group.GroupEntryCode == request.args.get('GroupEntryCode'))))
    else:
        # Otherwise, return the first 50 groups
        for group in Group.select()[:request.args.get('MaxGroupsToReturn', 50)]:
            to_return.append(render_object(group))
    return { "groups": to_return }

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

### Restaurants ###

@app.route('/resturant/query', methods=["GET"])
def getResturantInfo():
    to_return = []

    restaurants = select(restaurant for restaurant in Restaurant if restaurant.PriceHigh >= float(request.args.get('price-high')) \
        and restaurant.PriceLow <= float(request.args.get('price-low')) and restaurant.Rating >= float(request.args.get('rating')) \
        and request.args.get('cuisine') in restaurant.CuisineType)[request.args.get('start-index'):request.args.get('end-index')]

    for resturant in restaurants:
        to_return.append({"name": resturant.Name, "location": resturant.Location, "hours": resturant.HoursOfOperation,
         "website": resturant.Website, "phone": resturant.PhoneNumber, "dining-option": resturant.DiningType, "bookingsite": resturant.BookingSite,
         "picture": resturant.PictureLocation, "sponsored": resturant.Sponsored, "cuisine": resturant.CuisineType, "rating": resturant.Rating, 
         "price-low": resturant.PriceLow, "price-high": resturant.PriceHigh,})
    return {"resturants": to_return}

### End Restaurants ###

### Sessions ###

@app.route('/session/<id>/deactivate', methods=["PUT"])
def deactivateSession(id):
    try:
        SelectionSession[id].Active = False
        commit()
    except TransactionIntegrityError as e:
        return {'message': f"Could not create group in database: {str(e).split('DETAIL:')[1]}".replace('\n', '')}, 400
    return jsonify({"session": id, "active": SelectionSession[id].Active})

@app.route("/session/<id>/results", methods=["GET"])
def getSessionResults(id):
    query = list(select((count(s.id), s.TypeOfFeedback, r.Name, r.id) for s in SessionSelections for r in Restaurant if s.RestaurantId == r).order_by(3))
    result = {}
    for obj in query:  # obj will be a tuple of (count, typeOfFeedback, restaurant name, restaurant id) 
        if obj[3] not in result:  # if the restaurant is not already in the results add it
            result[obj[3]] = {obj[1]: obj[0], 'name': obj[2]}
        else:  # otherwise add the response to the restaurant
            result[obj[3]][obj[1]] = obj[0]
        if 'points' not in result[obj[3]]:
            result[obj[3]]['points'] = 0
        if obj[1] == 'crave':
            result[obj[3]]['points'] += obj[0] * 2
        elif obj[1] == 'like':
            result[obj[3]]['points'] += obj[0] * 1
        elif obj[1] == 'dislike':
            result[obj[3]]['points'] -= obj[0] * 1
        elif obj[1] == 'hard no':
            result[obj[3]]['points'] -= obj[0] * 2
    return jsonify(result)

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

### End Sessions ###

if __name__ == "__main__":
    app.run(debug=True)
