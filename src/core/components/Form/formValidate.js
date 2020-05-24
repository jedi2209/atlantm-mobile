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
