import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useState } from "react";
import { ListRenderItem, FlatList, SafeAreaView, StyleSheet, Pressable, StatusBar } from "react-native";
import Colors from '../constants/Colors';
import { Text } from './Themed';

export interface Group {
  id: string;
  name: string;
  members: Array<any>;
}

const DATA: Group[] = [
  {
    id: "bd7acbea",
    name: "Roomies",
    members: [""],
  },
  {
    id: "3ac68afc",
    name: "Homies",
    members: [""],
  },
  {
    id: "58694a0d",
    name: "Dev Team",
    members: [""],
  },
  {
    id: "ghc69a34",
    name: "Dream Team",
    members: [""],
  },
  {
    id: "55578a0f",
    name: "Michael",
    members: [""],
  },
  {
    id: "3asdfg45c",
    name: "350 Bloor",
    members: [""],
  },
  {
    id: "545b7an8",
    name: "Cabin Seven",
    members: [""],
  },
];

const Item = ({ data }: { data: Group }) => (
  <Pressable 
    onPress={() => {
  }} 
    style={styles.container}>
    <Text style={styles.name}>{data.name}</Text>
    <FontAwesomeIcon style={styles.name} icon="angle-right" size={30}/>
  </Pressable>
); 

const renderItem: ListRenderItem<Group> = ({ item }) => (
  <Item 
    data={item} 
    // select={() => setSelectedId(item.id)}
  />
);

export default function GroupList() {
  const [grouplist, setGroupList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const alone: Group[] = [  {
    id: "9999999",
    name: "Table for One",
    members: [""],
  },]
  let list: Group[]
  
  let retrieveGroups = () => {
    // fetch("//131.104.49.71:80/group/find", {
    //   method:'GET'
    // })
    // .then(response =>response.json())
    // .then(data => {
    //   setGroupList(data.groups)
    //   console.log(grouplist)
    // })
  }

  return (
    <SafeAreaView style={styles.background}>
      <FlatList 
        {...retrieveGroups}
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

