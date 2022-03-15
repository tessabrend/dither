import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
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
  {
    id: "ghc69a34",
    name: "Dream Team",
  },
  {
    id: "55578a0f",
    name: "Michael",
  },
  {
    id: "3asdfg45c",
    name: "350 Bloor",
  },
  {
    id: "545b7an8",
    name: "Cabin Seven",
  },
];

const Item = ({ data }: { data: Restaurant }) => (
  <Pressable 
    onPress={() => {
  }} 
    style={styles.container}>
    <Text style={styles.name}>{data.name}</Text>
    <FontAwesomeIcon style={styles.name} icon="angle-right" size={30}/>
  </Pressable>
); 

const renderItem: ListRenderItem<Restaurant> = ({ item }) => (
  <Item 
    data={item} 
    // select={() => setSelectedId(item.id)}
  />
);

export default function GroupList() {
  const [selectedId, setSelectedId] = useState(null);
  const alone: Restaurant[] = [  {
    id: "456ghjjh",
    name: "Table for One",
  },]
  
  return (
    <SafeAreaView style={styles.background}>
      <FlatList 
        data={alone.concat(DATA)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#DDD", //Colors.light.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
    justifyContent: 'space-between',
    alignSelf: "center",
    color: Colors.light.text,
    marginLeft: "10%",
    marginRight: "10%",
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.dark.background,
    borderStyle: "solid",
    justifyContent: "space-between",
    alignContent: "center",
    width: "80%",
    height: 73,
    marginHorizontal: "5%",
  }, 
});

