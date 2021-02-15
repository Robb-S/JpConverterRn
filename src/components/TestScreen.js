import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import SwipeGesture from '../utils/swipe-gesture2'
import { clr } from '../utils/colors';
import NarrowBtn from './NarrowBtn';
import Converter from '../utils/Converter';

const TestScreen = ({navigation}) => {

  const tuple1 = ["c2f", "°C to °F", "°C", "", "°F", 0.0, 1, "frommetric"];
  const tuple2 = ["f2c","°F to °C", "°F", "","°C", 0.0, 1, "tometric"];
  const tuple3 = ["km2mi", "kilometers to miles", "kilometers", "kilometer", "miles", 0.621371, 2, "frommetric"];
  const tuple4 = ["in2cm","inches to centimeters", "inches", "inch", "cm", 2.54, 3, "tometric"];
  const tuple5 = ["go2ml", "go to ml (sake)", "go", "", "ml", 180.4, 2, "fromjpmeasure", "合"];
  const conv1 = new Converter(...tuple1);
  const conv2 = new Converter(...tuple2);
  const conv3 = new Converter(...tuple3);
  const conv4 = new Converter(...tuple4);
  const conv5 = new Converter(...tuple5);
  const testVal1 = conv4.getEquationArray(4);
  const testVal2 = conv2.getEquationString(32);
  const testVal3 = conv3.getEquationString(12);
  const testVal4 = conv4.getEquationString(21);  
  const testVal5 = conv5.getEquationString(4);

  const onSwipePerformed = (action) => {    
    if (action==='left') {navigation.goBack()}
  }

  return (
    <View style={styles.container} >
    <SwipeGesture gestureStyle={styles.swipeGestureContainer} 
      onSwipePerformed={onSwipePerformed}>
        <View style={styles.innerView}>
          <Text style={styles.mainText}>Test area</Text>
          <Text style={styles.mainText}>{testVal1[0]}</Text>
          <Text style={styles.mainText}>{testVal1[1]}</Text>
          <Text style={styles.mainText}>{testVal3}</Text>
          <Text style={styles.mainText}>{testVal4}</Text>
          <Text style={styles.mainText}>{testVal5}</Text>
        </View>
      </SwipeGesture>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    height:'100%',
    width:'100%',
    backgroundColor: '#ffffff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  swipeGestureContainer:{
    height:'100%',
    width:'100%',
   },
   mainText: {
    backgroundColor: '#ffffff',
    padding: 15,
    fontSize: 20,
    width: '80%',
    marginBottom: 12,
    textAlign: 'left',
  },
  innerView: {
    backgroundColor: '#ffddbb',
    alignItems: 'center',
    // justifyContent: 'center',
    height:'100%',
    width:'100%',
  }
});

export default TestScreen
