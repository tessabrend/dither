from pony.orm import *
from dotenv import load_dotenv
import os

load_dotenv()

db = Database()

class User(db.Entity):
    Name = Required(str)
    Location = Optional(LongStr)
    Password = Required(str) # need to store hashed passwords not plain text
    PhoneNumber = Optional(str)
    Email = Optional(str, unique=True, nullable=True)
    UserAccessibleUI = Required(bool, default=False)
    GroupMembers = Set('GroupMembers') # this is needed to make a foreign key in the groupmembers table
    Selections = Set('SessionSelections') # this is needed to make a foreign key in the sessionselections table

class Group(db.Entity):
    GroupName = Required(str, unique=True)
    GroupEntryCode = Required(str, unique=True)
    TimeLimit = Required(int)
    GroupMembers = Set('GroupMembers') # this is needed to make a foreign key in the groupmembers table
    Session = Set('SelectionSession') # this is needed to make a foreign key in the selectionsession table
    PreviousSession = Optional('SessionSelection') 
    Selection = Set('SessionSelections') # this is needed to make a foreign key in the sessionselections table

class GroupMembers(db.Entity):
    GroupId = Required(Group, unique=False)
    UserId = Required(User, unique=False)
    GroupLeader = Required(bool, default=False)
    composite_key(GroupId, UserId)
    
class SelectionSession(db.Entity):
    Rating = Optional(float)
    Radius = Required(int)
    PriceBucket = Optional(StrArray)
    CuisineType = Optional(StrArray) # an array of all cuisine preferences
    DiningType = Optional(StrArray) # should be 'dine in', 'check out', or 'both', but is dependant on what the places api provides
    GroupId = Required(Group)
    Active = Required(bool, default=True) # needed to ensure that session is not already in progress and to close a session
    Selection = Set('SessionSelections') # this is needed to make a foreign key in the sessionselections table
    
class Restaurant(db.Entity):
    Name = Required(str)
    Location = Required(LongStr)
    Website = Optional(str)
    Rating = Optional(float)
    HoursOfOperation = Optional(StrArray)
    NumberOfRatings = Optional(int)
    PriceBucket = Optional(str)
    PlaceId = Required(str, unique=True)
    BusinessStatus = Required(str)
    PhotoReference = Optional(str)
    PhoneNumber = Optional(str)
    CuisineType = Optional(StrArray) # an array of cuisine types
    DiningType = Optional(StrArray) # Places API provides 'meal_delivery', 'meal_takeaway', and 'restaurant'. I believe these can be read as delivery, take out, dine in 
    Coordinates = Optional(str)
    PictureLocation = Required(LongStr) # Do we need to store date taken and type?
    Selection = Set('SessionSelections') # this is needed to make a foreign key in the sessionselections table

class SessionSelections(db.Entity):
    GroupId = Required(Group, unique=False)
    SessionId = Required(SelectionSession, unique=False)
    UserId = Required(User, unique=False)
    RestaurantId = Required(Restaurant, unique=False)
    TypeOfFeedback = Required(str)
    composite_key(SessionId, UserId, RestaurantId)

db.bind(provider='postgres', user=os.environ["DB_USER"], password=os.environ["PASSWORD"], host=os.environ["DB_HOST"], database=os.environ["DB"])
db.generate_mapping(create_tables=True)
