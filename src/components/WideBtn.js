import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { clr } from '../utils/colors';

export default function WideBtn ({ onPress, text, bgColor=clr.blue }) {
  return(
    <TouchableOpacity onPress={onPress}
      style={[styles.wideButton, {backgroundColor: bgColor}]}>
      <Text style={styles.wideBtnText}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  wideButton: {
    width: '80%',
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 8,
    marginBottom: 8,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: 50,
    alignItems: 'center'
  },
  wideBtnText: {
    color: clr.white,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
})
