from models import *

# Warning - This will result in all existing data being lost - use this when changes to the schema have been made and the tables need to be recreated
db.drop_all_tables(with_all_data=True)
db.create_tables()
