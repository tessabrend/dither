/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable, Text, Alert } from 'react-native';

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
import AsyncStorage from '@react-native-async-storage/async-storage';

import { faRoute } from '@fortawesome/free-solid-svg-icons';
import { apiRequestRetry } from '../utils/utils';

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

const getCurrentRouteParamItems = (nav: object, value: string) => {
  try {
    const currentRouteParams = nav.getCurrentRoute().params;
    console.log("typeof currentRouteParams = " + typeof currentRouteParams)
    if(typeof currentRouteParams === 'undefined' ) {
      return false;
    } else {
      return currentRouteParams[value]
    }
  } catch(err) {
    return false;
  }
}

function RootNavigator() {
  let navigation = useNavigation();
  const popAction = StackActions.pop();
  
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Homepage} options={{
        title: '',
          headerLeft: () => {
            return <GroupPopup/>
          }
          ,
          headerRight: () => (
            <Pressable
              onPress={() => {
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <FontAwesomeIcon
                icon="circle-user"
                size={25}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          )
      }}>
      </Stack.Screen>
      <Stack.Screen name='AddUserToGroup' component={AddToGroup} options={{title: ''}}></Stack.Screen>
      <Stack.Screen name='GroupList' component={GroupList} options={{title: ''}}></Stack.Screen>
      <Stack.Screen name='GroupDetails' component={GroupDetails} options={{title: '', headerRight: () => (
      <Menu>
          <MenuTrigger>
            <FontAwesomeIcon size={25} style={{marginRight: 15}} icon="ellipsis"/>
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => navigation.navigate('AddUserToGroup')}>
              {console.log("\n\n\n*************************************\n\n")}
              {console.log(navigation.getCurrentRoute())}
              {console.log("\n\n*************************************\n\n\n")}
  
              <Text style={{padding: 10, fontSize: 14}}>Add User</Text>
            </MenuOption>
            <MenuOption onSelect={() => {
              Alert.alert(
              "Confirm",
              getCurrentRouteParamItems(navigation, 'isGroupLeader') ? 
              "Are you sure you want to delete the Group " + getCurrentRouteParamItems(navigation, "groupName") + "?" :
              "Are you sure you  want to leave the Group " + getCurrentRouteParamItems(navigation, "groupName") + "?",
              [
                {
                  text: "Yes",
                  onPress: async () => {
                    const userId = await AsyncStorage.getItem("@userId");
                    const url = `http://131.104.49.71:80/group/${getCurrentRouteParamItems(navigation, "groupId")}/leave/${userId}`
                    const options = {
                      method: "PUT",
                      headers: {
                        'Content-Type': "multipart/form-data",
                        'Accept': 'application/json'
                      }
                    }
                    let data = await apiRequestRetry(url, options, 10);
                    if(data.status === 'delete all' || (data.message && getCurrentRouteParamItems(navigation, "isGroupLeader") === true)) {
                      alert("You have successfully deleted the group");
                    } else if(data.status === 'delete' || (data.message && getCurrentRouteParamItems(navigation, "isGroupLeader") === false)) {
                      alert("You have successfully left the group");
                    } else {
                      alert("An error occured. Please reload the app.");
                    }
                    navigation.dispatch(popAction);
                  }
                    /*fetch(`http://131.104.49.71:80/group/${navigation.getCurrentRoute().params.groupId}/leave/${userId}`, {
                      method: "PUT",
                      headers: {
                        'Content-Type': "multipart/form-data",
                        'Accept': 'application/json'
                      }
                    })
                    .then(response => response.json())
                    .then(data => {
                      if(data.status === 'delete') {
                        alert("You have successfully left the group");
                      } else if(data.status === 'delete all') {
                        alert("You have successfully deleted the group");
                      } else {
                        alert("An error occured. Please try again later");
                      }
                      navigation.dispatch(popAction);
                    }).catch(err => console.log(err));
                  }*/
                },
                {
                  text: "No"
                }
              ]
            )}}>
              <Text style={{padding: 10, fontSize: 14}}>
                {getCurrentRouteParamItems(navigation, "isGroupLeader") ? 
                  "Delete Group" :
                  "Leave Group"
                }
              </Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      )}}></Stack.Screen>
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
