import React, {PureComponent} from 'react';
import {View, Linking, Dimensions} from 'react-native';
import WebView from 'react-native-webview';
import styleConst from '@core/style-const';

const BODY_TAG_PATTERN = /\<\/ *body\>/;

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
        padding: 0;
        font-size: 16px !important;
        backgroundColor: ${styleConst.color.bg}
    }
    a, a:visited, a.hover {
        color: #0072e7;
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
  <script>
    ${script}
  </script>
`;

const codeInject = html => html.replace(BODY_TAG_PATTERN, styleCSS + '</body>');

export default class WebViewAutoHeight extends PureComponent {
  static defaultProps = {
    minHeight: 200,
  };

  constructor(props) {
    super(props);

    this.state = {
      realContentHeight: this.props.minHeight,
    };
  }

  handleNavigationChange = navState => {
    if (navState.title) {
      const realContentHeight = parseInt(navState.title, 10) || 0; // turn NaN to 0
      this.setState({realContentHeight});
    }

    if (typeof this.props.onNavigationStateChange === 'function') {
      this.props.onNavigationStateChange(navState);
    }
  };

  render() {
    const {source, style, minHeight, ...otherProps} = this.props;
    const html = source.html;

    return (
      <WebView
        {...otherProps}
        source={{html: codeInject(html)}}
        scrollEnabled={false}
        style={[
          style,
          {height: Math.max(this.state.realContentHeight, minHeight)},
        ]}
        javaScriptEnabled
        onNavigationStateChange={this.handleNavigationChange}
        dataDetectorTypes="all"
        allowsFullscreenVideo={true}
        allowsInlineMediaPlayback={true}
        originWhitelist={['*']}
      />
    );
  }
}
