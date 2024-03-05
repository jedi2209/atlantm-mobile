import {get, omitBy, isNil} from 'lodash';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {sign as JWTSign} from 'react-native-pure-jwt';
import DeviceInfo from 'react-native-device-info';

import {
  STORE_LINK,
  API_MAIN_URL,
  API_MAIN_KEY,
  APP_REGION,
} from './const';
import {getTimestampInSeconds} from '../utils/date';
import {strings} from './lang/const';

const isAndroid = Platform.OS === 'android';
const SourceID = 3;
const secretKey = [
  API_MAIN_KEY[APP_REGION][Platform.OS],
  DeviceInfo.getBundleId(),
  DeviceInfo.getVersion(),
].join('__');

const JWTToken = async () => {
  const token = await JWTSign(
    {
      exp: (getTimestampInSeconds() + 60) * 1000, // expiration date, required, in ms, absolute to 1/1/1970
      iss: 'MobileAPP',
    }, // body
    secretKey,
    {
      alg: 'HS512',
    },
  ).catch(console.error);
  return token;
};
const headersDefault = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'x-api-key': `${API_MAIN_KEY[APP_REGION][Platform.OS]}`,
  'App-Version': DeviceInfo.getVersion(),
  'App-Name': DeviceInfo.getApplicationName(),
};
const baseRequestParams = {
  method: 'GET',
  timeout: 45 * 1000,
  headers: headersDefault,
};

const transformResponse = response => {
  if (get(response, 'status') === 'success') {
    return get(response, 'data', []);
  }
  return response;
};

// Define a service using a base URL and expected endpoints
export const baseAPI = createApi({
  reducerPath: 'apiData',
  baseQuery: fetchBaseQuery({
    baseUrl: API_MAIN_URL,
    // timeout: baseRequestParams.timeout,
    timeout: 5000,
    prepareHeaders: async (headers, api) => {
      const newHeaders = new Headers(headersDefault);
      const jwtToken = await JWTToken();
      newHeaders.set('x-auth', jwtToken);
      return newHeaders;
    }
  }),
  tagTypes: ['Actions'],
  endpoints: builder => ({
    getVersionAPP: builder.query({
      query: () => `/mobile/check/version/`,
      // transformResponse,
    }),
    getMainScreenSettings: builder.query({
      query: ({region = APP_REGION}) => `/mobile/screen/main/${region}/`,
      // transformResponse,
    }),
    getInfoList: builder.query({
      query: ({region = APP_REGION, dealer = null, type = null}) => {
        const url = '/info/actions/get/';
        const params = new URLSearchParams(
          omitBy(
            {
              region,
              dealer,
              type,
            },
            isNil,
          ),
        );
        const finalPath = [url, params].join('?');
        return finalPath;
      },
      providesTags: (result = []) => [
        ...result.data.map(({ id }) => ({ type: 'Actions', id })),
        { type: 'Actions', id: 'LIST' },
      ],
      // transformResponse: response => response,
      transformErrorResponse: response => {
        console.info('transformErrorResponse response', response);
        // if (action && action.type && action.type === INFO_LIST__FAIL) {
        //       let message = get(
        //         action,
        //         'payload.message',
        //         strings.Notifications.error.text,
        //       );
        
        //       if (message === 'Network request failed') {
        //         message = ERROR_NETWORK;
        //       }
        //       return false;
        //     }
        return response.error;
      },
    }),
  }),
});

export const { useGetInfoListQuery, useGetMainScreenSettingsQuery, useGetVersionAPPQuery } = baseAPI;