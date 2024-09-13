import React, {useState, useRef, useEffect} from 'react';
import {
  Linking,
  View,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import WebView from 'react-native-webview';
import LogRocket from '@logrocket/react-native';
import styleConst from '../style-const';

const isAndroid = Platform.OS === 'android';

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
    if (wrapper.clientHeight) {
      document.title = wrapper.clientHeight;
      window.location.hash = ++i;
    }
  }
  updateHeight();
  window.addEventListener("load", function() {
      setTimeout(updateHeight, 200);
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
        background-color: ${styleConst.color.white};
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
    p, div, h1, h2, h3, h4, table, ul, ol {
      margin-left: 2%;
      margin-right: 2%;
    }
  </style>
`;

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: styleConst.color.bg,
  },
});

const codeInject = html => {
  if (!html || typeof html === 'undefined') {
    return false;
  }
  html = html.replace(BODY_OPEN_TAG_PATTERN, '');
  html = html.replace(BODY_CLOSE_TAG_PATTERN, '');
  html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0">${styleCSS}</head><body>${html}<script>${INJECTED_JAVASCRIPT}</script></body></html>`;
  return html;
};

const _fetchURL = async url => {
  const res = await fetch(url);
  if (res && res.status !== 200) {
    return false;
  }
  const text = await res.text();
  return codeInject(text);
};

const WebViewAutoHeight = ({
  onNavigationStateChange,
  source,
  style,
  minHeight = 1000,
  fetchURL = false,
  ...otherProps
}) => {
  const [contentHeight, setContentHeight] = useState(minHeight);
  const [isLoading, setLoading] = useState(true);
  const [sourceModified, setSource] = useState(null);
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
      _handleHeight(navState);
    }
  };

  const _handleHeight = navState => {
    if (navState.title) {
      setContentHeight(parseInt(navState.title, 10) || 0);
    } else {
      setContentHeight(minHeight);
    }
  };

  useEffect(() => {
    if (source?.html) {
      setSource({
        html: codeInject(source.html),
      });
      setLoading(false);
    } else if (source?.uri) {
      if (fetchURL) {
        _fetchURL(source?.uri).then(res => {
          setSource({html: res});
          setLoading(false);
        });
      } else {
        setSource({uri: source?.uri});
        setLoading(false);
      }
    }
  }, [fetchURL, source.html, source?.uri]);

  if (isLoading || !sourceModified) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator
          color={styleConst.color.blue}
          style={styleConst.spinner}
        />
      </View>
    );
  }

  const webViewID = 'webview_auto_height';

  if (isAndroid) {
    LogRocket.registerWebView(webViewID);
  }

  return (
    <WebView
      nativeID={webViewID}
      source={sourceModified}
      scrollEnabled={false}
      style={[
        style,
        {
          backgroundColor: styleConst.color.white,
          height: Math.max(contentHeight, minHeight) + 30,
        },
      ]}
      ref={ref => {
        webviewRef = ref;
      }}
      onNavigationStateChange={
        sourceModified?.html ? _handleNavigationChange : _handleHeight
      }
      dataDetectorTypes={['phoneNumber', 'link', 'address']}
      allowsFullscreenVideo={true}
      allowsInlineMediaPlayback={true}
      // incognito={true}
      originWhitelist={['http://', 'https://', 'tel://', 'mailto://']}
      {...otherProps}
    />
  );
};

export default WebViewAutoHeight;
