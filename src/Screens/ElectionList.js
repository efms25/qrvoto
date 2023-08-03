import React, { useEffect } from 'react';
import { Box, Center, FlatList, Heading, Icon, Fab, Text, Pressable, HStack } from 'native-base';
import FA5Icons from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AppBar } from '../Components';
import { Button } from 'react-native';
import { addElectrionUrn } from '../Core/Services';

export default function ElectionList({ navigation, route }) {
  const elections = [
    {
      electionYear: 2023,
      BUQuantity: 123,
      turn: 1,
    },
    {
      electionYear: 2023,
      BUQuantity: 143,
      turn: 2,
    },
  ];

  const handleGoToQrScanner = () => {
    navigation.navigate('QrScanner');
  };

  return (
    <Box>
      <Button title='Test. Add Pleito' onPress={() => addElectrionUrn(['QRBU:1:2 VRQR:1.5 VRCH:20180618 ORIG:VOTA ORLC:LEG PROC:15000 DTPL:20181007 PLEI:15100 TURN:1 FASE:S UNFE:AC MUNI:1392 ZONA:9 SECA:16 AGRE:17.18.19.100 IDUE:1333898 IDCA:610860347874160324266426 VERS:6.28.2.1 LOCA:4 APTO:51 COMP:30 FALT:21 HBMA:0 DTAB:20181007 HRAB:173122 DTFC:20181007 HRFC:180755 IDEL:15103 CARG:6 TIPO:1 VERC:201807111207 PART:91 9101:1 9102:1 9103:1 9104:1 9105:1 LEGP:1 TOTP:6 PART:92 9201:1 9202:1 9203:1 9204:1 9205:1 LEGP:1 TOTP:6 PART:93 9301:1 9302:1 9303:1 9304:1 9305:1 LEGP:1 TOTP:6 PART:94 9401:1 9402:1 9403:1 9404:1 9405:1 LEGP:1 TOTP:6 PART:95 9501:1 9502:1 9503:1 9504:2 LEGP:1 TOTP:6 APTA:51 NOMI:25 LEGC:5 BRAN:0 NULO:0 TOTC:30 CARG:7 TIPO:1 VERC:201807111207 PART:91 91001:1 91002:1 91003:1 LEGP:3 TOTP:6 PART:92 92001:1 92002:1 92003:1 LEGP:3 TOTP:6 PART:93 93001:1 93002:1 93003:1 LEGP:3 TOTP:6 PART:94 94001:1 HASH:153DD1E96C876F062459DC9ACDF640D38BEBC4490C794826D8E7EB3CF4761BD39AFC560BAEF3895A9D3C59F16CDE61028DF07FED861234A0F91C7005AD94F797', 'QRBU:2:2 VRQR:1.5 VRCH:20180618 94002:1 94003:1 LEGP:4 TOTP:7 APTA:51 NOMI:12 LEGC:13 BRAN:0 NULO:5 TOTC:30 CARG:5 TIPO:0 VERC:201807111207 911:8 921:3 931:3 941:5 951:7 APTA:51 NOMI:26 BRAN:0 NULO:34 TOTC:60 CARG:3 TIPO:0 VERC:201807111207 91:5 92:8 93:2 94:4 95:6 APTA:51 NOMI:25 BRAN:3 NULO:2 TOTC:30 IDEL:15101 CARG:1 TIPO:0 VERC:201807111207 91:7 92:6 93:3 94:6 95:5 APTA:51 NOMI:27 BRAN:2 NULO:1 TOTC:30 HASH:266788CFBB06EE77DB520DB89C2E60C51F60574E6E322C5F620FE71E691DCBA1E33DB16E2397683E18FE89B7D6F9F9252E6DD318735902EFC109F2E1F61015BF ASSI:0DFEC66ECE3848066CA83EDAA7B9C70CA84D7F40279FD3D44742BCB5BB360D233A89B94686E11C50D363D182A2800BFA6748A8B66BE888394E533F77E9B9B50B'])} />

      <AppBar pageName="Pleitos" />
      {elections.length ? (
        <FlatList
          data={elections}
          h="92%"
          renderItem={({ item }) => (
            <Pressable
              w="100%"
              p="5px"
              onPress={() =>
                navigation.navigate('Poll', {
                  electionYear: item.electionYear,
                  turn: item.turn,
                })
              }
            >
              {({ isPressed }) => (
                <Box
                  bg={isPressed ? 'coolGray.200' : 'coolGray.100'}
                  p="5"
                  rounded="8"
                  shadow={2}
                  borderWidth="1"
                  borderColor="coolGray.300"
                  style={{
                    transform: [
                      {
                        scale: isPressed ? 0.96 : 1,
                      },
                    ],
                  }}
                >
                  <HStack space={2} w="100%">
                    <Box w="50%">
                      <Text fontSize="11px" color="coolGray.600">
                        Ano do Pleito
                      </Text>
                      <Text fontSize="20px">{item.electionYear}</Text>
                    </Box>
                    <Box w="50%">
                      <Text fontSize="11px" color="coolGray.600">
                        Turno
                      </Text>
                      <Text fontSize="20px">{item.turn}</Text>
                    </Box>
                  </HStack>
                </Box>
              )}
            </Pressable>
          )}
        />
      ) : (
        <Box mb="40">
          <Center h="100%" w="100%">
            <Icon as={FA5Icons} name="vote-yea" size="60px" color="coolGray.300" minW="80px" />
            <Heading color="coolGray.300" fontWeight="medium" textAlign="center" size="xl" py="8px">
              Não há nenhum pleito cadastrado.
            </Heading>
          </Center>
        </Box>
      )}
      {/* <Fab
        renderInPortal
        shadow={2}
        placement="bottom-left"
        size="sm"
        icon={<Icon color="white" as={MaterialIcons} name="add" size="4" />}
        label="Adicionar Pleito"
      /> */}
      <Fab
        renderInPortal={false}
        shadow={2}
        onPress={handleGoToQrScanner}
        bg="tertiary.500"
        placement="bottom-right"
        size="sm"
        icon={<Icon color="white" as={MaterialIcons} name="qr-code-scanner" size="4" />}
        label="Ler QRcode"
      />
    </Box>
  );
}
