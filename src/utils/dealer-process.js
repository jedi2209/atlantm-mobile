import {strings} from '../core/lang/const';
import {get} from 'lodash';

export default function ({
  dealer,
  listDealers,
  dealerSelectedLocal,
  allDealers,
  route,
  dealerFilter,
}) {
  if (listDealers.length < 1) {
    return {
      name: 'DEALER',
      type: 'dealerSelect',
      label: strings.Form.group.dealer,
      value: dealer,
      props: {
        required: true,
        goBack: true,
        isLocal: true,
        showBrands: false,
        dealerFilter: {
          type: dealerFilter,
        },
      },
    };
  } else if (listDealers.length === 1) {
    return {
      name: 'DEALER',
      type: 'dealerSelect',
      label: strings.Form.group.dealer,
      value: dealerSelectedLocal || allDealers[dealer] || dealer,
      props: {
        required: true,
        goBack: true,
        isLocal: true,
        showBrands: false,
        readonly: get(route, 'params.settings.dealerHide', false),
        dealerFilter: {
          type: dealerFilter,
        },
      },
    };
  } else if (listDealers.length > 1) {
    return {
      name: 'DEALER',
      type: 'select',
      label: strings.Form.field.label.dealer,
      value: dealer,
      props: {
        items: listDealers,
        required: true,
        placeholder: {
          label: strings.Form.field.placeholder.dealer,
          value: null,
          color: '#9EA0A4',
        },
      },
    };
  }
  return {};
}
