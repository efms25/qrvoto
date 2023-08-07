import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Pressable, useColorScheme } from 'react-native';
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
  FormControl,
  Input,
  VStack,
  useToast
} from 'native-base';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppBar, SplashScreen } from '../Components';
import { getElections, getElectronicUrns } from '../Core/Services';
import { JobNames } from '../Core/Constants';
import ToastAlert from '../Components/ToastAlert';

export default function Poll({ navigation, route }) {
  const colorMode = useColorScheme()
  const toast = useToast()
  const { params } = route
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('OK')
  const [nameModal, setNameModal] = useState(false);
  const [totalBus, setTotalBus] = useState(0);
  //
  const [pollData, setPollData] = useState({ year: '0', turn: '1' })
  const [jobData, setJobData] = useState([])
  const [tempNameEditor, setTempNameEditor] = useState({
    id: '',
    carg: '',
    idx: -1,
    number: 0,
    name: ""
  })

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
                if (number.match(/[0-9]+/)) {
                  const nameObj = candidatesName.find(op => op.number === number)
                  candidates.push({
                    number: number,
                    name: nameObj != null ? nameObj.name : "",
                    numberOfVotes: parseInt(votes) || 0
                  })
                }
              }

              jobsInfo.push({
                id: urn.id,
                carg: job.carg,
                candidates: candidates,
                totalValidVotes: parseInt(job.nomi) || 0,
                totalWhiteVotes: parseInt(job.bran) || 0,
                totalNullVotes: parseInt(job.nulo) || 0
              })
            } else {

              for (const [number, votes] of entries) {
                if (number.match(/[0-9]+/)) {
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
              }
              jobsInfo[idxJob].totalValidVotes += parseInt(job.nomi)
              jobsInfo[idxJob].totalWhiteVotes += parseInt(job.bran)
              jobsInfo[idxJob].totalNullVotes += parseInt(job.nulo)
            }
          }

        }
        setJobData(jobsInfo)
        setLoading(false)
      }
    }
    if (params && params.eid) {
      readBuData().catch(err => {
        setStatus('database_error')
      })
    } else {
      setStatus('param')
    }
  }, [params, getElectronicUrns])

  const submit = useCallback(async (data) => {
    try {
      if (data.name === '') {
        toast.show({
          id: 'infoQrBu',
          placement: "top",
          render: () => ToastAlert({
            toastInstance: toast,
            variant: "left-accent",
            status: "error",
            isClosable: true,
            title: 'Erro de Validação',
            description: 'O nome precisa ser preenchido para continuar.',
          })
        })
      }
      else {
        const getContent = await getElectronicUrns().doc(data.id).get()
        const newArrNames = [...getContent.data().candidatesName]
        const nIx = newArrNames.findIndex(cnd => cnd.number === data.number)
        if (nIx > -1) {

          newArrNames[nIx].name = data.name

          const update = await getElectronicUrns().doc(data.id).update({
            candidatesName: newArrNames
          })
        }
      }

    } catch (e) {
      console.log(e)
      if (!toast.isActive('basic')) {
        toast.show({
          id: 'infoQrBu',
          placement: "top",
          render: () => ToastAlert({
            toastInstance: toast,
            variant: "left-accent",
            status: "error",
            isClosable: true,
            title: 'Erro de Atualização',
            description: 'Não foi possível atualizar os dados do cargo.',
          })
        })
      }
    }

  }, [])

  return (
    loading
      ? <SplashScreen description="Carregando Dados dos BUs" />
      : <Box w='full' h='full'>
        <AppBar pageName={`Eleições ${pollData.year}`} backButton />

        {status === 'OK'
          ? <Box w='full' h='full' position={'relative'}>
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
                      h={`${Dimensions.get('window').width * 1.2}px`}
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
                        renderItem={({ item: candidate, index }) => {

                          return (
                            <HStack p="10px" key={candidate.number}>
                              <Box w="15%">
                                <Text bold color="coolGray.600">
                                  {candidate.number || ""}
                                </Text>
                              </Box>
                              <HStack w="55%" alignItems={'center'} paddingX={'2'}>
                                <Box w="15%" marginRight={'1.5'}>
                                  <IconButton
                                    icon={<Icon as={MCIcons} name="pencil" />}
                                    onPress={() => {
                                      setTempNameEditor({
                                        id: item.id,
                                        carg: item.carg,
                                        idx: index,
                                        number: candidate.number,
                                        name: candidate.name
                                      })
                                      setNameModal(true)
                                    }}
                                  />
                                </Box>
                                <Box w="90%">
                                  <Text bold color="coolGray.600">
                                    {candidate.name || 'Não Definido.'}
                                  </Text>
                                </Box>
                              </HStack>

                              <Box w="30%">
                                <Text bold color="coolGray.600">
                                  {new Intl.NumberFormat('pt-BR').format(candidate.numberOfVotes)}
                                </Text>
                              </Box>
                            </HStack>
                          )
                        }}
                      />
                    </Box>)
                  })}

                  {/* END BOX DE CANDIDATO */}
                </HStack>
              </ScrollView>
            </Box>
            {nameModal && <Box
              background={colorMode === 'dark' ? 'coolGray.800' : 'coolGray.50'}
              w="100%"
              maxH={'100%'}
              minH={Dimensions.get('window').height - (Dimensions.get('window').height * 58 / 100)}
              paddingY={'3'}
              paddingX={'3'}
              position={'absolute'}
              left={'0'}
              bottom={Dimensions.get('screen').height - (Dimensions.get('screen').height * 92 / 100)}
              election={999}
              zIndex={999}>
              <Pressable
                zIndex={1}
                elevation={1}
                position='absolute'
                right={7}
                top={7}
                onPress={() => setNameModal(false)}>
                <MCIcons name='close' size={30} />
              </Pressable>
              <VStack justifyContent={'space-between'} h={'100%'}>
                <Heading >Nome do candidato</Heading>
                <Box>
                  <FormControl>
                    <FormControl.Label>Nome</FormControl.Label>
                    <Input value={tempNameEditor.name} onChangeText={(txt) => {
                      setTempNameEditor(val => ({
                        ...val,
                        name: txt
                      }))
                    }} />
                  </FormControl>
                </Box>
                <Box alignItems={'flex-end'}>
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
                        const jIx = jobData.findIndex(jj => jj.carg === tempNameEditor.carg)
                        if (jIx > -1) {
                          console.log(jobData[jIx])
                          const cni = jobData[jIx].candidates.findIndex(cn => cn.number === tempNameEditor.number)
                          if (cni > -1) {
                            jobData[jIx].candidates[cni].name = tempNameEditor.name

                            submit(tempNameEditor)
                          }
                        }
                        setNameModal(false);
                      }}
                    >
                      <HStack justifyContent={'center'} alignItems={'center'}>
                        <MCIcons name='content-save' size={16} color={'white'} />
                        <Text color={'coolGray.50'} marginLeft={'3'}>Salvar</Text>
                      </HStack>


                    </Button>
                  </Button.Group>
                </Box>
              </VStack>

            </Box>}
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
