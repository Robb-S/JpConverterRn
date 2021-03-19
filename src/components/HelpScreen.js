import React from 'react';
import { WebView } from 'react-native-webview';
import {HelpHtml} from './helphtml.js';

const HelpScreen = () => {
  return (
    <WebView
    originWhitelist={['*']}
    source={ {html: HelpHtml } }
    />
  );
};

export default HelpScreen;
