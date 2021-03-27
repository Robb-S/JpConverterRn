/**
 * The HomeScreen component provides a shell for MainScreen, drawer and swipe gesture components, 
 * and it handles async storage to keep track of most recently used conversion types.
 * 
 * HomeScreen handles navigation/manipulation of the conversion categories and directions 
 * that are displayed in MainScreen.  Two state variables - screenNum and currDirection,
 * determine which conversion category and direction of conversion (to/from Japanese measures)
 * will be displayed by the MainScreen component.
 * 
 * Swiping left or right switches from one conversion category to the next, and toggling 
 * switches conversion direction.  Pairs of category/direction can also be set from buttons 
 * in the drawer.  
 * 
 * UseState uses the dirArray variable to remember the most recent conversion
 * direction for each conversion category, and stores all last-position data to async storage.
 * 
 * ScreenNum correlates with conversion category (e.g. "metric"), and together with direction
 * ("tojp" or "fromjp") these determine the conversion type (e.g. "tometric"), which is passed
 * down to the MainScreen component.
 */

import React, {useRef, useState, useEffect} from 'react';
import { StyleSheet, View, DrawerLayoutAndroid, Keyboard } from 'react-native';
import { clr } from '../utils/colors';
import { cv, getBgStyles, getBgColors, getDispName, getCvType } from '../utils/modes';
import MainScreen from './MainScreen';
import SwipeGesture from '../utils/swipe-gesture2';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {toggleArrayIx, assignArrayIx} from '../utils/helpers';
import DrawerView from './DrawerView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {capitalize} from '../utils/helpers';


const HomeScreen = ({navigation}) => {
  /**
   * Set header title to match current conversion type, or generic app name as default 
   */
  const setMainHeaderTitle = (sNum, cDirection) => {
    const currTitle = (sNum!==null) ? getDispName(getCvType(sNum, cDirection)) : 'JP Converter';
    navigation.setOptions({
      headerTitle: capitalize(currTitle),
    });
  };
  /**
   * Set header title to generic app name when the drawer is open.
   */
  const setDrawerHeaderTitle = () => {
    const drawerTitle = 'JP Converter';
    navigation.setOptions({
      headerTitle: drawerTitle,
    });
  };
  // handle drawer open/close, since toggle method doesn't exist for DrawerLayoutAndroid.
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const onDrawerOpen = () => {
    Keyboard.dismiss();
    setDrawerOpen(true);
    setDrawerHeaderTitle();
  };
  const onDrawerClose = () => {
    Keyboard.dismiss();
    setDrawerOpen(false);
    setMainHeaderTitle(screenNum, currDirection);
  };
  const toggleDrawer = () => {
    if (isDrawerOpen)drawer.current.closeDrawer();
    else drawer.current.openDrawer();
  };
  const drawer = useRef(null);
  /**
   * Add hamburger icon to left side of header, to open and close drawer.
   */
  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Icon name='menu' size={32} onPress={toggleDrawer} color={clr.white} />
      ),
    });
  }, [navigation, isDrawerOpen, screenNum]);  // isDrawerOpen is necessary, otherwise won't close drawer

  // handle swiping of different screenNums
  // direction array will remember last conversion direction for each conversion type
  const [screenNum, setScreenNum] = React.useState(null);
  const [dirArray, setDirArray] = React.useState([true, true, true, true]);
  const [currDirection, setCurrDirection] = React.useState(true);
  const [changeType, setChangeType] = useState('swipe'); // set new cvtype with 'swipe', 'toggle' or 'menu'
  const showToggle = (getCvType(screenNum, currDirection) !== cv.TOZODIAC);

  /**
   * Add arrow button in header to increment screen number.  This must be placed after the
   * screenNum useState() statement in order to update properly.  Also add toggle direction 
   * button in header, but hide it when it's not appropriate.
   */
  React.useEffect(() => {
    const [bgColor, bgColor2, bgColor3] = getBgColors(getCvType(screenNum, currDirection));
    if (!isDrawerOpen) {setMainHeaderTitle(screenNum, currDirection);}
    navigation.setOptions({
      headerStyle: {
        backgroundColor: bgColor3,
      },
      headerTintColor: clr.white,
      headerRight: () => (
        <View style={styles.horizontal}>
          {(showToggle) && (!isDrawerOpen) &&
            <Icon name='arrow-up-down-bold-outline' size={28} color={clr.lighterGrey}
              style={styles.iconPadRight} onPress={toggleDirection} />
          }
          {(!isDrawerOpen) &&
            <Icon name='arrow-right-bold-box-outline' size={32} color={clr.lighterGrey}
              style={styles.iconPadRight} onPress={incrementScreenNum} />
          }
        </View>
      ),
    });
  }, [navigation, screenNum, currDirection, isDrawerOpen]);

  /**
   * Switch to new conversion screen by swiping. 
   */
  const onSwipePerformed = (action) => {
    if (action==='left') incrementScreenNum();
    if (action==='right') decrementScreenNum();
  };
  const minScrNum = 0;
  const maxScrNum = 3;
  /**
   * Change screen number to display next screen (next conversion type) in sequence after swiping.
   * Loop back to beginning after reaching the end.  (This looping is not possible using ordinary 
   * React Native tab navigation.)  Using simulated modulo function for clearer code.
   */
  const incrementScreenNum = () => {
    const newScreenNum = (screenNum===maxScrNum) ? minScrNum : screenNum+1;
    const newCurrDirection = dirArray[newScreenNum];
    updateData(newScreenNum, dirArray, newCurrDirection); // dirArray is unchanged
    setMainHeaderTitle(newScreenNum, newCurrDirection);
    setChangeType('swipe');
    Keyboard.dismiss();
  };
  const decrementScreenNum = () => { // display previous screen/category
    const newScreenNum = (screenNum===minScrNum) ? maxScrNum : screenNum-1;
    const newCurrDirection = dirArray[newScreenNum];
    updateData(newScreenNum, dirArray, newCurrDirection); // dirArray is unchanged
    setMainHeaderTitle(newScreenNum, newCurrDirection);
    setChangeType('swipe');
    Keyboard.dismiss();
  };
  /**
   * Set new conversion type and direction, store to state and async storage, from drawer buttons.
   */
  const setMode = (newScreenNum, newCurrDirection) => { // new conv type and direction from drawer
    const newDirArray = assignArrayIx(dirArray, newScreenNum, newCurrDirection);
    updateData(newScreenNum, newDirArray, newCurrDirection);
    setMainHeaderTitle(newScreenNum, newCurrDirection);
    setChangeType('menu');
  };
  /**
   * Keep conversion type but toggle direction, store to state and async storage.
   */
  const toggleDirection = async function () { // // switch conversion direction only
    await setChangeType('toggle'); // make sure toggle is set before showing radio buttons
    const newDirArray = toggleArrayIx(dirArray, screenNum);
    const newCurrDirection = newDirArray[screenNum];
    updateData(screenNum, newDirArray, newCurrDirection); // screenNum is unchanged
    setMainHeaderTitle(screenNum, newCurrDirection);
    Keyboard.dismiss();
  };
  /**
   * Read last-used position and direction from async storage when starting up.
   */
  useEffect(() => { // get last stored screens, etc. from local async storage
    retrieveInitData();
  }, []);
  /**
   * Retrieve last-used position data, or substitute defaults if not found.
   */
  const retrieveInitData = async () => {
    try {
      const stLastPos = await(AsyncStorage.getItem('lastPos'));
      if (stLastPos!=null) {
        const { stScreenNum, stDirArray, stCurrDirection } = JSON.parse(stLastPos);
        setScreenNum(stScreenNum);
        setDirArray(stDirArray);
        setCurrDirection(stCurrDirection);
      } else { // if first time, set defaults
        setScreenNum(0);
        setDirArray([true, true, true, true]);
        setCurrDirection(true);
        // console.log('nothing retrieved, setting defaults');
        // sleep(3000);
      }
    } catch (error) { // if error, set initial screen to zodiac
      setScreenNum(3);
      setDirArray([true, true, true, true]);
      setCurrDirection(true);
    }
  };
  /**
   * Reset position and direction variables, set to state and write to async storage.
   */
  const updateData = async (newScreenNum, newDirArray, newCurrDirection) => {
    setScreenNum(newScreenNum);
    setDirArray(newDirArray);
    setCurrDirection(newCurrDirection);
    const stLastPos = {
      stScreenNum: newScreenNum,
      stDirArray: newDirArray,
      stCurrDirection: newCurrDirection,
    };
    await AsyncStorage.setItem('lastPos', JSON.stringify(stLastPos));
  };
  const [bgStyle] = getBgStyles(getCvType(screenNum, currDirection));

  /**
   * Drawer - buttons to set MainScreen params (pseudo-nav) or navigate to other components.
   * View - lies underneath SwipeGesture to pick up different, edge swipe gestures to open drawer.
   *   A narrow band along the left edge is exposed, and when this is swiped it will open
   *   the drawer rather than shift the whole screen as described below.
   * SwipeGesture - handles leftward and rightward swipes to change conversion category.  
   *   Swipe behavior was fine-tuned by setting a threshold level of positional delta.
   * MainScreen - shows main conversion screen, depending on conversion-type param.
   */
  return (
    <DrawerLayoutAndroid
      onDrawerOpen={onDrawerOpen}
      onDrawerClose={onDrawerClose}
      ref={drawer}
      drawerWidth={300}
      drawerPosition={'left'}
      renderNavigationView={() => DrawerView(drawer, navigation, setMode)}
    >
    <View style={[styles.container, bgStyle]}>
    <SwipeGesture gestureStyle={styles.swipeGestureContainer}
      onSwipePerformed={onSwipePerformed}>
      <MainScreen
        cvtype={getCvType(screenNum, currDirection)}
        toggleDirection={toggleDirection}
        changeType={changeType}
        />
    </SwipeGesture>
    </View>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    height:'100%',
    width:'100%',
    backgroundColor: clr.red,
    // alignItems: 'center',
    // justifyContent: 'center',
    // padding: 10,
  },
  swipeGestureContainer:{ // padding on left allows swipe from left edge to open drawer    
    height:'100%',
    width:'100%',
    paddingLeft: 2,
    paddingRight: 2,
   },
   horizontal: {
    flexDirection: 'row',
   },
   iconPadRight: {
    paddingRight: 10,
  },
});

export default HomeScreen;
