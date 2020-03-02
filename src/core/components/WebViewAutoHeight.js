import {View, Linking, Dimensions} from 'react-native';
import {WebView} from 'react-native-webview';
import HTML from 'react-native-render-html';
import React, {Component} from 'react';

const BODY_TAG_PATTERN = /\<\/ *body\>/;

// Do not add any comments to this! It will break line breaks will removed for
// some weird reason.
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

const style = `
  <style>
    body, html, #height-wrapper {
        margin: 0;
        padding: 0;
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
      font-size: 12px !important;
    }
    table,
    th,
    td {
      border: 1px solid rgba(4,88,167,0.4);
    }
    img {
      width: auto;
      max-width: 100%;
    }
  </style>
  <script>
    ${script}
  </script>
`;

//const codeInject = html => html.replace(BODY_TAG_PATTERN, style + '</body>');

const deviceWidth = Dimensions.get('window').width;

/**
 * Wrapped Webview which automatically sets the height according to the
 * content. Scrolling is always disabled. Required when the Webview is embedded
 * into a ScrollView with other components.
 *
 * Inspired by this SO answer http://stackoverflow.com/a/33012545
 * */
export default class WebViewAutoHeight extends Component {
  static defaultProps = {
    minHeight: 100,
  };

  constructor(props) {
    super(props);

    console.log('props', props);

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

    console.log('html', html);

    // if (!html) {
    //   throw new Error('WebViewAutoHeight supports only source.html');
    // }

    // if (!BODY_TAG_PATTERN.test(html)) {
    //   throw new Error(`Cannot find </body> from: ${html}`);
    // }

    const tagsStyles = {
      div: {
        fontSize: 16,
        lineHeight: 24,
      },
      p: {padding: 0, marginBottom: 10, marginHorizontal: 10},
      img: {width: deviceWidth, maxWidth: deviceWidth},
    };

    const classesStyles = {
      div: {marginBottom: 0, padding: 0},
      divider: {marginRight: 10, width: 10},
    };

    return (
      <HTML
        html={html}
        tagsStyles={tagsStyles}
        classesStyles={classesStyles}
        imagesMaxWidth={deviceWidth}
        onLinkPress={(evt, href) => {
          return Linking.openURL(href);
        }}
      />
      // <WebView
      //   {...otherProps}
      //   source={{html: codeInject(html)}}
      //   scrollEnabled={false}
      //   style={[
      //     style,
      //     {height: Math.max(this.state.realContentHeight, minHeight)},
      //   ]}
      //   javaScriptEnabled
      //   onNavigationStateChange={this.handleNavigationChange}
      //   dataDetectorTypes="all"
      //   allowsFullscreenVideo={true}
      //   allowsInlineMediaPlayback={true}
      //   originWhitelist={['*']}
      // />
    );
  }
}
