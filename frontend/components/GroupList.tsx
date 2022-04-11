import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useState, useEffect } from "react";
import { ListRenderItem, FlatList, SafeAreaView, StyleSheet, Pressable, StatusBar } from "react-native";
import Colors from '../constants/Colors';
import { Text } from './Themed';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Group {
  groupCode: string,
  groupId: string,
  groupName: string,
  isGroupLeader: boolean,
}

const Item = ({ data }) => {
  let navigation = useNavigation();
  return(<Pressable 
    onPress={() => {
      navigation.navigate('GroupDetails')
  }} 
    style={styles.container}>
    <Text style={styles.name}>{data.groupName}</Text>
    <FontAwesomeIcon style={styles.name} icon="angle-right" size={30}/>
  </Pressable>);
}; 

export default function GroupList() {
  const [groupList, setGroupList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const alone: Group[] = [  {
    groupId: "9999999",
    groupName: "Table for One",
    groupCode: "",
    isGroupLeader: true
  },]
  let list: Group[]
  
  useEffect(() => {
    async function checkUserExists() {
      // Checks if the user exists, and if not creates a temporary one for them
        const userId = await AsyncStorage.getItem("@userId");
        let updatedUserId = fetch('http://131.104.49.71:80/user/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: userId !== null ? `userId=${userId}` : ''
        })
        .then(response => response.json())
        .then(async (data) => {
            await AsyncStorage.setItem('@userId', data.userId)
            return data.userId;
        }).catch(error => {
          console.log(error)
          return -1;
        });
        return updatedUserId;
    }
    async function getUserGroups() {
      let userId = await checkUserExists();
      console.log(userId);
      fetch(`http://131.104.49.71:80/user/${userId}/groups`)
      .then(response => response.json())
      .then(data => {
        setGroupList(data);
        console.log(data);
      })
      .catch(err => {
        console.log(err);
        alert("an internal error occured.\nFor now only the table for one option is available.")
      });
    }
    getUserGroups()
  }, []);

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

