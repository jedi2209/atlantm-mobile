import React from 'react';

import {connect} from 'react-redux';

const mapStateToProps = ({profile}) => {
  return {profile};
};

const AdditionalPurchaseScreen = props => {
  return (
    <></>
    );
};

export default connect(mapStateToProps)(AdditionalPurchaseScreen);
