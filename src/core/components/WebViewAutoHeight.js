import React, {PureComponent} from 'react';
import {Linking} from 'react-native';
import WebView from 'react-native-webview';
import styleConst from '../style-const';

const BODY_OPEN_TAG_PATTERN = /\<body\>/;
const BODY_CLOSE_TAG_PATTERN = /\<\/ *body\>/;

const script = `
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
      updateHeight();
      setTimeout(updateHeight, 1000);
  });
  window.addEventListener("resize", updateHeight);
  }());
`;

const styleCSS = `
  <style>
    body, html, #height-wrapper {
        margin: 0;
        padding: 15;
        font-size: 16px !important;
        font-family: Geneva, Arial, Helvetica, sans-serif,
        backgroundColor: ${styleConst.color.bg}
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

const codeInject = (html) => {
  html = html.replace(BODY_OPEN_TAG_PATTERN, '');
  html = html.replace(BODY_CLOSE_TAG_PATTERN, '');
  html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0">${styleCSS}</head><body>${html}<script>${script}</script></body></html>`;
  return html;
};

export default class WebViewAutoHeight extends PureComponent {
  static defaultProps = {
    minHeight: 200,
  };

  constructor(props) {
    super(props);

    this.state = {
      realContentHeight: this.props.minHeight,
    };

    this.html = codeInject(this.props.source.html);
  }

  handleNavigationChange = (navState) => {
    if (
      navState.url &&
      (navState.url.indexOf('https://') !== -1 ||
        navState.url.indexOf('http://') !== -1 ||
        navState.url.indexOf('tel:') !== -1 ||
        navState.url.indexOf('mailto:') !== -1)
    ) {
      this.webview.stopLoading();
      this.webview.goBack();
      Linking.openURL(navState.url);
    } else {
      if (typeof this.props.onNavigationStateChange === 'function') {
        this.props.onNavigationStateChange(navState);
      }
      if (navState.title) {
        const realContentHeight = parseInt(navState.title, 10) || 0; // turn NaN to 0
        this.setState({realContentHeight});
      }
    }
  };

  render() {
    const {style, minHeight, ...otherProps} = this.props;

    return (
      <WebView
        {...otherProps}
        source={{html: this.html}}
        scrollEnabled={false}
        style={[
          style,
          {height: Math.max(this.state.realContentHeight, minHeight)},
        ]}
        ref={(ref) => {
          this.webview = ref;
        }}
        javaScriptEnabled
        onNavigationStateChange={this.handleNavigationChange}
        dataDetectorTypes="all"
        allowsFullscreenVideo={true}
        allowsInlineMediaPlayback={true}
        // incognito={true}
        originWhitelist={['http://', 'https://', 'tel://', 'mailto://']}
      />
    );
  }
}
