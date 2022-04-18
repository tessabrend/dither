import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './navigation';
import { StatusBar } from 'expo-status-bar';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHeart, faCircleXmark, faFaceGrinStars, faFaceFrown, faDollarSign, faCircleUser, faAngleRight, faCrown, faLongArrowLeft, faStar, faEllipsisH, faUpRightFromSquare} from '@fortawesome/free-solid-svg-icons';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import React, { useEffect } from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const reset = false; // Set this to true when you want to clear the user id from the device. This should be used if the temp user gets deleted from the database.

  library.add(faHeart, faCircleXmark, faFaceGrinStars, faFaceFrown, faDollarSign, faCircleUser, faAngleRight, faCrown, faLongArrowLeft, faStar, faEllipsisH, faUpRightFromSquare);

  let resetStorage = async () => {
    let keys = await AsyncStorage.getAllKeys();
    console.log(keys);
    await AsyncStorage.multiRemove(keys);
    keys = await AsyncStorage.getAllKeys();
    console.log(keys);
  }

  useEffect(() => {
    async function checkUserExists() {
      const userId = await AsyncStorage.getItem("@userId");
      if(userId === null) {
        fetch('http://131.104.49.71:80/user/create', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
          },
        })
        .then(response => {
          response.json().then(async (data) => {
            await AsyncStorage.setItem('@userId', data.userId)
            console.log("Id should be set");
          }).catch(error => {
              console.log("Within app.tsx, 1st catch block");
              console.log(error)
          });
        }).catch(reason => {
          console.log("Within app.tsx, 2nd catch block");
          console.log(reason)
        });
      }  
    }
    checkUserExists();
  });

  if(reset) {
    resetStorage();
    return null;
  }
  else if (!isLoadingComplete) {
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
