import React, {useState} from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import RadioButtonRN from '../utils/radio-buttons-react-native/RadioButtonRN';
import { clr } from '../utils/colors';

export default function ConverterList2({cvtype, cvs, setConverter, changeType})  {  
  const initialConvCode = cvs.getFirstConvCodeFromConvType(cvtype);
  // console.log('** converterList cvtype: ' + cvtype + ' convCode: ' + initialConvCode);
  const initialRadioIx = 0;
  let radioProps = [];
  const [convCodeLocal, setConvCodeLocal] = useState(initialConvCode);
  const [radioIndex, setRadioIndex] = useState(initialRadioIx); // STATE, these start with zero
  const [stRadioProps, setStRadioProps] = useState(radioProps); // STATE

  /**
   * Reset local version of convCode and radio index.  Activated 
   * when changing cvtype externally, by swiping or toggling direction.
   */
  React.useEffect(() => {
    radioProps = cvs.convTypeToRadioProps(cvtype);
    setStRadioProps(radioProps);
    if (changeType==='toggle') { // keep same radio index, update the convCode
      const newConvCode = cvs.radioIndexToConvCode(cvtype, radioIndex);
      setConvCodeLocal(newConvCode);
      setConverter(newConvCode);
    } else { // switch to first radio button after swiping
      setConvCodeLocal(initialConvCode);
      setRadioIndex(initialRadioIx);
    }
  }, [cvtype]); 
 
  const onPressProc = async (radioObj) => { // radioObj.value = newConvCode, radioObj.ixValue = zero-based ix
    const newConvCode = radioObj.value;
    setRadioIndex(radioObj.ixValue); 
    setConvCodeLocal(newConvCode);
    setConverter(newConvCode); // passed back to calling component
  }

  return (
    <ScrollView style={styles.converterList}>
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
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  converterList: {
    width: '100%',
    borderWidth: 0,
    borderColor: clr.lighterGrey,
  },
  radioText: {
    color: clr.white,
    fontSize: 14,
    fontWeight: 'bold',
    paddingLeft: 0,
    marginLeft: 5,
    paddingBottom: 3,
    paddingTop: 4,
  },
  radioGroup: {
    marginLeft: 5,
    marginBottom: 10,
  },
});
