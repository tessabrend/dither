import React, {Component, useEffect, useState} from "react";
import { StyleSheet, Image, Pressable, TouchableOpacity } from "react-native";
import { Text, View } from './Themed';
import FlipCard from "react-native-flip-card-plus";
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RestaurantQueryParams } from "../constants/Interfaces";
import { apiRequestRetry } from "../utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Star } from 'react-native-star-view';
import MapView, {Marker, Region, PROVIDER_GOOGLE} from 'react-native-maps';


export default class AllDetailsCard extends Component {
  restaurantData = ['Restaurant Name' , "2", '0.5 km', ['Indian', 'Thai', 'African', 'Buffet'], 
  'https://google.com', '000-000-0000', '123 Alphabet Street', '3', 'https://www.opentable.ca/r/' ];//temp data

  state = {
    data: [] as any[],
    index: 0,
    navigator: null,
    restaurantParams: {},
    sessionId: 0,
  }

  constructor(props) {
    super(props);
    this.navigation = props.navigator;
    // this.state.restaurantParams = this.navigation.state.params.restaurantParams;

  }

  getSessionInfo = async () => {
    const url = `http://131.104.49.71:80/session/${this.state.sessionId/ismatch}`;
    const options = {
        headers: {
            'Accept': 'application/json'
        }
    } 
    let json = await apiRequestRetry(url, options, 10);
    this.setState({data: json})
  }


  openWebsite = () => {
    WebBrowser.openBrowserAsync(this.restaurantData[4]);
  };

  makeReservation = () => {
    WebBrowser.openBrowserAsync(this.restaurantData[8]);
  };

  makeCall = () => {
    Linking.openURL(`tel:${this.restaurantData[5]}`); //state.data[this.state.index]?.phoneNumber
  };

  viewInMap = () => {
    let url = 'https://www.google.com/maps/search/?api=1&query='+this.restaurantData[6]
    Linking.openURL(url)
  };

  getCoord = () => {
    let location: Region = {
      latitude: 43.5345361,
      longitude: -80.3102086,
      latitudeDelta: 0.009,
      longitudeDelta: 0.009,
    }
    return location
  }

  getPriceBucket = (price_bucket: any) => {
    switch (price_bucket) {
      case "1":
        return (
          <View style={styles.bucketRow}>
            <FontAwesomeIcon icon="dollar-sign" size={20}/>
          </View>
        );
      case "2":
        return (
          <View style={styles.bucketRow}>
            <FontAwesomeIcon icon="dollar-sign" size={20}/>
            <FontAwesomeIcon icon="dollar-sign" size={20}/>
          </View>
        );
      case "3":
        return (
          <View style={styles.bucketRow}>
            <FontAwesomeIcon icon="dollar-sign" size={20}/>
            <FontAwesomeIcon icon="dollar-sign" size={20}/>
            <FontAwesomeIcon icon="dollar-sign" size={20}/>
          </View>
        );
      case "4":
        return (
          <View style={styles.bucketRow}>
            <FontAwesomeIcon icon="dollar-sign" size={20}/>
            <FontAwesomeIcon icon="dollar-sign" size={20}/>
            <FontAwesomeIcon icon="dollar-sign" size={20}/>
            <FontAwesomeIcon icon="dollar-sign" size={20}/>
          </View>
        );
      default:
        break;
    }
    return null;
  }

  render () {
    return (
      <View style={styles.container}>
        <FlipCard
          flipDirection={"h"}
          style={styles.cardContainer}
          ref={(card) => (this.card = card)}>
          <Pressable
            style={styles.card}
            onPress={() =>this.card.flipVertical()}>
            <Text style={styles.label}>{this.restaurantData[0]}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.rowMember}>{this.getPriceBucket(this.restaurantData[1])}</Text>
              <Text style={styles.rowMember}>{this.restaurantData[2]}</Text>
            </View>
            <View style={styles.infoRow}>
              { this.restaurantData[3].map((item: string, i: number)=>(
                <Text key={i} style={styles.cuisineTypeBox}> { item } </Text>)
              )}
            </View>
            {/* <Image style={styles.mapbox}
               source={{uri: 'https://i.stack.imgur.com/SlwjS.png'}}
             /> */}
            <MapView 
              style={styles.mapbox} 
              provider={PROVIDER_GOOGLE}
              mapType='standard'
              region={this.getCoord()}>
              <Marker coordinate={{latitude: 43.5345361, longitude: -80.3102086}} />
            </MapView>
          </Pressable>
          <Pressable style={styles.card} onPress={() => this.card.flipVertical()}>
            <TouchableOpacity onPress={this.makeCall}>
            <Text style={styles.rowMember}>PHONE: {this.restaurantData[5]}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.viewInMap}>
            <Text style={styles.rowMember}>LOCATION: {this.restaurantData[6]}</Text>
            </TouchableOpacity>
            <View style={styles.infoRow}>
              <Text style={styles.rowMember}>RATING: {this.restaurantData[7]} Stars</Text>
              {/* <Star score={this.restaurantData[7] ? this.restaurantData[7] : 0} style={styles.starStyle} /> */}
            </View>
            <View style={styles.buttonCol}>
              <View style={styles.buttons}>
                <Feather.Button name="arrow-up-right" style={styles.buttonDetail} size={24} onPress={this.openWebsite}>
                Website
              </Feather.Button>
              </View>
              <View style={styles.buttons}>
                <Feather.Button name="arrow-up-right" style={styles.buttonDetail} size={24} onPress={this.makeReservation}>
                Reserve
              </Feather.Button>
              </View>
            </View>
          </Pressable>
        </FlipCard>
        <View style={styles.manualTriggers}>
          <Pressable
            style={styles.trigger}
            onPress={() => this.card.flipVertical()}>
            <Text style={{ color: 'white', fontSize: 20 }}>Expand Details</Text>
          </Pressable>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  cardContainer: {
    minWidth: 300,
    minHeight: 400,
  },
  card: {
    minWidth: 300,
    minHeight: 400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D8CFCD',
    borderRadius: 5,
    borderColor: '#000000',
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
  },
  label: {
    textAlign: 'center',
    fontSize: 30,
    fontFamily: 'System',
    color: '#000000',
    backgroundColor: 'transparent',
  },
  manualTriggers: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  trigger: {
    backgroundColor: 'black',
    margin: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
  },
  bucketRow: {
    backgroundColor: "transparent",
    flexDirection: "row",
    padding: 5,
  },
  infoRow: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: "1%"
  },
  rowMember: {
    textAlign: 'center',
    fontSize: 22,
    fontFamily: 'System',
    color: '#000000',
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    paddingHorizontal: "4%",
  },
  cuisineTypeBox: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'System',
    color: '#000000',
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    margin: "1%",
    borderColor: '#000000',
    borderWidth: 1.4,
    borderRadius: 6,
  },
  mapbox:{
    width: '75%',
    height: '60%',
    alignSelf: 'center',
    margin: '4%'
  },
  buttonCol: {
    flexDirection: 'column',
    color: '#ffffff',
    backgroundColor: 'transparent',
    margin: '3%'
  },
  buttons: {
    marginVertical: 10,
    backgroundColor: 'transparent',
  },
  buttonDetail: {
    backgroundColor: "#000000",
    color: "white",
    fontSize: 20,
  },
  starStyle: {
    width: 100,
    height: 20,
  },
});

