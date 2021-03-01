import React, {useState} from 'react';
import { Text, StyleSheet, View, useWindowDimensions, TextInput, Pressable } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { clr } from '../utils/colors';
import { capitalize } from '../utils/helpers';
import { cv, getInstructions, getDispName, getBgStyles, getBgColor } from '../utils/modes';
import TinyBtn from './TinyBtn';
import Converters from '../utils/Converters';
import YearConverters from '../utils/YearConverters';
import ConverterList from './ConverterList';
import EraList from './EraList';
import ZodiacKanjiScreen from './ZodiacKanjiScreen';
const validYrTypes = [cv.FROMJPYEAR, cv.TOJPYEAR, cv.TOZODIAC];

function LoadingScreen() { // show this during async loading of last screen used data
  return (
    <View style={[styles.container, styles.loading]}><Text>Loading...</Text></View>
  )
}

export default function MainScreen({cvtype, toggleDirection, changeType}) {
  // const {width, height} = useWindowDimensions();
  const [cvs, setCvs] = useState(null);   // measure converter object
  const [yc, setYc] = useState(null);     // year converter object
  const [convCode, setConvCode] = useState(null);   // chosen conversion code (e.g. "mi2km", "heisei")
  const [fromValue, setFromValue] = useState('');   // inputtext - will base initial value on cvtype

  React.useEffect(() => { // create and fetch Converters objects on first load
    const gotcvs = new Converters();
    const gotyc = new YearConverters();
    setCvs(gotcvs);
    setYc(gotyc);
  }, []); 
  React.useEffect(() => { // after swipe (not toggle), change numeric CONVCODE to first on list
    if (cvs && cvtype) {
      if (isNumericConv(cvtype)) {
        if (changeType!=='toggle') { // if toggling, don't reset, stay at same index
          setConvCode(cvs.getFirstConvCodeFromConvType(cvtype));
          // console.log('useEffect to reset convCode: ' + cvs.getFirstConvCodeFromConvType(cvtype));
        }
      } 
    }
  }, [cvs, cvtype]);

  React.useEffect(() => { // reset FROMVALUE to current year or 1 when switching conversion code
    if (cvs && yc && cvtype) {
      // console.log('setting init fromValue ', cvtype);
      if (isNumericConv(cvtype)) {setFromValue('1');}
      else if ([cv.TOJPYEAR, cv.TOZODIAC].includes(cvtype)) {setFromValue(yc.getNowYear().toString());}
      else {setFromValue('');} // blank for FROMJPYEAR, so hint is visible
    }
  }, [cvs, yc, convCode, cvtype]);

  if (cvtype==null) { return (<LoadingScreen />) } // if cvtype not yet available
  // cvtype (conversion type, e.g. 'frommetric'), is now available
  const setConverter = (newConverter) => { setConvCode(newConverter); } // used by child component
  const isNumericConv = (cvtype) => { return cvs.isValidConvType(cvtype); }
  const isYearConv = (cvtype) => { return validYrTypes.includes(cvtype); }
  const [bgStyle, bgStyle2]=getBgStyles(cvtype);
  const bgColor = getBgColor(cvtype);
  // show-xx variables control conditional rendering
  const showConvRadio = isNumericConv(cvtype);      // radio buttons for regular conversions
  const showEraRadio = ([cv.FROMJPYEAR].includes(cvtype));  // radio buttons for jp eras
  const showNumericInput = isNumericConv(cvtype);   // TextInput for regular conversions
  const showYearInput = isYearConv(cvtype);         // TextInput for years (Jp or int'l)
  const showToggle = (cvtype !== cv.TOZODIAC);      // toggle to switch direction
  const showZodiac = ([cv.TOZODIAC, cv.TOJPYEAR].includes(cvtype)); // zodiac panel
  const showIncrementers = [cv.TOJPYEAR].includes(cvtype) ?         // +/- year value
    yc.isValidIYear(fromValue) : !(isNaN(parseInt(fromValue)));
  let kanjiJ, kanjiJZ, caption1, caption2, maxInputTextLength;
  let eq = ['',''];
  let hint = '';
  const fromInt = isNaN(fromValue) ? 0 : parseInt(fromValue);  // make it zero if fromValue is blank
  const fromNum = isNaN(fromValue) ? 0 : parseFloat(fromValue); 
  if (cvtype===cv.TOZODIAC) { // any year AD 1-9999
    maxInputTextLength = 4;
    if (!isNaN(fromInt)) { // async setting of fromValue may lag behind display
      // console.log('!isNaN (' + fromValue + ') fromInt: (' + fromInt + ')');
      eq = yc.getZodEquationArray(fromInt);
      kanjiJ = yc.getZodJName(fromInt);
      kanjiJZ = yc.getZodJZName(fromInt);
      const eName = yc.getZodEName(fromInt);
      caption1 = eName;
      caption2 = eName + ' zodiac sign';
    } else {
      // console.log('*isNaN (' + fromValue + ') fromInt: (' + fromInt + ')');
    }
  } else if (isNumericConv(cvtype)) { // all numeric conversions
    maxInputTextLength = 12;
    if (!(isNaN(fromNum)||isNaN(fromValue))) { eq = cvs.getEquationArray(convCode, fromValue);}
  } else if (cvtype===cv.TOJPYEAR) {  // international year after Meiji restoration
    maxInputTextLength = 4;
    if (yc.isValidIYear(fromValue)) { // show nothing unless it's a valid year (post-Meiji)
      eq = yc.iYearToJYearEq(fromInt);
      kanjiJ = yc.getZodJName(fromInt);
      kanjiJZ = yc.getZodJZName(fromInt);
      const eName = yc.getZodEName(fromInt);
      caption1 = eName;
      caption2 = eName + ' zodiac sign';  
    }
  } else if (cvtype===cv.FROMJPYEAR) { // 1- or 2-digit Japanese year
    maxInputTextLength = 2;
    if (yc.isValidEraCode(convCode)) {
      hint = yc.getHint(convCode);
      eq = yc.jYearToIYearEq(convCode, fromInt);
    }
  }
  const resultPanelText = `${eq[0]} \n${eq[1]} `;
  const instructions = getInstructions(cvtype);
  const onChangeTextProc = (text) => { // handle TEXT input
    let isValid = true;
    if (isNumericConv(cvtype)) {
      if (cvs.isTempConv(convCode)) { // temperature conversion
        if (isNaN(text) && (text!=='-') && (text!=='.')) isValid=false; // initial minus sign, decimal point okay
      } else { // regular conversion
        if (isNaN(text) && (text!=='.')) isValid=false; // initial decimal point okay
      }
    } else { // years
      if (!(/^\d+$/.test(text)) && text!=='') isValid=false; // years have to be numbers only
    }
    if (isValid) { setFromValue(text); }
  }
  const addAYear = () => {
    if (!isNaN(parseInt(fromValue))) {
      const newYearInt = parseInt(fromValue) + 1;
      setFromValue(newYearInt.toString());
    }
  }
  const subtractAYear = () => {
    if (!isNaN(parseInt(fromValue))) {
      const newYearInt = parseInt(fromValue) - 1;
      if (newYearInt>0) {setFromValue(newYearInt.toString());}
    }
  }
  /**
   * Display elements for this component:
   * 1a) TextInput for regular measurement conversions
   * 1b) TextInput for year conversions w/ minus and plus buttons to decrement/increment the year
   *      (hide buttons when year is blank or invalid)
   * 2) Result panel - two-line text to show results of numeric or year conversion
   * 3) Instructions - help for one type of conversion
   * 4) Toggle zone - show current conversion type (e.g. "To Metric") w/ button to switch direction when 
   *      appropriate (i.e. all except for Zodiac)
   * 5a) Radio buttons to choose conversion code (e.g. miles to kilometers)
   * 5b) Radio buttons or dropdown list to show Japanese eras to convert from (if FROMJPYEAR, e.g. Taisho)
   * 6) ZodiacKanjiScreen show zodiac kanji (for TOJPYEAR and TOZODIAC only)
   */
  return (
    <View style={[styles.container, bgStyle]}>
      {showNumericInput && 
      <View style={[styles.inputTextArea, bgStyle2]}>
        <TextInput style={styles.inputTextText}
          onChangeText={onChangeTextProc}
          value={fromValue}
          keyboardType={'numeric'}
          maxLength={maxInputTextLength}
          returnKeyType={'done'}
        />
      </View>
      }
      {showYearInput && 
      <View style={[styles.inputYearArea, bgStyle2]}>
        <TextInput style={styles.inputYearText}
          onChangeText={onChangeTextProc}
          value={fromValue}
          keyboardType={'numeric'}
          maxLength={maxInputTextLength}
          returnKeyType={'done'}
          placeholder={hint}          
        />
        { showIncrementers &&
        <View style={[styles.inputIcon, bgStyle2]}>
          <Pressable onPress = {() => { subtractAYear(); }}>
          <Icon name='minus-box' size={32} color={bgColor} style={{height:32, width:32}}/>
          </Pressable>
        </View>
        }
        { showIncrementers &&
        <View style={[styles.inputIcon, bgStyle2]}>
          <Pressable onPress = {() => { addAYear(); }}>
          <Icon name='plus-box' size={32} color={bgColor} style={{height:32, width:32}}/>
          </Pressable>
        </View>      
        }
      </View>
      }
      <Text style={styles.resultPanel}>{resultPanelText}</Text>
      <Text style={styles.instructionsText}>{instructions}</Text>

      <View style={styles.toggleZone}>
        <Text style={styles.converterHeader}>{capitalize(getDispName(cvtype))}</Text>
        {showToggle && 
        <View style={styles.toggleButtonZone} >
          <TinyBtn onPress={() => toggleDirection()} 
            text={'Switch direction'} color={clr.lightBlue} />        
        </View>
        }
      </View>
      
      {showConvRadio &&
      <ConverterList cvtype={cvtype} cvs={cvs} setConverter={setConverter} changeType={changeType} />
      }

      {showEraRadio &&
      <EraList cvtype={cvtype} yc={yc} setConverter={setConverter} />
      }

      {showZodiac &&
      <ZodiacKanjiScreen kanjiJ={kanjiJ} kanjiJZ={kanjiJZ} caption1={caption1} caption2={caption2} />
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
    // height: 50,
  },
  inputYearArea: {
    flexDirection: 'row',
    marginTop: 3,
    paddingLeft: 10,
    // height: 50,
  },
  inputTextText: {
    fontSize: 20,
    paddingBottom: 10,
    paddingTop: 10,
  },
  inputYearText: {
    fontSize: 20,
    flex: 6,
    paddingBottom: 10,
    paddingTop: 10,
  },
  inputIcon: {
    flex: 1,
    alignSelf: 'center',
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
    borderBottomWidth: 1,
    borderBottomColor: clr.lighterGrey,
  },
  converterHeader: {
    fontSize: 16,
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 20,
    color: clr.white,
    paddingBottom: 15,
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
