import React from 'react';
import { Text, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { clr } from '../utils/colors';
import { catToSnum, cv } from '../utils/modes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DrButton = ({text, iconName, onPress}) => {
  return (
    <View style={styles2.drButton}>
      <Icon style={styles2.icon} size={20} name={iconName} color={iconColor} />
      <TouchableOpacity onPress={onPress}>
        <Text style={styles2.drButtonText}> {text}</Text>
      </TouchableOpacity>
    </View>
  );
};
const DrSubhead = ({text, topBorder='true'}) => {
  let substyle;
  if (topBorder) {substyle = styles2.drSubhead;}
  else substyle = [styles2.drSubhead, styles2.noTopBorder];
  return (
    <View style={substyle}>
      <Text style={styles2.drSubheadText}>{text}</Text>
    </View>
  );
};

const DrawerView = (drawer, navigation, setMode) => {
  // const cvid = getCvType(screenNum, currDirection);
  const goToScreen = (cvCat, dir) => {
    drawer.current.closeDrawer();
    setMode(catToSnum(cvCat), dir);
  };
  return (
    <ScrollView style={[styles2.drawerContainer]}>
      <DrSubhead text={'Measurements'} topBorder={false} />
      <DrButton text={'To metric'}
        iconName={'calculator'}
        onPress={() => { goToScreen(cv.METRIC, cv.TOJPVAL);} }
      />
      <DrButton text={'From metric'}
        iconName={'calculator'}
        onPress={() => { goToScreen(cv.METRIC, cv.FROMJPVAL);} }
      />
      <DrButton text={'To Japanese measures'}
        iconName={'calculator'}
        onPress={() => { goToScreen(cv.JPMEASURE, cv.TOJPVAL);} }
      />
      <DrButton text={'From Japanese measures'}
        iconName={'calculator'}
        onPress={() => { goToScreen(cv.JPMEASURE, cv.FROMJPVAL);} }
      />
      <DrSubhead text={'Calendar'} />
      <DrButton text={'To Japanese years'}
        iconName={'calendar-month'}
        onPress={() => { goToScreen(cv.JPYEAR, cv.TOJPVAL);} }
      />
      <DrButton text={'From Japanese years'}
        iconName={'calendar-month'}
        onPress={() => { goToScreen(cv.JPYEAR, cv.FROMJPVAL);} }
      />
      <DrButton text={'Zodiac years'}
        iconName={'rabbit'}
        onPress={() => { goToScreen(cv.ZODIAC, cv.TOJPVAL);} }
      />
      <DrSubhead text={'More'} />
      <DrButton text={'Help'}
        iconName={'help-circle-outline'}
        onPress={() => {
          drawer.current.closeDrawer();
          navigation.navigate('Help');
        }}
      />
      <DrButton text={'Other useful apps'}
        iconName={'apps'}
        onPress={() => {
          drawer.current.closeDrawer();
          navigation.navigate('Other useful apps');
        }}
      />
      {/* <DrButton text={'Web resources'}
        iconName={'web'}
        onPress={() => {
          drawer.current.closeDrawer();
          navigation.navigate('Web resources');
        }}
      /> */}
      {/* <DrButton text={'Test'}
        iconName={'cow'}
        onPress={() => {
          drawer.current.closeDrawer();
          navigation.navigate('Test');
        }}
      /> */}
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

export default DrawerView;
