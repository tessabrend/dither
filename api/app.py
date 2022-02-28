from crypt import methods
import random
import string
from flask import Flask, jsonify, request
from itsdangerous import json
from models import *
from util import *

app = Flask(__name__, static_url_path='')

@app.route('/', methods=["GET"])
def test():
    return jsonify({"hello": "world"})

### Groups ###

@db_session
@app.route('/group/create', methods=["POST"])
def create_group():
    if not confirm_fields(request.form, Group, exceptions=['TimeLimit']):
        return {'message': f"Required form item(s) not present: {','.join(field_difference(request.form, group))}"}

    # If a time limit is not provided, use the default value of 30 minutes
    group = Group(GroupName=request.form['GroupName'], 
                  GroupEntryCode=''.join(random.choice(string.ascii_letters) for _ in range(8)),
                  TimeLimit=request.form.get('TimeLimit', 30))
    commit()
    return render_object(group)

### End Groups ###

if __name__ == "__main__":
    app.run(debug=True)