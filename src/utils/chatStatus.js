import API from './api';
import {get} from 'lodash';

const chatStatus = async (isSubscribed) => {
    return await API.chatAvailable().then(res => {
        if (!isSubscribed) {
            return false;
        }
        if (get(res, 'error')) {
            switch (res.error.code) {
                case 503:
                    return false;
                    break;
                case 200:
                    return true;
                    break;
                default:
                    return false;
                    break;
            }
        }
    });
}

export default chatStatus;