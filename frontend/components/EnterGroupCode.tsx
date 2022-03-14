import { Text, View } from './Themed';
import { 
    StyleSheet, 
    TextInput, 
    Pressable
 } from 'react-native';
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view';
import React, { useState } from 'react';
import { useLinkProps } from '@react-navigation/native';

export default function EnterGroupCode(setModalOpen) {
    const [groupCode, setGroupCode] = useState("");
    const [userName, setUserName] = useState("")
    const [error, setError] = useState("");
    let submit = () => {
        fetch('http://131.104.49.71:80/group/join', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `groupEntryCode=${groupCode}&UserName=${userName}`
        })
        .then(response => {
            response.json().then(data => {
                if(data['message'] == "User added in group in database") {
                    alert("You have successfully joined the group " + data["groupName"])
                    setError(null);
                    setModalOpen(false);
                } else {
                    setError(data['message']);
                }
            }).catch(error => {
                console.log(error)
                setError('Incorrect response format: likely due to internal error');
            });
        }).catch(reason => {
            console.log(reason)
            setError(reason.toString().split(':')[1]);
        });
    }
    
    return (<KeyboardAvoidingScrollView 
        style={styles.container}>
        <View style={styles.headerWrapper}>
            <Text style={styles.header}>Join Group</Text>
        </View>
        {error ? <Text style={styles.invalidCode}>{error}</Text> : null}
        <View style={styles.input}>
            <TextInput 
                nativeID='groupCode' 
                style={styles.textBox}
                placeholder="Group Code"
                onChangeText={(text: string) => {
                    setGroupCode(text);
                }}
            ></TextInput>
            <TextInput
                nativeID="userName"
                style={styles.textBox}
                placeholder="Your name"
                onChangeText={(text: string) => {
                    setUserName(text);
                }}
            ></TextInput>
        </View>
        <Pressable 
            style={styles.submitButton} 
            onPress={submit}>
            <Text style={styles.buttonText}>Enter</Text>
        </Pressable>
    </KeyboardAvoidingScrollView>);
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        minHeight: 182,
        backgroundColor: "white",
    },
    headerWrapper: {
        flex: 1,
        maxHeight: '20%',
        height: "20%",
    },
    header: {
        textAlign: "center",
        fontSize: 25,
        fontWeight: 'bold',
        height: "95%",
        maxHeight: "95%",
        marginBottom: "5%"
    },
    input: {
        flex: 1,
        width: "100%",
        maxHeight: "40%",
        height: "40%",
        justifyContent: "center",
        alignItems: "center"
    },
    textBox: {
        flex: 1,
        width: "80%",
        height: "100%",
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 20,
        fontSize: 20,
        marginBottom: "2%"
    },
    buttonText: {
        fontSize: 24,
        color: "white",
    },
    invalidCode: {
        color: "red",
        textAlign: "center"
    },
    submitButton: {
        backgroundColor: "#2196F3",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        flex: 1,
        margin: 8,
        height: "20%",
        maxHeight: "20%"
    }
});