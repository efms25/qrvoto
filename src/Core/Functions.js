import EncryptedStorage from "react-native-encrypted-storage";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { RegexpJobsData, RegxpBUHeader, RegxpBuHeaderForEachElection, RegxpBuHeaderSA, RegxpBuHeaderSaRed, RegxpBuHeaderVoteRed, RegxpSecurity } from "./Regexp";


async function storeDataEncrypted(key, value, errMessage) {
  try {
    await EncryptedStorage.setItem(
      key,
      JSON.stringify(value)
    );
  }
  catch (e) {
    Toast.show({
      type: "error",
      text1: "Ocorreu um erro",
      text2: errMessage || "Ocorreu um erro na tentativa de salvar os dados em segurança!"
    })
  }
}

async function delDataEncrypted(key, errMessage) {
  try {
    await EncryptedStorage.removeItem(key)
  }
  catch (e) {
    Toast.show({
      type: "error",
      text1: "Ocorreu um erro",
      text2: errMessage || "Ocorreu um erro na tentativa de remover os dados em segurança!"
    })
  }
}

async function retrieveDataEncrypted(key, errMessage) {
  try {
    return await EncryptedStorage.getItem(key)
  }
  catch (e) {
    Toast.show({
      type: "error",
      text1: "Ocorreu um erro",
      text2: errMessage || "Ocorreu um erro na tentativa de obter os dados de segurança!"
    })
    return null;
  }
}

function parseStringFragment(content) {
  const value = []
  if (content) {
    value.push(...content.split(" "))
  }
  return value
}
function parseContentBuToValue(input) {
  const objectValues = {}

  if (input) {
    for (const item of input) {
      const key = item.match(/[a-z0-9]+/i)
      const val = item.match(/:[a-z0-9:.]+/i)
      if (key != null) {
        const value = val[0] ? val[0].substring(1) : ''
        objectValues[key[0].toLowerCase()] = value
      }

    }
  }
  return objectValues
}

function buResolution(stringContent) {
  let mainObject = {}
  try {
    const arrayDataOfBuFragParsed = parseStringFragment(stringContent)
    const result = parseContentBuToValue(arrayDataOfBuFragParsed)
    mainObject = result
  } catch (e) {
    Toast.show({
      type: "error",
      text1: "Erro na análise do BU",
      text2: "Ocorreu um erro na tentativa de interpretar os dados do BU. "
    })
    return {}
  }
  return mainObject
}

function buQrCount(buStringInput) {
  const value = {
    current: 0,
    total: 0
  }
  const result = buResolution(buStringInput)
  if (result.qrbu) {
    const checkValue = result.qrbu.split(":")
    value.current = parseInt(checkValue[0])
    value.total = parseInt(checkValue[1])
  }
  return value
}

function buExtractHeader(bu) {
  let buContentData = {
    jobData: []
  }

  const buReadHeader = bu.match(RegxpBUHeader)
  const buReadHeaderVoteRed = bu.match(RegxpBuHeaderVoteRed)
  const buReadHeaderSA = bu.match(RegxpBuHeaderSA)
  const buReadHeaderSaRed = bu.match(RegxpBuHeaderSaRed)
  const buReadHeaderForElection = bu.match(RegxpBuHeaderForEachElection)
  const buReadSecurity = bu.match(RegxpSecurity)

  if (buReadHeader != null) {
    const buHeader = buResolution(buReadHeader[0])
    buContentData = {
      ...buContentData,
      ...buHeader
    }
  }

  if (buReadHeaderVoteRed != null) {
    const buHeaderVoteRed = buResolution(buReadHeaderVoteRed[0])
    buContentData = {
      ...buContentData,
      ...buHeaderVoteRed
    }
  }

  if (buReadHeaderSA != null) {
    const buHeaderSa = buResolution(buReadHeaderSA[0])
    buContentData = {
      ...buContentData,
      ...buHeaderSa
    }
  }

  if (buReadHeaderSaRed != null) {
    const buHeaderSaRed = buResolution(buReadHeaderSaRed[0])
    buContentData = {
      ...buContentData,
      ...buHeaderSaRed
    }
  }

  if (buReadHeaderForElection != null) {
    const buHeaderForElection = buResolution(buReadHeaderForElection[0])
    buContentData = {
      ...buContentData,
      ...buHeaderForElection
    }
  }

  if (buReadSecurity != null) {
    const buSecurity = buResolution(buReadSecurity[0])
    buContentData = {
      ...buContentData,
      ...buSecurity
    }
  }

  return buContentData
}


function buExtractJobs(bu) {
  const jobsContent = bu.match(RegexpJobsData)

  if (jobsContent != null) {
    const jobsResolution = buResolution(jobsContent[0])
    return jobsResolution
  }
  return {}
}

export { buExtractJobs, buExtractHeader, buQrCount, buResolution, parseContentBuToValue, storeDataEncrypted, retrieveDataEncrypted, delDataEncrypted, parseStringFragment }