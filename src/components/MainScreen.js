import React, {useState} from 'react';
import { Text, StyleSheet, View, useWindowDimensions, TextInput,  
  ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { clr } from '../utils/colors';
import { capitalize } from '../utils/helpers';
import { cv, getInstructions, getDispName, getBgStyles } from '../utils/modes';
// import NarrowBtn from './NarrowBtn';
import TinyBtn from './TinyBtn';
import Converters from '../utils/Converters';
import ConverterList from './ConverterList';

// import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function LoadingScreen() {
  return (
    <View style={[styles.container, styles.loading]}><Text>Loading...</Text></View>
  )
}

export default function MainScreen({cvtype, toggleDirection}) {

  const {width, height} = useWindowDimensions();
  const [cvs, setCvs] = useState(null);
  const [convCode, setConvCode] = useState(null);
  const [fromValue, setFromValue] = useState(''); // will base initial value on cvtype
  React.useEffect(() => { // fetch Converters object on first load
    const gotcvs = new Converters();
    setCvs(gotcvs);
  }, []); 
  React.useEffect(() => { // after swipe, change chosen convCode to first on list
    if (cvs && cvtype) {
      setConvCode(cvs.getFirstConvCodeFromConvType(cvtype));
      console.log('useEffect to reset convCode: ' + cvs.getFirstConvCodeFromConvType(cvtype));
    }
  }, [cvs, cvtype]);

  React.useEffect(() => { // reset fromValue to current year or 1 when switching conversion code
    if (cvs && convCode) {
      setFromValue(cvs.getInitFromValue(cvtype));
    }
  }, [cvs, convCode, cvtype]);

  if (cvtype==null) { return (<LoadingScreen />) } // if cvtype not yet available
  // cvtype is now available
  const [bgStyle, bgStyle2]=getBgStyles(cvtype);
  const setConverter = (newConverter) => { // used by child component ConverterList
    setConvCode(newConverter);
  }
  const showRadio = (!([cv.TOZODIAC, cv.TOJPYEAR].includes(cvtype)));
  const showToggle = (cvtype !== cv.TOZODIAC);
  
  const resultValue = cvs.getResult(fromValue, convCode);
  const resultPanelText = 
`${fromValue} fromValue / ${cvtype}
${convCode} is convCode / ${resultValue}`;
  const instructions = getInstructions(cvtype);

  return (
    <View style={[styles.container, bgStyle]}>
      <View style={[styles.inputTextArea, bgStyle2]}>
        <TextInput style={styles.inputTextText}
          onChangeText={text => setFromValue(text)}
          value={fromValue}
        />
      </View>
      <Text style={styles.resultPanel}>{resultPanelText}</Text>
      <Text style={styles.instructionsText}>{instructions}</Text>
      {showToggle && 
      <View style={styles.toggleZone}>
        <Text style={styles.converterHeader}>{capitalize(getDispName(cvtype))}</Text>
        <TinyBtn onPress={() => toggleDirection()} text={'Switch direction'} />        
      </View>
      }
      {showRadio &&
      <ConverterList cvtype={cvtype} cvs={cvs} setConverter={setConverter} />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    height:'100%',
    width:'100%',
    backgroundColor: clr.medGrey,
  },
  inputTextArea: {
    marginTop: 3,
    paddingLeft: 10,
    paddingBottom: 10,
    paddingTop: 10,
    // height: 50,
  },
  inputTextText: {
    fontSize: 20,
  },
  resultPanel: {
    color: clr.white,
    paddingTop: 15,
    paddingLeft: 10,
    paddingBottom: 6,
    marginBottom: 12,
    fontSize: 20,
    lineHeight: 36,
    width: '100%',
    textAlign: 'left',
  },
  toggleZone: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  converterHeader: {
    fontSize: 16,
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 20,
    color: clr.white,
  },
  toggleButtonZone: {
    paddingTop: 0,
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
  instructionsText: {
    backgroundColor: clr.lightGrey,
    fontSize: 15,
    paddingTop: 12,
    paddingLeft: 10,
    paddingBottom: 12,
    marginBottom: 10,
  },
  loading: {
    backgroundColor: clr.black,
  },
});
