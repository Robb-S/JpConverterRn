import React, {useRef, useState, useEffect} from 'react';
import { StyleSheet, View, DrawerLayoutAndroid } from 'react-native';
import { clr } from '../utils/colors';
import { getBgStyles, getDispName, getCvType } from '../utils/modes';
import MainScreen from './MainScreen';
import SwipeGesture from '../utils/swipe-gesture2'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {toggleArrayIx, assignArrayIx} from '../utils/helpers';
import DrawerView from './DrawerView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {capitalize} from '../utils/helpers';

/**
 * Shell for MainScreen, drawer and swipe gesture components, with state variables 
 * to keep track of MainScreen content.
 * 
 * HomeScreen handles navigation/manipulation of the conversion categories and directions 
 * that are displayed in MainScreen.  Two state variables - screenNum and currDirection,
 * determine which conversion category and direction of conversion (to/from Japanese measures)
 * will be displayed by the MainScreen component.
 * 
 * Swiping left or right switches from one conversion category to the next, and toggling 
 * switches conversion direction.  Pairs of category/direction can also be set from buttons 
 * in the drawer.  UseState uses the dirArray variable to remember the most recent conversion
 * direction for each conversion category, and stores all last-position data to async storage.
 */
const HomeScreen = ({navigation}) => {
  const setMainHeaderTitle = (sNum, cDirection) => {
    let currTitle = "JP Converter";
    if (sNum!==null) {currTitle = getDispName(getCvType(sNum, cDirection))}
    navigation.setOptions({
      title: capitalize(currTitle),
    });
  }
  const setDrawerHeaderTitle = () => {
    const drawerTitle = "JP Converter";
    navigation.setOptions({
      title: drawerTitle,
    });
  }
  // handle drawer open/close, since toggle method doesn't exist for DrawerLayoutAndroid.
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const onDrawerOpen = () => {
    setDrawerOpen(true);
    setDrawerHeaderTitle();
  }
  const onDrawerClose = () => {
    setDrawerOpen(false);
    setMainHeaderTitle(screenNum, currDirection);
  }
  const toggleDrawer = () => {
    if (isDrawerOpen)drawer.current.closeDrawer();
    else drawer.current.openDrawer();
  }
  const drawer = useRef(null);

  React.useEffect(() => { // add hamburger button to toggle drawer
    navigation.setOptions({
      headerLeft: () => (
        <Icon name='menu' size={32} onPress={toggleDrawer} />
      ),
    });
  }, [navigation, isDrawerOpen, screenNum]);  // isDrawerOpen is necessary, otherwise won't close drawer

  // handle swiping of different screenNums
  // direction array will remember last conversion direction for each conversion type
  const [screenNum, setScreenNum] = React.useState(null);
  const [dirArray, setDirArray] = React.useState([true, true, true, true]);
  const [currDirection, setCurrDirection] = React.useState(null);

  /**
   * Add arrow button in header to increment screen number.  This must be placed after the
   * screenNum useState() statement in order to update properly.
   */
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.horizontal}>
          {(screenNum!==3) && (!isDrawerOpen) &&
            <Icon name='arrow-up-down-bold-outline' size={28} color={clr.medGrey}
              style={styles.iconPadRight} onPress={toggleDirection} />
          }
          {(!isDrawerOpen) &&
            <Icon name='arrow-right-bold-box-outline' size={32} color={clr.medGrey}
              style={styles.iconPadRight} onPress={incrementScreenNum} />
          }
        </View>
      ),
    });
  }, [navigation, screenNum, currDirection, isDrawerOpen]); 

  const onSwipePerformed = (action) => { // switch to new conversion screen by swiping
    if (action==='left') incrementScreenNum();
    if (action==='right') decrementScreenNum();
  }
  const minScrNum = 0; 
  const maxScrNum = 3;
  const incrementScreenNum = () => { // display next screen/category. simulate modulo function.
    const newScreenNum = (screenNum===maxScrNum) ? minScrNum : screenNum+1;
    const newCurrDirection = dirArray[newScreenNum];
    updateData(newScreenNum, dirArray, newCurrDirection); // dirArray is unchanged
    setMainHeaderTitle(newScreenNum, newCurrDirection);
  }
  const decrementScreenNum = () => { // display previous screen/category
    const newScreenNum = (screenNum===minScrNum) ? maxScrNum : screenNum-1;
    const newCurrDirection = dirArray[newScreenNum];
    updateData(newScreenNum, dirArray, newCurrDirection); // dirArray is unchanged
    setMainHeaderTitle(newScreenNum, newCurrDirection);
  }
  /**
   * Set new conversion type and direction, store to state and async storage
   */
  const setMode = (newScreenNum, newCurrDirection) => { // new conv type and direction from drawer
    const newDirArray = assignArrayIx(dirArray, newScreenNum, newCurrDirection);
    updateData(newScreenNum, newDirArray, newCurrDirection);
    setMainHeaderTitle(newScreenNum, newCurrDirection);
  }
  /**
   * Keep conversion type but change direction, store to state and async storage
   */
  const toggleDirection = async function () { // // switch conversion direction only
    const newDirArray = toggleArrayIx(dirArray, screenNum);
    const newCurrDirection = newDirArray[screenNum];
    updateData(screenNum, newDirArray, newCurrDirection); // screenNum is unchanged
    setMainHeaderTitle(screenNum, newCurrDirection);
  }
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
        console.log('retrieving')
        console.log(stLastPos);
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
    }
    await AsyncStorage.setItem('lastPos', JSON.stringify(stLastPos));
  }
  // const bgStyle = getBgStyle(getCvType(screenNum, currDirection));
  const [bgStyle] = getBgStyles(getCvType(screenNum, currDirection));

  /**
   * Drawer - buttons to set MainScreen params (pseudo-nav) or navigate to other components.
   * View - lies underneath SwipeGesture to pick up swipe gestures from a narrow band along 
   *   the left edge, in order to open the drawer with a swipe instead of swiping the 
   *   whole screen.
   * SwipeGesture - handles leftward and rightward swipes to change conversion category.  
   *   Swipe behavior was fine-tuned to set a threshold level of positional delta before swiping.
   * MainScreen - shows main conversion screen, depending on position params.
   */
  return (
    <DrawerLayoutAndroid
      onDrawerOpen={onDrawerOpen}
      onDrawerClose={onDrawerClose}
      ref={drawer}
      drawerWidth={300}
      drawerPosition={"left"}
      renderNavigationView={() => DrawerView(drawer, navigation, setMode, 
        screenNum, currDirection)}
    >
    <View style={[styles.container, bgStyle]}>
    <SwipeGesture gestureStyle={styles.swipeGestureContainer} 
      onSwipePerformed={onSwipePerformed}>
      <MainScreen 
        cvtype={getCvType(screenNum, currDirection)}
        toggleDirection={toggleDirection} 
        />
    </SwipeGesture>
    </View>
    </DrawerLayoutAndroid>
  )
}

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

export default HomeScreen
