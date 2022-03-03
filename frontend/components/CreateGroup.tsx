import React, { useState } from "react";
import { Pressable, TextInput, StyleSheet, Alert } from "react-native";
import { Text, View } from './Themed';

export default function CreateGroup() {

    let [groupName, setGroupName] = useState("");
    let [error, setError] = useState("");
    let createGroup = () => {
        fetch('http://131.104.49.71:80/group/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `GroupName=${groupName}`
        })
        .then(response => {
            response.json().then(data => {
                if(data['message']) {
                    setError(data['message']);
                } else {
                    setError('');
                    alert(`Group Created Successfully: ${JSON.stringify(data)}`);
                }
            }).catch(error => {
                setError('Incorrect response format: likely due to internal error');
            });
        }).catch(reason => {
            setError(reason.toString().split(':')[1]);
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