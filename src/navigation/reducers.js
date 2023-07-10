const nav = (state, action) => {
  const stateUpd = {
    prevState: {
      index: 0,
      routes: [],
    },
    newState: {
      index: 0,
      routes: [
        {
          index: 0,
          routeName: 'BottomTabNavigation',
        },
      ],
    },
  };
  switch (action.type) {
    case 'NAVIGATION__CHANGE':
      return action.payload;
    default:
      return state ? state : stateUpd;
  }
};

export default nav;
