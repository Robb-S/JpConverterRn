import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { clr } from '../utils/colors';

export default function NarrowBtn ({ onPress, text, bgColor=clr.blue, color=clr.white }) {
  return(
    <TouchableOpacity onPress={onPress}
      style={[styles.narrowButton, {backgroundColor: bgColor}]}>
      <Text style={[styles.wideBtnText, {color: color}]}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  narrowButton: {
    width: 180,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 12,
    marginBottom: 8,
    alignSelf: 'center',
    justifyContent: 'center',
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
