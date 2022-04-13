import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useState, useEffect } from "react";
import { ListRenderItem, FlatList, SafeAreaView, StyleSheet, Pressable, StatusBar } from "react-native";
import Colors from '../constants/Colors';
import { Text } from './Themed';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Group } from '../constants/Interfaces';
import { faCropSimple } from "@fortawesome/free-solid-svg-icons";
import { apiRequestRetry } from "../utils/utils";

const Item = ({ data }) => {
  let navigation = useNavigation();
  return(<Pressable 
    onPress={() => {
      navigation.navigate('GroupDetails', data)
  }} 
    style={styles.container}>
    {data.isGroupLeader && data.groupId !== "9999999" ? <FontAwesomeIcon style={styles.groupLeader} icon="star" size={30}/> : null}
    <Text style={styles.name}>{data.groupName}</Text>
    <FontAwesomeIcon style={styles.name} icon="angle-right" size={30}/>
  </Pressable>);
}; 

export default function GroupList() {
  const [groupList, setGroupList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const isFocused = useIsFocused();
  const alone: Group[] = [  {
    groupId: "9999999",
    groupName: "Table for One",
    groupCode: "",
    isGroupLeader: true
  },]
  let list: Group[]
  
  useEffect(() => {
    async function getUserGroups() {
      const userId = await AsyncStorage.getItem("@userId");
      const url = `http://131.104.49.71:80/user/${userId}/groups`;
      const options = {headers: {'Accept': 'application/json'}}

      let userGroups = await apiRequestRetry(url, options, 10);
      setGroupList(userGroups);
      console.log(groupList);
    }
    getUserGroups()
  }, [isFocused]);

  const renderItem: ListRenderItem<Group> = ({ item }) => (
    <Item 
      data={item} 
      // select={() => setSelectedId(item.id)}
    />
  );
  
  return (
    <SafeAreaView style={styles.background}>
      <FlatList 
        data={alone.concat(groupList)}
        renderItem={renderItem}
        keyExtractor={(item) => item.groupId}
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
  groupLeader: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: "center",
    color: Colors.light.text,
    marginLeft: "5%",
    marginRight: "-5%"
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

