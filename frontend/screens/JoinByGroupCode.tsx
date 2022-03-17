import { StyleSheet } from 'react-native';

import EnterGroupCode from '../components/EnterGroupCode';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import ModalScreen from './ModalScreen';

export default function JoinByGroupCode({ navigation }: RootTabScreenProps<'TabOne'>) {
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
