import React, {useState, useRef} from 'react';
import {Linking, View} from 'react-native';
import WebView from 'react-native-webview';
import styleConst from '../style-const';

const BODY_OPEN_TAG_PATTERN = /\<body\>/;
const BODY_CLOSE_TAG_PATTERN = /\<\/ *body\>/;

const INJECTED_JAVASCRIPT = `
  ;(function() {
  var wrapper = document.createElement("div");
  wrapper.id = "height-wrapper";
  while (document.body.firstChild) {
      wrapper.appendChild(document.body.firstChild);
  }
  document.body.appendChild(wrapper);
  var i = 0;
  function updateHeight() {
      document.title = wrapper.clientHeight;
      window.location.hash = ++i;
  }
  updateHeight();
  window.addEventListener("load", function() {
      setTimeout(updateHeight, 100);
  });
  window.addEventListener("resize", updateHeight);
  }());
`;

const styleCSS = `
  <style>
    body, html, #height-wrapper {
        margin: 0;
        padding: 15 15 120 15;
        font-size: 16px !important;
        font-family: "HelveticaNeue-Light", "Helvetica Neue", Helvetica, Arial, sans-serif;
        backgroundColor: ${styleConst.color.bg};
    }
    a, a:visited, a.hover {
        color: #0072e7;
        font-size: 18px !important;
        border: 1px solid #0072e7;
        padding: 5px 10px;
        white-space: nowrap;
        line-height: 36px;
        border-radius: 5px;
        text-decoration: none;
    }
    #height-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
    }
    table {
      font-size: 14px !important;
      border-spacing: 0;
      border-left: none;
      border-right: none;
      border-bottom: none;
      border-top: 1px solid;
      border-color: rgba(4,88,167,0.4);
    }
    th,
    thead,
    td {
      border-spacing: 0;
      border-right: 1px solid;
      border-bottom: none;
      border-left: none;
      border-top: none;
      border-color: rgba(4,88,167,0.4);
    }
    td {
      border-bottom: 1px solid;
      border-color: rgba(4,88,167,0.4);
      padding: 0.4em;
    }
    img {
      width: auto;
      max-width: 100%;
    }
    p {
      margin-left: 2%;
      margin-right: 2%;
    }
  </style>
`;

const codeInject = html => {
  if (!html || typeof html === 'undefined') {
    return false;
  }
  html = html.replace(BODY_OPEN_TAG_PATTERN, '');
  html = html.replace(BODY_CLOSE_TAG_PATTERN, '');
  html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0">${styleCSS}</head><body>${html}<script>${INJECTED_JAVASCRIPT}</script></body></html>`;
  return html;
};

const WebViewAutoHeight = ({
  onNavigationStateChange,
  source,
  style,
  minHeight,
  ...otherProps
}) => {
  if (!minHeight) {
    minHeight = 400;
  }
  const [contentHeight, setContentHeight] = useState(minHeight);
  let webviewRef = useRef(null);
  const _handleNavigationChange = navState => {
    if (
      navState.url &&
      (navState.url.indexOf('https://') !== -1 ||
        navState.url.indexOf('http://') !== -1 ||
        navState.url.indexOf('tel:') !== -1 ||
        navState.url.indexOf('mailto:') !== -1)
    ) {
      webviewRef.stopLoading();
      webviewRef.goBack();
      Linking.openURL(navState.url);
    } else {
      if (typeof onNavigationStateChange === 'function') {
        onNavigationStateChange(navState);
      }
      if (navState.title) {
        const realContentHeight = parseInt(navState.title, 10) || 0; // turn NaN to 0
        setContentHeight(realContentHeight);
      }
    }
  };

  return (
    <WebView
      {...otherProps}
      source={{html: codeInject(source.html)}}
      scrollEnabled={false}
      style={[style, {height: Math.max(contentHeight, minHeight)}]}
      ref={ref => {
        webviewRef = ref;
      }}
      onNavigationStateChange={_handleNavigationChange}
      dataDetectorTypes="all"
      allowsFullscreenVideo={true}
      allowsInlineMediaPlayback={true}
      // incognito={true}
      originWhitelist={['http://', 'https://', 'tel://', 'mailto://']}
    />
  );
};

WebViewAutoHeight.defaultProps = {
  minHeight: 200,
};

export default WebViewAutoHeight;
