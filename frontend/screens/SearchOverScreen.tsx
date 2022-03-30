import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AllDetailsCard from '../components/AllDetails';

import { RootTabScreenProps } from '../types';

export default function ConsensusReveal() {
  return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Everyone likes:</Text>
        <AllDetailsCard/>
      </View>
      
     
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  messageText: {
    textAlign: "center",
    fontSize: 20,
    bottom: 1,
  },
})