import React from 'react';
import { StatusBar, Box, HStack, IconButton, Icon, Text } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

// eslint-disable-next-line react/prop-types
export default function AppBar({ pageName, backButton = false }) {
  const navigation = useNavigation();
  return (
    <>
      <StatusBar bg="#3700B3" barStyle="light-content" />
      <Box safeAreaTop bg="violet.600" />
      <HStack
        bg="violet.700"
        px="1"
        py="3"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
      >
        <HStack alignItems="center">
          {backButton && (
            <IconButton
              onPress={() => {
                navigation.goBack();
              }}
              icon={
                <Icon
                  size="md"
                  as={MaterialIcons}
                  name="arrow-back"
                  color="white"
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
              }
            />
          )}
          {/* <IconButton icon={<Icon size="sm" as={MaterialIcons} name="menu" color="white" />} /> */}
          <Text color="white" pl="1" fontSize="20" fontWeight="bold">
            {pageName}
          </Text>
        </HStack>
        <HStack>
          {/* <IconButton icon={<Icon as={MaterialIcons} name="more-vert" size="sm" color="white" />} /> */}
        </HStack>
      </HStack>
    </>
  );
}
