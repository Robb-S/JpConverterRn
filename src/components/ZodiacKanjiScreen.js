import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { clr } from '../utils/colors';

export default function ZodiacKanjiScreen({kanjiJ, kanjiJZ, 
  caption1='animal kanji', caption2='zodiac kanji'}) {
  return (
    <View style={stylesZ.zodiacZone}>
      <View style={stylesZ.zodiacPart}>
        <Text style={stylesZ.zodiac1}>{kanjiJ}</Text>
        <Text style={stylesZ.zodiacCaption}>{caption1}</Text>   
      </View>
      <View style={stylesZ.zodiacPart}>
        <Text style={stylesZ.zodiac2}>{kanjiJZ}</Text>
        <Text style={stylesZ.zodiacCaption}>{caption2}</Text>   
      </View>
    </View>
  )
}

const stylesZ = StyleSheet.create({
  zodiacZone: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-evenly',
  },
  zodiacPart: {
    paddingTop: 0,
  },
  zodiac1: {
    fontSize: 100,
    textAlign: 'center',
    color: clr.yellow,
  },
  zodiac2: {
    fontSize: 100,
    textAlign: 'center',
    color: clr.yellow,
  },
  zodiacCaption: {
    fontSize: 14,
    textAlign: 'center',
    color: clr.white,
  },
});
