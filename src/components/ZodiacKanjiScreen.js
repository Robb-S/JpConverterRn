import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { clr } from '../utils/colors';

export default function ZodiacKanjiScreen({kanji1, kanji2}) {
  console.log('calling kscreen: ' + kanji1);
  return (
    <View style={stylesZ.zodiacZone}>
      <View style={stylesZ.zodiacPart}>
        <Text style={stylesZ.zodiac1}>{kanji1}</Text>
        <Text style={stylesZ.zodiacCaption}>{'Zodiac kanji'}</Text>   
      </View>
      <View style={stylesZ.zodiacPart}>
        <Text style={stylesZ.zodiac2}>{kanji2}</Text>
        <Text style={stylesZ.zodiacCaption}>{'Animal kanji'}</Text>   
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
