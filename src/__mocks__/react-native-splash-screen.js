export default {
  show: jest.fn().mockImplementation(() => {
    console.info('show splash screen');
  }),
  hide: jest.fn().mockImplementation(() => {
    console.info('hide splash screen');
  }),
};
