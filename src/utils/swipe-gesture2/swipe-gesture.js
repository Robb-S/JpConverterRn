import React, { Component } from 'react';
import {
  View,
  Animated,
  PanResponder
} from 'react-native';

export default class SwipeGesture extends Component {

  constructor(props) {
    super(props);
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        let x = gestureState.dx;
        let y = gestureState.dy;
        const threshold = 20;     // ignore swipes less than minimum swipe distance
        if (Math.abs(x) > Math.abs(y)) {
          if (x >= threshold) {
            this.props.onSwipePerformed('right')
          }
          else if (x <= (-1 * threshold)) {
            this.props.onSwipePerformed('left')
          }
        }
        else {
          if (y >= threshold) {
            this.props.onSwipePerformed('down')
          }
          else if (y <= (-1 * threshold)) {  
            this.props.onSwipePerformed('up')
          }
        }
      }
    })
  }

  render() {
    return (
      <Animated.View {...this.PanResponder.panHandlers} style={this.props.gestureStyle}>
        <View>{this.props.children}</View>
      </Animated.View>
    )
  }
}

