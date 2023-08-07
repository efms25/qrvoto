export const RegxpBUHeader = /((QRBU:[0-9]+:[0-9]+ )?(VRQR:[0-9.]+ )?(VRCH:[0-9]+ )?(ORIG:[a-z]+ )?(ORLC:[a-z]+ )?(PROC:[0-9]+ )?(DTPL:[0-9]+ )?(PLEI:[0-9]+ )?(TURN:[0-9]+ )?(FASE:[a-z] )?(UNFE:[a-z]{2} )?(MUNI:[0-9]+ )?(ZONA:[0-9]+ )?(SECA:[0-9]+ )?(AGRE:[0-9.]+ )?(IDUE:[0-9]+ )?(IDCA:[0-9]+ )?(VERS:[0-9.]+ )?)/ig
export const RegxpBuHeaderVoteRed = /((LOCA:[0-9]+ )?(APTO:[0-9]+ )?(COMP:[0-9]+ )?(FALT:[0-9]+ )?(HBMA:[0-9]+ )?(DTAB:[0-9]+ )?(HRAB:[0-9]+ )?(DTFC:[0-9]+ )?(HRFC:[0-9]+ )?)/ig
export const RegxpBuHeaderSA = /((JUNT:[0-9]+ )?(TURM:[0-9]+ )?)/ig
export const RegxpBuHeaderSaRed = /((DTEM:[0-9]+ )?(HREM:[0-9]+ )?)/ig
export const RegxpBuHeaderForEachElection = /((IDEL:[0-9]+ )?(MAJO:[0-9]+ )?(PROP:[0-9]+ )?)/ig
// ---------- //
export const RegexpLeftPieceJob = /(?<=QRBU:[0-9]+:[0-9]+ VRQR:[0-9.]+ VRCH:[0-9]+ )(.*?)(?=( CARG:[0-9]+| HASH:[0-9a-z]+))/gi
export const RegexpJobsData = /CARG:[0-9]+ .* (?=HASH:[0-9a-z]+)?/gi
export const RegexpJobsFirstData = /^CARG:[0-9]+ (.*?)(?=(CARG:[0-9]+|HASH:[0-9a-z]+))|^CARG:[0-9]+ (.*)/gi
export const RegxpBUHeaderPost = /(QRBU:[0-9]+:[0-9]+ VRQR:[0-9.]+ VRCH:[0-9]+)/gi
// ---------- //
export const RegxpEstablishedPosition = /(CARG:[0-9]+ TIPO:[0-9]+ VERC:[0-9]+ (PART:[0-9]+ )?)/ig
export const RegxpVotingParty = /((LEGP:[0-9]+ )?(TOTP:[0-9]+ )?)/ig
export const RegxpCandidateReceivedvotes = /(([0-9]+:[0-9]+ )*)*/ig
export const RegxpJobSummary = /(APTA:[0-9]+ (NOMI:[0-9]+ )?(LEGC:[0-9]+ )?BRAN:[0-9]+ NULO:[0-9]+ TOTC:[0-9]+)/ig
// ---------- //

export const RegxpSecurity = /((HASH:[0-9a-z]+ )?(ASSI:[0-9a-z]+ ?)?)/ig