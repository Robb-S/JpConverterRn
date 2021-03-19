import React from 'react';
import { WebView } from 'react-native-webview';
import { WebHtml } from './webhtml.js';

const WebScreen = () => {
  return (
    <WebView
    originWhitelist={['*']}
    source={ {html: WebHtml } }
    />
  );
};

export default WebScreen;
