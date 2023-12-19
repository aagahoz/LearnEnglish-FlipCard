import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import SettingsScreen from './screens/SettingsScreen';

import HomeScreenUser from './screens/User/HomeScreen';
import ProfileScreen from './screens/User/ProfileScreen';
import LearnedScreen from './screens/User/LearnedScreen';

import HomeScreenAdmin from './screens/Admin/HomeScreen';
import UsersScreen from './screens/Admin/UsersScreen';
import WordsScreen from './screens/Admin/WordsScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: 'bold',
          },
        }}
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
              <Tab.Screen name="Settings">
                {(props) => <SettingsScreen {...props} setIsSignedIn={setIsSignedIn} setIsAdmin={setIsAdmin} />}
              </Tab.Screen>
            </>
          ) :
            (
              <>
                <Tab.Screen name="Home">
                  {(props) => <HomeScreenUser {...props} setIsSignedIn={setIsSignedIn} />}
                </Tab.Screen>
                <Tab.Screen name="Profile">
                  {(props) => <ProfileScreen {...props} setIsSignedIn={setIsSignedIn} />}
                </Tab.Screen>
                <Tab.Screen name="Learned">
                  {(props) => <LearnedScreen {...props} setIsSignedIn={setIsSignedIn} />}
                </Tab.Screen>
                <Tab.Screen name="Settings">
                  {(props) => <SettingsScreen {...props} setIsSignedIn={setIsSignedIn} />}
                </Tab.Screen>

              </>
            )) : (
          <>
            <Tab.Screen name="Sign In">
              {(props) => <SignInScreen {...props} setIsSignedIn={setIsSignedIn} setIsAdmin={setIsAdmin}  />}
            </Tab.Screen>
            <Tab.Screen name="Sign Up">
              {(props) => <SignUpScreen {...props} setIsSignedIn={() => setIsSignedIn(true)} setIsAdmin={() => setIsAdmin(true)}  />}
            </Tab.Screen>
          </>
        )}

      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;