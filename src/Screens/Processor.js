
import React, { useCallback, useEffect, useState } from 'react';
import { Box, VStack, Center, Heading, Spinner, Text, HStack, Button, Icon } from 'native-base'
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ERROR_ELECTRONIC_URN_ALREADY_EXIST, ERROR_ON_WRITE_ELECTRONIC_URN, ERROR_QR_CODE_RECEIVE_INVALID, SUCCESSFULLY_ELECTRONIC_URN_ADDED } from '../Core/Constants';
import { Pressable } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { addElectrionUrn } from '../Core/Services';

function Processor(props) {

  const [status, setStatus] = useState('')
  const navigator = useNavigation()
  useEffect(() => {
    const params = props.route.params
    const buData = params.buData
    if (params && buData) {
      addElectrionUrn(buData).then(resolve => {
        setStatus(resolve)
      })
    }
    else {
      setStatus('ERROR_INPUT_BU_CANNOT_BY_EMPTY')
    }
  }, [props])

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
            <Text mt='5'>Processando Dados do BU...</Text>
          </Center>
          : status === ERROR_ELECTRONIC_URN_ALREADY_EXIST
            ? <Center flex='1'>
              <MCIcons name='alert-circle-check' size={50} />
              <Text mt='5' fontSize={'xl'} textAlign={'center'}>BOLETIM DE URNA JÁ CADASTRADO!</Text>
              <Text mt='2' textAlign={'center'}>Não é necessário registrar esse BU pois ele já se encontra registrado no sistema.</Text>
            </Center>
            : status === ERROR_QR_CODE_RECEIVE_INVALID
              ? <Center flex='1'>
                <MCIcons name='alert-decagram' size={50} />
                <Text mt='5' fontSize={'xl'} textAlign={'center'}>QR-CODE INSERIDO INVÁLIDO!</Text>
                <Text mt='2' textAlign={'center'}>O QrCode lido não parece ser um boletim de urna, não é possível continuar.</Text>
              </Center>
              : status === ERROR_ON_WRITE_ELECTRONIC_URN
                ? <Center flex='1'>
                  <MCIcons name='cloud-alert' size={50} />
                  <Text mt='5' fontSize={'xl'} textAlign={'center'}>FALHA NO CADASTRAMENTO DO BU</Text>
                  <Text mt='2' textAlign={'center'}>O aplicativo não conseguiu salvar o boletim de urna no momento, tente novament em instantes.</Text>
                </Center>
                : status === SUCCESSFULLY_ELECTRONIC_URN_ADDED
                  ? <Center flex='1'>
                    <MCIcons name='check-bold' size={100} />
                    <Text mt='5' fontSize={'xl'} textAlign={'center'}>CADASTRADO COM SUCESSO</Text>
                    <Text mt='2' textAlign={'center'}>Boletim de urna cadastrado com sucesso.</Text>
                  </Center>
                  : <Center flex='1'>
                    <MCIcons name='alert' size={70} />
                    <Text mt='5' fontSize={'xl'} textAlign={'center'}>OCORREU UM ERRO DESCONHECIDO</Text>
                    <Text mt='2' textAlign={'center'}>O Aplicativo não conseguiu processar o pedido</Text>
                    <Text mt='2' textAlign={'center'} fontSize={'xs'}>Codigo do erro: {status}</Text>
                  </Center>
        }
        <HStack mb='10'>
          {status !== '' &&
            status !== SUCCESSFULLY_ELECTRONIC_URN_ADDED &&
            <Button
              variant={'ghost'}
              onPress={(ev) => {
                navigator.push('QrScanner')
              }}>
              <HStack alignItems={'center'}>
                <MCIcons name='arrow-left' size={20} />
                <Text ml='2'>Voltar</Text>
              </HStack>
            </Button>
          }
          {status === SUCCESSFULLY_ELECTRONIC_URN_ADDED &&
            <HStack>
              <Button
                variant={'primary'}
                onPress={(ev) => {
                  navigator.navigate('QrScanner')
                }}>
                <HStack alignItems={'center'}>
                  <MCIcons name='qrcode-scan' size={20} />
                  <Text ml='2'>Cadastrar outro</Text>
                </HStack>
              </Button>
              <Button
                variant={'primary'}
                onPress={(ev) => {
                  navigator.navigate('Listagem')
                }}>
                <HStack alignItems={'center'}>
                  <MCIcons name='home' size={20} />
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