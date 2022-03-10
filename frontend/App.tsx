import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './navigation';
import { StatusBar } from 'expo-status-bar';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHeart, faCircleXmark, faFaceGrinStars, faFaceFrown, faDollarSign, faCircleUser} from '@fortawesome/free-solid-svg-icons';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import TabOneScreen from './screens/TabOneScreen';
import React from 'react';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  library.add(faHeart, faCircleXmark, faFaceGrinStars, faFaceFrown, faDollarSign, faCircleUser);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
