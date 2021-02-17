import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import SwipeGesture from '../utils/swipe-gesture2'
import { clr } from '../utils/colors';
import NarrowBtn from './NarrowBtn';
import Converter from '../utils/Converter';
import Converters from '../utils/Converters';
import YearConverters from '../utils/YearConverters';
import {OneEra} from '../utils/YearConverters';

/*
("reiwa", "Reiwa", "令和", 2019, 0),
("heisei", "Heisei", "平成", 1989, 2019),	
("showa", "Sh&#333;wa", "昭和", 1926, 1989),
("taisho", "Taish&#333;", "大正", 1912, 1926),
("meiji", "Meiji", "明治", 1868, 1912),
("keio", "Kei&#333;", "慶応", 1865, 1868),
("genji", "Genji", "元治", 1864, 1865),
("bunkyu", "Bunky&#363;", "文久", 1861, 1864),
*/



const TestScreen = ({navigation}) => {

  const yrs = new YearConverters();
  const era = new OneEra("showa", "Sh&#333;wa", "昭和", 1926, 1989);

  const testVal1 = era.getEraCode();
  const testVal2 = typeof(testVal1);
  const testVal3 = era.getEName();
  const testVal4 = era.getJName();
  const testVal5 = era.iYearToEraYear(1984);

  const cvs = new Converters();
  // const testVal3 = cvs.getAmt2Float('km2mi', '1');
  // const testVal4 = cvs.getAmt1StringUnits('ft2m', 1);
  // const testVal5 = cvs.getAmt1StringUnits('ft2m', 12);

  const onSwipePerformed = (action) => {    
    if (action==='left') {navigation.navigate('Home')}
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
