import React, {useState} from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 
  'react-native-simple-radio-button';
import { clr } from '../utils/colors';
import { cv } from '../utils/modes';
import NarrowBtn from './NarrowBtn';

export default function EraList({cvtype, yc, setConverter})  {
  const initialConvCode = yc.getNowEra();
  // console.log('initialConvCode: ' + initialConvCode);
  // console.log('** converterList cvtype: ' + cvtype + ' convCode: ' + initialConvCode);
  const initialRadioIx = 0;   // TODO find index for reiwa?
  const [eraType, setEraType] = useState('modern'); 
  const [convCodeLocal, setConvCodeLocal] = useState(initialConvCode);
  const [radioIndex, setRadioIndex] = useState(initialRadioIx);
  const radioProps = yc.eraTypeToRadioProps(eraType);

  /**
   * Reset local version of convCode and radio index.  Activated 
   * when changing cvtype externally, by swiping or toggling direction.
   */
  React.useEffect(() => {
    setConvCodeLocal(initialConvCode);
    setConverter(initialConvCode); // passed back to calling component
    setRadioIndex(initialRadioIx);
  }, []); 
  // }, [cvtype]); 

  const onPressProc = (newConvCode, index) => { // value is the chosen convCode
    setRadioIndex(index);
    setConvCodeLocal(newConvCode);
    setConverter(newConvCode); // passed back to calling component
  }

  const toggleEraType = () => {
    if (eraType==='modern') {setEraType('all');}
    else {setEraType('modern');}
  }

  /** 
   * Use cvtype for key value in RadioForm to force a rerendering when cvtype changes,
   * due to swiping screen or toggling direction. (Otherwise maybe it won't reset chosen 
   * position to top radio button.)
   */

  const toggleText = eraType==='modern' ? 'Show all eras' : 'Show modern eras';
  return (
    <ScrollView style={styles.converterList}>
      <NarrowBtn onPress={toggleEraType} text={toggleText} />
      <RadioForm animation={true} style={styles.radioForm} key={cvtype}>
        {radioProps.map((obj, i) => {
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
});
