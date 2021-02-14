import React, {useRef, useState, useEffect} from 'react';
import { Text, StyleSheet, View, useWindowDimensions, 
  ScrollView, TouchableOpacity } from 'react-native';
import { clr } from '../utils/colors';
import { catToSnum, cv, snumToBgStyle, getDispName, getCvType, cvCatToCvType } from '../utils/modes';
import NarrowBtn from './NarrowBtn';
import Converters from '../utils/Converters';
import ConverterList from './ConverterList';

// import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function LoadingScreen() {
  return (
    <View style={[styles.container, styles.loading]}><Text>Loading...</Text></View>
  )
}
export default function MainScreen({screenNum, currDirection, cvtype, navigation, toggleDrawer,
  toggleDirection, incrementScreenNum, decrementScreenNum, setMode}) {

  const {width, height} = useWindowDimensions();
  const [cvs, setCvs] = useState(null);
  const [convCode, setConvCode] = useState(null);
  React.useEffect(() => {
    const gotcvs = new Converters();
    setCvs(gotcvs);
  }, []); 
  React.useEffect(() => {
    if (cvs && cvtype) {
      setConvCode(cvs.getFirstConvCodeFromConvType(cvtype));
      console.log('useEffect to reset convCode: ' + cvs.getFirstConvCodeFromConvType(cvtype));
    }
  }, [cvs, cvtype]);

  if (screenNum==null) { return (<LoadingScreen />) }
  // screenNum is now available
  const bgStyle=snumToBgStyle(screenNum);
  const setConverter = (newConverter) => { // used by child component ConverterList
    setConvCode(newConverter);
  }
  const zodiacCvType = cvCatToCvType(cv.ZODIAC, cv.TOJP);
  const showRadio = (cvtype !== zodiacCvType);
  const showToggle = (cvtype !== zodiacCvType);
  return (
    <View style={[styles.container, bgStyle]}>
      <Text style={styles.mainText}>
        {cvtype} {convCode} {Math.round(width)}/{Math.round(height)}
      </Text>
      {showRadio &&
      <ConverterList cvtype={cvtype} cvs={cvs} setConverter={setConverter} />
      }
      <NarrowBtn 
        onPress={() => navigation.navigate('Help')}
        text={'Go to Help'} bgColor={clr.lightGrey} color={clr.darkGrey} />
      {showToggle && 
      <NarrowBtn 
        onPress={() => toggleDirection(screenNum)}
        text={'Toggle direction'} bgColor={clr.lightGrey} color={clr.darkGrey} />
      }
      <NarrowBtn 
        onPress={() => decrementScreenNum()}
        text={'Backward'} bgColor={clr.lightLgreen} color={clr.darkGrey} />
      <NarrowBtn 
        onPress={() => incrementScreenNum()}
        text={'Forward'} bgColor={clr.lightCyan} color={clr.darkGrey} />
      <NarrowBtn
        text="From metric"
        bgColor={clr.tan} color={clr.darkGrey}
        onPress={()=>setMode(catToSnum(cv.METRIC), cv.FROMJP)}
      />
      <NarrowBtn
        text="Zodiac"
        bgColor={clr.brown}
        onPress={()=>setMode(catToSnum(cv.ZODIAC), cv.TOJP)}
      />
      <NarrowBtn 
        onPress={() => toggleDrawer()}
        text={'Drawer'} bgColor={clr.darkBlue} color={clr.white} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    height:'100%',
    width:'100%',
    backgroundColor: clr.red,
    // padding: 10,
  },
  mainText: {
    // backgroundColor: clr.white,
    color: clr.white,
    padding: 18,
    fontSize: 20,
    width: '100%',
    marginBottom: 12,
    textAlign: 'center',
    marginRight: 5,
  },
  smallText: {
    backgroundColor: clr.black,
    color: clr.white,
    padding: 14,
    fontSize: 14,
    width: '90%',
    marginBottom: 2,
    textAlign: 'center',
    marginRight: 5,
  },
  loading: {
    backgroundColor: clr.black,
  },
});
