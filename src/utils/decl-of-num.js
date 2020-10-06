/**
 * Функция возвращает окончание для множественного числа слова на основании числа и массива окончаний
 * @param  number Integer Число на основе которого нужно сформировать окончание
 * @param  titles Array Массив слов или окончаний для чисел (1, 4, 5),
 *         например ['яблоко', 'яблока', 'яблок']
 * @return String
 */
export default function declOfNum(number, titles) {
  const cases = [2, 0, 1, 1, 1, 2];

  return titles[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : cases[number % 10 < 5 ? number % 10 : 5]
  ];
}
