export default (checkProps) => {
  return function (props, propName, compName) {
    const requirePropNames = Object.keys(checkProps);
    let notFound = true;

    requirePropNames.map((el) => {
      if (props[el]) {
        notFound = false;
      }
    });

    try {
      if (notFound) {
        throw new Error(
          `One of ${requirePropNames.join(
            ', ',
          )} is required by '${compName}' component.`,
        );
      }
    } catch (e) {
      return e;
    }
    return null;
  };
};
