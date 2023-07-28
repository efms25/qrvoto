import React, { useState, useEffect, useCallback } from 'react';
import { Box, Heading, VStack, FormControl, Input, Button, Center } from 'native-base';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthContext } from '../Contexts/AuthContext';
import Toast from 'react-native-toast-message'

function Login() {
  const { login, setAuth } = useAuthContext()
  const [dataLogin, setDataLogin] = useState({ login: "", password: "" })
  const [fieldsStatus, setFieldsStatus] = useState({ login: true, password: true })
  const [loadingAuth, setLoadingAuth] = useState(false)

  const onSubmit = useCallback(async (user, password) => {
    setLoadingAuth(true)
    try {
      if (user === "") {
        setFieldsStatus(val => ({ ...val, login: false }))
        Toast.show({
          type: 'error',
          text1: "Autenticação",
          text2: "O campo de email não pode ficar em branco."
        })
      } else if (password === "") {
        setFieldsStatus(val => ({ ...val, password: false }))
        Toast.show({
          type: 'error',
          text1: "Autenticação",
          text2: "Forneça a senha de acesso para continuar."
        })
      } else {
        const resultLogin = await login(user, password)

        const userInfo = resultLogin.user
        setAuth(userInfo)

        setLoadingAuth(false)
        setFieldsStatus({
          login: true,
          password: true
        })
      
      }

    } catch (e) {
      setLoadingAuth(false)
      if (e.code === "auth/user-not-found" || e.code === "auth/wrong-password") {
        Toast.show({
          type: 'error',
          text1: "Autenticação",
          text2: "O Email ou senha estão incorretos ou o usuário não existe!"
        })
      }
      else if (e.code === "auth/too-many-requests") {
        Toast.show({
          type: 'error',
          text1: "Autenticação",
          text2: "Tentativas multiplas de login, aguarde um segundo para tentar se conectar novamente."
        })
      }
      else {
        Toast.show({
          type: 'error',
          text1: "Autenticação",
          text2: "Não foi possível realizar a autenticação no momento, tente novamente em instantes."
        })
      }
    } finally {
      setLoadingAuth(false)
    }
  }, [login])

  return (
    <Center w="100%" h="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Center my="8">
          <MCIcons name="qrcode-scan" size={60} />
        </Center>
        <Heading
          size="lg"
          fontWeight="600"
          color="coolGray.800"
          _dark={{
            color: 'warmGray.50',
          }}
        >
          Bem vindo ao QRvoto
        </Heading>
        <Heading
          mt="1"
          _dark={{
            color: 'warmGray.200',
          }}
          color="coolGray.600"
          fontWeight="medium"
          size="xs"
        >
          Leia e acompanhe seus boletins de urna eletrônica.
        </Heading>

        <VStack space={3} mt="5">
          <FormControl isInvalid={!fieldsStatus.login}>
            <FormControl.Label>Email</FormControl.Label>
            <Input onChange={(ev) => {
              setDataLogin(val => ({
                ...val,
                login: ev.nativeEvent.text
              }))
            }} />
            <FormControl.ErrorMessage>
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isInvalid={!fieldsStatus.password}>
            <FormControl.Label>Senha</FormControl.Label>
            <Input type="password" onChange={(ev) => {
              setDataLogin(val => ({
                ...val,
                password: ev.nativeEvent.text
              }))
            }} />
            <FormControl.ErrorMessage>
            </FormControl.ErrorMessage>
          </FormControl>
          <Button
            isLoading={loadingAuth}
            isLoadingText='Autenticando...'
            mt="2" colorScheme="indigo" onPress={() => onSubmit(dataLogin.login, dataLogin.password)}>
            Entrar
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}

export default Login;
