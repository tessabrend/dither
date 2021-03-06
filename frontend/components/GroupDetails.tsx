import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useState, useEffect } from "react";
import { ListRenderItem, FlatList, SafeAreaView, StyleSheet, Pressable, ScrollView, } from "react-native";
import { Slider } from '@miblanchard/react-native-slider';
import Colors from '../constants/Colors';
import { Text, View } from './Themed';
import { useNavigation } from '@react-navigation/native';
import getLocation, { apiRequestRetry } from '../utils/utils';
import Dropdown from "./Dropdown";
import Rating from "./Rating";
import SliderContainer from "./SliderContainer";
import { GroupMembers, RatingProps, SliderProps, DropdownProps, RestaurantQueryParams } from '../constants/Interfaces';
import Modal from "react-native-modal";
import { QrCodeScannerOutlined } from "@mui/icons-material";
import { createIconSetFromFontello } from "react-native-vector-icons";

const Item = ({ data }: { data: GroupMembers }) => (
  <View
    style={data.leader ? {...styles.groupMember, ...styles.groupLeader} : {...styles.groupMember}}>
    <Text style={styles.name}>{data.name?.charAt(0)}</Text>
  </View>
);
 

const renderItem: ListRenderItem<GroupMembers> = ({ item }) => (
  <Item 
    data={item} 
  />
);


export default function GroupDetails({ route }) {
  const group = route.params;
  console.log(group);
  const [groupMembers, setGroupMembers] = useState<GroupMembers[]>([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showMembers, setShowMembers] = useState(false);

//temp button option
const [diningType, setDiningType] = useState<string[]>([]);
const [cuisineType, setCuisineType] = useState<string[]>([]);
const [priceBuckets, setPriceBuckets] = useState<string[]>([]);
const [rating, setRating] = useState(0.0);
const [distance, setDistance] = useState(5.0);
const [timeLimit, setTimeLimit] = useState(5);
const [location, setLocation] = useState("");
const [sessionId, setSessionId] = useState(0);

let updateDiningType = (type: string) => {
  let types = diningType.slice();
  if(diningType.indexOf(type) !== -1) {
    types.splice(types.indexOf(type), 1)
    setDiningType(types)
  } else {
    types.push(type)
    setDiningType(types)
  }
}

let updateCuisineType = (type: string) => {
  let types = cuisineType.slice();
  if(cuisineType.indexOf(type) !== -1) {
    types.splice(types.indexOf(type), 1)
    setCuisineType(types)
  } else {
    types.push(type)
    setCuisineType(types)
  }
}

let updatePriceBucket = (bucket: string) => {
  let buckets = priceBuckets.slice();
  if(priceBuckets.indexOf(bucket) !== -1) {
    buckets.splice(buckets.indexOf(bucket), 1)
    setPriceBuckets(buckets)
  } else {
    buckets.push(bucket)
    setPriceBuckets(buckets)
  }
}

let startSession = () => {
  const url = "http://131.104.49.71:80/session/start";
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: `groupId=${2}&diningType=${diningType}&radius=${distance}&cuisineType=${cuisineType}&priceBucket=${priceBuckets}&rating=${rating}`
  }
  apiRequestRetry(url, options, 10).then(data => {
    console.log(data);
    setSessionId(data.sessionId);
    console.log("data.sessionId = " + data.sessionId);
  }).catch(err => console.log(err));
}

  const navigation = useNavigation();
  const ratingProps: RatingProps = {rating: rating, setRating: setRating}
  const distanceProps: SliderProps = {value: distance, caption: "Distance: ", unit: " km"}
  const timeLimitProps: SliderProps = {value: timeLimit, caption: "Time Limit: ", unit: " min"}
  const dropdownProps: DropdownProps = {selection: cuisineType, updateSelection: updateCuisineType}
  const restaurantParams: RestaurantQueryParams = {cuisineType: cuisineType, diningType: diningType, priceBucket: priceBuckets, rating: rating, maxDistance: distance, coords: "43.5327,-80.2262", sessionId: sessionId, groupId: group.groupId, timeLimit: timeLimit}

  useEffect(() => {
    getLocation().then((userLocation) => setLocation(userLocation));
    async function getGroupMembers() {
      const url = `http://131.104.49.71:80/group/${group.groupId}/members`;
      const options = {
        headers: {
          'Accept': 'application/json'
        }
      }
      let groupMembers = await apiRequestRetry(url, options, 10)
      setGroupMembers(groupMembers);
    }
    getGroupMembers();

    function pollForActiveSession() {
      let interval = setInterval(() => {
        let exit = fetch(`http://131.104.49.71:80/group/${group.groupId}/hasLiveSession`)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if(data.hasLiveSession) {
            setSessionId(data.sessionId);
            console.log("data.sessionId = " + data.sessionid)
            clearInterval(interval);
            let sessionParams: RestaurantQueryParams = {cuisineType: data.cuisineType, diningType: data.diningType, priceBucket: data.priceBucket, rating: data.rating, maxDistance: data.radius, coords: "43.5327,-80.2262", sessionId: sessionId, groupId: group.groupId}
            alert("A session has started for the group " + group.groupName);
            navigation.navigate("Session", sessionParams);
          }
        }).catch(err => console.log(err));
      }, 5000);
    }
    if(! (group.isGroupLeader)) {
      pollForActiveSession();
    }
  }, []);

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.membersWrapper}>
        <FlatList 
          horizontal
          data={groupMembers}
          renderItem={renderItem}
          keyExtractor={(item) => item.user_id}
          extraData={selectedId}
        />
        <Pressable onPress={() => {setShowMembers(true); console.log(groupMembers)}}><Text style={{fontSize: 40}}>+</Text></Pressable>
        <Modal
                     coverScreen={true}
                     isVisible={showMembers}
                     onSwipeComplete={() => setShowMembers(false)}
                     swipeDirection="down"
                     >
                     <View style={styles.modalView}>
                       <Text style={styles.modalHeader}>All Members</Text>
                     {groupMembers.map(function(g, idx){
         return (<Text key={idx} style={styles.modalText}>{g.name}</Text>)
       })}
                     </View>
                    </Modal>
      </View>

      <ScrollView style={styles.scrollBox}>
      <View style={styles.buttonRow}>
        <Pressable 
            onPress={() => updateDiningType("delivery")}
            style={diningType.indexOf("delivery") !== -1 
            ? {borderWidth: 3, ...styles.buttonCard} 
            : {borderWidth: 1, ...styles.buttonCard}}
          >
          <Text style={styles.detailText}>DELIVERY</Text>
        </Pressable>
        <Pressable 
            onPress={() => updateDiningType("pick up")}
            style={diningType.indexOf("pick up") !== -1 
            ? {borderWidth: 3, ...styles.buttonCard} 
            : {borderWidth: 1, ...styles.buttonCard}}
          >
          <Text style={styles.detailText}>PICK UP</Text>
        </Pressable>
        <Pressable 
            onPress={() => updateDiningType("dine in")}
            style={diningType.indexOf("dine in") !== -1 
            ? {borderWidth: 3, ...styles.buttonCard} 
            : {borderWidth: 1, ...styles.buttonCard}}
          >
          <Text style={styles.detailText}>DINE IN</Text>
        </Pressable>
      </View>

      <SliderContainer {...distanceProps}>
        <Slider 
          minimumValue={0}
          maximumValue={100}
          step={0.5}
          value={distance}
          onValueChange={value => setDistance(value[0])}
        />
      </SliderContainer>

      <SliderContainer {...timeLimitProps}>
        <Slider 
          minimumValue={0}
          maximumValue={120}
          step={1}
          value={timeLimit}
          onValueChange={value => setTimeLimit(value[0])}
          />
      </SliderContainer>

      <View style={styles.labelWrapper}>
        <Text style={styles.label}>Cuisine</Text>
      </View>
      <View style={styles.elementWrapper}>
        <Dropdown {...dropdownProps}/>
      </View>

      <View style={styles.labelWrapper}>
        <Text style={styles.label}>Price</Text>
      </View>
  <View style={styles.buttonRow}>
      <Pressable 
            onPress={() => updatePriceBucket('1')}
            style={[{ borderWidth: priceBuckets.indexOf('1') !== -1 ? 3 : 1 }, styles.buttonCard] }
          >
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
        </Pressable>
        <Pressable 
            onPress={() => updatePriceBucket('2')}
            style={[{ borderWidth: priceBuckets.indexOf('2') !== -1 ? 3 : 1 }, styles.buttonCard] }
          >
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
        </Pressable>
        <Pressable 
            onPress={() => updatePriceBucket('3')}
            style={[{ borderWidth: priceBuckets.indexOf('3') !== -1 ? 3 : 1 }, styles.buttonCard] }
          >
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
        </Pressable>
        <Pressable 
            onPress={() => updatePriceBucket('4')}
            style={[{ borderWidth: priceBuckets.indexOf('4') !== -1 ? 3 : 1 }, styles.buttonCard] }
          >
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
           <FontAwesomeIcon icon="dollar-sign" size={26}/>
        </Pressable>
      </View>

      <View style={styles.labelWrapper}>
        <Text style={styles.label}>Rating</Text>
      </View>
      <View style={styles.ratingWrapper}>
        <Rating {...ratingProps}/>
      </View>
      </ScrollView>

      <View style={styles.submitWrapper}>
        <Pressable 
          style={styles.buttonCard} onPress={() => {
          if(group.isGroupLeader) {
            startSession()
            navigation.navigate('Session', restaurantParams);
          } else {
            alert("Only the leader of a group may start the session");
          }
        }}>
          <Text style={styles.submitText}>Go Eat!</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.light.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: "center",
    color: Colors.light.text,
  },
  membersWrapper: {
    width: "100%",
    height: "12%",
    maxHeight: "12%",
    //justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: "1%",
    paddingLeft: "20%",
    flexDirection: "row",
    paddingRight: "20%",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 50,
    width: "90%",
    height: "40%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    fontSize: 20,
    paddingBottom: 5,
  },
  modalHeader: {
    fontSize: 25,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  groupMember: {
    backgroundColor: "#eee",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.dark.background,
    borderStyle: "solid",
    justifyContent: "center",
    alignContent: "center",
    width: 50,
    height: 50,
    marginHorizontal: 3
  }, 
  groupLeader: {
    backgroundColor: '#0000ff44'
  },
  buttonRow: {
    justifyContent: "space-evenly",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    padding: "2%",
  },
  buttonCard: {
    borderColor: Colors.dark.background,
    borderRadius: 10,
    borderStyle: "solid",
    backgroundColor: Colors.light.background,
    padding: "1%",
    marginHorizontal: "2%",
    flexDirection: "row",
  },
  detailText: {
    textAlign: "center",
    fontSize: 20,
    justifyContent: "space-around"
  },
  label: {
    textAlign: "left",
    fontSize: 22,
  },
  labelWrapper: {
    width: "100%",
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "flex-start",
    alignContent: "center",
    paddingHorizontal: "4%",
    paddingTop: "2%",
  },
  elementWrapper: {
    width: "80%",
    flex: 1,
    marginLeft: "1%",
    marginRight: "1%",
    alignItems: 'stretch',
    justifyContent: 'center',
    alignSelf: "center",
  },
  ratingWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    height: "8%",
    marginBottom: "2%",
  },
  submitWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
    height: "14%",
    maxHeight: "14%",
    padding: "1%",
  },
  submitText: {
    justifyContent: "center",
    textAlign: "center",
    fontSize: 33,
  },
  dropdown: {
    height: 50,
    backgroundColor: 'transparent',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 18,
  },
  selectedStyle: {
    borderRadius: 12,
  },
  scrollBox: {
    width: "100%",
    height: "68%",
    flexDirection: "column",
    alignContent: "center",
  },
});