import React, {useState} from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import RadioButtonRN from '../utils/radio-buttons-react-native/RadioButtonRN';
import { clr } from '../utils/colors';
import TinyBtn from './TinyBtn';
import {Picker} from '@react-native-picker/picker';
// import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // for custom radio icon

/**
 * Show radio buttons and/or dropdown list for choosing Japanese eras.
 * Initial state: 1) eraType will be modern; 2) eraCode will be nowCode; 
 * 3) radioButtonIx will be from yc.getEraCodes call (or just 0)
 * On first load: call getEraCodes, set radioButtonIx
 * In toggle proc: reset eraType in store
 * On change of eraType: get new radiobuttons and ix
 * onPress for radio buttons: setEraCode, ixPos in store, setEraCode in parent component
 */
export default function EraList2({yc, setConverter, setFromValue})  {
  // console.log('** at start of EraList component **');
  let radioProps = []; let nowPos = null;
  const nowEra = yc.getNowEra();
  const defaultNowPos = 0; // for first button in modern list - should be now era
  const [eraType, setEraType] = useState('modern');  // STATE
  const [convCodeLocal, setConvCodeLocal] = useState(nowEra); // STATE
  const [radioIndex, setRadioIndex] = useState(defaultNowPos); // STATE
  const [stRadioProps, setStRadioProps] = useState(radioProps); // STATE

  /**
   * Reset local version of convCode and radio index.  Activated when component is loaded.
   */
  React.useEffect(() => {
    [radioProps, nowPos] = yc.eraTypeToRadioProps(eraType); // NOT state
    setConvCodeLocal(nowEra);
    setConverter(nowEra); // passed back to calling component
    setRadioIndex(nowPos);
    setStRadioProps(radioProps);
  }, []); 
  // }, [cvtype, initialRadioIx]); 

  React.useEffect(() => {  // get list of eras at start or when eraType changes
    [radioProps, nowPos] = yc.eraTypeToRadioProps(eraType); // NOT state, just a pair array
  }, [eraType]);

  const onPressProc = async (radioObj) => { // radioObj.value is newConvCode
    const newConvCode = radioObj.value;
    await setFromValue('');  // set to blank to avoid momentary flash of wrong value when switching eras
    // setRadioIndex(index); // other radio button packages needed this
    setConvCodeLocal(newConvCode);
    setConverter(newConvCode); // passed back to calling component
  }

  const onDropdownSelect = async (newConvCode, itemIndex) => { // value is the chosen eraCode
    await setFromValue('');  // set to blank to avoid momentary flash of wrong value when switching eras
    setConvCodeLocal(newConvCode);
    setConverter(newConvCode); // passed back to calling component
  }

  const toggleEraType = () => {
    const newEraType = eraType==='modern' ? 'all' : 'modern';
    setEraType(newEraType);
    setConvCodeLocal(nowEra);
    setConverter(nowEra); // in parent component
    [radioProps, nowPos] = yc.eraTypeToRadioProps(newEraType);
    setRadioIndex(nowPos);        // always switch to current era
    setStRadioProps(radioProps);
  }

  const toggleText = eraType==='modern' ? 'Show historical eras' : 'Show modern eras';
  const statusText = eraType==='modern' ? 'Modern eras' : 'Historical eras'
  const showRadioForm = eraType==='modern';
  const showDropdown = eraType==='all';

  return (
        <ScrollView style={styles.converterList}>

        <View style={styles.toggleZone}>
          <Text style={styles.converterHeader}>{statusText}</Text>
          <View style={styles.toggleButtonZone} >
            <TinyBtn onPress={() => toggleEraType()} 
            text={toggleText} color={clr.lightBlue} />        
          </View>  
        </View>

        { showDropdown && 
        <View style={styles.pickerView}>
        <Picker
          selectedValue={convCodeLocal}
          mode={'dialog'}
          style={styles.picker}
          onValueChange={onDropdownSelect}
        >
          {stRadioProps.map((obj, i) => {
            return (
              <Picker.Item style={styles.pickerItem} key={i} label={obj['label']} value={obj['value']} />
            )
          })}
        </Picker>
        </View>
        }

        { showRadioForm && 
        <RadioButtonRN
          data={stRadioProps}
          selectedBtn={onPressProc}
          initial={radioIndex+1}
          animationTypes={['zoomIn', 'pulse']}
          circleSize={18}
          activeColor={clr.white}
          deactiveColor={clr.darkGrey}
          box={false}
          style={styles.radioGroup}
          textStyle={styles.radioText}
        />
        }
      </ScrollView>
  )
}

const styles = StyleSheet.create({
  converterList: {
    width: '100%',
    borderWidth: 0,
    borderColor: clr.lighterGrey,
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
  picker: {
    width: 200,
    height: 40,
    color: clr.white,
  }, 
  pickerView: {
    width: 202,
    borderWidth: 1,
    borderColor: clr.lighterGrey,
    marginLeft: 10,
  },
  pickerItem: {
    color: clr.white,
  },
  radioText: {
    color: clr.white,
    fontSize: 14,
    fontWeight: 'bold',
    paddingLeft: 0,
    marginLeft: 5,
    paddingBottom: 4,
    paddingTop: 4,
  },
  radioGroup: {    
    marginLeft: 5,
    marginBottom: 10,
    /* width: 200,   /* set this to allow swiping from right side of window */
  },
});
