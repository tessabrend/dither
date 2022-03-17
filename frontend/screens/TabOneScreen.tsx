import React, { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import GroupPopup from '../components/GroupPopup';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import JoinByGroupCode from './JoinByGroupCode';
<<<<<<< HEAD
import { MoreDetails } from '../components/RestaurantInfo';

export default function TabOneScreen() {
  return (
   <MoreDetails/>
=======
import AddToGroup from './AddToGroup';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <AddToGroup></AddToGroup>
    </View>
>>>>>>> 8e9bbdb405ee0f889407e5931b3208b557ca2006
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
