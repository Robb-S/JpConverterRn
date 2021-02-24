import React, {useState} from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 
  'react-native-simple-radio-button';
import { clr } from '../utils/colors';
import { cv } from '../utils/modes';
import NarrowBtn from './NarrowBtn';
import TinyBtn from './TinyBtn';

/**
 * Show radio buttons and/or dropdown list for choosing Japanese eras.
 * Initial state: 1) eraType will be modern; 2) eraCode will be nowCode; 
 * 3) radioButtonIx will be from yc.getEraCodes call (or just 0)
 * On first load: call getEraCodes, set radioButtonIx
 * In toggle proc: reset eraType in store
 * On change of eraType: get new radiobuttons and ix
 * onPress for radio buttons: setEraCode, ixPos in store, setEraCode in parent component
 */
export default function EraList({cvtype, yc, setConverter})  {
  console.log('** at start of EraList component **');
  let radioProps = []; let nowPos = null;
  const nowEra = yc.getNowEra();
  const defaultNowPos = 0; // for first button in modern list - should be now era
  const [eraType, setEraType] = useState('modern');  // STATE
  const [convCodeLocal, setConvCodeLocal] = useState(nowEra); // STATE
  const [radioIndex, setRadioIndex] = useState(defaultNowPos); // STATE
  const [stRadioProps, setStRadioProps] = useState(radioProps);

  /**
   * Reset local version of convCode and radio index.  Activated when component is loaded.
   */
  React.useEffect(() => {
    console.log('****** radio buttons : ' + radioProps.length);
    console.log('** Activating initial useEffect setup when EraList component is loaded');
    [radioProps, nowPos] = yc.eraTypeToRadioProps(eraType); // NOT state
    setConvCodeLocal(nowEra);
    setConverter(nowEra); // passed back to calling component
    setRadioIndex(nowPos);
    setStRadioProps(radioProps);
    console.log('****** radio buttons : ' + radioProps.length);
  }, []); 
  // }, [cvtype, initialRadioIx]); 

  React.useEffect(() => {
    console.log('Era type was reset, using effect.');
    console.log('****** radio buttons : ' + radioProps.length);
    [radioProps, nowPos] = yc.eraTypeToRadioProps(eraType); // NOT state
    console.log('****** radio buttons : ' + radioProps.length);
  }, [eraType]);

  const onPressProc = (newConvCode, index) => { // value is the chosen convCode
    console.log('** onPressProc for radio buttons **');
    setRadioIndex(index);
    setConvCodeLocal(newConvCode);
    setConverter(newConvCode); // passed back to calling component
  }

  const toggleEraType = () => {
    console.log('*** inside toggleEraType ***');
    const newEraType = eraType==='modern' ? 'all' : 'modern';
    setEraType (newEraType);
    setConvCodeLocal(nowEra);
    setConverter(nowEra);
    [radioProps, nowPos] = yc.eraTypeToRadioProps(newEraType);
    setRadioIndex(nowPos);
    setStRadioProps(radioProps);
  }

  const toggleText = eraType==='modern' ? 'Show historical eras' : 'Show modern eras';
  const statusText = eraType==='modern' ? 'Modern eras' : 'Historical eras'
  return (
      <ScrollView style={styles.converterList}>
        <View style={styles.toggleZone}>
          <Text style={styles.converterHeader}>{statusText}</Text>
          <View style={styles.toggleButtonZone} >
            <TinyBtn onPress={() => toggleEraType()} 
            text={toggleText} color={clr.lightBlue} />        
          </View>  
        </View>
        <RadioForm animation={true} style={styles.radioForm}>
          {stRadioProps.map((obj, i) => {
            return (
              <RadioButton labelHorizontal={true} key={i} >
                <RadioButtonInput
                  obj={obj}
                  index={i}
                  isSelected={radioIndex===i}
                  onPress={onPressProc}
                  buttonInnerColor={clr.lightGrey}
                  buttonOuterColor={radioIndex === i ? clr.black : clr.darkGrey}
                  buttonSize={14}
                  buttonStyle={{marginTop: 4, marginBottom: 5}}
                  buttonWrapStyle={{marginRight: 10, marginLeft: 10}}
                />
                <RadioButtonLabel
                  obj={obj}
                  index={i}
                  onPress={onPressProc}
                  labelStyle={{fontWeight: 'bold', color: clr.lighterGrey}}
                  labelWrapStyle={{marginTop: -3}}
                />
              </RadioButton>
            )
          })}
        </RadioForm>
      </ScrollView>
  )
}

const styles = StyleSheet.create({
  converterList: {
    width: '100%',
    borderWidth: 0,
    borderColor: clr.lighterGrey,
  },
  radioForm: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  toggleZone: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingRight: 10,
  },
  converterHeader: {
    fontSize: 16,
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 20,
    color: clr.white,
  },
});
