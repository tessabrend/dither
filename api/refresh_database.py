import os
import json
from pathlib import Path

from models import *
from crontab import CronTab

app_folder = Path(__file__).parent
print(app_folder)

with CronTab(user = 'student') as cron:
    job_exists = False
    for job in cron.find_comment('Fetch Restaurant Data'):
        job_exists = True
    if not job_exists:
        print('Creating a new cron job to fetch data from places API')
        job = cron.new(command = f"python3 {app_folder}/fetch_restaurant_data.py && python3 {app_folder}/refresh_database.py", comment='Fetch Restaurant Data')
        job.day.every(7) # This should be set to a longer timeframe (1 week) when we use it in production

table_names = [User, Group, GroupMembers, SelectionSession, Restaurant, SessionSelections]

def load_into_table(folder, table):
    sample_path = Path(app_folder).joinpath('data', folder, f"{table.__name__}.json")
    if(sample_path.is_file()):
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