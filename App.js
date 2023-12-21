import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import SettingsScreen from './screens/SettingsScreen';

import HomeScreenUser from './screens/User/HomeScreen';
import ProfileScreen from './screens/User/ProfileScreen';
import PlayScreen from './screens/User/PlayScreen';
import LearnedScreen from './screens/User/LearnedScreen';

import HomeScreenAdmin from './screens/Admin/HomeScreen';
import UsersScreen from './screens/Admin/UsersScreen';
import WordsScreen from './screens/Admin/WordsScreen';
import AddWordScreen from './screens/Admin/AddWordScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: 'bold',
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home')
            {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Users')
            {
              iconName = focused ? 'account-group' : 'account-group-outline';
            } else if (route.name === 'Words')
            {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === 'Add Word')
            {
              iconName = focused ? 'plus-circle' : 'plus-circle-outline';
            } else if (route.name === 'Settings')
            {
              iconName = focused ? 'cog' : 'cog-outline';
            } else if (route.name === 'Profile')
            {
              iconName = focused ? 'account' : 'account-outline';
            }
            else if (route.name === 'Play')
            {
              iconName = focused ? 'play' : 'play-outline';
            } else if (route.name === 'Learned')
            {
              iconName = focused ? 'check' : 'check-outline';
            } else if (route.name === 'Sign In')
            {
              iconName = focused ? 'login' : 'login-variant';
            } else if (route.name === 'Sign Up')
            {
              iconName = focused ? 'account-plus' : 'account-plus-outline';
            }

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
        })}
      >
        {isSignedIn ? (
          isAdmin ? (
            <>
              <Tab.Screen name="Home">
                {(props) => <HomeScreenAdmin {...props} setIsSignedIn={setIsSignedIn} setIsAdmin={setIsAdmin} />}
              </Tab.Screen>
              <Tab.Screen name="Users">
                {(props) => <UsersScreen {...props} setIsSignedIn={setIsSignedIn} setIsAdmin={setIsAdmin} />}
              </Tab.Screen>
              <Tab.Screen name="Words">
                {(props) => <WordsScreen {...props} setIsSignedIn={setIsSignedIn} setIsAdmin={setIsAdmin} />}
              </Tab.Screen>
              <Tab.Screen name="Add Word">
                {(props) => <AddWordScreen {...props} setIsSignedIn={setIsSignedIn} setIsAdmin={setIsAdmin} />}
              </Tab.Screen>
              <Tab.Screen name="Settings">
                {(props) => <SettingsScreen {...props} setIsSignedIn={setIsSignedIn} setIsAdmin={setIsAdmin} />}
              </Tab.Screen>
            </>
          ) : (
            <>
              <Tab.Screen name="Home">
                {(props) => <HomeScreenUser {...props} setIsSignedIn={setIsSignedIn} />}
              </Tab.Screen>
              <Tab.Screen name="Profile">
                {(props) => <ProfileScreen {...props} setIsSignedIn={setIsSignedIn} />}
              </Tab.Screen>
              <Tab.Screen name="Play">
                {(props) => <PlayScreen {...props} setIsSignedIn={setIsSignedIn} />}
              </Tab.Screen>
              <Tab.Screen name="Learned">
                {(props) => <LearnedScreen {...props} setIsSignedIn={setIsSignedIn} />}
              </Tab.Screen>
              <Tab.Screen name="Settings">
                {(props) => <SettingsScreen {...props} setIsSignedIn={setIsSignedIn} />}
              </Tab.Screen>
            </>
          )
        ) : (
          <>
            <Tab.Screen name="Sign In">
              {(props) => <SignInScreen {...props} setIsSignedIn={setIsSignedIn} setIsAdmin={setIsAdmin} />}
            </Tab.Screen>
            <Tab.Screen name="Sign Up">
              {(props) => <SignUpScreen {...props} setIsSignedIn={() => setIsSignedIn(true)} setIsAdmin={() => setIsAdmin(true)} />}
            </Tab.Screen>
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
