from crypt import methods
import random
import string
from flask import Flask, jsonify, request
from itsdangerous import json
from models import *
from util import *
from pony.flask import Pony
from geopy.distance import distance
from geopy.geocoders import Nominatim
import sendgrid
from sendgrid.helpers.mail import *


app = Flask(__name__, static_url_path='')
Pony(app)
geolocator = Nominatim(user_agent="Dither")
sg = sendgrid.SendGridAPIClient(api_key=os.environ.get('SENDGRID_API_KEY'))

SERVER_URL = "http://131.104.49.71"

@app.route('/', methods=["GET"])
def test():
    return jsonify({"hello": "world"})

### Groups ###

@app.route('/group/join', methods=["PUT"])
def add_to_group():
    # check find if group exists
    group = Group.get(GroupEntryCode=request.form['groupEntryCode'])

    userId = request.form.get('UserId', None)
    if group is not None:
        # check if user already in group
        if not select(group_member for group_member in GroupMembers if group_member.UserId.id == userId and group_member.GroupId.id == group.id).exists():
            # if not in, add user to group 
            try:
                if(userId is None):
                    user = User(Name=request.form['UserName'], Password="NO_ACCOUNT")
                else:
                    user = User.get(id=userId)
                flush()
                group_member = GroupMembers(GroupId=group, UserId=user)
                commit()
            except TransactionIntegrityError as e:
                return {'message': f"Could not add user to group in database: {str(e).split('DETAIL:')[1]}".replace('\n', '')}, 400
        else:
            return {'message': f"User already in group in database"}, 400
    else:
        return {'message': f"Group does not exist in database"}, 400
    return {'message': f"User added in group in database", 'groupName': group.GroupName}

@app.route('/group/find', methods=["GET"])
def find_groups():
    to_return = []
    if 'User' in request.args.keys():
        # If searching by user, return all the groups of which the user is a member
        groups = select(group_member for group_member in GroupMembers if group_member.UserId == request.args.get('User'))
        for group_id in groups:
            to_return.append(render_object(get(group for group in Group if group.id == group_id)))
    elif 'GroupID' in request.args.keys():
        # If searching by ID, return the group with the corresponding ID
        to_return.append(render_object(get(group for group in Group if group.id == request.args.get('GroupID'))))
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

@app.route('/group/invite', methods=['POST'])
def send_group_invitation():
    if not 'GroupID' in request.form.keys() or not 'InviteEmail' in request.form.keys():
        return {'message': f"Required form item(s) not present: {', '.join(set(request.form.keys()) - set(['GroupID', 'InviteEmail']))}"}, 400
    
    user_to_invite = get(user for user in User if user.email and user.email == request.form.get('InviteEmail'))
    if not user_to_invite:
        return {'message': f"Sending the invitation email failed, because the user with email {request.form.get('InviteEmail')} was not found"}, 400

    content = Content("text/plain", f"You've been invited to join a group - click this link to complete the process: {SERVER_URL}/group/accept_invitation?UserID={user_to_invite}&GroupID={request.form.get('GroupID')}")
    mail = Mail(Email("dreti@uoguelph.ca"), To(request.form.get('InviteEmail')), "Group Invitation", content)
    response = sg.client.mail.send.post(request_body=mail.get())
    if response.status_code >= 300:
        return {'message': f'Sending the invite email failed with the following error: {response.status_code}'}, 500
    return {'message': 'Invitation email send successfully'}

@app.route('/group/accept_invitation', methods=['GET'])
def join_group_link():
    if not 'GroupID' in request.args.keys() or not 'UserID' in request.args.keys():
        return f"Required arg item(s) not present: {', '.join(set(request.args.keys()) - set(['GroupID', 'UserID']))}", 400
 
    GroupMembers(request.args.get('GroupID'), request.args.get('FormID'))
    try:
        commit()
    except TransactionIntegrityError as e:
        return f"Could not add member to group in database: {str(e).split('DETAIL:')[1]}".replace('\n', ''), 400

    return "Successfully registered for group"

@app.route('/group/create', methods=["POST"])
def create_group():
    provided_fields = ['id', 'TimeLimit', 'GroupEntryCode']
    if not confirm_fields(request.form, Group, exceptions=provided_fields):
        print("a")
        print({'message': f"Required form item(s) not present: {', '.join(field_difference(request.form, Group, exceptions=provided_fields))}"})
        return {'message': f"Required form item(s) not present: {', '.join(field_difference(request.form, Group, exceptions=provided_fields))}"}, 400
    # If a time limit is not provided, use the default value of 30 minutes
    group = Group(GroupName=request.form['GroupName'], 
                GroupEntryCode=''.join(random.choice(string.ascii_letters) for _ in range(8)),
                TimeLimit=request.form.get('TimeLimit', 30))
    flush()
    print(request.form.get("UserId"))
    group_member = GroupMembers(GroupId=group.id, UserId=request.form.get('UserId'), GroupLeader=True)
    try:
        commit()
    except TransactionIntegrityError as e:
        print("b")
        print({'message': f"Could not create group in database: {str(e).split('DETAIL:')[1]}".replace('\n', '')})
        return {'message': f"Could not create group in database: {str(e).split('DETAIL:')[1]}".replace('\n', '')}, 400
    print("c")
    print(render_object(group))
    return render_object(group)

@app.route('/group/<id>/leave/<userId>', methods=["PUT"])
def leaveGroup(id, userId):
    membership = GroupMembers.get(GroupId=id, UserId=userId)
    if not membership:
        return { "message": "The user is not in the group. Invalid request" }, 400
    if membership.GroupLeader:
        GroupMembers.select(GroupId=id).delete(bulk=True)
        Group.get(id=id).delete() 
        return { "status": "delete all" }
    else:
        membership.delete()
        return { "status": "delete" }

@app.route('/group/<id>/members', methods=["GET"])
def getGroupMembers(id):
    group = Group.get(id=id)
    if group is None:
        print('invalid, id = ' + str(id))
        return { "message": "invalid group" }, 400
    else:
        groupMembers = GroupMembers.select(GroupId=id)
        response = []
        for gm in groupMembers:
            response.append({"user_id": gm.UserId.id, "name": gm.UserId.Name, "leader": gm.GroupLeader})
        print(response)
        return jsonify(response)

### End Groups ###

### Restaurants ###

@app.route('/restaurant/query', methods=["GET"])
def getRestaurantInfo():
    # optional params priceBucket, rating, cuisineType, diningType, coords, maxDistance
    cuisineTypes = request.args.get("cuisineType", '''African,South American,Chinese,Indian,Middle Eastern,Fast Food,Italian,Mexican,Pub,Japanese''').split(",")
    diningTypes = request.args.get("diningType", 'dine in,take out,delivery').split(',')
    priceLevels = request.args.get("priceBucket", '0,1,2,3,4').split(',')
    coords = eval(request.args.get("coords", (0,0)))
    priceLevels = ['1', '2', '3', '4'] if priceLevels == '' or priceLevels == [''] else priceLevels
    diningTypes = ['dine in', 'take out', 'delivery'] if diningTypes == '' or diningTypes == [''] else diningTypes
    cuisineTypes = ['African', 'South American', 'Chinese', 'Indian', 'Middle Eastern', 'Fast Food', 'Italian', 'Mexican', 'Pub', 'Japanese'] if cuisineTypes == '' or cuisineTypes == [''] else cuisineTypes
    to_return = []
    query = f'''SELECT id, Name, Location, Website, Rating, HoursOfOperation, 
    NumberOfRatings, PriceBucket, PhoneNumber, CuisineType, DiningType, Coordinates 
    from Restaurant WHERE Rating >= {request.args.get("rating", 0, float)} 
    and (PriceBucket in ({str(priceLevels)[1:-1]}) OR PriceBucket = 'N/A')
    and CuisineType && '{{{str(cuisineTypes)[1:-1].replace("'", '"')}}}'
    and DiningType && '{{{str(diningTypes)[1:-1].replace("'", '"')}}}';'''
    restaurants = db.execute(query).fetchall()
    for r in restaurants:
        if distance(eval(r[11]), coords).km < request.args.get("maxDistance", 5, float):
            to_return.append({"id": r[0], "name": r[1], "location": r[2], "website": r[3], "rating": r[4],
            "hoursOfOperation": r[5], "numberOfRatings": r[6], "priceBucket": r[7], "phoneNumber": r[8],
            "cuisineType": r[9], "dining_type": r[10]})
    return jsonify(to_return)

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

@app.route("/session/start", methods=["POST"])
def startSession():
    groupId = request.form.get("groupId", 0, int)
    if groupId == 0:
        return { "message": "Invalid Group ID" }, 400
    activeSession = SelectionSession.get(GroupId=groupId, Active=True)
    if(activeSession):
        activeSession.Active = False
        flush()
    cuisineTypes = request.form.get("cuisineType", ['African', 'South American', 'Chinese', 'Indian', 'Middle Eastern', 'Fast Food', 'Italian', 'Mexican', 'Pub', 'Japanese'])
    cuisineTypes = cuisineTypes.split(",") if type(cuisineTypes) == str else cuisineTypes
    diningTypes = request.form.get("diningType", ['dine in', 'take out', 'delivery'])
    diningTypes = diningTypes.split(",") if type(diningTypes) == str else diningTypes
    priceBucket = request.form.get("priceBucket", [0,1,2,3,4], str)
    priceBucket = priceBucket.split(",") if type(priceBucket) == str else priceBucket
    SelectionSession(Rating=request.form.get("rating", 0.0, float), 
    Radius=request.form.get("radius", 5, int), 
    PriceBucket=priceBucket, CuisineType=cuisineTypes, DiningType=diningTypes, GroupId=groupId, Active=True)
    try:
        commit()
    except TransactionIntegrityError as e:
        return {'message': f"Could not add user choice to database: {str(e).split('DETAIL:')[1]}".replace('\n', '')}, 400
    return { "success": True }

### End Sessions ###

### User ###

@app.route('/user/create', methods=["POST"])
def createUser():
    # userId = request.form.get("userId", None)
    # print(userId)
    # user = User.get(id=userId)
    #if userId is None or user is None:
    try:
        user = User(Name="User", Location="", Password="NO_ACCOUNT", PhoneNumber="", Email=None)
        commit()
        return jsonify({"userId": str(user.id)})
    except TransactionIntegrityError as e:
        print(e)
        return {"message": "Could not create a user"}, 400
    #elif user:
        #print({"userId": userId})
        #return jsonify({"userId": userId})


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
    print(response)
    print(request.headers)
    return jsonify(response)

### End User ###

if __name__ == "__main__":
    app.run(debug=True, port=80, host="131.104.49.71")
