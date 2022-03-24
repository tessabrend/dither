import os
import json
from random import sample

from models import *

table_names = [User, Group, GroupMembers, SelectionSession, Restaurant, SessionSelections]

# Load in the sample data from the sample folder
for table in table_names:
    sample_path = os.path.join('.', 'data', 'sample', f"{table}.json")
    if(os.path.isfile(sample_path)):
        with open(sample) as input_file:
            data = json.load(input_file)
            print(str(data))
            exit()

# Load in the restaurant data fetched from the API
with open(os.path.join('.', 'data', 'fetched', 'Restaurant.json')) as fetched_data:
    data = json.load(fetched_data)
    print(data)