import { Text, View } from './Themed';
import { TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import React, { useState } from 'react';

export default function EnterGroupCode() {
    const [groupCode, setGroupCode] = useState("");
    const [error, setError] = useState(false);

    function submitGroupCode() {
        alert(groupCode);
        // ajax call here
        // call setError if group code is invalid
    }
    
    return <>
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
    </>;
}

const styles = StyleSheet.create({
    headerWrapper: {
        flex: 1,
        maxHeight: '25%'
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