import React, { useCallback, useEffect, useState } from 'react';
import { PermissionsAndroid, Dimensions, Pressable, useColorScheme } from 'react-native';
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
  useToast,
  CloseIcon
} from 'native-base';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as XLSX from 'xlsx';
import { AppBar, SplashScreen } from '../Components';
import { getElections, getElectronicUrns } from '../Core/Services';
import { JobNames } from '../Core/Constants';
import ToastAlert from '../Components/ToastAlert';
import { writeFile, DownloadDirectoryPath, mkdir } from "react-native-fs";

const BU_SHEETS_PATH = DownloadDirectoryPath + "/qrvoto";

export default function Poll({ navigation, route }) {
  const colorMode = useColorScheme()
  const toast = useToast()
  const { params } = route
  const [loading, setLoading] = useState(true)
  const [loadingSheetGeneration, setLoadingSheetGeneration] = useState(false)
  const [status, setStatus] = useState('OK')
  const [nameModal, setNameModal] = useState(false);
  const [totalBus, setTotalBus] = useState(0);
  const [buContentByState, setBuContentByState] = useState([])

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
        let buArr = [];
        for (const urn of dataUrns.docs) {
          const urnContent = urn.data()
          const buContent = urnContent.buContent;
          const candidatesName = urnContent.candidatesName
          const jobs = buContent.jobData

          //Separação de BUs por UF e zona.

          // console.log(buContent, '--buContent')

          const ufIndex = buArr.findIndex(f => {
            return f.unfe === buContent.unfe
          })

          if (ufIndex !== -1) {

            const zoneIndex = buArr[ufIndex].zones.findIndex(f => {
              return f.zoneNumber === buContent.zona
            })
            if (zoneIndex !== -1) {
              buArr[ufIndex].zones[zoneIndex].buContent.push(buContent);
            } else {
              buArr[ufIndex].zones.push(
                {
                  zoneNumber: buContent.zona,
                  buContent: [buContent],
                  candidatesName
                }
              )

            }

          } else {
            buArr.push({
              unfe: buContent.unfe,
              zones: [
                {
                  zoneNumber: buContent.zona,
                  buContent: [buContent],
                  candidatesName
                }
              ]
            })
          }


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
        setBuContentByState(buArr);
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

  const getCandidaetesOnlyFromBu = (data) => {
    const objData = Object.entries(data);
    let rowObject = []

    objData.forEach(od => {
      if (/^\d+$/.test(od[0])) {
        rowObject = { ...rowObject, [od[0]]: parseInt(od[1]) };
      }
    })

    if (Object.keys(rowObject).length === 0) {
      return false;
    } else {
      return rowObject
    }
  }

  const handleGenerateFile = async () => {
    setLoadingSheetGeneration(true);

    let candidatesData = jobData.map(jd => {
      return jd.candidates.map(c => {
        return {
          [jd.carg + '-number']: c.number,
          [jd.carg + '-name']: c.name,
          [jd.carg + '-numberOfVotes']: c.numberOfVotes,
        }
      })
    })

    let longerIndex = candidatesData
      .map(a => a.length)
      .indexOf(Math.max(...candidatesData.map(a => a.length)));



    let rows = [{}]
    for (let i = 0; i < candidatesData[longerIndex].length; i++) {
      let row = {};
      for (let j = 0; j < candidatesData.length; j++) {
        if (candidatesData[j] && candidatesData[j][i]) {
          row = Object.assign({ ...candidatesData[j][i] }, row)
        }
      }
      rows.push(row);
    }
    /* fix headers */

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();


    let topTitle = [];
    let bottomTitle = [];

    jobData.forEach(jd => {
      topTitle = [JobNames[jd.carg], JobNames[jd.carg], JobNames[jd.carg], ...topTitle];
      bottomTitle = [...bottomTitle, "Número", "Nome", "Votos"];
    })

    XLSX.utils.sheet_add_aoa(worksheet, [topTitle, bottomTitle], { origin: "A1" });
    XLSX.utils.book_append_sheet(workbook, worksheet, "GERAL");

    let merge = jobData.map((j, i) => {
      const endIndex = i + 1;

      let sc = i === 0 ? 0 : ((3 * i))
      let se = (endIndex * 3) - 1;
      return {
        s: { r: 0, c: sc },
        e: { r: 0, c: se }
      }
    })
    worksheet['!merges'] = merge;

    // Abas de zona
    if (buContentByState.length) {
      let zonesRows = buContentByState.map(buS => {
        if (buS.zones && buS.zones.length) {
          let zRowsArr = buS.zones.map(z => {
            // console.log(z.buContent[0]['jobData'], 'z')


            let zoneRowData = [];
            if (z.buContent && z.buContent.length) {
              z.buContent.forEach(buC => {
                if (buC) {
                  let sectionIndex = -1;

                  if (zoneRowData.length !== 0) {
                    sectionIndex = zoneRowData.findIndex(f => {
                      return f.seca === buC.seca
                    })
                  }

                  if (sectionIndex === -1 || zoneRowData.length === 0) {
                    // Primeiro sessão do array da zona
                    if (buC['jobData']) {
                      let zrnJobData = {};
                      buC['jobData'].forEach(jd => {
                        if (getCandidaetesOnlyFromBu(jd)) {
                          zrnJobData = { ...zrnJobData, [jd.carg]: getCandidaetesOnlyFromBu(jd) }
                        }
                      })
                      if (Object.keys(zrnJobData).length !== 0) {
                        zoneRowData.push(
                          {
                            seca: buC.seca,
                            jobData: zrnJobData
                          }
                        )
                      }
                    }
                  } else {
                    // Soma quantidade de votos
                    buC['jobData'].forEach(jd => {
                      console.log(jd.carg, 'jd')
                      if (getCandidaetesOnlyFromBu(jd)) {
                        Object.entries(getCandidaetesOnlyFromBu(jd)).forEach(jdEntries => {
                          zoneRowData[sectionIndex].jobData[jd.carg][jdEntries[0]] += jdEntries[1];
                        })
                      }
                    })
                  }
                }
              })
            }
            // console.log(buS, 'bus')
            return {
              zoneName: buS.unfe + " zona " + z.zoneNumber,
              zoneResults: zoneRowData,
              // cadidates: z.candidatesName
            }
          })

          return zRowsArr;
        } else return []
      })
      zonesRows = [].concat.apply([], [...zonesRows]);

      zonesRows.forEach(zr => {
        let tableZoneRows = [];
        // console.log(zr, 'zr')
        zr.zoneResults.forEach((zoneResult) => {
          // console.log(zoneResult, 'result')
          if (zoneResult.jobData) {
            Object.entries(zoneResult.jobData).forEach((job) => {
              Object.entries(job[1]).forEach((jb, jobIndex) => {
                const candidateNumberIndex = tableZoneRows.findIndex(f => {
                  return f['0-n'] === jb[0]
                })

                // if (jobIndex === 0) {
                //   tableZoneRows.push({ '0-n': JobNames[job[0]] })
                // }

                if (tableZoneRows.length === 0 || candidateNumberIndex === -1) {
                  let candidateVoteLine = {
                    '0-n': jb[0],
                    '0-name': '',
                    [zoneResult.seca]: jb[1],
                    total: jb[1]
                  }
                  tableZoneRows.push(candidateVoteLine);
                } else {
                  tableZoneRows[candidateNumberIndex] = {
                    ...tableZoneRows[candidateNumberIndex],
                    [zoneResult.seca]: jb[1],
                    total: tableZoneRows[candidateNumberIndex]['total'] + jb[1]
                  }
                }
              })
            })
          }
        })
        console.log(tableZoneRows, '--tableZoneRows')
        const worksheetZone = XLSX.utils.json_to_sheet(tableZoneRows);
        XLSX.utils.book_append_sheet(workbook, worksheetZone, zr.zoneName);


      })
    }


    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Permission",
        message: "Permissão de leitura é necessária."
      }
    );

    if (granted) {

      mkdir(BU_SHEETS_PATH).catch((error) => { console.log(error) })

      /* create an XLSX file and try to save to Presidents.xlsx */
      const bstr = XLSX.write(workbook, { type: 'binary', bookType: "xlsx" });
      try {
        writeFile(BU_SHEETS_PATH + "/pleito_" + pollData['year'] + "_turno_" + pollData['turn'] + ".xlsx", bstr, "ascii")
          .then(() => {
            setLoadingSheetGeneration(false);
            navigation.navigate("SheetGenerated")
          })

      } catch (err) {
        if (!toast.isActive('infoQrBu')) {
          toast.show({
            id: 'infoQrBu',
            placement: "top",
            render: () => ToastAlert({
              toastInstance: toast,
              variant: "left-accent",
              status: "error",
              isClosable: true,
              title: 'Erro de Validação',
              description: 'Ocorreu um erro na escrita da planilha, tente novamente mais tarde.',
            })
          })
        }
        console.log(err, 'write err')
      }
    } else {
      toast.show({
        id: 'infoQrBu',
        placement: "top",
        render: () => ToastAlert({
          toastInstance: toast,
          variant: "left-accent",
          status: "error",
          isClosable: true,
          title: 'Erro de Validação',
          description: 'A permissão de acesso ao storage é necessária para a criação da planilha.',
        })
      })

    }

  }

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
  if (loadingSheetGeneration) {
    return <SplashScreen description="Coletando dados e gerando planilha" />
  } else {
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
                      <Button bg="green.400" leftIcon={<ArrowDownIcon color='coolGray.50' />} onPress={handleGenerateFile}>
                        Baixar Totalizações
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Center>
              <Box p="10px">
                <Heading p="10px" color="coolGray.600">
                  Candidatos
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
                background={'coolGray.50'}
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
                  <CloseIcon />
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

}
