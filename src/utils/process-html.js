import styleConst from '../core/style-const';

const processHtml = (text, width, height) => {
  // const result = text.replace(/<a[^>]*>([^<]*)<\/a>/ig, (i1, i2) => `<p>${i2}</p>`);

  return `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Акция Atlant-m</title>

    </head>
    <body>
    <style>
    html, body {
      width: ${width};
      max-width: 100%;
      font-size: 15px;
      background-color: ${styleConst.color.bg};
      font-family: 'Helvetica Neue';
      padding: 0;
      margin: 0;
      overflow: 'scroll';
    }
    table {
      font-size: 13px;
    }
  </style>
      ${text}
    </body>
    </html>
  `;
};

export default processHtml;
