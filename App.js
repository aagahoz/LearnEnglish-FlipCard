import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import LearnedScreen from './screens/LearnedSecreen';
import HomeScreenAdmin from './screens/HomeScreenAdmin';

import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { addDoc, Timestamp } from 'firebase/firestore';
import { doc, deleteDoc } from 'firebase/firestore';
import { updateDoc } from 'firebase/firestore';

import db from './firebaseConfig'


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
              <Tab.Screen name="Home Screen">
                {(props) => <HomeScreenAdmin {...props} setIsSignedIn={setIsSignedIn} setIsAdmin={setIsAdmin} />}
              </Tab.Screen>
              <Tab.Screen name="Settings">
                {(props) => <SettingsScreen {...props} setIsSignedIn={setIsSignedIn} setIsAdmin={setIsAdmin} />}
              </Tab.Screen>
            </>
          ) :
            (
              <>
                <Tab.Screen name="Home">
                  {(props) => <HomeScreen {...props} setIsSignedIn={setIsSignedIn} />}
                </Tab.Screen>
                <Tab.Screen name="Profile">
                  {(props) => <ProfileScreen {...props} setIsSignedIn={setIsSignedIn} />}
                </Tab.Screen>
                <Tab.Screen name="Learned Words">
                  {(props) => <LearnedScreen {...props} setIsSignedIn={setIsSignedIn} />}
                </Tab.Screen>
                <Tab.Screen name="Settings">
                  {(props) => <SettingsScreen {...props} setIsSignedIn={setIsSignedIn} />}
                </Tab.Screen>

              </>
            )) : (
          <>
            <Tab.Screen name="SignIn">
              {(props) => <SignInScreen {...props} setIsSignedIn={setIsSignedIn} setIsAdmin={setIsAdmin}  />}
            </Tab.Screen>
            <Tab.Screen name="SignUp">
              {(props) => <SignUpScreen {...props} setIsSignedIn={() => setIsSignedIn(true)} setIsAdmin={() => setIsAdmin(true)}  />}
            </Tab.Screen>
          </>
        )}

      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;