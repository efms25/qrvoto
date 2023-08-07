import React from 'react';
import { Text, VStack, HStack, IconButton, Alert, CloseIcon } from 'native-base';


/***
 * 
 */
const ToastAlert = ({
  id,
  status,
  variant,
  title,
  description,
  isClosable,
  toastInstance,
  ...rest
}) => {

  return (<Alert maxWidth="100%" alignSelf="center" flexDirection="row" status={status ? status : "info"} variant={variant || 'solid'} {...rest}>
    <VStack space={1} flexShrink={1} w="100%">
      <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
        <HStack space={2} flexShrink={1} alignItems="center">
          <Alert.Icon />
          <Text fontSize="md" fontWeight="medium" flexShrink={1} color={variant === "solid" || !variant ? "lightText" : variant !== "outline" ? "darkText" : null}>
            {title}
          </Text>
        </HStack>
        {isClosable ? <IconButton variant="unstyled" icon={<CloseIcon color={variant === "solid" || !variant ? "lightText" : variant !== "outline" ? "darkText" : null} size="3" />} _icon={{
          color: variant === "solid" ? "lightText" : "darkText"
        }} onPress={() => toastInstance.close(id)} /> : null}
      </HStack>
      <Text px="6" color={variant === "solid" || !variant ? "lightText" : variant !== "outline" ? "darkText" : null}>
        {description}
      </Text>
    </VStack>
  </Alert>)
};

export default ToastAlert