import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import {
  Text,
  Box,
  HStack,
  Button,
  Center,
  Divider,
  ArrowDownIcon,
  Heading,
  FlatList,
  ScrollView,
  IconButton,
  Icon,
  Modal,
  FormControl,
  Input,
} from 'native-base';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppBar } from '../Components';

export default function Poll() {
  const [nameModal, setNameModal] = useState(false);
  const [nominees, setNominee] = useState({
    twoDigits: {
      label: 'Presidente/Prefeito',
      candidates: [
        {
          number: '22',
          name: 'Jair Messias Bolsonaro',
          numberOfVotes: 72000400,
        },
        {
          number: '13',
          name: 'Luiz Inácio Lula da Silva',
          numberOfVotes: 40241002,
        },
      ],
    },
    ThreeDigits: {
      label: 'Senador',
      candidates: [
        {
          number: '22',
          name: 'Jair Messias Bolsonaro',
          numberOfVotes: 72000400,
        },
        {
          number: '13',
          name: 'Luiz Inácio Lula da Silva',
          numberOfVotes: 40241002,
        },
      ],
    },
    fourDigits: {
      label: 'Deputado Federal',
      candidates: [
        {
          number: '22',
          name: 'Jair Messias Bolsonaro',
          numberOfVotes: 72000400,
        },
        {
          number: '13',
          name: 'Luiz Inácio Lula da Silva',
          numberOfVotes: 40241002,
        },
      ],
    },
    fiveDigits: {
      label: 'Dep. Estadual ou Vereador',
      candidates: [
        {
          number: '22',
          name: 'Jair Messias Bolsonaro',
          numberOfVotes: 72000400,
        },
        {
          number: '13',
          name: 'Luiz Inácio Lula da Silva',
          numberOfVotes: 40241002,
        },
        {
          number: '88888',
          name: 'João das Neves Silva',
          numberOfVotes: 40241002,
        },
      ],
    },
  });

  const pollData = {
    year: '2022',
    turn: '1',
    validVotes: '300',
    nullVotes: '123',
    whiteVotes: '100',
    buQuantity: '23',
  };

  return (
    <Box>
      <AppBar pageName={`Eleições ${pollData.year}`} backButton />
      <Center>
        <Box p="1">
          <Box rounded="8" shadow={2} bg="coolGray.100">
            <HStack p="10px" justifyContent="space-between">
              <Center w="48%" p="10px">
                <Text fontSize="11px" color="coolGray.600">
                  Ano do Pleito
                </Text>
                <Text fontSize="34px">{pollData.year}</Text>
              </Center>
              <Center w="48%" p="10px">
                <Text fontSize="11px" color="coolGray.600">
                  Turno
                </Text>
                <Text fontSize="34px">{pollData.turn}º</Text>
              </Center>
            </HStack>
            <Divider bg="muted.300" />

            <Box p="1">
              <Button bg="green.400" leftIcon={<ArrowDownIcon color="coolGray.100" />}>
                Baixar Totalizações
              </Button>
            </Box>
          </Box>
        </Box>
      </Center>
      <Box p="10px">
        <Heading p="10px" color="coolGray.600">
          Candidados
        </Heading>
        <ScrollView horizontal>
          <HStack>
            {/* BOX DE CANDIDATO */}
            {nominees.twoDigits &&
              nominees.twoDigits.candidates &&
              nominees.twoDigits.candidates.length && (
                <Box
                  rounded="8"
                  w={`${Dimensions.get('window').width * 0.85}px`}
                  mr="10px"
                  mb="10px"
                  shadow={2}
                  bg="coolGray.100"
                >
                  <Heading p="10px" fontSize="14px">
                    {nominees.twoDigits.label}
                  </Heading>
                  <Divider />
                  <HStack p="10px" justifyContent="center">
                    <Center w="48%" p="10px">
                      <HStack>
                        <Text color="coolGray.600">Votos Válidos: </Text>
                        <Text>{pollData.validVotes}</Text>
                      </HStack>
                      <HStack>
                        <Text color="coolGray.600">Votos Nulos: </Text>
                        <Text>{pollData.nullVotes}</Text>
                      </HStack>
                    </Center>
                    <Center w="48%" p="10px">
                      <HStack>
                        <Text color="coolGray.600">Votos em Branco: </Text>
                        <Text>{pollData.whiteVotes}</Text>
                      </HStack>
                      <HStack>
                        <Text color="coolGray.600">Quantidade de BUs: </Text>
                        <Text>{pollData.buQuantity}</Text>
                      </HStack>
                    </Center>
                  </HStack>
                  <Divider />
                  <HStack p="10px">
                    <Box w="20%">
                      <Text bold color="coolGray.600">
                        Nº
                      </Text>
                    </Box>
                    <Box w="50%">
                      <Text bold color="coolGray.600">
                        Nome
                      </Text>
                    </Box>
                    <Box w="30%">
                      <Text bold color="coolGray.600">
                        Votos
                      </Text>
                    </Box>
                  </HStack>
                  <Divider />
                  <FlatList
                    maxH="200px"
                    data={nominees.twoDigits.candidates}
                    renderItem={({ item }) => (
                      <HStack p="10px">
                        <Box w="15%">
                          <Text bold color="coolGray.600">
                            {item.number}
                          </Text>
                        </Box>
                        <Box w="10%">
                          <IconButton
                            icon={<Icon as={MCIcons} name="pencil" />}
                            borderRadius="full"
                            onPress={() => setNameModal(nominees.twoDigits.number)}
                          />
                        </Box>
                        <Box w="45%">
                          <Text bold color="coolGray.600">
                            {item.name || '-'}
                          </Text>
                        </Box>
                        <Box w="30%">
                          <Text bold color="coolGray.600">
                            {new Intl.NumberFormat('pt-BR').format(item.numberOfVotes)}
                          </Text>
                        </Box>
                      </HStack>
                    )}
                  />
                </Box>
              )}
            {nominees.ThreeDigits &&
              nominees.ThreeDigits.candidates &&
              nominees.ThreeDigits.candidates.length && (
                <Box
                  rounded="8"
                  mb="10px"
                  shadow={2}
                  bg="coolGray.100"
                  w={`${Dimensions.get('window').width * 0.85}px`}
                  mr="10px"
                >
                  <Heading p="10px" fontSize="14px">
                    {nominees.ThreeDigits.label}
                  </Heading>
                  <Divider />
                  <HStack p="10px" justifyContent="center">
                    <Center w="48%" p="10px">
                      <HStack>
                        <Text color="coolGray.600">Votos Válidos: </Text>
                        <Text>{pollData.validVotes}</Text>
                      </HStack>
                      <HStack>
                        <Text color="coolGray.600">Votos Nulos: </Text>
                        <Text>{pollData.nullVotes}</Text>
                      </HStack>
                    </Center>
                    <Center w="48%" p="10px">
                      <HStack>
                        <Text color="coolGray.600">Votos em Branco: </Text>
                        <Text>{pollData.whiteVotes}</Text>
                      </HStack>
                      <HStack>
                        <Text color="coolGray.600">Quantidade de BUs: </Text>
                        <Text>{pollData.buQuantity}</Text>
                      </HStack>
                    </Center>
                  </HStack>
                  <Divider />
                  <HStack p="10px">
                    <Box w="20%">
                      <Text bold color="coolGray.600">
                        Nº
                      </Text>
                    </Box>
                    <Box w="50%">
                      <Text bold color="coolGray.600">
                        Nome
                      </Text>
                    </Box>
                    <Box w="30%">
                      <Text bold color="coolGray.600">
                        Votos
                      </Text>
                    </Box>
                  </HStack>
                  <Divider />
                  <FlatList
                    maxHeight="200px"
                    data={nominees.ThreeDigits.candidates}
                    renderItem={({ item }) => (
                      <HStack p="10px">
                        <Box w="15%">
                          <Text bold color="coolGray.600">
                            {item.number}
                          </Text>
                        </Box>
                        <Box w="10%">
                          <IconButton
                            icon={<Icon as={MCIcons} name="pencil" />}
                            borderRadius="full"
                            onPress={() => setNameModal(nominees.ThreeDigits.number)}
                          />
                        </Box>
                        <Box w="45%">
                          <Text bold color="coolGray.600">
                            {item.name || '-'}
                          </Text>
                        </Box>
                        <Box w="30%">
                          <Text bold color="coolGray.600">
                            {new Intl.NumberFormat('pt-BR').format(item.numberOfVotes)}
                          </Text>
                        </Box>
                      </HStack>
                    )}
                  />
                </Box>
              )}
            {nominees.fourDigits &&
              nominees.fourDigits.candidates &&
              nominees.fourDigits.candidates.length && (
                <Box
                  rounded="8"
                  mb="10px"
                  shadow={2}
                  bg="coolGray.100"
                  w={`${Dimensions.get('window').width * 0.85}px`}
                  mr="10px"
                >
                  <Heading p="10px" fontSize="14px">
                    {nominees.fourDigits.label}
                  </Heading>
                  <Divider />
                  <HStack p="10px" justifyContent="center">
                    <Center w="48%" p="10px">
                      <HStack>
                        <Text color="coolGray.600">Votos Válidos: </Text>
                        <Text>{pollData.validVotes}</Text>
                      </HStack>
                      <HStack>
                        <Text color="coolGray.600">Votos Nulos: </Text>
                        <Text>{pollData.nullVotes}</Text>
                      </HStack>
                    </Center>
                    <Center w="48%" p="10px">
                      <HStack>
                        <Text color="coolGray.600">Votos em Branco: </Text>
                        <Text>{pollData.whiteVotes}</Text>
                      </HStack>
                      <HStack>
                        <Text color="coolGray.600">Quantidade de BUs: </Text>
                        <Text>{pollData.buQuantity}</Text>
                      </HStack>
                    </Center>
                  </HStack>
                  <Divider />
                  <HStack p="10px">
                    <Box w="20%">
                      <Text bold color="coolGray.600">
                        Nº
                      </Text>
                    </Box>
                    <Box w="50%">
                      <Text bold color="coolGray.600">
                        Nome
                      </Text>
                    </Box>
                    <Box w="30%">
                      <Text bold color="coolGray.600">
                        Votos
                      </Text>
                    </Box>
                  </HStack>
                  <Divider />
                  <FlatList
                    maxHeight="200px"
                    data={nominees.fourDigits.candidates}
                    renderItem={({ item }) => (
                      <HStack p="10px">
                        <Box w="15%">
                          <Text bold color="coolGray.600">
                            {item.number}
                          </Text>
                        </Box>
                        <Box w="10%">
                          <IconButton
                            icon={<Icon as={MCIcons} name="pencil" />}
                            borderRadius="full"
                            onPress={() => setNameModal(nominees.fourDigits.number)}
                          />
                        </Box>
                        <Box w="45%">
                          <Text bold color="coolGray.600">
                            {item.name || '-'}
                          </Text>
                        </Box>
                        <Box w="30%">
                          <Text bold color="coolGray.600">
                            {new Intl.NumberFormat('pt-BR').format(item.numberOfVotes)}
                          </Text>
                        </Box>
                      </HStack>
                    )}
                  />
                </Box>
              )}
            {nominees.fiveDigits &&
              nominees.fiveDigits.candidates &&
              nominees.fiveDigits.candidates.length && (
                <Box
                  rounded="8"
                  mb="10px"
                  shadow={2}
                  bg="coolGray.100"
                  w={`${Dimensions.get('window').width * 0.85}px`}
                  mr="10px"
                >
                  <Heading p="10px" fontSize="14px">
                    {nominees.fiveDigits.label}
                  </Heading>
                  <Divider />
                  <HStack p="10px" justifyContent="center">
                    <Center w="48%" p="10px">
                      <HStack>
                        <Text color="coolGray.600">Votos Válidos: </Text>
                        <Text>{pollData.validVotes}</Text>
                      </HStack>
                      <HStack>
                        <Text color="coolGray.600">Votos Nulos: </Text>
                        <Text>{pollData.nullVotes}</Text>
                      </HStack>
                    </Center>
                    <Center w="48%" p="10px">
                      <HStack>
                        <Text color="coolGray.600">Votos em Branco: </Text>
                        <Text>{pollData.whiteVotes}</Text>
                      </HStack>
                      <HStack>
                        <Text color="coolGray.600">Quantidade de BUs: </Text>
                        <Text>{pollData.buQuantity}</Text>
                      </HStack>
                    </Center>
                  </HStack>
                  <Divider />
                  <HStack p="10px">
                    <Box w="20%">
                      <Text bold color="coolGray.600">
                        Nº
                      </Text>
                    </Box>
                    <Box w="50%">
                      <Text bold color="coolGray.600">
                        Nome
                      </Text>
                    </Box>
                    <Box w="30%">
                      <Text bold color="coolGray.600">
                        Votos
                      </Text>
                    </Box>
                  </HStack>
                  <Divider />
                  <FlatList
                    maxHeight="200px"
                    data={nominees.fiveDigits.candidates}
                    renderItem={({ item }) => (
                      <HStack p="10px">
                        <Box w="15%">
                          <Text bold color="coolGray.600">
                            {item.number}
                          </Text>
                        </Box>
                        <Box w="10%">
                          <IconButton
                            icon={<Icon as={MCIcons} name="pencil" />}
                            borderRadius="full"
                            onPress={() => setNameModal(nominees.fiveDigits.number)}
                          />
                        </Box>
                        <Box w="45%">
                          <Text bold color="coolGray.600">
                            {item.name || '-'}
                          </Text>
                        </Box>
                        <Box w="30%">
                          <Text bold color="coolGray.600">
                            {new Intl.NumberFormat('pt-BR').format(item.numberOfVotes)}
                          </Text>
                        </Box>
                      </HStack>
                    )}
                  />
                </Box>
              )}
            {/* END BOX DE CANDIDATO */}
          </HStack>
        </ScrollView>
      </Box>
      <Modal
        isOpen={!!(nameModal !== null && nameModal !== false)}
        onClose={() => setNameModal(false)}
        safeAreaTop
      >
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Nome do candidato</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Nome</FormControl.Label>
              <Input />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setNameModal(false);
                }}
              >
                Cancelar
              </Button>
              <Button
                onPress={() => {
                  setNameModal(false);
                }}
              >
                Salvar
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
}
