import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import SettingsScreen from './screens/SettingsScreen';

import PlayScreen from './screens/User/PlayScreen';
import LearnedScreen from './screens/User/LearnedScreen';
import FavoritesScreen from './screens/User/FavoritesScreen';
import UnLearnedScreen from './screens/User/UnLearnedScreen';

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
        initialRouteName={isSignedIn ? (isAdmin ? 'Home' : 'Learn') : 'SignInTab'}
        screenOptions={({ route }) => ({
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: 'bold',
          },
          tabBarIcon: ({ focused, color, size }) => {
            const icons = {
              Home: 'home',
              Users: 'account-group',
              Words: 'book',
              'Add Word': 'plus-circle',
              Settings: 'cog',
              Profile: 'account',
              Favorites: 'heart',
              UnLearned: 'book',
              Learn: 'play',
              Learned: 'check',
              'Sign In': 'login',
              'Sign Up': 'account-plus',
            };
            const iconName = focused ? icons[route.name] : `${icons[route.name]}-outline`;
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
        })}
      >
        {isSignedIn ? (
          isAdmin ? (
            <>
              <Tab.Screen name="Home" component={HomeScreenAdmin} />
              <Tab.Screen name="Users" component={UsersScreen} />
              <Tab.Screen name="Words" component={WordsScreen} />
              <Tab.Screen name="Add Word" component={AddWordScreen} />
              <Tab.Screen name="Settings">
                {(props) => <SettingsScreen {...props} setIsSignedIn={setIsSignedIn} />}
              </Tab.Screen>
            </>
          ) : (
            <>
              <Tab.Screen name="Favorites" component={FavoritesScreen} />
              <Tab.Screen name="UnLearned" component={UnLearnedScreen} />
              <Tab.Screen name="Learn" component={PlayScreen} />
              <Tab.Screen name="Learned" component={LearnedScreen} />
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
