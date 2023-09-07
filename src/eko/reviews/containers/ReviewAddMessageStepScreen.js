import React, {useEffect} from 'react';
import Form from '../../../core/components/Form/Form';

// redux
import {connect} from 'react-redux';
import {actionAddReviewPlusFill, actionAddReviewMinusFill} from '../../actions';
import {localDealerClear} from '../../../dealer/actions';

// helpers
import {strings} from '../../../core/lang/const';

const mapStateToProps = ({dealer, eko, nav}) => {
  return {
    nav,
    dealerSelectedLocal: dealer.selectedLocal,
    messagePlus: eko.reviews.messagePlus,
    messageMinus: eko.reviews.messageMinus,
  };
};

const mapDispatchToProps = {
  actionAddReviewPlusFill,
  actionAddReviewMinusFill,
  localDealerClear,
};

const ReviewAddMessageStepScreen = ({
  navigation,
  dealerSelectedLocal,
  Text,
  localDealerClear,
}) => {
  useEffect(() => {
    console.info('== ReviewAddMessageStepScreen ==');
    return () => {
      localDealerClear();
    };
  }, [localDealerClear]);

  const FormConfig = {
    groups: [
      {
        name: strings.Form.field.label.dealer,
        fields: [
          {
            name: 'DEALER',
            type: 'dealerSelect',
            label: strings.Form.field.label.dealer,
            value: dealerSelectedLocal,
            props: {
              goBack: true,
              isLocal: true,
              showBrands: false,
              returnScreen: navigation.state?.routeName,
            },
          },
        ],
      },
      {
        name: strings.ReviewAddMessageForm.label.plus,
        fields: [
          {
            name: 'COMMENT_PLUS',
            type: 'textarea',
            label: '',
            value: Text,
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
            value: Text,
            props: {
              placeholder: strings.ReviewAddMessageForm.placeholder.minus,
            },
          },
        ],
      },
    ],
  };

  const _onPressOrder = async props => {
    const {COMMENT_MINUS, COMMENT_PLUS, DEALER} = props;
    navigation.navigate('ReviewAddRatingStepScreen', {
      COMMENT_PLUS,
      COMMENT_MINUS,
      DEALER: dealerSelectedLocal || DEALER,
    });
  };

  return (
    <Form
      contentContainerStyle={{
        paddingHorizontal: 14,
        marginTop: 20,
      }}
      key="ReviewAddForm"
      fields={FormConfig}
      barStyle={'light-content'}
      SubmitButton={{
        text: strings.MessageForm.continue,
        noAgreement: true,
      }}
      onSubmit={_onPressOrder}
    />
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewAddMessageStepScreen);
