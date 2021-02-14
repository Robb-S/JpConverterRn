import React, {useState} from 'react';
import { Text, StyleSheet, View, useWindowDimensions, ScrollView } from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 
  'react-native-simple-radio-button';
import { clr } from '../utils/colors';

export default function ConverterList({cvtype, cvs, setConverter})  {
  const radioProps = cvs.convTypeToRadioProps(cvtype);
  const initialConvCode = cvs.getFirstConvCodeFromConvType(cvtype);
  const initialRadioIx = 0;
  const [convCodeLocal, setConvCodeLocal] = useState(initialConvCode);
  const [radioIndex, setRadioIndex] = useState(initialRadioIx);

  /**
   * Reset local version of convCode and radio index.  Activated 
   * when changing cvtype externally, by swiping or toggling direction.
   */
  React.useEffect(() => {
    setConvCodeLocal(initialConvCode);
    setRadioIndex(initialRadioIx);
  }, [cvtype]); 

  const onPressProc = (newConvCode, index) => { // value is the chosen convCode
    setRadioIndex(index);
    setConvCodeLocal(newConvCode);
    setConverter(newConvCode); // passed back to calling component
  }

  /** 
   * Use cvtype for key values in text and RadioForm to force a rerendering when cvtype changes,
   * due to swiping screen or toggling direction.  (Otherwise it won't reset chosen 
   * position to top radio button.)
   */
  return (
    <View style={styles.converterList}>
      <Text key={cvtype+'0'} style={styles.smallText}>{cvtype} / {convCodeLocal}</Text>
      <ScrollView>
        <RadioForm formHorizontal={false} animation={true} style={styles.radioForm} >
          {radioProps.map((obj, i) => {
            return (
              <RadioButton labelHorizontal={true} key={i} >
                {/*  You can set RadioButtonLabel before RadioButtonInput */}
                <RadioButtonInput
                  obj={obj}
                  index={i}
                  isSelected={radioIndex === i}
                  onPress={onPressProc}
                  buttonInnerColor={clr.lightGrey}
                  buttonOuterColor={radioIndex === i ? clr.black : clr.darkGrey}
                  buttonSize={14}
                  buttonStyle={{marginTop: 4, marginBottom: 6}}
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
    </View>
  )
}

const styles = StyleSheet.create({
  converterList: {
    maxHeight: 350,
    width: '70%',
    borderWidth: 1,
    borderColor: clr.lighterGrey,
  },
  radioForm: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  smallText: {
    // display: 'none',
    backgroundColor: clr.darkGrey,
    color: clr.white,
    padding: 10,
    fontSize: 11,
    width: '100%',
    marginBottom: 2,
    textAlign: 'center',
    marginRight: 5,
  },
});
