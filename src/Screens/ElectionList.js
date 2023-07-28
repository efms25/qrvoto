import React from 'react';
import { Box, Center, FlatList, Heading, Icon, Fab, Text, Pressable, HStack } from 'native-base';
import FA5Icons from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AppBar } from '../Components';

export default function ElectionList({ navigation }) {
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
        renderInPortal
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
