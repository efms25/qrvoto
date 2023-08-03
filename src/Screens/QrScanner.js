import { Text, Icon, Container, Button, Box, VStack, HStack, IconButton, Alert, useToast, CloseIcon } from 'native-base';
// import produce from 'immer'
import { StyleSheet, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import { addElectrionUrn } from '../Core/Services';



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
          const buCode = barcodes[0].displayValue;
          const qrPerBuTotalQty = buCode.split("QRBU:")[1].split(" ")[0].split(':');

          if (qrPerBuTotalQty[1] > 1) {

            let qrArr = []

            if (qrCodes.length === 0) {
              for (let i = 0; i < parseInt(qrPerBuTotalQty[1]); i++) {
                qrArr.push({
                  scanned: (parseInt(qrPerBuTotalQty[0]) - 1) === i,
                  data: (parseInt(qrPerBuTotalQty[0]) - 1) === i && buCode
                })
              }
              setQrCodes(qrArr)
              toast.show({
                placement: "top",
                render: () => ToastAlert({
                  isClosable: true,
                  title: 'ATENÇÃO',
                  description: 'Os dados desse BU são divididos em ' + qrPerBuTotalQty[1] + ' QrCodes, leia todos para salvar o Boletim com sucesso.',
                })
              })
            } else {

              let qrs = [...qrCodes];
              qrs[[(parseInt(qrPerBuTotalQty[0]) - 1)]] = {
                scanned: true,
                data: buCode
              }
              setQrCodes(qrs)

            }
          } else {
            toast.show({
              placement: "top",
              render: () => ToastAlert({
                variant: "left-accent",
                status: "success",
                isClosable: true,
                title: 'Leitura Realizada',
                description: 'Qr code do boletim foi lido com sucesso',
              })
            })

          }

        } else {
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
        console.log(err, 'QRcode Reader');
        throw "Erro ao obter dados do QRcode";
      }
    }
  }, [barcodes]);

  useEffect(() => {
    async function submit() {
      if (qrCodes.length > 0) {
        let readyForProcess = true
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
          <HStack justifyContent={'space-between'}>''
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
            <Text>
              Aponte para o QR code do Boletim de Urna, a leitura será automática.
            </Text>
          </Box>
        </Box>
      </VStack >
    </Box >
  );
}
