from crypt import methods
import random
import string
from flask import Flask, jsonify, request
from itsdangerous import json
from models import *
from util import *
from pony.flask import Pony
import sendgrid
from sendgrid.helpers.mail import *

app = Flask(__name__, static_url_path='')
Pony(app)
sg = sendgrid.SendGridAPIClient(api_key=os.environ.get('SENDGRID_API_KEY'))

SERVER_URL = "http://131.104.49.71"

@app.route('/', methods=["GET"])
def test():
    return jsonify({"hello": "world"})

### Groups ###

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

@app.route('/group/join', methods=['GET'])
def join_group_link():
    if not 'GroupID' in request.args.keys() or not 'UserID' in request.args.keys():
        return f"Required arg item(s) not present: {', '.join(set(request.args.keys()) - set(['GroupID', 'UserID']))}", 400
 
    GroupMembers(request.args.get('GroupID'), request.args.get('FormID'))
    try:
        commit()
    except TransactionIntegrityError as e:
        return f"Could not add member to group in database: {str(e).split('DETAIL:')[1]}".replace('\n', ''), 400

    return "Successfully registered for group"

@app.route('/group/invitation', methods=['POST'])
def send_group_invitation():
    if not 'GroupID' in request.form.keys() or not 'InviteEmail' in request.form.keys():
        return {'message': f"Required form item(s) not present: {', '.join(set(request.form.keys()) - set(['GroupID', 'InviteEmail']))}"}, 400
    
    user_to_invite = get(user for user in User if user.email and user.email == request.form.get('InviteEmail'))
    if not user_to_invite:
        return {'message': f"Sending the invite email failed, because the user with email {request.form.get('InviteEmail')} was not found"}, 400

    content = Content("text/plain", f"You've been invited for a group - click this link to join: {SERVER_URL}/group/join?UserID=1&GroupID={request.form.get('GroupID')}")
    mail = Mail(Email("dreti@uoguelph.ca"), To(request.form.get('InviteEmail')), "Group Invitation", content)
    response = sg.client.mail.send.post(request_body=mail.get())
    if response.status_code >= 300:
        return {'message': f'Sending the invite email failed with the following error: {response.status_code}'}, 500
    return {'message': 'Invitation email send successfully'}

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

if __name__ == "__main__":
    app.run(debug=True)
