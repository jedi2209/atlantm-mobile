import React from 'react';
import {Linking} from 'react-native';
import {Text, Icon, Actionsheet, Box, ScrollView} from 'native-base';
import {useNavigation} from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5Brands from 'react-native-vector-icons/FontAwesome5';

const ActionSheetMenuWrapper = ({actionSheetData, children}) => {
  if (actionSheetData?.options?.length > 8) {
    return <ScrollView w={'100%'}>{children}</ScrollView>;
  } else {
    return children;
  }
};

const ActionSheetMenu = props => {
  const {actionSheetData, isOpen, onClose, hideDragIndicator} = props;
  const navigation = useNavigation();

  if (!actionSheetData || !actionSheetData['options']) {
    return <></>;
  }

  return (
    <Actionsheet
      hideDragIndicator={hideDragIndicator}
      size="full"
      isOpen={isOpen}
      onClose={onClose}>
      <Actionsheet.Content>
        {actionSheetData?.title ? (
          <Box w="100%" my={4} px={4} justifyContent="space-between">
            <Text
              fontSize="xl"
              color="gray.800"
              _dark={{
                color: 'gray.300',
              }}>
              {actionSheetData.title}
            </Text>
          </Box>
        ) : null}
        <ActionSheetMenuWrapper actionSheetData={actionSheetData}>
          {actionSheetData.options.map((el, index) => {
            let fontIcon = Ionicons;
            switch (el.icon?.font) {
              case 'FontAwesome5Brands':
                fontIcon = FontAwesome5Brands;
                break;
              default:
                fontIcon = Ionicons;
                break;
            }
            return (
              <Actionsheet.Item
                key={'contactsScreenActionSheet' + index}
                onPress={() => {
                  onClose();
                  if (el.navigate) {
                    navigation.navigate(el.navigate, el.navigateOptions);
                  } else {
                    if (el?.link) {
                      Linking.openURL(el.link);
                    }
                  }
                }}
                _text={{
                  fontSize: 'md',
                  color: 'gray.600',
                  w: '100%',
                }}
                startIcon={
                  el.icon ? (
                    <Icon
                      as={fontIcon}
                      color={el.icon?.color}
                      mr="1"
                      size={el.icon?.size ? el.icon.size : 6}
                      name={el.icon?.name}
                    />
                  ) : null
                }>
                {el?.text}
                {el?.subtitle ? (
                  <Text color={'gray.500'}>{el.subtitle}</Text>
                ) : null}
              </Actionsheet.Item>
            );
          })}
        </ActionSheetMenuWrapper>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

ActionSheetMenu.defaultProps = {
  hideDragIndicator: true,
};

export default ActionSheetMenu;
