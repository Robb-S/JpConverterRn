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

const stylesZ = StyleSheet.create({
  zodiacZone: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-evenly',
  },
  zodiacPart: {
    paddingTop: 0,
  },
  zodiac1: {
    fontSize: 100,
    textAlign: 'center',
    color: clr.yellow,
  },
  zodiac2: {
    fontSize: 100,
    textAlign: 'center',
    color: clr.yellow,
  },
  zodiacCaption: {
    fontSize: 14,
    textAlign: 'center',
    color: clr.white,
  },
});

function ZodiacKanjiScreen({kanji1, kanji2}) {
  return (
    <View style={stylesZ.zodiacZone}>
      <View style={stylesZ.zodiacPart}>
        <Text style={stylesZ.zodiac1}>{kanji1}</Text>
        <Text style={stylesZ.zodiacCaption}>{'zodiac kanji'}</Text>   
      </View>
      <View style={stylesZ.zodiacPart}>
        <Text style={stylesZ.zodiac2}>{kanji2}</Text>
        <Text style={stylesZ.zodiacCaption}>{'animal kanji'}</Text>   
      </View>
    </View>
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
  const showZodiac = (cvtype === cv.TOZODIAC);
  const kanji1 = '兔';
  const kanji2 = '兎';
  const maxKeyboardLength = 15;
  const eq = cvs.getEquationArray(convCode, fromValue);

  const resultValue = cvs.getResult(fromValue, convCode);
  const resultPanelText = 
`${fromValue} fromValue / ${cvtype}
${convCode} is convCode / ${resultValue}`;
  const resultPanelText2 = 
`${eq[0]} 
${eq[1]} `;
  const instructions = getInstructions(cvtype);

  return (
    <View style={[styles.container, bgStyle]}>
      <View style={[styles.inputTextArea, bgStyle2]}>
        <TextInput style={styles.inputTextText}
          onChangeText={text => setFromValue(text)}
          value={fromValue}
          keyboardType={'numeric'}
          maxLength={maxKeyboardLength}
          returnKeyType={'done'}
        />
      </View>
      <Text style={styles.resultPanel}>{resultPanelText2}</Text>
      <Text style={styles.instructionsText}>{instructions}</Text>

      {showToggle && 
      <View style={styles.toggleZone}>
        <Text style={styles.converterHeader}>{capitalize(getDispName(cvtype))}</Text>
        <View style={styles.toggleButtonZone} >
          <TinyBtn onPress={() => toggleDirection()} 
            text={'Switch direction'} color={clr.lightBlue} />        
        </View>  
      </View>
      }

      {showRadio &&
      <ConverterList cvtype={cvtype} cvs={cvs} setConverter={setConverter} />
      }

      {showZodiac &&
      <ZodiacKanjiScreen kanji1={kanji1} kanji2={kanji2} />
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
    marginBottom: 10,
    fontSize: 26,
    lineHeight: 38,
    width: '100%',
    textAlign: 'left',
  },
  toggleZone: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    paddingRight: 10,
    paddingTop: 1,
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
