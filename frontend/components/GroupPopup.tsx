import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, Pressable, KeyboardAvoidingView } from 'react-native';
import CreateGroup from './CreateGroup';
import EnterGroupCode from './EnterGroupCode';
import { Text, View } from './Themed';


export default function GroupPopup() {

    let [modalOpen, setModalOpen] = useState(false);
    let [currentAction, setCurrentAction] = useState('start');

    let actions = {
        start: <View style={styles.actionButtonContainer}>
                    <Pressable style={styles.actionButton} onPress={() => setCurrentAction('create')}>
                        <Text style={styles.buttonText}>Create New</Text>
                    </Pressable>
                    <Pressable style={styles.actionButton} onPress={() => setCurrentAction('join')}>
                        <Text style={styles.buttonText}>Join Existing</Text>
                    </Pressable>
                </View>,
        create: CreateGroup(),
        join: EnterGroupCode(),
    }

    return  <>
            <Modal animationType="slide" transparent={true} visible={modalOpen} onRequestClose={() => setModalOpen(false)}>
                <View style={styles.modalView}>
                    <View style={styles.popupContainer}>
                        <View style={styles.modalHeader}>
                            <View style={styles.backButton}>
                                {currentAction !== 'start' &&
                                    <Ionicons.Button name="md-arrow-back" 
                                                    color={'black'} 
                                                    backgroundColor='transparent'
                                                    underlayColor={'transparent'} 
                                                    size={32} 
                                                    onPress={() => setCurrentAction('start')}/>
                                }
                            </View>
                            <View style={styles.closeButton}>
                                <Ionicons.Button name="md-close" 
                                                color={'black'} 
                                                backgroundColor='transparent'
                                                underlayColor={'transparent'} 
                                                size={32} 
                                                onPress={() => { setCurrentAction('start'); setModalOpen(false); }}/>
                            </View>
                        </View>
                        {actions[currentAction]}
                    </View>
                </View>
            </Modal>
            <Ionicons.Button color={'black'} underlayColor={'transparent'} backgroundColor={'transparent'} name='add' size={36} onPress={() => setModalOpen(true)}></Ionicons.Button>
            </>;
}

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    popupContainer: {
        width: "75%",
        height: "40%",
    },
    modalHeader: {
        flexDirection: 'row'
    },
    backButton: {
        flex: 1,
        flexDirection: "row",
    },
    closeButton: {
        justifyContent: "space-evenly",
    },
    actionButtonContainer: {
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    actionButton: {
        backgroundColor: "#2196F3",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        paddingVertical: 24
    },
    buttonText: {
        color: 'white',
        fontSize: 24
    }
}); 