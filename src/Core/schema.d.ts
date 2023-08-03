/**
QRBU:1:1
VRQR:1.5
VRCH:20180830
ORIG:VOTA
ORLC:LEG
PROC:223
DTPL:20181028
PLEI:229
TURN:2
FASE:O
UNFE:ZZ
MUNI:30627
ZONA:1
SECA:1769
AGRE:1791
IDUE:1542886
IDCA:692980847361227766897949
VERS:6.32.0.4
LOCA:1023
APTO:799
COMP:339
FALT:460
DTAB:20181028
HRAB:080000
DTFC:20181028
HRFC:171005
IDEL:296
CARG:1
TIPO:0
VERC:201810111030
13:45
17:261
APTA:799
NOMI:306
BRAN:20
NULO:13
TOTC:339
HASH:97D6F28B66E5DA5B71C04FE2EEF9484FC1C791B26838DDB7CC2F5705A8573BFA47999C5723F66AE70FEFF561737574CEB38E041A1C887C6D25DEA07965486E12
ASSI:CE655E1D3FE765E1BA17D6CEE62B33E2FAB7167C0BCCB53008891BE587D588086D15F65E34AA6ECAFB39275785DDCBBD4382BC873B9020943C3BE5EB711C4B08
 */

//----------------------------------------------------------------------//
// INTERFACE DE REFERÊNCIA 
//----------------------------------------------------------------------//

interface BuContent {
    /** Cabeçalho do boletim de urna */
    qrbu: string // padrão n:x (n= numero do qrCode, x=total de qrCodes)
    vrqr: string // padrão n.y 
    vrch: number // numero da versão da chave utilizada da assinatura
    orig: string // origem do boletim de urna (Vota, RED, SA)
    orlc: string // origem da configuração do processo eleitoral (LEG - eleição legal, COM eleição Comunitaria)
    proc: number // numero do processo eleitoral
    dtpl: Date   // data do pleito formato = ano/mes/dia
    plei: number // numero do pleito
    turn: number // numero do turno (1 = pri.turno, 2= seg.turno)
    fase: string // fase de dados (O - oficial; S - simulado; T - treinamento)
    unfe: string // sigla do UF. ZZ para exterior
    muni: number // numero do municipio
    zona: number // numero da zona eleitoral
    seca: number // numero da seção eleitoral
    agre: string // numero das seções agregadas separadas por ponto (ex: nnnn.nnnn)
    idue: number // numero de serie da urna
    idca: number // código de identificação da carga (24 dig)
    vers: string // texto variavel com a versão do software (somente numeros e pontos)
    /** Cabeçalho do boletim de urna – campos exclusivos do Vota e do RED */
    loca: number // numero do local de cotação
    apto: number // quantidade de elitores aptos
    comp: number // quantidade de eleitores que compareceram para votar
    falt: number // quantidade de eleitores faltosos.
    hbma: number // Quantidade de eleitores habilitados por ano de nascimento. (diferente do "habilitados por ano nascimento")
    dtab: string // Data de abertura da urna (formato ano/mes/dia)
    hrab: string // Hora de abertura da urba (formato hora/minuto/segundo) 
    dtfc: string // Data de fechamento da urna (formato ano/mes/dia)
    hrfc: string // Hora de fechamento da urba (formato hora/minuto/segundo) 
    /** Cabeçalho do boletim de urna – campos exclusivos do SA */
    junt: number // Numero da junta apuradora.
    turm: number // numero da turma apuradora
    /** Cabeçalho do boletim de urna – campos exclusivos do SA e do RED */
    dtem: string // Data de emissão do boletim de urna (formato ano/mes/dia)
    hrem: string // hora de emissão do boletim de urna (formato hora/minuto/segundo) 
    /** Cabeçalho da eleição – incluído para cada eleição */
    idel: number // código da eleição
    majo: number // numero de votos nos cargos majoritários - campo exclusivo do SA
    prop: number // numero doe votos nos cargos porporcionais - campo exclusivo do SA
    /** Cabeçalho do cargo – incluído para cada cargo sendo apurado */
    carg: number // código do cargo
    tipo: number // tipo: 0 - majoritário; 1 - Proporcional; 2 - Consulta
    verc: number // versão do pacote de dados de candidatos/consulta
    /** Cabeçalho do partido – incluído para cada partido com votação para o cargo */
    part: number // numero do partidp
    legp: number // quantidade de votos de legenda para o partido
    totp: number // total de cotos apurados para o partido
    /** Votação do candidato ou da resposta – incluído para cada candidato ou resposta 
     * que recebeu votos, agrupados pelo cargo (majoritário ou consulta) 
     * ou pelo partido (proporcional) */
    [candidate: number]: number //Número do candidato ou resposta, seguido da quantidade de votos que recebeu.
    /** Resumo do cargo – incluído para cada cargo apurado  */
    apta: number // qunatidade de eleitores aptros para votar no cargo
    nomi: number // quantidade de votos nominais para o cargo.
    legc: number // quantidade de votos de legenda par ao cargo. (opcional - só incluódo para cargos proporcionais)
    bran: number // quantidade de votos em branco para o cargo.
    nulo: number // quantidade de votos nulo para o cargo.
    totc: number // total de votos apurados para o cargos.
    /** Segurança */
    hash: string // hash da seção de conteúdo do boletim. Ao final de cada QR code, virá um hash cumulativo aos dados de todos os anteriores.
    assi: stirng // assinatura difital Ed25519 a partir do último hash (incluído somente no último qrCode.)

}
//----------------------------------------------------------------------//
// FIM DA REFERENCIA
//----------------------------------------------------------------------//

interface BuCandidatesName{
    id: string
    number: number,
    name: string
}

interface JobData {
    /** Cabeçalho do cargo – incluído para cada cargo sendo apurado */
    carg: number // código do cargo
    tipo: number // tipo: 0 - majoritário; 1 - Proporcional; 2 - Consulta
    verc: number // versão do pacote de dados de candidatos/consulta
    /** Cabeçalho do partido – incluído para cada partido com votação para o cargo */
    part: number // numero do partido
    legp: number // quantidade de votos de legenda para o partido
    totp: number // total de cotos apurados para o partido
    /** Votação do candidato ou da resposta – incluído para cada candidato ou resposta 
     * que recebeu votos, agrupados pelo cargo (majoritário ou consulta) 
     * ou pelo partido (proporcional) */
    [candidate: number]: number //Número do candidato ou resposta, seguido da quantidade de votos que recebeu.
    /** Resumo do cargo – incluído para cada cargo apurado  */
    apta: number // qunatidade de eleitores aptros para votar no cargo
    nomi: number // quantidade de votos nominais para o cargo.
    legc: number // quantidade de votos de legenda par ao cargo. (opcional - só incluódo para cargos proporcionais)
    bran: number // quantidade de votos em branco para o cargo.
    nulo: number // quantidade de votos nulo para o cargo.
    totc: number // total de votos apurados para o cargos.
}

interface BuContentParsed {
    /** Cabeçalho do boletim de urna */
    qrbu: string // padrão n:x (n= numero do qrCode, x=total de qrCodes)
    vrqr: string // padrão n.y 
    vrch: number // numero da versão da chave utilizada da assinatura
    orig: string // origem do boletim de urna (Vota, RED, SA)
    orlc: string // origem da configuração do processo eleitoral (LEG - eleição legal, COM eleição Comunitaria)
    proc: number // numero do processo eleitoral
    dtpl: Date   // data do pleito formato = ano/mes/dia
    plei: number // numero do pleito
    turn: number // numero do turno (1 = pri.turno, 2= seg.turno)
    fase: string // fase de dados (O - oficial; S - simulado; T - treinamento)
    unfe: string // sigla do UF. ZZ para exterior
    muni: number // numero do municipio
    zona: number // numero da zona eleitoral
    seca: number // numero da seção eleitoral
    agre: string // numero das seções agregadas separadas por ponto (ex: nnnn.nnnn)
    idue: number // numero de serie da urna
    idca: number // código de identificação da carga (24 dig)
    vers: string // texto variavel com a versão do software (somente numeros e pontos)
    /** Cabeçalho do boletim de urna – campos exclusivos do Vota e do RED */
    loca: number // numero do local de cotação
    apto: number // quantidade de elitores aptos
    comp: number // quantidade de eleitores que compareceram para votar
    falt: number // quantidade de eleitores faltosos.
    hbma: number // Quantidade de eleitores habilitados por ano de nascimento. (diferente do "habilitados por ano nascimento")
    dtab: string // Data de abertura da urna (formato ano/mes/dia)
    hrab: string // Hora de abertura da urba (formato hora/minuto/segundo) 
    dtfc: string // Data de fechamento da urna (formato ano/mes/dia)
    hrfc: string // Hora de fechamento da urba (formato hora/minuto/segundo) 
    /** Cabeçalho do boletim de urna – campos exclusivos do SA */
    junt: number // Numero da junta apuradora.
    turm: number // numero da turma apuradora
    /** Cabeçalho do boletim de urna – campos exclusivos do SA e do RED */
    dtem: string // Data de emissão do boletim de urna (formato ano/mes/dia)
    hrem: string // hora de emissão do boletim de urna (formato hora/minuto/segundo) 
    /** Cabeçalho da eleição – incluído para cada eleição */
    idel: number // código da eleição
    majo: number // numero de votos nos cargos majoritários - campo exclusivo do SA
    prop: number // numero doe votos nos cargos porporcionais - campo exclusivo do SA
    jobData: JobData[]//Dados separados para cada cargo

}

//Converter dados do BU em objeto e inserir no buData
//Obter algumas informações do objeto do BU para EletronicUrn
interface EletronicUrn {
    id: string
    hash: string //utilizado para identificar a sequencia de QRCodes já inseridos para evitar duplicatas.
    eid: string //identificador do pleito 
    qntBus: number // quantidades de arquivos de bu padrão QRBU:1:n, sendo 'n' a quantidade de qrcodes adicionais
    buRawData: string[]
    buContent: BuContentParsed
    candidatesName: BuCandidatesName[]
}



interface Elections {
    eid: string;
    createdDate: Date,
    active: boolean,
    year: number;
    shift: number;
}

