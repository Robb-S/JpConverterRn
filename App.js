/**
 * The App component is just a shell to provide the Stack Navigator housing the rest of the 
 * app.
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/components/HomeScreen';
import HelpScreen from './src/components/HelpScreen';
import TestScreen from './src/components/TestScreen';
import { clr } from './src/utils/colors';

const Stack = createStackNavigator();

const soptions = {
  headerStyle: {
    backgroundColor: clr.lighterGrey,
  },
  headerTitleStyle: {
    marginLeft: -28,
  },
};
/** 
 * Shell for navigator skeleton.  All conversion functionality and navigation are
 * provided by the Home screen component. 
 */
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Test" >
        <Stack.Screen name="Home" component={HomeScreen}  options={soptions} />
        <Stack.Screen name="Help" component={HelpScreen}  options={soptions} />
        <Stack.Screen name="Test" component={TestScreen}  options={soptions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
