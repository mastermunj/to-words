"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const af_ZA_1 = __importDefault(require("./af-ZA"));
const ar_AE_1 = __importDefault(require("./ar-AE"));
const ar_MA_1 = __importDefault(require("./ar-MA"));
const ar_SA_1 = __importDefault(require("./ar-SA"));
const be_BY_1 = __importDefault(require("./be-BY"));
const bg_BG_1 = __importDefault(require("./bg-BG"));
const bn_IN_1 = __importDefault(require("./bn-IN"));
const ca_ES_1 = __importDefault(require("./ca-ES"));
const cs_CZ_1 = __importDefault(require("./cs-CZ"));
const da_DK_1 = __importDefault(require("./da-DK"));
const de_DE_1 = __importDefault(require("./de-DE"));
const ee_EE_1 = __importDefault(require("./ee-EE"));
const en_AE_1 = __importDefault(require("./en-AE"));
const en_AU_1 = __importDefault(require("./en-AU"));
const en_BD_1 = __importDefault(require("./en-BD"));
const en_CA_1 = __importDefault(require("./en-CA"));
const en_GB_1 = __importDefault(require("./en-GB"));
const en_GH_1 = __importDefault(require("./en-GH"));
const en_IE_1 = __importDefault(require("./en-IE"));
const en_IN_1 = __importDefault(require("./en-IN"));
const en_KE_1 = __importDefault(require("./en-KE"));
const en_MA_1 = __importDefault(require("./en-MA"));
const en_MM_1 = __importDefault(require("./en-MM"));
const en_MU_1 = __importDefault(require("./en-MU"));
const en_MY_1 = __importDefault(require("./en-MY"));
const en_NG_1 = __importDefault(require("./en-NG"));
const en_NP_1 = __importDefault(require("./en-NP"));
const en_NZ_1 = __importDefault(require("./en-NZ"));
const en_OM_1 = __importDefault(require("./en-OM"));
const en_PH_1 = __importDefault(require("./en-PH"));
const en_PK_1 = __importDefault(require("./en-PK"));
const en_SA_1 = __importDefault(require("./en-SA"));
const en_SG_1 = __importDefault(require("./en-SG"));
const en_US_1 = __importDefault(require("./en-US"));
const en_ZA_1 = __importDefault(require("./en-ZA"));
const es_AR_1 = __importDefault(require("./es-AR"));
const es_ES_1 = __importDefault(require("./es-ES"));
const es_MX_1 = __importDefault(require("./es-MX"));
const es_US_1 = __importDefault(require("./es-US"));
const fa_IR_1 = __importDefault(require("./fa-IR"));
const fi_FI_1 = __importDefault(require("./fi-FI"));
const fr_BE_1 = __importDefault(require("./fr-BE"));
const fr_FR_1 = __importDefault(require("./fr-FR"));
const fr_MA_1 = __importDefault(require("./fr-MA"));
const fr_SA_1 = __importDefault(require("./fr-SA"));
const gu_IN_1 = __importDefault(require("./gu-IN"));
const ha_NG_1 = __importDefault(require("./ha-NG"));
const he_IL_1 = __importDefault(require("./he-IL"));
const hi_IN_1 = __importDefault(require("./hi-IN"));
const hr_HR_1 = __importDefault(require("./hr-HR"));
const hu_HU_1 = __importDefault(require("./hu-HU"));
const id_ID_1 = __importDefault(require("./id-ID"));
const is_IS_1 = __importDefault(require("./is-IS"));
const it_IT_1 = __importDefault(require("./it-IT"));
const kn_IN_1 = __importDefault(require("./kn-IN"));
const ko_KR_1 = __importDefault(require("./ko-KR"));
const lt_LT_1 = __importDefault(require("./lt-LT"));
const lv_LV_1 = __importDefault(require("./lv-LV"));
const mr_IN_1 = __importDefault(require("./mr-IN"));
const ms_MY_1 = __importDefault(require("./ms-MY"));
const nb_NO_1 = __importDefault(require("./nb-NO"));
const nl_NL_1 = __importDefault(require("./nl-NL"));
const nl_SR_1 = __importDefault(require("./nl-SR"));
const np_NP_1 = __importDefault(require("./np-NP"));
const pa_IN_1 = __importDefault(require("./pa-IN"));
const pl_PL_1 = __importDefault(require("./pl-PL"));
const pt_BR_1 = __importDefault(require("./pt-BR"));
const pt_PT_1 = __importDefault(require("./pt-PT"));
const ru_RU_1 = __importDefault(require("./ru-RU"));
const sk_SK_1 = __importDefault(require("./sk-SK"));
const sl_SI_1 = __importDefault(require("./sl-SI"));
const sq_AL_1 = __importDefault(require("./sq-AL"));
const sr_RS_1 = __importDefault(require("./sr-RS"));
const sv_SE_1 = __importDefault(require("./sv-SE"));
const ta_IN_1 = __importDefault(require("./ta-IN"));
const te_IN_1 = __importDefault(require("./te-IN"));
const th_TH_1 = __importDefault(require("./th-TH"));
const tr_TR_1 = __importDefault(require("./tr-TR"));
const uk_UA_1 = __importDefault(require("./uk-UA"));
const ur_PK_1 = __importDefault(require("./ur-PK"));
const el_GR_1 = __importDefault(require("./el-GR"));
const es_VE_1 = __importDefault(require("./es-VE"));
const fil_PH_1 = __importDefault(require("./fil-PH"));
const ro_RO_1 = __importDefault(require("./ro-RO"));
const sw_KE_1 = __importDefault(require("./sw-KE"));
const vi_VN_1 = __importDefault(require("./vi-VN"));
const LOCALES = {
    'af-ZA': af_ZA_1.default,
    'ar-AE': ar_AE_1.default,
    'ar-MA': ar_MA_1.default,
    'ar-SA': ar_SA_1.default,
    'be-BY': be_BY_1.default,
    'bg-BG': bg_BG_1.default,
    'bn-IN': bn_IN_1.default,
    'ca-ES': ca_ES_1.default,
    'cs-CZ': cs_CZ_1.default,
    'da-DK': da_DK_1.default,
    'de-DE': de_DE_1.default,
    'ee-EE': ee_EE_1.default,
    'el-GR': el_GR_1.default,
    'en-AE': en_AE_1.default,
    'en-AU': en_AU_1.default,
    'en-BD': en_BD_1.default,
    'en-CA': en_CA_1.default,
    'en-GB': en_GB_1.default,
    'en-GH': en_GH_1.default,
    'en-IE': en_IE_1.default,
    'en-IN': en_IN_1.default,
    'en-KE': en_KE_1.default,
    'en-MA': en_MA_1.default,
    'en-MM': en_MM_1.default,
    'en-MU': en_MU_1.default,
    'en-MY': en_MY_1.default,
    'en-NG': en_NG_1.default,
    'en-NP': en_NP_1.default,
    'en-NZ': en_NZ_1.default,
    'en-OM': en_OM_1.default,
    'en-PH': en_PH_1.default,
    'en-PK': en_PK_1.default,
    'en-SA': en_SA_1.default,
    'en-SG': en_SG_1.default,
    'en-US': en_US_1.default,
    'en-ZA': en_ZA_1.default,
    'es-AR': es_AR_1.default,
    'es-ES': es_ES_1.default,
    'es-MX': es_MX_1.default,
    'es-US': es_US_1.default,
    'fa-IR': fa_IR_1.default,
    'fi-FI': fi_FI_1.default,
    'fil-PH': fil_PH_1.default,
    'fr-BE': fr_BE_1.default,
    'fr-FR': fr_FR_1.default,
    'fr-MA': fr_MA_1.default,
    'fr-SA': fr_SA_1.default,
    'gu-IN': gu_IN_1.default,
    'ha-NG': ha_NG_1.default,
    'he-IL': he_IL_1.default,
    'hi-IN': hi_IN_1.default,
    'hr-HR': hr_HR_1.default,
    'hu-HU': hu_HU_1.default,
    'id-ID': id_ID_1.default,
    'is-IS': is_IS_1.default,
    'it-IT': it_IT_1.default,
    'kn-IN': kn_IN_1.default,
    'ko-KR': ko_KR_1.default,
    'lt-LT': lt_LT_1.default,
    'lv-LV': lv_LV_1.default,
    'mr-IN': mr_IN_1.default,
    'ms-MY': ms_MY_1.default,
    'nb-NO': nb_NO_1.default,
    'nl-NL': nl_NL_1.default,
    'nl-SR': nl_SR_1.default,
    'np-NP': np_NP_1.default,
    'pa-IN': pa_IN_1.default,
    'pl-PL': pl_PL_1.default,
    'pt-BR': pt_BR_1.default,
    'pt-PT': pt_PT_1.default,
    'ro-RO': ro_RO_1.default,
    'ru-RU': ru_RU_1.default,
    'sk-SK': sk_SK_1.default,
    'sl-SI': sl_SI_1.default,
    'sq-AL': sq_AL_1.default,
    'sr-RS': sr_RS_1.default,
    'sv-SE': sv_SE_1.default,
    'sw-KE': sw_KE_1.default,
    'ta-IN': ta_IN_1.default,
    'te-IN': te_IN_1.default,
    'th-TH': th_TH_1.default,
    'tr-TR': tr_TR_1.default,
    'uk-UA': uk_UA_1.default,
    'ur-PK': ur_PK_1.default,
    'vi-VN': vi_VN_1.default,
    'es-VE': es_VE_1.default,
};
exports.default = LOCALES;
