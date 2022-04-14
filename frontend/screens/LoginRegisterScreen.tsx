import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import validator from 'validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { DeviceEventEmitter } from "react-native"

export function LoginRegisterScreen({route, navigation}) {
    const LOGIN = false;
    const REGISTER = true;

    let [email, setEmail] = useState("");
    let [error, setError] = useState("");
    let [password, setPassword] = useState("");
    let [emailValid, setEmailValid] = useState(true);
    let [passwordValid, setPasswordValid] = useState(true);
    let [action, setAction] = useState(false);
    let [userLoggedIn, setUserLoggedIn] = useState("false");

    const [userId, setUserId] = useState("");
    const navigator = useNavigation();

    let validateEmail = () => {
        let _emailValid = validator.isEmail(email);
        setEmailValid(_emailValid);
        return _emailValid;
    }

    let validatePassword = () => {
        let _passwordValid = validator.isAlphanumeric(password);
        setPasswordValid(_passwordValid);
        return passwordValid;
    }

    let validate = () => {
        return validateEmail() && validatePassword();
    }

    useEffect(() => {
        async function retrieveUserId() {
            let userID = await AsyncStorage.getItem("@userId");
            setUserId(userID || "");
        }
        retrieveUserId();

        (async () => {
            setUserLoggedIn(await AsyncStorage.getItem('@userLoggedIn') || "false");
        })();
    }, []);

    let login = () => {
        setError("");
        if(validate()) {
            fetch('http://131.104.49.71:80/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `Email=${email}&Password=${password}`
            })
            .then(response => {
                response.json().then(data => {
                    if(data['message'] !== "OK") {
                        setError(data['message']);
                    } else {
                        setError('');
                        AsyncStorage.setItem('@userId', `${data['userID']}`).then(() => {
                            AsyncStorage.setItem('@userLoggedIn', 'true').then(() => {
                                DeviceEventEmitter.emit('event.userUpdate');
                                navigator.goBack();
                            }).catch(error => alert(error));
                        }).catch(error => alert(error));
                    }
                }).catch(error => {
                    setError('Incorrect response format: likely due to internal error');
                });
            }).catch(reason => {
                setError(reason.toString().split(':')[1]);
            });
        } else {
            setError('Cannot register, please check email and password validity');
        }
    }

    let register = () => {
        setError("");
        if(validate() && userId) {
            fetch(`http://131.104.49.71:80/user/${userId}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `Email=${email}&Password=${password}`
            })
            .then(response => {
                response.json().then(data => {
                    if(data['message'] !== "OK") {
                        setError(data['message']);
                    } else {
                        setError('');
                        AsyncStorage.setItem('@userId', userId).then(() => {
                            AsyncStorage.setItem('@userLoggedIn', 'true').then(() => {
                                DeviceEventEmitter.emit('event.userUpdate');
                                navigator.goBack();
                            }).catch(error => alert(error));
                        }).catch(error => alert(error));
                    }
                }).catch(error => {
                    setError('Incorrect response format: likely due to internal error');
                });
            }).catch(reason => {
                setError(reason.toString().split(':')[1]);
            });
        } else {
            setError('Cannot register, please check email and password validity');
        }
    }

    let actions = [login, register];

    return <>
        <View style={styles.outerContainer}>
            <Text style={styles.headerText}>{action == LOGIN ? (userLoggedIn == 'true' ? "Switch User" : "Login") : "Register"}</Text>
            <View style={emailValid ? styles.inputField : StyleSheet.flatten([styles.inputField, styles.error])}>
                <TextInput placeholder='Email Address' onChangeText={(email) => {setEmail(email); validateEmail();}}></TextInput>
            </View>
            <View style={passwordValid ? styles.inputField : StyleSheet.flatten([styles.inputField, styles.error])}>
                <TextInput placeholder='Password' onChangeText={(password) => {setPassword(password); validatePassword();}}></TextInput>
            </View>
            { error ? <Text style={StyleSheet.flatten([styles.error, { marginTop: 0, marginBottom: 16 }])}>{error}</Text> : <></> }
            <Pressable style={styles.primaryButton} onPress={() => {actions[+action]()}}> 
                <Text style={styles.buttonText}>
                    {action == LOGIN ? "Login" : "Register"}
                </Text>
            </Pressable>
            {
                ((action == LOGIN && userLoggedIn == "true") == false) ? 
                <Pressable onPress={() => setAction(!action)}>
                    <Text style={styles.linkText}>{action == LOGIN ? "Don't have an account?" : "Already have an account?"}</Text>
                </Pressable> : <></>
            }
        </View>
    </>
}

const styles = StyleSheet.create({
    outerContainer: {
        display: 'flex',
        padding: 48,
        height: '100%'
    },
    headerText: {
        fontSize: 24,
        marginBottom: 24
    },
    inputField: {
        marginVertical: 16,
        marginTop: 8,
        borderStyle: 'solid',
        borderWidth: 1,
        padding: 8
    },
    primaryButton: {
        backgroundColor: "#2196F3",
        padding: 8
    },
    buttonText: {
        fontSize: 24,
        color: 'white',
        textAlign: "center"
    },
    linkText: {
        color: "blue",
        marginTop: 8
    },
    error: {
        borderColor: 'red',
        color: 'red'
    }
});