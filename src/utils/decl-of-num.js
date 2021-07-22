/**
 * Функция возвращает окончание для множественного числа слова на основании числа и массива окончаний
 * @param  number Integer Число на основе которого нужно сформировать окончание
 * @param  titles Array Массив слов или окончаний для чисел (1, 4, 5),
 *         например ['яблоко', 'яблока', 'яблок']
 * @return String
 */
const declOfNum2 = (number, titles) => {
  const cases = [2, 0, 1, 1, 1, 2];

  return titles[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : cases[number % 10 < 5 ? number % 10 : 5]
  ];
};

// declOfNum(value, ['товар', 'товара', 'товаров']));
const declOfNum = (value, words) => {
  value = Math.abs(value) % 100;
  var num = value % 10;
  if (value > 10 && value < 20) {
    return words[2];
  }
  if (num > 1 && num < 5) {
    return words[1];
  }
  if (num === 1) {
    return words[0];
  }
  return words[2];
};

export {declOfNum, declOfNum2};
