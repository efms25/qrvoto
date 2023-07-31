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
  const [qrCodes, setQrCodes] = useState([])
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
        <Box w="100%" h={Dimensions.get('window').height * 0.65 - 60} display="flex" justifyContent={'flex-end'}>
          <HStack w="100%" h={((Dimensions.get('window').width * 0.5) - 10)}>
            <Box w={(Dimensions.get('window').width * 0.5) - 10}>
              <Box h="30%" w="30%" borderTopWidth={"4px"} borderLeftWidth={"4px"} roundedTopLeft="4px" borderColor={"coolGray.100"} />
            </Box>
            <Box w={(Dimensions.get('window').width * 0.5) - 10} display="flex" alignItems={'flex-end'}>
              <Box h="30%" w="30%" borderTopWidth={"4px"} borderRightWidth={"4px"} roundedTopRight="4px" borderColor={"coolGray.100"} />
            </Box>
          </HStack>
          <HStack w="100%" h={((Dimensions.get('window').width * 0.5) - 10)}>
            <Box h={((Dimensions.get('window').width * 0.5) - 10)} w="50%" display="flex" justifyContent={'flex-end'}>
              <Box h="30%" w="30%" borderBottomWidth={"4px"} borderLeftWidth={"4px"} roundedBottomLeft="4px" borderColor={"coolGray.100"} />
            </Box>
            <Box h={((Dimensions.get('window').width * 0.5) - 10)} w="50%" display="flex" alignItems={"flex-end"} justifyContent={'flex-end'}>
              <Box h="30%" w="30%" borderBottomWidth={"4px"} borderRightWidth={"4px"} roundedBottomRight="4px" borderColor={"coolGray.100"} />
            </Box>
          </HStack>
        </Box>
        <Box
          w="100%"
          h={Dimensions.get('window').height * 0.35}
          display="flex"
          justifyContent={'flex-end'}
        >
          <Box rounded="8" shadow={2} bg="coolGray.100" p="15px" m="10px" mb="25px">
            {qrCodes.length > 1 &&
              <HStack pb="10px" display="flex" justifyContent="center">
                {qrCodes.map((qr, i) => {
                  return (<Box
                    rounded="50"
                    borderColor={"green.400"}
                    borderWidth="2px"
                    h="30px"
                    w="30px"
                    m="5px"
                    bg={qr ? "green.400" : "coolGray.100"}
                    display="flex"
                    justifyContent="center"
                    alignItems="center">
                    {i + 1}
                  </Box>)
                })}
              </HStack>
            }
            <Text>
              Aponte para o QR code do Boletim de Urna, a leitura será automática.
            </Text>
          </Box>
        </Box>
      </VStack >
    </Box >
  );
}
