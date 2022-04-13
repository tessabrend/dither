/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable, Text } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import JoinByGroupCode from '../screens/JoinByGroupCode';
import NotFoundScreen from '../screens/NotFoundScreen';
import Homepage from '../screens/HomepageScreen';
import TabTwoScreen from '../screens/SessionScreen';
import SearchOverScreen from '../screens/SearchOverScreen'
import GroupHome from '../screens/GroupDetailsScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import GroupPopup from '../components/GroupPopup';
import Compromise from '../screens/Compromise';
import ConsensusReveal from '../screens/SearchOverScreen';
import Session from '../components/SwipingSession';
import SessionScreen from '../screens/SessionScreen';
import GroupList from '../components/GroupList';
import GroupDetails from '../components/GroupDetails';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import AddToGroup from '../screens/AddToGroup';
import { LoginRegisterScreen } from '../screens/LoginRegisterScreen';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { DeviceEventEmitter } from 'react-native';
import { useEffect } from 'react';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */

const Stack = createNativeStackNavigator();

function RootNavigator() {
  let navigation = useNavigation();

  let [userLoggedIn, setUserLoggedIn] = useState("false");

  let getUserLoggedIn = () => {
    AsyncStorage.getItem('@userLoggedIn').then((val) => {
      setUserLoggedIn(val || "false");
    }); 
  };

  useEffect(() => {
    getUserLoggedIn();
    DeviceEventEmitter.addListener('event.userUpdate', (data) => getUserLoggedIn());
  }, []);

  let userSignout = async () => {
    await AsyncStorage.setItem('@userLoggedIn', 'false');
    await AsyncStorage.removeItem('@userId');
    setUserLoggedIn('false');
    getUserLoggedIn();
    fetch('http://131.104.49.71:80/user/create', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
    }).then(response => {
        response.json().then(async (data) => {
            await AsyncStorage.setItem('@userId', data.userId)
        }).catch(error => {
            console.log(error)
        });
    }).catch(reason => {
        console.log(reason)
    });
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Homepage} options={{
          title: '',
          headerLeft: () => (
            <GroupPopup/>
          ),
          headerRight: () => {
            if(userLoggedIn === "false") {
              return (
                <Pressable onPress={() => navigation.navigate('Login')}>
                  <Text style={{fontSize: 16}}>Sign In</Text>
                </Pressable>
              );
            } else {
              return (
                <Menu>
                  <MenuTrigger><FontAwesomeIcon
                    icon="circle-user"
                    size={25}
                    style={{ marginRight: 15 }}
                  /></MenuTrigger>
                  <MenuOptions>
                    <MenuOption onSelect={() => navigation.navigate('Login')}>
                      <Text style={{padding: 10, fontSize: 14}}>Switch User</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => userSignout()}>
                      <Text style={{padding: 10, fontSize: 14}}>Sign Out</Text>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              )
            }
          }
      }}>
      </Stack.Screen>
      <Stack.Screen name='AddUserToGroup' component={AddToGroup} options={{title: ''}}></Stack.Screen>
      <Stack.Screen name='GroupDetails' component={GroupDetails} options={{title: '', headerRight: () => (
        <Menu>
          <MenuTrigger>
            <FontAwesomeIcon size={25} style={{marginRight: 15}} icon="ellipsis"/>
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => navigation.navigate('AddUserToGroup')}>
              <Text style={{padding: 10, fontSize: 14}}>Add User</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      )}}></Stack.Screen>
      <Stack.Screen name='Login' component={LoginRegisterScreen} options={{ title: ''}}></Stack.Screen>
      <Stack.Screen name='Compromise' component={ConsensusReveal}></Stack.Screen>
      <Stack.Screen name='Session' component={SessionScreen}></Stack.Screen>
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={JoinByGroupCode} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}