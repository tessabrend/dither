import { Ionicons } from "@expo/vector-icons";
import { Link } from "@react-navigation/native";
import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { RootTabScreenProps } from '../types';
import { useNavigation } from '@react-navigation/native';

export default function CompromiseScreen() {
    let [fetchError, setFetchError] = useState("");
    let [compromiseListItems, setCompromiseListItems] = useState([
            {
                id: 1,
                name: 'Thai Tanic', 
                numLikes: 2,
                numDislikes: 1,
                numCraves: 0
            }]);
    let sessionID = 1;

    let navigation = useNavigation();

    let fetchCompromiseListItems = () => {
        fetch(`http://131.104.49.71:80/session/1/results`, { method: 'GET'})
        .then(response => {
            response.json().then(data => {
                let items = [];
                for(let item in data) {
                    items.push({id: item, name: data[item]['name'], numLikes: data[item]['like'], numDislikes: data[item]['dislike'], numCraves: data[item]['crave']});
                }
                
                setCompromiseListItems(items);
            }).catch(reason => {
                setFetchError(reason.toString());
            });
        })
        .catch(reason => {
            setFetchError(reason.toString().split(':')[1]);
        });
    }

    fetchCompromiseListItems();

    let compromiseListItem = item => {
        return (<View style={styles.listItemView}>
            <Text style={styles.restaurantTitle}>{item.item.name}</Text>
            <View>
                <View style={styles.iconIndicator}>
                    <Text style={styles.restaurantDetailText}>{item.item.numCraves}</Text>
                    <Ionicons size={14} name="heart"></Ionicons>
                </View>
                <View style={styles.iconIndicator}>
                    <Text style={styles.restaurantDetailText}>{item.item.numLikes}</Text>
                    <Ionicons size={14} name="thumbs-up"></Ionicons>
                </View>
                <View style={styles.iconIndicator}>
                    <Text style={styles.restaurantDetailText}>{item.item.numDislikes}</Text>
                    <Ionicons size={14} name="thumbs-down"></Ionicons>
                </View>
            </View>
        </View>);
    }
    

    return <View style={styles.screen}>
        <Text style={styles.headerText}>Time's Up!</Text>
        <View style={styles.subHeaderView}>
            <Text style={styles.subHeaderSm}>Now Let's</Text>
            <Text style={styles.subHeaderLg}>COMPROMISE</Text>
        </View>
        <FlatList data={compromiseListItems} renderItem={compromiseListItem}></FlatList>
        {fetchError != "" && 
            <Text style={styles.errorText}>{fetchError}</Text>
        }
        <Pressable onPress={() => {navigation.reset({index: 0, routes: [{name: 'Home'}]}); }}>
            <Text style={styles.linkText}>Choice Made <Ionicons name="arrow-forward"></Ionicons></Text>
        </Pressable>
    </View>
}

const styles = StyleSheet.create({
    screen: {
        justifyContent: 'space-between',
        height: '100%',
        backgroundColor: 'white'
    },
    headerText: {
        fontSize: 32,
        textAlign: 'center',
        marginTop: 20,
    },
    subHeaderView: {
        marginTop: '15%'
    },
    restaurantDetailText: {
        marginRight: 5
    },
    subHeaderSm: {
        fontSize: 20,
        textAlign: 'center'
    },
    restaurantTitle: {
        textAlignVertical: 'center',
        fontSize: 20
    },
    subHeaderLg: {
        fontSize: 24,
        textAlign: 'center'
    },
    listItemView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 15,
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'black'
    },
    iconIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    linkText: {
        textAlign: 'right',
        margin: 8,
        color: '#2196F3'
    },
    errorText: {
        color: 'red'
    }
});