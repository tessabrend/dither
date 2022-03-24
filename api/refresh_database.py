import os
import json

from models import *
from crontab import CronTab

with CronTab(user = 'student') as cron:
    job_exists = False
    for job in cron.find_comment('Fetch Restaurant Data'):
        job_exists = True
    if not job_exists:
        print('Creating a new crontab to fetch data from places API')
        job = cron.new(command = 'python3 /app/checkmein/api/fetch_restaurant_data.py && python3 /app/checkmein/api/refresh_database.py', comment='Fetch Restaurant Data')
        job.minute.every(1)

table_names = [User, Group, GroupMembers, SelectionSession, Restaurant, SessionSelections]

def load_into_table(folder, table):
    sample_path = os.path.join('/', 'app', 'checkmein', 'api', 'data', folder, f"{table.__name__}.json")
    if(os.path.isfile(sample_path)):
        try:
            with open(sample_path) as input_file:
                data = json.load(input_file)
                with db_session():
                    for element in data:
                        table(**element)
            print(f"Loading sample data for table {table.__name__}")
        except:
            print(f"Sample data already loaded for table {table.__name__}")

# Load in the sample data from the sample folder
for table in table_names:
    load_into_table('sample', table)

# Load in the restaurant data fetched from the API
load_into_table('fetched', Restaurant)