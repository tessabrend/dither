import React, { useState, useEffect } from "react";
import { Pressable, TextInput, StyleSheet, Alert } from "react-native";
import { Text, View } from './Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function CreateGroup(setModalOpen) {
    let navigation = useNavigation();
    let [groupName, setGroupName] = useState("");
    let [error, setError] = useState("");
    const [userId, setUserId] = useState("");

    useEffect(() => {
        async function retrieveUserId() {
            let userID = await AsyncStorage.getItem("@userId");
            setUserId(userID);
        }
        retrieveUserId();
    }, [])

    let createGroup = () => {
        fetch('http://131.104.49.71:80/group/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: `GroupName=${groupName}&UserId=${userId}`
        })
        .then(response => {
            response.json().then(data => {
                if(data['message']) {
                    setError(data['message']);
                } else {
                    setError('');
                    setModalOpen(false);
                    alert(`Group Created Successfully`);
                    navigation.navigate("GroupList")
                }
            }).catch(error => {
                console.log("in creategroup.tsx, 1st catch");
                console.log(error)
                setError('Incorrect response format: likely due to internal error');
            });
        }).catch(reason => {
            console.log(Object.getOwnPropertyNames(reason));
        });
    }

    return <>
        <Text style={styles.headerText}>Create Group</Text>
        <View style={styles.groupNameView}>
            <TextInput style={error ? StyleSheet.flatten([styles.groupNameInput, styles.groupNameInputError]) : styles.groupNameInput} placeholder="Group Name" onChangeText={text => {setError(''); setGroupName(text); }}></TextInput>
            {error !== "" && 
                <Text style={styles.errorText}>{error}</Text>
            }
        </View>
        <Pressable style={styles.createGroupButton} onPress={createGroup}>
            <Text style={styles.buttonText}>Create</Text>
        </Pressable>
    </>
}

let styles = StyleSheet.create({
    headerText: {
        fontSize: 24,
        textAlign: 'center',
    },
    groupNameView: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 8,
        marginTop: 4
    },
    groupNameInput: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 20,
        padding: 8,
        paddingVertical: 12,
    },
    groupNameInputError: {
        borderColor: 'red'
    },
    createGroupButton: {
        backgroundColor: "#2196F3",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        flex: 1,
        margin: 8
    },
    buttonText: {
        color: 'white',
        fontSize: 24
    },
    errorText: {
        color: 'red'
    }
});