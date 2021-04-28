import React, {PureComponent} from 'react';
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {Content, StyleProvider} from 'native-base';
import Form from '../../../core/components/Form/Form';
import DealerCard from '../../../core/components/DealerCard';

// redux
import {connect} from 'react-redux';
import {actionAddReviewPlusFill, actionAddReviewMinusFill} from '../../actions';

// components
import {KeyboardAvoidingView} from '../../../core/components/KeyboardAvoidingView';

// helpers
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import strings from '../../../core/lang/const';

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: '#eee',
  },
});

const mapStateToProps = ({dealer, eko, nav}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    messagePlus: eko.reviews.messagePlus,
    messageMinus: eko.reviews.messageMinus,
  };
};

const mapDispatchToProps = {
  actionAddReviewPlusFill,
  actionAddReviewMinusFill,
};

class ReviewAddMessageStepScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.FormConfig = {
      fields: {
        groups: [
          {
            name: strings.ReviewAddMessageForm.label.plus,
            fields: [
              {
                name: 'COMMENT_PLUS',
                type: 'textarea',
                label: '',
                value: this.props.Text,
                props: {
                  placeholder: strings.ReviewAddMessageForm.placeholder.plus,
                },
              },
            ],
          },
          {
            name: strings.ReviewAddMessageForm.label.minus,
            fields: [
              {
                name: 'COMMENT_MINUS',
                type: 'textarea',
                label: '',
                value: this.props.Text,
                props: {
                  placeholder: strings.ReviewAddMessageForm.placeholder.minus,
                },
              },
            ],
          },
        ],
      },
    };
  }

  onPressOrder = async ({COMMENT_MINUS, COMMENT_PLUS}) => {
    this.props.navigation.navigate('ReviewAddRatingStepScreen', {
      COMMENT_PLUS,
      COMMENT_MINUS,
    });
  };

  render() {
    const {dealerSelected} = this.props;

    console.log('== ReviewAddMessageStepScreen ==');

    return (
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={{flex: 1}}>
            <DealerCard key={'DealerBlock'} item={dealerSelected} />
            <Content
              style={{
                flex: 1,
                paddingHorizontal: 14,
                paddingTop: 20,
              }}>
              <Form
                fields={this.FormConfig.fields}
                barStyle={'light-content'}
                SubmitButton={{text: strings.MessageForm.continue}}
                onSubmit={this.onPressOrder}
              />
            </Content>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewAddMessageStepScreen);
