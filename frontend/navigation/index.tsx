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
import Session from '../components/SwipingSession';
import SessionScreen from '../screens/SessionScreen';
import GroupList from '../components/GroupList';
import GroupDetails from '../components/GroupDetails';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import AddToGroup from '../screens/AddToGroup';

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

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Homepage} options={{
        title: '',
          headerLeft: () => (
            <GroupPopup/>
          ),
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
      <Stack.Screen name='Compromise' component={Compromise}></Stack.Screen>
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
