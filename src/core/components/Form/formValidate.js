// синхронная валидация
export const validate = values => {
  const errors = {};
  if (!values.text) {
    errors.text = 'Поле обязательно для заполнения!';
  } else if (values.text.length < 15) {
    errors.text = 'Текст должен быть не менее 15 символов!';
  }
  // для синхронной валидации нужно вернуть объект с ошибками
  return errors;
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
//асинхронная валидация
//принимает два параметра значения и redux dispatch
export const asyncValidate = (values /*, dispatch */) => {
  return sleep(1000) // имитация серверного ответа
    .then(() => {
      if (!values.title) {
        // для асинхронной валидации нужно бросить объект с ошибкой
        throw {title: 'Поле обязательно для заполнения!'};
      } else if (values.title.length > 10) {
        throw {title: 'Заголовок должен быть не более 10 символов!'};
      }
    });
};

//returns true if valid, false if not valid
export const validateEmail = email => {
  var re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Zа-яА-Я\-0-9]+\.)+[a-zA-Zа-яА-Я]{2,}))$/;
  switch (typeof email) {
    case 'object':
      for (const [key, data] of Object.entries(email)) {
        if (data && data.value) {
          return re.test(data.value);
        } else {
          return false;
        }
      }
      break;
    case 'string':
      return re.test(email);
  }
};

export const validateDateTime = dateTime => {
  if (typeof dateTime === 'undefined' || !dateTime) {
    return false;
  }
  if (!dateTime.noTimeAlways) {
    return dateTime.date && dateTime.time;
  } else {
    return typeof dateTime.date !== 'undefined';
  }
};

export const validateDate = date => {
  if (typeof date === 'undefined' || !date) {
    return false;
  }
  return true;
};

export const validateCheckbox = isChecked => {
  if (typeof isChecked === 'undefined' || !isChecked) {
    return false;
  }
  return true;
};
