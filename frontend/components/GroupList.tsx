import React, { useState } from "react";
import { ListRenderItem, FlatList, SafeAreaView, StyleSheet, TouchableOpacity, Pressable, StatusBar } from "react-native";
import Colors from '../constants/Colors';
import { Text, View } from './Themed';

export interface Restaurant {
  id: string;
  name: string;
}

const DATA: Restaurant[] = [
  {
    id: "bd7acbea",
    name: "Roomies",
  },
  {
    id: "3ac68afc",
    name: "Homies",
  },
  {
    id: "58694a0f",
    name: "Dev Team",
  },
];

const Item = ({ data }: { data: Restaurant }) => (
  <Pressable 
    onPress={() => {
      // setTimesPressed((current) => current + 1);
    }} 
    style={styles.container}>
    <Text style={styles.name}>{data.name}</Text>
  </Pressable>
); 

export default function GroupList() {
  const [selectedId, setSelectedId] = useState(null);

  const renderItem: ListRenderItem<Restaurant> = ({ item }) => (
    <Item 
      data={item} 
      // select={() => setSelectedId(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.background}>
      <Pressable 
        style={styles.alone}
        onPress={() => {
          // setTimesPressed((current) => current + 1);
        }} >
        <Text style={styles.name}>Table for One</Text>
      </Pressable>
      <FlatList 
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
      />
    </SafeAreaView>
  );
    

  // return (
  //   <View style={styles.background}
  //     <View style={styles.container}>
  //       <Text style={styles.name}>{groupNames[1]}</Text>
  //     </View>
  //   </View>
  // );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#AAA", //Colors.light.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
    justifyContent: 'flex-start',
    alignSelf: "center",
    color: Colors.light.text
  },
  alone: {
    flex: 1,
    flexDirection: 'row',
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: Colors.light.background,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.dark.background,
    borderStyle: "solid",
    justifyContent: "center",
    width: "85%",
    margin: "6%"
  },
  container: {
    flex: 1.3,
    flexDirection: 'row',
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: Colors.light.background,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.dark.background,
    borderStyle: "solid",
    justifyContent: "center",
    width: "85%",
    margin: "6%"
  }, 
  // item: {
  //   padding: 20,
  //   marginVertical: 8,
  //   marginHorizontal: 16,
  //   color: Colors.light.background,
  // },

});

