import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useEffect, useState } from "react";
import { ListRenderItem, FlatList, SafeAreaView, StyleSheet, Pressable, StatusBar } from "react-native";
import Colors from '../constants/Colors';
import { Text } from './Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

export interface Group {
  groupId: string;
  groupCode: string;  
  groupName: string;
  isGroupLeader: boolean;
}

const DATA: Group[] = [
  {
    groupId: "1",
    groupCode: "bd7acbea",
    groupName: "Roomies",
    isGroupLeader: false,
  },
  {
    groupId: "2",
    groupCode: "3ac68afc",
    groupName: "Homies",
    isGroupLeader: false,
  },
  {
    groupId: "3",
    groupCode: "58694a0f",
    groupName: "Dev Team",
    isGroupLeader: false,
  },
  {
    groupId: "4",
    groupCode: "ghc69a34",
    groupName: "Dream Team",
    isGroupLeader: false,
  },
];

const Item = (props: { 
  data : any
  }) => {
  const { data } = props;
  // let leader
  // leader = <FontAwesomeIcon style={styles.name} icon="crown" size={26}/>
  // if (data.isGroupLeader == false) {
  //   leader = null
  // };
  let navigation = useNavigation();
  return(
    <Pressable 
      onPress={() => {
        navigation.navigate('GroupDetails')
      }} 
      style={styles.container}>
      <Text style={styles.name}>{data.groupName}</Text>
      <FontAwesomeIcon style={styles.name} icon="angle-right" size={30}/>
    </Pressable>
  )
}; 

export default function GroupList() {
  const [grouplist, setGroupList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [userId, setUserId] = useState("");

  const alone: Group[] = [  {
    groupId: "9999999",
    groupCode: "9999999",
    groupName: "Table for One",
    isGroupLeader: true
  },]

  // useEffect(() => {
  //   async function retrieveUserId() {
  //       let userID = await AsyncStorage.getItem("@userId");
  //       setUserId(userID);
  //   }
  //   retrieveUserId();
  // }, [])

  // let url = "//131.104.49.71:80/user/" + userId + "/groups"
  
  // let retrieveGroups = () => {
  //   fetch(url, {
  //     method:'GET'
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     setGroupList(data.groups)
  //   })
  // }

  const renderItem: ListRenderItem<Group> = ({ item }) => (
    <Item 
      data={item} 
      // select={() => setSelectedId(item.id)}
    />
  );
  
  return (
    <SafeAreaView style={styles.background}>
      <FlatList 
        // {...retrieveGroups}
        data={alone.concat(DATA)}
        renderItem={renderItem}
        keyExtractor={(item) => item.groupCode}
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
    width: "86%",
    height: 73,
    marginHorizontal: "5%",
  }, 
});

