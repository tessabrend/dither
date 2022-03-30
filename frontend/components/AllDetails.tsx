import React, {Component} from "react";
import { StyleSheet, Image, Pressable, TouchableOpacity } from "react-native";
import { Text, View } from './Themed';
import FlipCard from "react-native-flip-card-plus";
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Feather } from '@expo/vector-icons';

const enum Price {
  Low = '$',
  Medium = '$$',
  High = '$$$'
}

export default class AllDetailsCard extends Component {
  restaurantData = ['Restaurant Name' , Price.Medium, '0.5km', 'Pub', 
  'https://google.com', '000-000-0000', '123 Alphabet Street', '3 stars', 'https://www.opentable.ca/r/' ];//temp data

  openWebsite = () => {
    WebBrowser.openBrowserAsync(this.restaurantData[4]);
  };

  makeReservation = () => {
    WebBrowser.openBrowserAsync(this.restaurantData[8]);
  };

  makeCall = () => {
    Linking.openURL(`tel:${this.restaurantData[5]}`);
  };

  viewInMap = () => {
    let url = 'https://www.google.com/maps/search/?api=1&query='+this.restaurantData[6]
    Linking.openURL(url)
  };

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
            <Text style={styles.rowMember}>{this.restaurantData[1]}</Text>
              <Text style={styles.rowMember}>{this.restaurantData[2]}</Text>
              <Text style={styles.rowMember}>{this.restaurantData[3]}</Text>
            </View>
            <Image style={styles.mapbox}
               source={{uri: 'https://i.stack.imgur.com/SlwjS.png'}}
             />
          </Pressable>
          <Pressable style={styles.card} onPress={() => this.card.flipVertical()}>
            <TouchableOpacity onPress={this.makeCall}>
            <Text style={styles.rowMember}>PHONE: {this.restaurantData[5]}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.viewInMap}>
            <Text style={styles.rowMember}>LOCATION: {this.restaurantData[6]}</Text>
            </TouchableOpacity>
            <Text style={styles.rowMember}>RATING: {this.restaurantData[7]}</Text>
            <View style={styles.buttonCol}>
              <View style={styles.buttons}>
                <Feather.Button name="arrow-up-right" size={24} backgroundColor="#000000" color="white"onPress={this.openWebsite}>
                Website
              </Feather.Button>
              </View>
              <View style={styles.buttons}>
                <Feather.Button name="arrow-up-right" size={24} backgroundColor="#000000" color="white"onPress={this.makeReservation}>
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
            <Text style={{ color: 'white' }}>Expand Details</Text>
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
    width: 300,
    height: 400,
  },
  card: {
    width: 300,
    height: 400,
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
  infoRow: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  rowMember: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'System',
    color: '#000000',
    backgroundColor: 'transparent',
    margin: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
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
  },
  buttons: {
    marginVertical: 10,
    backgroundColor: 'transparent',
  }

});

