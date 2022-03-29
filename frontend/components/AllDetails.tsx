import React from "react";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Colors from '../constants/Colors';
import { Text, View } from './Themed';
import CardFlip from 'react-native-card-flip';

const enum Price {
  Low = '$',
  Medium = '$$',
  High = '$$$'
}

export default function ConsensusMade() {
  const restaurantData = ['Restaurant Name' , Price.Medium, '0.5km', 'Pub' ];//temp data

  // <View style={styles.background}>
  //     <View style={styles.headerWrapper}>
  //       <Text style={styles.title}>Consensus Made!</Text>
  //     </View>

  //     <View style={styles.container}>
  //       <Text style={styles.name}>{restaurantData[0]}</Text>
  //       <View style={styles.detailRow}>
  //         <View style={styles.hiddenCard}>
  //           <FontAwesomeIcon icon="dollar-sign" size={20}/>
  //           <FontAwesomeIcon icon="dollar-sign" size={20}/>
  //         </View>
  //         <View style={styles.hiddenCard}>
  //           <Text style={styles.detailText}>{restaurantData[2]}</Text>
  //         </View>
  //         <View style={styles.cuisineCard}>
  //           <Text style={styles.detailText}>{restaurantData[3]}</Text>
  //         </View>
  //       </View>

  //       {/* replace with mapview when provider added */}
  //       <Image style={styles.mapbox}
  //             source={{uri: 'https://i.stack.imgur.com/SlwjS.png'}}
  //           />
  //     </View>

  //     <View style={styles.footer}></View>
  //   </View>


  return (
    <View>
        <CardFlip style={styles.container} ref={(card) => this.card = card} >
    <TouchableOpacity style={styles.background} onPress={() => this.card.flip()} ><Text>AB</Text></TouchableOpacity>
    <TouchableOpacity style={styles.background} onPress={() => this.card.flip()} ><Text>CD</Text></TouchableOpacity>
  </CardFlip>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.light.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerWrapper: {
    width: "100%",
    height: "15%",
    maxHeight: "15%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
  }, 
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    justifyContent: "center",
    alignSelf: "center"
  }, 
  name: {
    fontSize: 25,
    fontWeight: 'bold',
    justifyContent: 'flex-start',
    alignSelf: "center",
    paddingBottom: "3%"
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.dark.background,
    borderStyle: "solid",
    justifyContent: "center",
    flexDirection: 'column',
    width: "75%",
    height: "70%",
    margin: "2%"
  },
  hiddenCard: {
    backgroundColor: Colors.light.background,
    justifyContent: "center",
    flexDirection: "row",
    padding: "1%",
  },
  cuisineCard: {
    borderColor: Colors.dark.background,
    borderRadius: 10,
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: Colors.light.background,
    justifyContent: "center",
    flexDirection: "row",
    padding: "1%",
  },
  subtitleText: {
    fontSize: 22,
    fontStyle: 'italic',
    textAlign: 'center'
  },
  detailRow: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    textAlign: "center",
    fontSize: 20,
    justifyContent: "space-around"
  },
  mapbox:{
    width: '75%',
    height: '60%',
    alignSelf: 'center',
    margin: '4%'
  },
  footer: {
    margin: "2%",
    flexDirection: 'column-reverse',
    alignContent: 'flex-end'
  },
});

