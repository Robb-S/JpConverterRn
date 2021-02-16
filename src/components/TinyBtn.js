import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { clr } from '../utils/colors';

export default function TinyBtn ({ onPress, text, bgColor='transparent', color=clr.white }) {
  return(
    <TouchableOpacity onPress={onPress}
      style={[styles.tinyButton, {backgroundColor: bgColor}]}>
      <Text style={[styles.tinyBtnText, {color: color}]}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  tinyButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: clr.lightGrey,
    borderWidth: 1,
  },
  tinyBtnText: {
    color: clr.white,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
})
