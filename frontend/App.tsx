import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './navigation';
import { StatusBar } from 'expo-status-bar';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHeart, faCircleXmark, faFaceGrinStars, faFaceFrown, faDollarSign, faCircleUser, faAngleRight, faCrown, faLongArrowLeft, faStar, faEllipsisH, faUpRightFromSquare} from '@fortawesome/free-solid-svg-icons';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import React from 'react';
import { MenuProvider } from 'react-native-popup-menu';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  library.add(faHeart, faCircleXmark, faFaceGrinStars, faFaceFrown, faDollarSign, faCircleUser, faAngleRight, faCrown, faLongArrowLeft, faStar, faEllipsisH, faUpRightFromSquare);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <MenuProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </MenuProvider>
      </SafeAreaProvider>
    );
  }
}
