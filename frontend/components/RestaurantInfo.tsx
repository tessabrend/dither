import React, { Component, useState } from "react";
import { StyleSheet, Pressable, Text, Modal, View, Alert } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';

export class datials extends Component {

    constructor(props) {
      super(props);
      this.more = this.more.bind(this);
  }

  more() {    
    this.props.show;
  }

  render() {
    return (
      <>
        <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.more}
          presentationStyle="pageSheet"
          onRequestClose={this.more}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hello World!</Text>
            </View>
          </View>
        </Modal>
      </View>
      </>
    )
  };
}

export const AllDetails = () => {

}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
}); 