import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Home from './Home';
import Intro from './intro';

const Stack = createStackNavigator();

const Main = () => {
  return (
    <NavigationContainer>
      <GestureHandlerRootView>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Intro" component={Intro} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </GestureHandlerRootView>
    </NavigationContainer>
  );
};

export default Main;
