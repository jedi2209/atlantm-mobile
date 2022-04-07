import React, {PureComponent} from 'react';
import Form from '../../../core/components/Form/Form';
import DealerCard from '../../../core/components/DealerCard';

// redux
import {connect} from 'react-redux';
import {actionAddReviewPlusFill, actionAddReviewMinusFill} from '../../actions';

// helpers
import {strings} from '../../../core/lang/const';

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
            name: strings.Form.field.label.dealer,
            fields: [
              {
                name: 'DEALER',
                type: 'component',
                value: <DealerCard key={'DealerBlock'} item={this.props.dealerSelected} />,
              },
            ]
          },
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
    console.info('== ReviewAddMessageStepScreen ==');

    return (
      <Form
        contentContainerStyle={{
          paddingHorizontal: 14,
          marginTop: 20,
        }}
        key='ReviewAddForm'
        fields={this.FormConfig.fields}
        barStyle={'light-content'}
        SubmitButton={{text: strings.MessageForm.continue}}
        onSubmit={this.onPressOrder}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewAddMessageStepScreen);
