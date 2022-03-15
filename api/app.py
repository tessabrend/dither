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

@app.route('/group/join', methods=['GET'])
def join_group_link():
    return "Successfully registered for group"

@app.route('/group/invitation', methods=['POST'])
def send_group_invitation():
    if not 'GroupID' in request.form.keys() or not 'InviteEmail' in request.form.keys():
        return {'message': f"Required form item(s) not present: {', '.join(set(request.form.keys()) - set(['GroupID', 'InviteEmail']))}"}, 400
    
    content = Content("text/plain", f"You've been invited for a group - click this link to join: {SERVER_URL}/group/join?user=test&group={request.form.get('GroupID')}")
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
