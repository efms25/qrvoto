import { Text, Icon, Box, VStack, HStack, IconButton, Alert, useToast, CloseIcon } from 'native-base';
// import produce from 'immer'
import { StyleSheet, Dimensions } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import { buQrCount } from '../Core/Functions';
import SplashScreen from '../Components/SplashScreen'



export default function QrScanner() {
  const navigation = useNavigation();
  const toast = useToast();

  const [flash, setFlash] = useState(false);
  const [qrCodes, setQrCodes] = useState([])
  const [cameraPermission, setCameraPermission] = useState();

  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  const ToastAlert = ({
    id,
    status,
    variant,
    title,
    description,
    isClosable,
    ...rest
  }) => <Alert maxWidth="100%" alignSelf="center" flexDirection="row" status={status ? status : "info"} variant={variant || 'solid'} {...rest}>
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
          }} onPress={() => toast.close(id)} /> : null}
        </HStack>
        <Text px="6" color={variant === "solid" || !variant ? "lightText" : variant !== "outline" ? "darkText" : null}>
          {description}
        </Text>
      </VStack>
    </Alert>;

  //O React-Navigation nunca desmonta os componentes, logo precisa de cleanup
  useFocusEffect(useCallback(() => {
    setQrCodes([])
    setFlash(false)
  }, []))


  useEffect(() => {
    (async () => {
      const cameraPermissionStatus = await Camera.requestCameraPermission();
      setCameraPermission(cameraPermissionStatus);
    })();
  }, []);

  useEffect(() => {
    if (barcodes.length) {
      try {
        if (barcodes && barcodes[0] && barcodes[0].displayValue) {
          //Informações a serem processadas vindo da leitura do BU
          const buCode = barcodes[0].displayValue;
          const buQntInfo = buQrCount(buCode);
          if (buQntInfo != null) {

            if (buQntInfo.total > 1 && qrCodes.length === 0) {
              if (!toast.isActive('infoQrBu')) {
                toast.show({
                  id: 'infoQrBu',
                  placement: "top",
                  render: () => ToastAlert({
                    isClosable: true,
                    title: 'ATENÇÃO',
                    description: 'Este BU está divido em: ' + buQntInfo.total + ' partes, leia todos as partes para processar o BU.',
                  })
                })
              }
            }

            if (qrCodes.length === 0) {
              let listOFQrs = []
              for (let i = 0; i < buQntInfo.total; i++) {
                listOFQrs.push({
                  scanned: (buQntInfo.current - 1) === i,
                  data: (buQntInfo.current - 1) === i && buCode
                })
              }
              setQrCodes(listOFQrs)
            } else {
              let newQrContent = [...qrCodes]
              newQrContent[buQntInfo.current - 1] = {
                scanned: true,
                data: buCode
              }
              setQrCodes(newQrContent)
            }
          }
        } else {
          if (!toast.isActive('infoQrBu')) {
            toast.show({
              id: 'infoQrBu',
              placement: "top",
              render: () => ToastAlert({
                variant: "left-accent",
                status: "error",
                isClosable: true,
                title: 'Erro de Leitura',
                description: 'Não foi possível obter as informações QrCode lido.',
              })
            })
          }

        }
      } catch (err) {
        toast.show({
          placement: "top",
          render: () => ToastAlert({
            variant: "left-accent",
            status: "error",
            isClosable: true,
            title: 'Erro de Leitura',
            description: 'Erro na leitura ou QRcode corrompido',
          })
        })
        console.log(err, 'QRcode Reader err');
      }
    }
  }, [barcodes, buQrCount]);

  useEffect(() => {
    async function submit() {
      let readyForProcess = true
      if (qrCodes.length > 0) {

        for (const qrCodeObj of qrCodes) {
          if (!qrCodeObj.scanned) {
            return readyForProcess = false
          }
        }

        if (readyForProcess) {
          navigation.navigate("Processor", {
            buData: qrCodes.map(qrCode => qrCode.data)
          })
        }
      }


    }
    submit().catch((e) => {
      toast.show({
        placement: 'top',
        render: ToastAlert({
          isClosable: true,
          description: "Ocorreu um erro no processamneto do QrCode.",
          title: "ERRO DE LEITURA",
          variant: 'error',
        })
      })
    })
  }, [qrCodes])

  if (device == null) return (<SplashScreen />);
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
                navigation.navigate('Listagem');
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
                    bg={qr.scanned ? "green.400" : "coolGray.100"}
                    display="flex"
                    justifyContent="center"
                    alignItems="center">
                    {i + 1}
                  </Box>)
                })}
              </HStack>
            }
            <Text>Aponte para o QR code do Boletim de Urna, a leitura será automática.</Text>
          </Box>
        </Box>
      </VStack >
    </Box >
  );
}
