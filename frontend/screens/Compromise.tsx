import { Ionicons } from "@expo/vector-icons";
import { Link } from "@react-navigation/native";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function Compromise(sessionID) {
    let [fetchError, setFetchError] = useState("");
    let [compromiseListItems, setCompromiseListItems] = useState([]);

    let fetchCompromiseListItems = () => {
        fetch(`http://131.104.49.71:80/session/<${sessionID}>/results`, { method: 'GET'})
        .then(response => {
            response.json().then(data => {
                setCompromiseListItems(data);
            });
        })
        .catch(reason => {
            setFetchError(reason.toString().split(':')[1]);
        });
    }

    // Session/results 
    setCompromiseListItems([
        {
            name: 'Thai Tanic', 
            numLikes: 2,
            numDislikes: 1,
            numCraves: 0
        }
    ]);

    let compromiseListItem = item => 
        <View style={styles.listItemView}>
            <Text>{item.name}</Text>
            <View>
                <View style={styles.iconIndicator}>
                    <Text>{item.numCraves}</Text>
                    <Ionicons name="heart"></Ionicons>
                </View>
                <View style={styles.iconIndicator}>
                    <Text>{item.numLikes}</Text>
                    <Ionicons name="thumbs-up"></Ionicons>
                </View>
                <View style={styles.iconIndicator}>
                    <Text>{item.numDislikes}</Text>
                    <Ionicons name="thumbs-down"></Ionicons>
                </View>
            </View>
            <Link to={'/home'}>Choice Made</Link>
        </View>;

    return <>
        <Text style={styles.headerText}>Time's Up!</Text>
        <View>
            <View>
                <Text style={styles.subHeaderSm}>Now Let's</Text>
                <Text style={styles.subHeaderLg}>COMPROMISE</Text>
            </View>
            <FlatList data={compromiseListItems} renderItem={compromiseListItem}></FlatList>
            <Text>Choice Made</Text>
        </View>
    </>
}

const styles = StyleSheet.create({
    headerText: {
        fontSize: 32
    },
    subHeaderSm: {
        fontSize: 20
    },
    subHeaderLg: {
        fontSize: 24
    },
    listItemView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    iconIndicator: {
        flexDirection: 'row'
    }
});