import React from 'react';
import Session from '../components/SwipingSession';
import { useNavigation } from '@react-navigation/native';

export default function SessionScreen() {
  let navigation = useNavigation();
  return (
      <Session navigator={navigation}/>
  );
}
