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

<<<<<<< HEAD
=======
### Restaurants ###

@app.route('/resturant/query', methods=["GET"])
def getResturantInfo():
    to_return = []

    restaurants = select(restaurant for restaurant in Restaurant if restaurant.PriceHigh >= float(request.args.get('price-high')) \
        and restaurant.PriceLow <= float(request.args.get('price-low')) and restaurant.Rating >= float(request.args.get('rating')) \
        and request.args.get('cuisine') in restaurant.CuisineType)[int(request.args.get('start-index')):int(request.args.get('end-index'))]

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
    session = SelectionSession[id]
    query = list(select((count(s.id), s.TypeOfFeedback, r.Name, r.id) for s in SessionSelections for r in Restaurant if s.RestaurantId == r and session.id == int(s.SessionId)).order_by(3))
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

@app.route("/session/<id>/ismatch", methods=["GET"])
def pollForMatch(id):
    # set_sql_debug(True)
    currentSession = SelectionSession[id]
    try:
        mostLikedRestaurant = list(select((count(ss), ss.RestaurantId, ss.SessionId, ss.GroupId, r.id,
            r.Name, r.Location, r.HoursOfOperation, r.Website, r.Rating, r.PhoneNumber, r.DiningType) 
            for ss in SessionSelections for r in ss.RestaurantId if (r == ss.RestaurantId) and
            (ss.TypeOfFeedback == 'like' or ss.TypeOfFeedback == 'crave') and 
            ss.SessionId == currentSession).order_by(lambda: desc(count(ss))).limit(1))[0]
    except IndexError as e:
        print(e)
        return jsonify({"match": False})
    currentGroup = mostLikedRestaurant[3]
    numGroupMembers = list(select(count(gm.id) for gm in GroupMembers if (gm.GroupId == currentGroup)))[0] # get the number of members in the group
    if mostLikedRestaurant[0] >= numGroupMembers:
        return jsonify({
            "match": True,
            "restaurantId": mostLikedRestaurant[4],
            "restaurantName": mostLikedRestaurant[5],
            "restaurantLocation": mostLikedRestaurant[6],
            "restaurantHours": mostLikedRestaurant[7],
            "restaurantWebsite": mostLikedRestaurant[8],
            "restaurantRating": mostLikedRestaurant[9],
            "restaurantPhoneNumber": mostLikedRestaurant[10],
            "restaurantDiningType": mostLikedRestaurant[11]
        })
    return jsonify({"match": False})


### End Sessions ###

### User ###

@app.route('/user/create', methods=["POST"])
def createUser():
    try:
        user = User(Name="User", Location="", Password="NO_ACCOUNT", PhoneNumber="", Email=None)
        commit()
        return jsonify({"userId": str(user.id)})
    except TransactionIntegrityError as e:
        print(e)
        return {"message": "Could not create a user"}, 400
        
@app.route('/user/<id>/groups', methods=["GET"])
def getUserGroups(id):
    user = User[id]
    query = list(left_join((gm.GroupLeader, g.GroupName, g.GroupEntryCode, g.id) for gm in GroupMembers for g in gm.GroupId if user.id == int(gm.UserId)))
    response = []
    for group in range(len(query)):
        response.append({
            "groupId": query[group][3],
            "groupName": query[group][1],
            "groupCode": query[group][2],
            "isGroupLeader": query[group][0]
        })
    return jsonify(response)

### End User ###

>>>>>>> 1ef6e44649f71fce3755d0d538ee7fd6199b5f25
if __name__ == "__main__":
    app.run(debug=True)
