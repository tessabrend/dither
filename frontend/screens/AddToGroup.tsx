import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '../components/Themed';

export default function AddToGroup(groupID : Number) {

    let [inputError, setInputError] = useState('');
    let [groupEntryCode, setGroupEntryCode] = useState('');
    let [inviteEmail, setInviteEmail] = useState('');

    const validateEmail = (email : String) => {
        return email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };


    let getInviteCode = () => {
        // fetch('http://131.104.49.71:80/group/find')
    }

    let sendInvitation = () => {
        // First, validate the email
        if(!validateEmail(inviteEmail)) {
            setInputError('Invalid email address');
            return;
        }

        // Then, send the invitation request
        fetch('http://131.104.49.71:80/group/invite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `GroupID=${groupID}&InviteEmail=${inviteEmail}`
        })
        .then(response => {
            response.json().then(data => {
                    setInputError('');
                    alert(`Invitation Email Sent`);
            }).catch(error => {
                setInputError('Incorrect response format: likely due to internal error');
            });
        }).catch(reason => {
            setInputError(reason.toString().split(':')[1]);
        });
    }

    return <View style={styles.screen}>
        <Text style={styles.headerText}>Group Invitations</Text>
        <View style={{flexGrow: 1, justifyContent: 'space-around'}}>
            <View>
                <Text style={styles.subHeaderText}>Group Entry Code</Text>
                <View style={styles.container}>
                    <Text style={styles.codeText}>ABC DEF</Text>    
                </View>
                <Text>A user can join the group manually by entering this code in their side of the app. </Text>
            </View>
            <View>
                <Text style={styles.subHeaderText}>Invite Group Member</Text>
                <View style={{flexDirection: 'column'}}>
                    <View style={{flexDirection: 'row'}}>
                        <TextInput nativeID='inviteEmail' style={styles.textBox} placeholder='Invite Email' onChangeText={(text) => setInviteEmail(text)}></TextInput>
                    </View>
                    {inputError !== "" && 
                            <Text style={styles.errorText}>{inputError}</Text>
                    }
                </View>
                <Pressable style={styles.actionButton} onPress={sendInvitation}>
                    <Text style={styles.buttonText}>Invite</Text>
                </Pressable>
            </View>
        </View>
    </View>
}

const styles = StyleSheet.create({
    screen: {
        height: '100%',
        width: '100%',
        padding: 16
    },
    headerText: {
        fontSize: 36,
        alignSelf: 'flex-start'
    },
    subHeaderText: {
        fontSize: 20,
    },
    actionButton: {
        backgroundColor: "#2196F3",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        paddingVertical: 16
    },
    buttonText: {
        color: 'white',
        fontSize: 24
    },
    codeText: {
        fontSize: 24
    },
    textBox: {
        flex: 1,
        width: "80%",
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 20,
        fontSize: 20,
        paddingVertical: 16,
        marginBottom: 4
    },
    container: {
        borderColor: 'black',
        borderStyle: 'solid',
        borderRadius: 2,
        borderWidth: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 6
    },
    errorText: {
        color: 'red'
    }
});