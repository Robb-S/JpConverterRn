import React, {useState} from 'react';
import { Text, StyleSheet, View, useWindowDimensions, TextInput } from 'react-native';
import { clr } from '../utils/colors';
import { capitalize } from '../utils/helpers';
import { cv, getInstructions, getDispName, getBgStyles } from '../utils/modes';
import TinyBtn from './TinyBtn';
import Converters from '../utils/Converters';
import YearConverters from '../utils/YearConverters';
import ConverterList from './ConverterList';
import EraList from './EraList';
import ZodiacKanjiScreen from './ZodiacKanjiScreen';
// import NarrowBtn from './NarrowBtn';
// import { Formik } from "formik"; 
// import * as Yup from "yup";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function LoadingScreen() {
  return (
    <View style={[styles.container, styles.loading]}><Text>Loading...</Text></View>
  )
}

export default function MainScreen({cvtype, toggleDirection}) {
  // const {width, height} = useWindowDimensions();
  const [cvs, setCvs] = useState(null);
  const [yc, setYc] = useState(null);
  const [convCode, setConvCode] = useState(null);
  const [fromValue, setFromValue] = useState(''); // will base initial value on cvtype
  React.useEffect(() => { // fetch Converters objects on first load
    const gotcvs = new Converters();
    const gotyc = new YearConverters();
    setCvs(gotcvs);
    setYc(gotyc);
  }, []); 
  React.useEffect(() => { // after swipe, change chosen CONVCODE to first on list
    if (cvs && cvtype) {
      if (isNumericConv(cvtype)) {
        setConvCode(cvs.getFirstConvCodeFromConvType(cvtype));
        console.log('useEffect to reset convCode: ' + cvs.getFirstConvCodeFromConvType(cvtype));
      } else if (cvtype===cv.FROMJPYEAR) {
        setConvCode(yc.getNowEra()); 
      } else {
        setConvCode(null); 
      }
    }
  }, [cvs, cvtype]);

  React.useEffect(() => { // reset FROMVALUE to current year or 1 when switching conversion code
    if (cvs && yc && cvtype) {
      console.log('setting init fromValue ', cvtype);
      if (isNumericConv(cvtype)) {setFromValue('1');}
      else if ([cv.TOJPYEAR, cv.TOZODIAC].includes(cvtype)) {setFromValue(yc.getNowYear().toString());}
      else {setFromValue('');}
    }
  }, [cvs, yc, convCode, cvtype]);

  if (cvtype==null) { return (<LoadingScreen />) } // if cvtype not yet available
  // cvtype (conversion type, e.g. 'frommetric'), is now available
  const isNumericConv = (cvtype) => { return cvs.isValidConvType(cvtype); }
  const [bgStyle, bgStyle2]=getBgStyles(cvtype);
  const setConverter = (newConverter) => { setConvCode(newConverter); } // used by child component
  const showConvRadio = (!([cv.TOZODIAC, cv.TOJPYEAR, cv.FROMJPYEAR].includes(cvtype)));
  const showEraRadio = ([cv.FROMJPYEAR].includes(cvtype));
  const showToggle = (cvtype !== cv.TOZODIAC);                          // conditional rendering
  const showZodiac = (cvtype === cv.TOZODIAC);                          // conditional rendering  
  let eq, kanjiJ, kanjiJZ, caption1, caption2, maxInputTextLength, hint;
  eq = ['',''];
  hint = '';
  const fromInt = isNaN(fromValue) ? 0 : parseInt(fromValue);  // make it zero if fromValue is blank
    if (cvtype===cv.TOZODIAC) {
      console.log('fromInt: ' + fromInt);
      if (!isNaN(fromInt)) { // because async setting of fromValue may lag behind display
        eq = yc.getZodEquationArray(fromInt);
        kanjiJ = yc.getZodJName(fromInt);
        kanjiJZ = yc.getZodJZName(fromInt);
        const eName = yc.getZodEName(fromInt);
        caption1 = eName;
        caption2 = eName + ' zodiac sign';
        maxInputTextLength = 4;
      }
    } else if (isNumericConv(cvtype)) {
      eq = cvs.getEquationArray(convCode, fromInt);
      // eq[0] = eq[0] + ' ' + convCode;
      maxInputTextLength = 12;
    } else if (cvtype===cv.TOJPYEAR) {
      eq = yc.iYearToJYearEq(fromInt);
      maxInputTextLength = 4;
    } else if (cvtype===cv.FROMJPYEAR) {
      maxInputTextLength = 2;
      if (yc.isValidEraCode(convCode)) {
        hint = yc.getHint(convCode);
        eq = yc.jYearToIYearEq(convCode, fromInt);
      }
    }
  // }
  const resultPanelText = `${eq[0]} \n${eq[1]} `;
  const instructions = getInstructions(cvtype);
  const onChangeTextProc = (text) => {
    let isValid = true;
    if (isNaN(text) && (text!=='-')) isValid=false; // initial minus sign is okay
    if (isValid) { setFromValue(text); }
  }

  return (
    <View style={[styles.container, bgStyle]}>
      <View style={[styles.inputTextArea, bgStyle2]}>
        <TextInput style={styles.inputTextText}
          onChangeText={onChangeTextProc}
          value={fromValue}
          keyboardType={'numeric'}
          maxLength={maxInputTextLength}
          returnKeyType={'done'}
          placeholder={hint}
        />
      </View>
      <Text style={styles.resultPanel}>{resultPanelText}</Text>
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

      {showConvRadio &&
      <ConverterList cvtype={cvtype} cvs={cvs} setConverter={setConverter} />
      }

      {showEraRadio &&
      <EraList cvtype={cvtype} yc={yc} setConverter={setConverter} />
      }

      {showZodiac &&
      <ZodiacKanjiScreen kanjiJ={kanjiJ} kanjiJZ={kanjiJZ} caption1={caption1} 
        caption2={caption2} />
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
    paddingTop: 13,
    paddingLeft: 10,
    paddingBottom: 6,
    marginBottom: 8,
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
