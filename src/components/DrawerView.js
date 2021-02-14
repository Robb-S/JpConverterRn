import React from 'react';
import { Text, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { clr } from '../utils/colors';
import { catToSnum, cv } from '../utils/modes';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const DrButton = ({text, iconName, onPress}) => {
  return (
    <View style={styles2.drButton}>
      <Icon style={styles2.icon} size={20} name={iconName} color={iconColor} />
      <TouchableOpacity onPress={onPress}>
        <Text style={styles2.drButtonText}> {text}</Text>
      </TouchableOpacity>
    </View>
  );
}
const DrSubhead = ({text, topBorder='true'}) => {
  let substyle
  if (topBorder)substyle = styles2.drSubhead
  else substyle = [styles2.drSubhead, styles2.noTopBorder];
  return (
    <View style={substyle}>
      <Text style={styles2.drSubheadText}>{text}</Text>
    </View>
  );
}

const DrawerView = (drawer, navigation, setMode, screenNum, currDirection) => {
  // const cvid = getCvType(screenNum, currDirection);
  const cvid = 'temporary';
  const goToScreen = (cvCat, dir) => {
    drawer.current.closeDrawer();
    setMode(catToSnum(cvCat), dir);
  }
  return (
    <ScrollView style={[styles2.drawerContainer]}>
      <DrSubhead text={'Measurements'} topBorder={false} />
      <DrButton text={'To metric'} 
        iconName={'calculator'}
        onPress={() => { goToScreen(cv.METRIC, cv.TOJP)} }
      />
      <DrButton text={'From metric'} 
        iconName={'calculator'}    
        onPress={() => { goToScreen(cv.METRIC, cv.FROMJP)} }
      />
      <DrButton text={'To Japanese measures'} 
        iconName={'calculator'}
        onPress={() => { goToScreen(cv.JPMEASURE, cv.TOJP)} }
      />
      <DrButton text={'From Japanese measures'} 
        iconName={'calculator'}
        onPress={() => { goToScreen(cv.JPMEASURE, cv.FROMJP)} }
      />
      <DrSubhead text={'Calendar'} />
      <DrButton text={'To Japanese years'} 
        iconName={'calendar-month'}
        onPress={() => { goToScreen(cv.JPYEAR, cv.TOJP)} }
      />
      <DrButton text={'From Japanese years'} 
        iconName={'calendar-month'}
        onPress={() => { goToScreen(cv.JPYEAR, cv.FROMJP)} }
      />
      <DrButton text={'Zodiac years'} 
        iconName={'rabbit'}
        onPress={() => { goToScreen(cv.ZODIAC, cv.TOJP)} }
      />
      <DrSubhead text={"More"} />
      <DrButton text={"Help"}
        iconName={'help-circle-outline'}
        onPress={() => {
          drawer.current.closeDrawer();
          navigation.navigate('Help');
        }}
      />
    </ScrollView>
  )
}

const drawerBgColor = clr.lighterGrey;
const iconColor = clr.red;

const styles2 = StyleSheet.create({
  drawerContainer: {
    height:'100%',
    width:'100%',
    backgroundColor: drawerBgColor,
  },
  drButton: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: drawerBgColor,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 22,
  },
  drSubhead: {
    width: '100%',
    backgroundColor: drawerBgColor,
    paddingTop: 12,
    marginTop: 12,
    paddingBottom: 4,
    paddingLeft: 20,
    borderTopColor: clr.medGrey,
    borderTopWidth: 1,
  },
  noTopBorder: {
    borderTopWidth: 0,
  },
  drButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: clr.black,
  },
  drSubheadText: {
    fontSize: 15,
    color: clr.darkGrey,
  },
  icon: {
    paddingRight: 15,
    paddingTop: 0,
  },
});

export default DrawerView
