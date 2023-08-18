import firestore from '@react-native-firebase/firestore'
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import uuid from 'react-native-uuid'
import { RegexpJobsData, RegexpJobsFirstData, RegexpLeftPieceJob, RegxpBUHeaderPost, RegxpSecurity } from './Regexp';
import { buExtractHeader, buExtractJobs, buQrCount, buResolution } from './Functions';
import {
  ERROR_CANNOT_ADD_ELECTRONIC_URN_WITHOUT_HASH,
  ERROR_ELECTRONIC_URN_ALREADY_EXIST,
  ERROR_QR_CODE_RECEIVE_INVALID,
  SUCCESSFULLY_ELECTRONIC_URN_ADDED,
  ERROR_PERMISSION_DENIED,
  ERROR_ON_WRITE_ELECTRONIC_URN
} from './Constants';
const ElectionsCollection = firestore().collection("Elections");
const EletronicUrnCollection = firestore().collection("EletronicUrns")
const ElectionsCandidatesCollection = firestore().collection("ElectionsCandidates")

function getElectionsCandidates() {
  return ElectionsCandidatesCollection
}

function getElections() {
  return ElectionsCollection
}

function getElectronicUrns() {
  return EletronicUrnCollection
}

async function getElection(year, shift) {
  return ElectionsCollection
    .where(
      firestore.Filter.and(
        firestore.Filter("year", "==", year),
        firestore.Filter("shift", "==", shift)
      )
    ).get()
}

/**
 * Cadastra um novo pleito. 
 * 
 * Retorna o ID do pleito existente ou o recem criado caso não exista.
 * @param input - Objeto para cadastro, valores automaticos são criados caso não exista parametros.
 * @param {number} input.year - Ano do pleito 
 * @param {number} input.shift - Turno do pleito
 *  
 */
async function addElections(input) {
  try {
    const dataToSave = {
      uuid: uuid.v4(),
      createdDate: new Date(),
      active: true,
      year: input && input.year || (new Date()).getFullYear(),
      shift: input && input.shift || 1,
    }
    const checkElections = await getElection(dataToSave.year, dataToSave.shift)

    if (checkElections.docs.length === 0) {
      const resultAdd = await ElectionsCollection.add(dataToSave)
      if (resultAdd) {
        Toast.show({
          type: "success",
          text1: "Cadastro de Pleito",
          text2: "Pleito " + dataToSave.year + " cadastrado!"
        })
        return resultAdd.id
      }
    } else {
      const currentObject = checkElections.docs.find(doc => doc.year === dataToSave.year &&
        doc.shift === dataToSave.shift)

      if (currentObject != null) {
        return currentObject.id
      }
    }
    return null
  }
  catch (e) {
    Toast.show({
      type: 'error',
      text1: "Ocorreu um erro no cadastro do pleito!",
      text2: "Não foi possível cadastrar o pleito no momento, tente novamente mais tarde!"
    })
    return null
  }

}

function buResolutionQuantity(input) {
  const buResolutionResult = buResolution(input)
  const qntBus = buResolutionResult.qrbu.split(':')[1]
  return qntBus
}

/**
 * Adiciona um BU ao banco
 * @param {string[]} input - Lista de valores de cada QrCode Lido. 
 */
async function addElectrionUrn(input) {
  let firstAction = true
  let electionId = ""
  let buContentData = {}
  let buResolutionResult = null
  try {
    if (input == null || !Array.isArray(input)) {
      return ERROR_INPUT_BU_CANNOT_BY_EMPTY
    } else {
      const qrBuInfo = buQrCount(input[0])
      //-----------------------------------------------//
      // Cadastra o pleito se não existir e retona o id
      //-----------------------------------------------//
      if (firstAction) {
        firstAction = false
        buResolutionResult = buResolution(input[0])
        if (qrBuInfo.current === 1) {
          const de = buResolutionResult.dtpl
          const dateParsed = new Date(
            de.substring(0, 4) + '-' +
            de.substring(4, 6) + '-' +
            de.substring(6));
          const year = dateParsed.getFullYear()
          const shift = parseInt(buResolutionResult.turn)

          const election = await getElection(year, shift)

          if (election.docs.length === 0) {
            electionId = await addElections({
              year: year,
              shift: shift,
            })
          } else {
            electionId = election.docs[0].id
          }
        }
      }

      if (!buResolutionResult.qrBu && !buResolutionResult.hash) {
        return ERROR_QR_CODE_RECEIVE_INVALID;
      }

      // ---------------------------------------------//
      // Checa se o BU já está cadastrado analisando pelo HASH
      const checkBu = await EletronicUrnCollection
        .where('hash', '==', buResolutionResult.hash).get()

      if (checkBu.docs.length > 0) {
        return ERROR_ELECTRONIC_URN_ALREADY_EXIST
      } else {
        //Parse para INPUT com um(1) QRCode
        if (input.length > 0) {
          //   const content = buExtractHeader(input[0])
          //   buContentData = {
          //     ...content
          //   }
          //   //obtem os cargos e seus candidatos
          //   const jobs = buExtractJobs(input[0])
          //   buContentData.jobData.push(jobs)
          // } else {

          const content = buExtractHeader(input[0])
          buContentData = {
            ...content
          }
          //Parse para INPUT com multiplos (+1) QrCodes
          let fullConcatData = ""

          for (const buData of input) {
            //Checa fragmento de continuidade do qrcode anterior pelo 
            //numero do qrbu. Em algumas situações com mais de um QR-CODE
            //O restante do qrCode anterior pode ser colocado no proximo, logo 
            //a concatenação precisa obter o restante dos dados antes de pegar
            //o proximo cargo vindo do RegexpJobsData.
            if (buQrCount(buData).current > 1) {
              const getPieceLeft = buData.match(RegexpLeftPieceJob)
              if (getPieceLeft != null)
                fullConcatData += getPieceLeft[0] + " "
            }

            const dataJobsRead = buData.match(RegexpJobsData)
            if (dataJobsRead != null) {
              fullConcatData += dataJobsRead[0] + " "
            }

          }
          //Limpar dados inuteis para esse processo
          fullConcatData = fullConcatData.replace(RegxpBUHeaderPost, "").replace(RegxpSecurity, "")
          let continues = true
          const listOfItems = []
          do {
            const resultConcatGet = fullConcatData.match(RegexpJobsFirstData)
            if (resultConcatGet == null) {
              continues = false
            } else {
              listOfItems.push(resultConcatGet[0])
              fullConcatData = fullConcatData.replace(resultConcatGet[0], "")
            }
          } while (continues)

          for (const piece of listOfItems) {
            const pieceParsed = buResolution(piece)
            if (pieceParsed != null) {
              //console.log(pieceParsed)
              buContentData.jobData.push(pieceParsed)
            }
          }
        }
      }

      //Lista de nomes de candidatos ja no banco 
      const currentCandidatesList = await getElectionsCandidates()
        .where('eid', '==', electionId)
        .where('state', '==', buContentData.unfe)
        .get()


      //Montagem da lista de nomes dos candidatos
      const candidatesNames = []
      buContentData.jobData.forEach(item => {
        Object.keys(item).forEach(val => {
          if (/[0-9]+/.test(val)) {
            if (!candidatesNames.includes(val)) {
              const find = currentCandidatesList.docs.find(cd => cd.number === val)
              if (find == null) {
                const recheckList = candidatesNames.find(i => i.number === val)
                if (recheckList == null) {
                  candidatesNames.push({
                    state: buContentData.unfe,
                    eid: electionId,
                    number: val,
                    name: ""
                  })
                }
              }
            }
          }
        })
      })


      //Montagem do EletronicUrn Data
      const electronicUrn = {
        eid: electionId,
        hash: buResolutionResult.hash,
        qntBus: qrBuInfo.total,
        buRawData: input,
        buContent: buContentData,
      }
      if (electronicUrn.eid && electronicUrn.hash) {

        //Batch para candidatos
        if (candidatesNames.length > 0) {
          const firestoreBatch = firestore().batch()
          candidatesNames.forEach(doc => {
            const docRef = getElectionsCandidates().doc();
            firestoreBatch.set(docRef, doc);
          })
          firestoreBatch.commit()
        }

        await EletronicUrnCollection.add(electronicUrn)
        return SUCCESSFULLY_ELECTRONIC_URN_ADDED;

      } else {
        return ERROR_CANNOT_ADD_ELECTRONIC_URN_WITHOUT_HASH
      }
    }
  } catch (e) {
    if (e.code === "firestore/permission-denied") {
      return ERROR_PERMISSION_DENIED
    }
    return ERROR_ON_WRITE_ELECTRONIC_URN
  }
}

export { getElectionsCandidates, getElectronicUrns, getElections, addElections, addElectrionUrn }