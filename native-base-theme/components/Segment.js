import isIphoneX from '../../src/utils/is_iphone_x';
import variable from "./../variables/platform";

export default (variables = variable) => {
  const platform = variables.platform;

  const segmentTheme = {
    height: null,

    borderColor: variables.segmentBorderColorMain,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: variables.segmentBackgroundColor,
    "NativeBase.Button": {
      alignSelf: "space-between",
      borderRadius: 0,
      marginHorizontal: 10,
      height: null,
      backgroundColor: "transparent",
      borderBottomWidth: 2,
      borderBottomColor: variables.segmentBorderColor,
      elevation: 0,
      ".active": {
        backgroundColor: variables.segmentActiveBackgroundColor,
        borderBottomColor: '#F5A623',
        "NativeBase.Text": {
          color: variables.segmentActiveTextColor,
        }
      },
      ".first": {
        borderTopLeftRadius: platform === "ios" ? 5 : undefined,
        borderBottomLeftRadius: platform === "ios" ? 5 : undefined,
        borderRightWidth: 0
      },
      ".last": {
        borderTopRightRadius: platform === "ios" ? 5 : undefined,
        borderBottomRightRadius: platform === "ios" ? 5 : undefined,
        borderLeftWidth: 0
      },
      "NativeBase.Text": {
        color: variables.segmentTextColor,
        fontSize: 12,
        textAlign: 'center',
      }
    }
  };

  return segmentTheme;
};
