import styleConst from '../../src/core/style-const';
import variable from './../variables/platform';

export default (variables = variable) => {
	const inputTheme = {
		'.multiline': {
			height: null,
		},
		height: variables.inputHeightBase,
		color: variables.inputColor,
		flex: 1,
		fontSize: variables.inputFontSize,
    lineHeight: variables.inputLineHeight,
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.light,
	};

	return inputTheme;
};
