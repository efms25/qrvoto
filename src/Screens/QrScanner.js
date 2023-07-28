import { Text, Icon, Container, Button, Box, VStack, HStack, IconButton } from 'native-base';
import { StyleSheet, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';

export default function QrScanner() {
  const navigation = useNavigation();
  const [flash, setFlash] = useState(false);
  const [cameraPermission, setCameraPermission] = useState();

  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  useEffect(() => {
    (async () => {
      const cameraPermissionStatus = await Camera.requestCameraPermission();
      setCameraPermission(cameraPermissionStatus);
    })();
  }, []);

  useEffect(() => {
    if (barcodes.length) {
      console.log(barcodes, '--barcodes');
    }
  }, [barcodes]);

  if (device == null) return <Text>Loading</Text>;
  return (
    <Box w="100%" h="100%">
      <Camera
        device={device}
        isActive={true}
        torch={flash ? 'on' : 'off'}
        style={StyleSheet.absoluteFill}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
      <VStack p="10px">
        <Box bg="white.400" w="100%" maxH="60px">
          <HStack justifyContent={'space-between'}>
            <IconButton
              icon={<Icon as={IonIcons} name="chevron-back" />}
              size="md"
              borderRadius="full"
              bg="coolGray.800:alpha.20"
              onPress={() => {
                navigation.goBack();
              }}
              _icon={{
                color: 'coolGray.300',
                size: 'lg',
              }}
              _pressed={{
                bg: 'coolGray.800:alpha.40',
              }}
            />
            <IconButton
              icon={<Icon as={IonIcons} name={flash ? 'flash' : 'flash-off'} />}
              size="md"
              borderRadius="full"
              bg={flash ? 'primary.600' : 'coolGray.800:alpha.20'}
              onPress={() => setFlash(!flash)}
              _icon={{
                color: 'coolGray.300',
                size: 'lg',
              }}
              _pressed={{
                bg: 'coolGray.800:alpha.40',
              }}
            />
          </HStack>
        </Box>
        <Box w="100%" h={Dimensions.get('window').height * 0.65 - 60}></Box>
        <Box
          w="100%"
          h={Dimensions.get('window').height * 0.35}
          display="flex"
          justifyContent={'flex-end'}
        >
          <Box rounded="8" shadow={2} bg="coolGray.100" p="15px" m="10px" mb="25px">
            <Text>Testando para ver se ta tudo certinho </Text>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
}
