import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import SwipeGesture from '../utils/swipe-gesture2'
import { clr } from '../utils/colors';
import NarrowBtn from './NarrowBtn';
import Converter from '../utils/Converter';
import Converters from '../utils/Converters';
import YearConverters from '../utils/YearConverters';

const TestScreen = ({navigation}) => {


  const yrs = new YearConverters();
  const testVal1 = yrs.getNowYear();
  const testVal2 = typeof(testVal1);
  const testVal3 = yrs.getZodEName('2021');
  const testVal4 = yrs.getZodJName(2021);
  const testVal5 = yrs.getZodEquationStr('2022');

  const cvs = new Converters();
  // const testVal3 = cvs.getAmt2Float('km2mi', '1');
  // const testVal4 = cvs.getAmt1StringUnits('ft2m', 1);
  // const testVal5 = cvs.getAmt1StringUnits('ft2m', 12);

  const onSwipePerformed = (action) => {    
    if (action==='left') {navigation.goTo('Home')}
  }
  
  const numberOfConverters = cvs.numberOfConvertersTotal();
  const maxConvertersPerType = cvs.maxConvertersPerType();

  const onearray = cvs.convTypeToConvCodes('tometric'); 
  // console.log(onearray);

  return (
    <View style={styles.container} >
    <SwipeGesture gestureStyle={styles.swipeGestureContainer} 
      onSwipePerformed={onSwipePerformed}>
        <View style={styles.innerView}>
          <Text style={styles.mainText}>Test area</Text>
          <Text style={styles.mainText}>{testVal1}</Text>
          <Text style={styles.mainText}>{testVal2}</Text>
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
