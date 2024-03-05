import React, {useRef, useState, forwardRef} from 'react';
import {
  Alert,
  VStack,
  HStack,
  Text,
  IconButton,
  CloseIcon,
  useToast,
  Box,
  Collapse,
} from 'native-base';
import {strings} from '../lang/const';

const ToastAlert = forwardRef(
  (
    {id, status, variant, title, description, duration, isClosable, ...rest},
    ref,
  ) => {
    // const toast = useToast();
    // const toastRef = useRef();
    const [show, setShow] = useState(true);

    return (
      <Box w="100%" alignItems="center">
        {/* <Collapse
          key={'alert' + id}
          isOpen={show}
          variant={variant}
          animateOpacity={true}
          duration={duration / 10}> */}
        <Alert
          maxWidth="95%"
          alignSelf="center"
          flexDirection="row"
          status={status ? status : 'info'}
          variant={variant}
          duration={duration}
          opacity={show ? 1 : 0}
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
                  onPress={() => {
                    setShow(false);
                  }}
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
        {/* </Collapse> */}
      </Box>
    );
  },
);

ToastAlert.defaultProps = {
  title: strings.Notifications.error.title,
  variant: 'left-accent',
  description: strings.Notifications.error.text,
  isClosable: true,
  status: 'error',
  duration: 3000,
};

export default ToastAlert;
