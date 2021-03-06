import { StyleSheet } from 'react-native';

import EnterGroupCode from '../components/EnterGroupCode';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import ModalScreen from './ModalScreen';

export default function JoinByGroupCode() {
  return (
    <View style={styles.container}>
      <EnterGroupCode/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#888"
  },
});
