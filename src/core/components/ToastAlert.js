import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  VStack,
  HStack,
  Text,
  IconButton,
  CloseIcon,
  useToast,
} from 'native-base';
import {strings} from '../lang/const';

const ToastAlert = ({
  id,
  status,
  variant,
  title,
  description,
  isClosable,
  ...rest
}) => {
  const toast = useToast();
  const toastRef = useRef();
  return (
    <Alert
      maxWidth="95%"
      alignSelf="center"
      flexDirection="row"
      status={status ? status : 'info'}
      variant={variant}
      ref={toastRef}
      {...rest}>
      <VStack space={1} flexShrink={1} w="100%">
        <HStack
          flexShrink={1}
          alignItems="center"
          justifyContent="space-between">
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text
              fontSize="md"
              fontWeight="medium"
              flexShrink={1}
              color={
                variant === 'solid'
                  ? 'lightText'
                  : variant !== 'outline'
                  ? 'darkText'
                  : null
              }>
              {title}
            </Text>
          </HStack>
          {isClosable ? (
            <IconButton
              variant="unstyled"
              icon={<CloseIcon size={4} />}
              _icon={{
                color: variant === 'solid' ? 'lightText' : 'darkText',
              }}
              onPress={() => toast.close(id)}
            />
          ) : null}
        </HStack>
        <Text
          px="6"
          color={
            variant === 'solid'
              ? 'lightText'
              : variant !== 'outline'
              ? 'darkText'
              : null
          }>
          {description}
        </Text>
      </VStack>
    </Alert>
  );
};

ToastAlert.propTypes = {
  title: PropTypes.string.isRequired,
  variant: PropTypes.oneOf([
    'solid',
    'subtle',
    'left-accent',
    'top-accent',
    'outline',
  ]),
  status: PropTypes.oneOf(['info', 'warning', 'success', 'error']),
  description: PropTypes.string.isRequired,
  isClosable: PropTypes.bool,
};

ToastAlert.defaultProps = {
  title: strings.Notifications.error.title,
  variant: 'left-accent',
  description: strings.Notifications.error.text,
  isClosable: true,
  status: 'error',
};

export default ToastAlert;
