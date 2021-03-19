import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { clr } from '../utils/colors';

export default function ZodiacKanjiScreen({kanjiJ, kanjiJZ,
  caption1='', caption2=''}) {
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
  );
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
    color: clr.lighterBlueGrey,
  },
  zodiac2: {
    fontSize: 100,
    textAlign: 'center',
    color: clr.lighterBlueGrey,
  },
  zodiacCaption: {
    fontSize: 14,
    textAlign: 'center',
    color: clr.white,
  },
});
