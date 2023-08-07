import React, { useEffect, useState } from 'react';
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
  VStack,
} from 'native-base';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppBar, SplashScreen } from '../Components';
import { getElections, getElectronicUrns } from '../Core/Services';
import { JobNames } from '../Core/Constants';

export default function Poll({ navigation, route }) {
  const { params } = route
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('OK')
  const [nameModal, setNameModal] = useState(false);
  const [totalBus, setTotalBus] = useState(0);
  //
  const [pollData, setPollData] = useState({ year: '0', turn: '1' })
  const [jobData, setJobData] = useState([])

  useEffect(() => {
    async function readBuData() {
      const dataUrns = await getElectronicUrns().where('eid', '==', params.eid).get()
      setTotalBus(dataUrns.size)
      const dataElection = await getElections().doc(params.eid).get()
      if (dataElection.exists) {
        const election = dataElection.data()
        setPollData({ year: election.year, turn: election.shift })
      }

      if (dataUrns && dataUrns.docs) {
        const jobsInfo = []
        for (const urn of dataUrns.docs) {
          const urnContent = urn.data()
          const buContent = urnContent.buContent;
          const candidatesName = urnContent.candidatesName
          const jobs = buContent.jobData

          for (const job of jobs) {
            const idxJob = jobsInfo.findIndex(value => value.carg === job.carg)
            const entries = Object.entries(job)

            //Calculo a lista de candidados e seus valores para cada bu e cargos
            if (idxJob === -1) {

              const candidates = []
              for (const [number, votes] of entries) {
                const nameObj = candidatesName.find(op => op.number === number)
                candidates.push({
                  number: number,
                  name: nameObj != null ? nameObj.name : "",
                  numberOfVotes: parseInt(votes) || 0
                })
              }

              jobsInfo.push({
                carg: job.carg,
                candidates: candidates,
                totalValidVotes: parseInt(job.nomi) || 0,
                totalWhiteVotes: parseInt(job.bran) || 0,
                totalNullVotes: parseInt(job.nulo) || 0
              })
            } else {

              for (const [number, votes] of entries) {
                const checkCt = jobsInfo[idxJob].candidates.findIndex(cd => cd.number === number)
                const nameObj = candidatesName.find(op => op.number === number)
                
                if (checkCt > -1) {
                  jobsInfo[idxJob].candidates[checkCt].numberOfVotes += parseInt(votes)
                } else {
                  
                  jobsInfo[idxJob].candidates.push({
                    number: number,
                    name: nameObj != null ? nameObj.name : "",
                    numberOfVotes: parseInt(votes) || 0
                  })
                }
              }
              jobsInfo[idxJob].totalValidVotes += parseInt(job.nomi)
              jobsInfo[idxJob].totalWhiteVotes += parseInt(job.bran)
              jobsInfo[idxJob].totalNullVotes += parseInt(job.nulo)
            }
          }

        }
        console.log(jobsInfo, "jobsInfo")
        setJobData(jobsInfo)
        setLoading(false)
      }
    }
    if (params && params.eid) {
      readBuData().catch(err => {
        console.log(err)
        setStatus('database_error')
      })
    } else {
      setStatus('param')
    }
  }, [params, getElectronicUrns])

  return (
    loading
      ? <SplashScreen description="Carregando Dados dos BUs" />
      : <Box w='full' h='full'>
        <AppBar pageName={`Eleições ${pollData.year}`} backButton />

        {status === 'OK'
          ? <Box w='full' h='full'>
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
                  <HStack>
                    <Heading w='full' m='2' textTransform={'uppercase'} size={'sm'} textAlign='center' color="coolGray.600">Quantidade de BUs: {totalBus}</Heading>
                  </HStack>
                  <Divider bg="muted.300" />

                  <Box p="1">
                    <Button bg="green.400" leftIcon={<ArrowDownIcon color='coolGray.50' />}>
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
                  {jobData && jobData.map((item) => {
                    return (<Box
                      key={item.carg}
                      rounded="8"
                      w={`${Dimensions.get('window').width * 0.915}px`}
                      mr="10px"
                      mb="10px"
                      shadow={2}
                      h={'full'}
                      bg="coolGray.100"
                    >
                      <Heading p="10px" fontSize="14px">
                        {JobNames[item.carg]}
                      </Heading>
                      <Divider />
                      <VStack p="10px" justifyContent="center">
                        <HStack>
                          <Text color="coolGray.600">Votos Válidos: </Text>
                          <Text>{item.totalValidVotes}</Text>
                        </HStack>

                        <HStack>
                          <Text color="coolGray.600">Votos Nulos: </Text>
                          <Text>{item.totalNullVotes}</Text>
                        </HStack>
                        <HStack>
                          <Text color="coolGray.600">Votos em Branco: </Text>
                          <Text>{item.totalWhiteVotes}</Text>
                        </HStack>

                      </VStack>
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
                        maxH="260px"
                        data={item.candidates}
                        renderItem={({item: candidate}) => {
                        
                          return (
                          <HStack p="10px" key={candidate.number}>
                            <Box w="15%">
                              <Text bold color="coolGray.600">
                                {candidate.number || ""}
                              </Text>
                            </Box>
                            <Box w="10%">
                              <IconButton
                                icon={<Icon as={MCIcons} name="pencil" />}
                                borderRadius="full"
                                onPress={() => setNameModal(true)}
                              />
                            </Box>
                            <Box w="45%">
                              <Text bold color="coolGray.600">
                                {candidate.name || 'Não Definido.'}
                              </Text>
                            </Box>
                            <Box w="30%">
                              <Text bold color="coolGray.600">
                                {new Intl.NumberFormat('pt-BR').format(candidate.numberOfVotes)}
                              </Text>
                            </Box>
                          </HStack>
                        )}}
                      />
                    </Box>)
                  })}

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
          : <HStack h='100%' mt='-20' alignItems={'center'} justifyContent={'center'}>
            <Center>
              <MCIcons name={status === 'param' ? 'database-eye-off' : "database-off"} size={80} />
              <Text mt='5' fontSize={'xl'}>{'FALHA NA LEITURA DO BU'}</Text>
              <Text m='2' textAlign={'center'}>{status === 'param' ? 'O recurso necessário não foi encontrado.' : 'Não foi possível carregar os dados do BU no banco de dados.'}</Text>
            </Center>


          </HStack>}


      </Box>

  );
}
