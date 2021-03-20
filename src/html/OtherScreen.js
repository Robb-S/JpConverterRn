import React from 'react';
import { WebView } from 'react-native-webview';
import {OtherHtml} from './otherhtml.js';

const OtherScreen = () => {
  return (
    <WebView
    originWhitelist={['*']}
    source={ {html: OtherHtml } }
    />
  );
};

export default OtherScreen;
