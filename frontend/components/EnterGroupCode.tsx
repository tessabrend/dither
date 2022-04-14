import { Text, View } from './Themed';
import { 
    StyleSheet, 
    TextInput, 
    Pressable
 } from 'react-native';
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequestRetry } from '../utils/utils';
import { useNavigation } from '@react-navigation/native';

export default function EnterGroupCode(setModalOpen, setCurrentAction) {
    const [groupCode, setGroupCode] = useState("");
    const [userName, setUserName] = useState("");
    const [error, setError] = useState("");
    const [userId, setUserId] = useState("");
    let navigation = useNavigation();

    useEffect(() => {
        async function retrieveUserId() {
            let userID = await AsyncStorage.getItem("@userId");
            setUserId(userID);
        }
        retrieveUserId();
    }, [])

    let submit = () => {
        const url = 'http://131.104.49.71:80/group/join';
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: `groupEntryCode=${groupCode}&UserName=${userName}&UserId=${userId}`
        }
        apiRequestRetry(url, options, 10).then(res => {
            setModalOpen(false);
            setCurrentAction('start');
            console.log(res);
            if(res.message) {
                alert(res.message);
                navigation.reset({index: 0, routes: [{name: "GroupList" }]});
            } else {
                navigation.navigate("GroupDetails", {
                    "groupCode": res.GroupEntryCode,
                    "groupId": res.id,
                    "groupName": res.GroupName,
                    "isGroupLeader": true
                });    
            }
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
            onPress={() => submit()}>
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