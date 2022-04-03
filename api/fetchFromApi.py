import requests
import json
from dotenv import load_dotenv
import os
from pony.orm import *
from models import Restaurant

load_dotenv()
API_KEY = os.environ["API_KEY"]
    
# default location is for the university of Guelph
def findPlacesNearby(lat='43.5327', lng='-80.2262', radius=500, placeType="restaurant"):
    url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&radius={radius}&type={placeType}&key={api_key}'.format(lat=lat, lng=lng, radius=radius, placeType=placeType, api_key=API_KEY)
    response = requests.get(url)
    res = json.loads(response.text)
    for result in res["results"]:
        for key in result:
            print(str(key) + " = " + str(result[key]))
        print("\n\n")

def findPlacesByText(query, lat='43.5327', lng='-80.2262', radius=500, placeType="restaurant"):
    includedFields = ['business_status','name', 'formatted_address', 'rating', 'price_level', 'place_id', 'photos', 'user_ratings_total', 'types']
    url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query={query}&location={lat},{lng}&radius={radius}&type={placeType}&key={api_key}'.format(query=query, lat=lat, lng=lng, radius=radius, placeType=placeType, api_key=API_KEY)
    response = requests.get(url)
    placeDetails = []
    res = json.loads(response.text)
    for result in res["results"]:
        place = {}
        place["dining_type"] = ["dine in"]
        for key in result:
            if(key in includedFields):
                if key == "photos":
                    place["photo_reference"] = result[key][0]["photo_reference"]
                elif key == "types":
                    if "meal_delivery" in result[key]:
                        place["dining_type"].append("delivery")
                    if "meal_takeaway" in result[key]: 
                        place["dining_type"].append("take out")
                else:
                    place[key] = result[key]
        placeDetails.append(place)
    return placeDetails

def findPlaceDetails(places, cuisineType, fields=['website', 'formatted_phone_number', 'opening_hours/weekday_text']):
    placeDetails = places
    for i in range(len(places)):
        url = 'https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields={fields}&key={api_key}'.format(place_id=places[i]["place_id"], fields=','.join(fields), api_key=API_KEY)
        response = requests.get(url)
        res = json.loads(response.text)
        if "result" in res:
            for key in res["result"]:
                placeDetails[i][key] = res["result"][key]
            placeDetails[i]["cuisine_type"] = cuisineType # Not sure how to deal with conflicts
    return placeDetails

def insertIntoRestaurants(places):
    with db_session():
        set_sql_debug(True)
        placeIds = list(select((r.PlaceId for r in Restaurant)))
        for place in places:
            if place["place_id"] not in placeIds:
                Restaurant(Name=place["name"], Location=place["formatted_address"],
                HoursOfOperation=place["opening_hours"]["weekday_text"] if "opening_hours" in place.keys() else "N/A", 
                Website=place.get("website", "N/A"), Rating=place.get("rating", "N/A"), 
                NumberOfRatings=place.get("user_ratings_total", "N/A"), PriceBucket=str(place.get("price_level", "N/A")), 
                PlaceId=place["place_id"], BusinessStatus=place.get("business_status", "N/A"), 
                PhotoReference=place.get("photo_reference", "N/A"), PhoneNumber=place.get("formatted_phone_number", "N/A"),
                CuisineType=place["cuisine_type"], DiningType=place["dining_type"], PictureLocation="N/A")
                placeIds.append(place["place_id"])
            else:
                restaurant = Restaurant.get(PlaceId=place["place_id"])
                restaurant.CuisineType.append(place["cuisine_type"])
            flush()

cuisineTypes = ['African', 'South American', 'Chinese', 'Indian', 'Middle Eastern', 'Fast Food', 'Italian', 'Mexican', 'Pub', 'Japanese']
restaurants = None
for cuisine in cuisineTypes:
    restaurants = findPlacesByText(f'{cuisine} Restaurants in Guelph, CA')
    restaurants = findPlaceDetails(restaurants, cuisine)
    insertIntoRestaurants(restaurants)