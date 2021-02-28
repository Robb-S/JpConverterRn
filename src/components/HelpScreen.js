import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import SwipeGesture from '../utils/swipe-gesture2'
import { clr } from '../utils/colors';
import NarrowBtn from './NarrowBtn';
import {HelpHtml3} from './helphtml.js';
const HelpHtml = require('../html/help.html');

const HelpHtml2 = 
`
<html><head>
<meta name="HandHeldFriendly" content="true" />
<meta name="viewport"  content="width=device-width,initial-scale=1.0,user-scalable=yes" />
</head><body>

<div class="note">

<h3>General navigation</h3>
<p>
Swipe the screen right or left to switch between different types of conversion, or use the navigation drawer by swiping from the left edge or pressing the menu (three bars) button on the upper left.
</p>

<h3>Metric conversion</h3>
<p>
Press the "CONVERT TO METRIC" text to toggle back and forth between conversion modes, or use the left-hand navigation drawer.
</p><p>
The metric calculator converts between several common metric units (meters, kilograms, degrees centigrade, etc.) and their corresponding imperial units.  (Fluid ounces are US units.)  Choose the units you wish to convert from the drop-down list.
</p>
<br />
</div>
</body></html>
`

const HelpScreen = ({navigation}) => {


  const onSwipePerformed = (action) => {    
    if (action==='left') {navigation.goBack()}
  }
  // console.log('typeof ' + typeof(HelpHtml) + ' ' + HelpHtml);
  return (
    <WebView 
    originWhitelist={['*']}
    source={ {html: HelpHtml3 } }
    />

    // <View style={styles.container} >
    // <SwipeGesture gestureStyle={styles.swipeGestureContainer} 
    //   onSwipePerformed={onSwipePerformed}>
    //     <View style={styles.innerView}>
    //       <Text style={styles.mainText}>Please hlep me!</Text>
    //       <NarrowBtn 
    //         onPress={() => navigation.goBack()}
    //         text={'Go back'} bgColor={clr.lightGrey} color={clr.darkGrey} />
    //       <Text style={styles.mainText}>More text....</Text>
    //     </View>
    //   </SwipeGesture>
    // </View>
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
