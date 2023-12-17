import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screens/Home';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

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
          <>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </>
        ) : (
          <>
            <Tab.Screen name="SignIn">
              {(props) => <SignInScreen {...props} setIsSignedIn={setIsSignedIn} />}
              
            </Tab.Screen>

            <Tab.Screen name="SignUp">
              {(props) => (
                <SignUpScreen {...props} setIsSignedIn={() => setIsSignedIn(true)} />
              )}
            </Tab.Screen>
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
