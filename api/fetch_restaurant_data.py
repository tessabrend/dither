import os
import json
from random import sample

sample_path = os.path.join('/', 'app', 'checkmein', 'api', 'data', 'fetched', 'Restaurant.json')
with open(sample_path, 'w') as restaurant_file:
    sample_resturants = [{
        'Name': 'Test Restaurant',
        'Location': '123 Test Street',
        'HoursOfOperation': '9AM - 5PM',
        'Website': 'www.testresturant.com',
        'Rating': 4.0,
        'PriceHigh': 40,
        'PriceLow': 10,
        'PhoneNumber': '123-123-1234',
        'PictureLocation': 'http://www.example.com/test'
    }]
    json.dump(sample_resturants, restaurant_file)