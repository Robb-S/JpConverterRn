import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import SwipeGesture from '../utils/swipe-gesture2'
import { clr } from '../utils/colors';
import NarrowBtn from './NarrowBtn';

const HelpScreen = ({navigation}) => {


  const onSwipePerformed = (action) => {    
    if (action==='left') {navigation.goBack()}
  }

  return (
    <View style={styles.container} >
    <SwipeGesture gestureStyle={styles.swipeGestureContainer} 
      onSwipePerformed={onSwipePerformed}>
        <View style={styles.innerView}>
          <Text style={styles.mainText}>Please hlep me!</Text>
          <NarrowBtn 
            onPress={() => navigation.goBack()}
            text={'Go back'} bgColor={clr.lightGrey} color={clr.darkGrey} />
          <Text style={styles.mainText}>More text....</Text>
        </View>
      </SwipeGesture>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    height:'100%',
    width:'100%',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeGestureContainer:{
    height:'100%',
    width:'100%',
   },
   mainText: {
    backgroundColor: '#ffffff',
    padding: 25,
    fontSize: 20,
    width: 180,
    marginBottom: 12,
    textAlign: 'center',
  },
  innerView: {
    // flex: 1,
    backgroundColor: '#ffddbb',
    alignItems: 'center',
    justifyContent: 'center',
    height:'100%',
    width:'100%',
  }
});

export default HelpScreen
