import styleConst from '../core/style-const';

const htmlStyles = `
  <style>
    html, body {
      font-size: 15px;
      background-color: ${styleConst.color.bg};
      font-family: 'Helvetica Neue';
    }
    table {
      font-size: 13px;
    }
  </style>
`;

const processHtml = (text) => {
  const result = text.replace(/<a[^>]*>([^<]*)<\/a>/ig, (i1, i2) => `<p>${i2}</p>`);
  return htmlStyles + result;
};

export default processHtml;
