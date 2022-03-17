import React from 'react';
import GroupList from '../components/GroupList';
import Compromise from './CompromiseScreen';
import { RootTabScreenProps } from '../types';

export default function Homepage({ navigation }: RootTabScreenProps<'Homepage'>) {
  return <GroupList></GroupList>
}
