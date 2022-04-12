import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './navigation';
import { StatusBar } from 'expo-status-bar';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHeart, faCircleXmark, faFaceGrinStars, faFaceFrown, faDollarSign, faCircleUser, faAngleRight, faCrown, faLongArrowLeft, faStar, faEllipsisH, faUpRightFromSquare} from '@fortawesome/free-solid-svg-icons';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuProvider } from 'react-native-popup-menu';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  library.add(faHeart, faCircleXmark, faFaceGrinStars, faFaceFrown, faDollarSign, faCircleUser, faAngleRight, faCrown, faLongArrowLeft, faStar, faEllipsisH, faUpRightFromSquare);

  useEffect(() => {
    async function checkUserExists() {
      /* To Remove the items in async storage run this code
      let keys = await AsyncStorage.getAllKeys();
      console.log(keys);
      await AsyncStorage.multiRemove(keys);
      keys = await AsyncStorage.getAllKeys();
      console.log(keys);
      */
      // Checks if the user exists, and if not creates a temporary one for them

      // let keys = await AsyncStorage.getAllKeys();
      // console.log(keys);
      // await AsyncStorage.multiRemove(keys);
      // keys = await AsyncStorage.getAllKeys();
      // console.log(keys);

      try {
        const userId = await AsyncStorage.getItem("@userId");
        if(userId === null) {
          fetch('http://131.104.49.71:80/user/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
        .then(response => {
            response.json().then(async (data) => {
              await AsyncStorage.setItem('@userId', data.userId)
            }).catch(error => {
                console.log(error)
            });
        }).catch(reason => {
            console.log(reason)
        });
        }
      } catch(error) {
        console.log(error);
      }
    }
    checkUserExists();

    (async () => {
      try {
        let val = await AsyncStorage.getItem('@userLoggedIn');
        if(val == null) {
          console.log("nulling");
          await AsyncStorage.setItem('@userLoggedIn', 'false');
        }
      } catch(error) {
        console.log(error);
      }
    })();
  }, []);

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
