import { Text, View } from './Themed';
import { TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';

export default function EnterGroupCode({ path }: { path: string }) {
    const [groupCode, setGroupCode] = useState("");
    const [error, setError] = useState(false);

    function submitGroupCode() {
        alert(groupCode);
        // ajax call here
        // call setError if group code is invalid
    }
    
    return <View style={styles.popupContainer}>
        <View style={styles.actionButtonWrapper}>
            <View style={styles.backButton}>
                <Ionicons name="md-arrow-back" size={32}/>
            </View>
            <View style={styles.closeButton}>
                <Ionicons name="md-close" size={32}/>
            </View>
        </View>
        <View style={styles.headerWrapper}>
            <Text style={styles.header}>Join Group</Text>
        </View>
        {error ? <Text style={styles.invalidCode}>Invalid Group Code</Text> : null}
        <View style={styles.input}>
            <TextInput 
                nativeID='groupCode' 
                style={styles.textBox}
                placeholder="Group Code"
                onChangeText={(text) => {
                    setGroupCode(text);
                }}
            ></TextInput>
        </View>
        <View style={styles.buttonWrapper}>
            <TouchableOpacity 
                style={styles.buttonArea} 
                activeOpacity={0.8}
                onPress={() => {
                    submitGroupCode();
                }}
            >
                <Text style={styles.buttonText}>Enter</Text>
            </TouchableOpacity>
        </View>
    </View>
}

const styles = StyleSheet.create({
    popupContainer: {
        width: "75%",
        height: "40%",
    },
    actionButtonWrapper: {
        height: "15%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 0,
    },
    backButton: {
        flex: 1,
        flexDirection: "row",
        paddingLeft: "4%"
    },
    closeButton: {
        justifyContent: "space-evenly",
        paddingRight: "4%"
    },
    headerWrapper: {
        flex: 1,
        width: "100%",
        height: "25%",
        maxHeight: "25%",
        justifyContent: "center",
    },
    header: {
        textAlign: "center",
        fontSize: 25,
        fontWeight: 'bold',
        height: "60%",
        maxHeight: "60%",
    },
    input: {
        flex: 1,
        width: "100%",
        maxHeight: "20%",
        height: "20%",
        justifyContent: "center",
        alignItems: "center"
    },
    textBox: {
        flex: 1,
        width: "80%",
        height: "70%",
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 20,
        fontSize: 20
    },
    buttonWrapper: {
        height: "25%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonArea: {
        width: "50%",
        height: "45%",
        backgroundColor: "#2196F3",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4
        
    },
    buttonText: {
        fontSize: 25,
        color: "white",
    },
    invalidCode: {
        color: "red",
        textAlign: "center"
    }

});