const getStatusWorktime = (dealer, checkType, returnTime = false) => {
  if (!dealer || !checkType || !dealer.divisions) {
    return false;
  }
  const locales = {
    by: 'Europe/Minsk',
    ru: 'Europe/Moscow',
    ua: 'Europe/Kiev',
  };
  let currentDealerLocale = 'by';
  if (dealer.region && locales[dealer.region]) {
    currentDealerLocale = locales[dealer.region];
  }
  const res = dealer.divisions
    .map(division => {
      const currDate = new Date();
      const today = currDate.getDay() - 1;
      if (
        division.worktime &&
        division.worktime[today] &&
        division.type &&
        division.type[checkType]
      ) {
        const currTime = currDate.getTime();
        const worktime = division.worktime[today];
        const timeOpen = new Date();
        const timeClose = new Date();
        timeOpen.setHours(worktime.start.hour, worktime.start.min, 0);
        timeClose.setHours(worktime.finish.hour, worktime.finish.min, 0);

        if (currTime > timeOpen.getTime() && currTime < timeClose.getTime()) {
          return true;
        }
        return false;
      }
    })
    .filter(function (element) {
      return element !== undefined;
    });
  if (res && res.length && res[0]) {
    return res[0];
  } else {
    const currDate = new Date();
    const currTimezone = currDate.getTimezoneOffset();
    const currTime = currDate.getTime();
    const timeOpen = new Date();
    const timeClose = new Date();
    timeOpen.setHours(9, 0, 0);
    timeClose.setHours(20, 0, 0);

    if (currTime > timeOpen.getTime() && currTime < timeClose.getTime()) {
      return true;
    }
    return false;
  }
};

export default getStatusWorktime;
