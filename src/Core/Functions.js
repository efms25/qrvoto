import EncryptedStorage from "react-native-encrypted-storage";
import { Toast } from "react-native-toast-message/lib/src/Toast";


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

export { storeDataEncrypted, retrieveDataEncrypted, delDataEncrypted }