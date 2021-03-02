import React from 'react';
import renderer from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Wrapper from '../core/containers/Wrapper';

it('checks if Async Storage is used', async () => {
  expect(AsyncStorage.getItem).toBeCalledWith('core');
});

test('renders correctly', () => {
  const tree = renderer.create(<Wrapper />).toJSON();
  expect(tree).toMatchSnapshot();
});
