import React, { useEffect, useState } from 'react';
import { Box, Center, FlatList, Heading, Icon, Fab, Text, Pressable, HStack } from 'native-base';
import FA5Icons from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AppBar } from '../Components';
import { getElections } from '../Core/Services';

export default function ElectionList({ navigation, route }) {

  const { params } = route
  const [elections, setElections] = useState([])


  const handleGoToQrScanner = () => {
    navigation.navigate('QrScanner');
  };

  useEffect(() => {
    const unsubscribe = getElections().onSnapshot((dataQuery) => {
      const electionsRecovered = []
      dataQuery.forEach(doc => {
        electionsRecovered.push({
          uid: doc.id,
          key: doc.id,
          ...doc.data()
        })
      })

      setElections(electionsRecovered)
    }, (err) => { })

    return () => unsubscribe()
  }, [])

  return (
    <Box justifyContent={'space-between'} h='full'>
      <AppBar pageName="Pleitos" />
      <Box flex={'10'}>
        {elections.length ? (
          <FlatList
            data={elections}
            h="92%"
            renderItem={({ item }) => (
              <Pressable
                w="100%"
                p="5px"
                onPress={() =>{
                  navigation.navigate('Poll', {
                    eid: item.uid
                  })}
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
                        <Text fontSize="20px">{item.year}</Text>
                      </Box>
                      <Box w="50%">
                        <Text fontSize="11px" color="coolGray.600">
                          Turno
                        </Text>
                        <Text fontSize="20px">{item.shift}</Text>
                      </Box>
                    </HStack>
                  </Box>
                )}
              </Pressable>
            )}
          />
        ) : (
          <Box alignContent={'center'} h='full'>
            <Center h='full'>
              <Icon as={FA5Icons} name="vote-yea" size="60px" color="coolGray.300" minW="80px" />
              <Heading color="coolGray.300" fontWeight="medium" textAlign="center" size="xl" px='8px' py="18px">
                Não há pleitos cadastrados.
              </Heading>
            </Center>
          </Box>
        )}
      </Box>
      <Box flex={'1'}>
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


    </Box>
  );
}
