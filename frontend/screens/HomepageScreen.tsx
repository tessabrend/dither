import React from 'react';
import GroupList from '../components/GroupList';
import Compromise from './Compromise';
import { RootTabScreenProps } from '../types';

export default function Homepage({ navigation }: RootTabScreenProps<'Homepage'>) {
  return <Compromise session={1}></Compromise>
}
