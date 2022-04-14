import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useState, useEffect } from "react";
import { ListRenderItem, FlatList, SafeAreaView, StyleSheet, Pressable, StatusBar, Dimensions } from "react-native";
import Colors from '../constants/Colors';
import { Text, View } from './Themed';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Group } from '../constants/Interfaces';
import { faCropSimple } from "@fortawesome/free-solid-svg-icons";
import { apiRequestRetry } from "../utils/utils";

const screen = Dimensions.get("screen");

const Item = (props: { 
  data : any
  }) => {
  const { data } = props;
  let isLeader = data.isGroupLeader;
  let navigation = useNavigation();
  let newName = data.groupName;
  if (data.groupName.length > 15) {
    newName = data.groupName.slice(0,15).concat("...");
  }

  if (isLeader && data.groupId != "9999999") {
    return(
      <Pressable 
        onPress={() => {
          navigation.navigate('GroupDetails')
        }} 
        style={styles.container}>
        <View style={styles.spacer}>
          <View style={styles.nameContainer}>
            <FontAwesomeIcon style={styles.leaderIcon} icon="crown" size={26}/>
            <Text style={styles.leaderName}>{newName} </Text>
          </View>
          <FontAwesomeIcon style={styles.arrowIcon} icon="angle-right" size={30}/>
        </View>
      </Pressable>
    )
  } else {
    return(
      <Pressable 
        onPress={() => {
          navigation.navigate('GroupDetails')
        }} 
        style={styles.container}>
        <Text style={styles.name}>{data.groupName}</Text>
        <FontAwesomeIcon style={styles.arrowIcon} icon="angle-right" size={30}/>
      </Pressable>
    )
  };
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
  leaderName: {
    fontSize: 25,
    fontWeight: 'bold',
    justifyContent: 'space-between',
    alignSelf: "center",
    color: Colors.light.text,
    marginLeft: "4%",
    marginRight: "10%",
  },
  leaderIcon: {
    color: "#FFC107",
    alignSelf: "center",
  },
  arrowIcon: {
    justifyContent: 'flex-end',
    alignSelf: "center",
    marginRight: "5%",
  },
  nameContainer: {
    flex: 1,
    flexDirection: "row",
    marginLeft: "8%",
  },
  spacer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "100%",
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
    alignSelf: "center",
    width: screen.width - 50,
    height: 73,
    marginHorizontal: "5%",
  },  
});

