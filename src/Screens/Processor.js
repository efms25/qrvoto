
import React, { useCallback, useEffect, useState } from 'react';
import { Box, VStack, Center, Heading, Spinner, Text, HStack, Button, Icon } from 'native-base'
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ERROR_PERMISSION_DENIED, ERROR_ELECTRONIC_URN_ALREADY_EXIST, ERROR_ON_WRITE_ELECTRONIC_URN, ERROR_QR_CODE_RECEIVE_INVALID, SUCCESSFULLY_ELECTRONIC_URN_ADDED } from '../Core/Constants';
import { Pressable } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { addElectrionUrn } from '../Core/Services';
import { useGlobalContext } from '../Contexts/GlobalContext';

function Processor(props) {

  const { navigation } = props
  const [status, setStatus] = useState('')
  const { readyForProcess, setReadyForProcess } = useGlobalContext()

  useEffect(() => {
    if (readyForProcess) {
      const params = props.route.params
      const buData = params.buData
      if (params && buData) {
        setReadyForProcess(false)
        addElectrionUrn(buData).then(resolve => {
          setStatus(resolve)
        })
      }
      else {
        setStatus('ERROR_INPUT_BU_CANNOT_BY_EMPTY')
      }
    }

  }, [props, readyForProcess])

  useFocusEffect(useCallback(() => {
    setStatus("")
  }, []))

  return (<Box h='100%'>
    <VStack justifyContent={'space-between'} h={'full'}>
      <Center flex={'1'}>
        <Heading mt={'10'} size={'md'} textTransform={'uppercase'}>PROCESSANDO BOLETIM DE URNA</Heading>
        <Box my={'10'}>
          <Icon
            size={120}
            as={MCIcons}
            name="qrcode-scan"
            color="coolGray.800"
          />
        </Box>

      </Center>
      <Center flex='1'>
        {status === ''
          ? <Center flex='1'>
            <Spinner color="coolGray.500" size={50} />
            <Text mt='5' fontSize={'xl'} textAlign={'center'}>PROCESSANDO INFORMAÇÕES</Text>
            <Text mt='5'>O aplicativo está processando as informações recebidas.</Text>
          </Center>
          : status === ERROR_ELECTRONIC_URN_ALREADY_EXIST
            ? <Center flex='1'>
              <Icon
                size={50}
                as={MCIcons}
                name="alert-circle-check"
                color="blue.400"
              />
              <Text mt='5' fontSize={'xl'} textAlign={'center'}>BOLETIM DE URNA JÁ CADASTRADO!</Text>
              <Text mt='2' textAlign={'center'}>Não é necessário registrar esse BU pois ele já se encontra registrado no sistema.</Text>
            </Center>
            : status === ERROR_QR_CODE_RECEIVE_INVALID
              ? <Center flex='1'>
                <Icon
                  size={50}
                  as={MCIcons}
                  name="alert-decagram"
                  color="red.400"
                />
                <Text mt='5' fontSize={'xl'} textAlign={'center'}>QR-CODE INSERIDO INVÁLIDO!</Text>
                <Text mt='2' textAlign={'center'}>O QrCode lido parece não ser um boletim de urna, não é possível continuar.</Text>
              </Center>
              : status === ERROR_ON_WRITE_ELECTRONIC_URN
                ? <Center flex='1'>
                  <Icon
                    size={50}
                    as={MCIcons}
                    name="cloud-alert"
                    color="red.400"
                  />
                  <Text mt='5' fontSize={'xl'} textAlign={'center'}>FALHA NO CADASTRAMENTO DO BU</Text>
                  <Text mt='2' textAlign={'center'}>O aplicativo não conseguiu salvar o boletim de urna no momento, tente novamente em instantes.</Text>
                </Center>
                : status === SUCCESSFULLY_ELECTRONIC_URN_ADDED
                  ? <Center flex='1'>
                    <Icon
                      size={100}
                      as={MCIcons}
                      name="check-bold"
                      color="green.500"
                    />
                    <Text mt='5' fontSize={'xl'} textAlign={'center'}>CADASTRADO COM SUCESSO</Text>
                    <Text mt='2' textAlign={'center'}>Boletim de urna cadastrado com sucesso.</Text>
                  </Center>
                  : status === ERROR_PERMISSION_DENIED
                    ? <Center flex='1'>
                      <Icon
                        size={70}
                        as={MCIcons}
                        name="database-remove"
                        color="red.400"
                      />
                      <Text mt='5' fontSize={'xl'} textAlign={'center'}>PERMISSÃO NEGADA</Text>
                      <Text mt='2' textAlign={'center'}>O banco de dados negou a leitura ou escrita de dados.</Text>
                    </Center>
                    : <Center flex='1'>
                      <Icon
                        size={70}
                        as={MCIcons}
                        name="alert"
                        color="red.400"
                      />
                      <Text mt='5' fontSize={'xl'} textAlign={'center'}>OCORREU UM ERRO DESCONHECIDO</Text>
                      <Text mt='2' textAlign={'center'}>O Aplicativo não conseguiu processar o pedido!</Text>
                      <Text mt='2' textAlign={'center'} fontSize={'xs'}>Codigo do erro: {status}</Text>
                    </Center>
        }
        <HStack mb='10'>
          {status !== '' &&
            status !== SUCCESSFULLY_ELECTRONIC_URN_ADDED &&
            <Button
              variant={'ghost'}
              onPress={(ev) => {
                navigation.push('QrScanner')
              }}>
              <HStack alignItems={'center'}>
                <Icon
                  size={"20px"}
                  as={MCIcons}
                  name="arrow-left"
                  color="coolGray.600"
                />
                <Text ml='2'>Voltar</Text>
              </HStack>
            </Button>
          }
          {status === SUCCESSFULLY_ELECTRONIC_URN_ADDED &&
            <HStack>
              <Button
                variant={'primary'}
                onPress={(ev) => {
                  navigation.reset({
                    index: 1,
                    routes: [
                      { name: "List" },
                      { name: "QrScanner" }
                    ]
                  })
                  //navigation.navigate('QrScanner')
                }}>
                <HStack alignItems={'center'}>
                  <Icon
                    size={"20px"}
                    as={MCIcons}
                    name="qrcode-scan"
                    color="coolGray.600"
                  />
                  <Text ml='2'>Cadastrar outro</Text>
                </HStack>
              </Button>
              <Button
                variant={'primary'}
                onPress={(ev) => {
                  navigation.push('List')
                }}>
                <HStack alignItems={'center'}>
                  <Icon
                    size={"20px"}
                    as={MCIcons}
                    name="home"
                    color="coolGray.600"
                  />
                  <Text ml='2'>Voltar ao Inicio</Text>
                </HStack>
              </Button>
            </HStack>
          }
        </HStack>


      </Center>
    </VStack>
  </Box>)
}

export default Processor