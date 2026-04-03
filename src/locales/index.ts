import { type ConstructorOf, type LocaleInterface } from '../types.js';

import afZa from './af-ZA.js';
import amEt from './am-ET.js';
import arAe from './ar-AE.js';
import asIn from './as-IN.js';
import arLb from './ar-LB.js';
import arMa from './ar-MA.js';
import arSa from './ar-SA.js';
import azAz from './az-AZ.js';
import beBy from './be-BY.js';
import bgBg from './bg-BG.js';
import bnBd from './bn-BD.js';
import bnIn from './bn-IN.js';
import caEs from './ca-ES.js';
import csCz from './cs-CZ.js';
import daDk from './da-DK.js';
import deAt from './de-AT.js';
import deCh from './de-CH.js';
import deDe from './de-DE.js';
import eeEE from './ee-EE.js';
import enAe from './en-AE.js';
import enAu from './en-AU.js';
import enBd from './en-BD.js';
import enCa from './en-CA.js';
import enGb from './en-GB.js';
import enGh from './en-GH.js';
import enHk from './en-HK.js';
import enIe from './en-IE.js';
import enIn from './en-IN.js';
import enJm from './en-JM.js';
import enKe from './en-KE.js';
import enLk from './en-LK.js';
import enMa from './en-MA.js';
import enMm from './en-MM.js';
import enMu from './en-MU.js';
import enMy from './en-MY.js';
import enNg from './en-NG.js';
import enNp from './en-NP.js';
import enNz from './en-NZ.js';
import enOm from './en-OM.js';
import enPh from './en-PH.js';
import enPk from './en-PK.js';
import enSa from './en-SA.js';
import enSg from './en-SG.js';
import enTt from './en-TT.js';
import enTz from './en-TZ.js';
import enUg from './en-UG.js';
import enUs from './en-US.js';
import enZa from './en-ZA.js';
import enZw from './en-ZW.js';
import esAr from './es-AR.js';
import esCl from './es-CL.js';
import esCo from './es-CO.js';
import esEs from './es-ES.js';
import esMx from './es-MX.js';
import esUs from './es-US.js';
import faIr from './fa-IR.js';
import fiFi from './fi-FI.js';
import frBe from './fr-BE.js';
import frCa from './fr-CA.js';
import frCh from './fr-CH.js';
import frFr from './fr-FR.js';
import frMa from './fr-MA.js';
import frSa from './fr-SA.js';
import guIn from './gu-IN.js';
import haNg from './ha-NG.js';
import hboIl from './hbo-IL.js';
import heIl from './he-IL.js';
import hiIn from './hi-IN.js';
import hrHr from './hr-HR.js';
import huHu from './hu-HU.js';
import idId from './id-ID.js';
import igNg from './ig-NG.js';
import isIs from './is-IS.js';
import itIt from './it-IT.js';
import jaJp from './ja-JP.js';
import jvId from './jv-ID.js';
import kaGe from './ka-GE.js';
import knIn from './kn-IN.js';
import koKr from './ko-KR.js';
import ltLt from './lt-LT.js';
import lvLv from './lv-LV.js';
import mlIn from './ml-IN.js';
import mrIn from './mr-IN.js';
import msMy from './ms-MY.js';
import msSg from './ms-SG.js';
import nbNo from './nb-NO.js';
import nlNl from './nl-NL.js';
import nlSr from './nl-SR.js';
import npNp from './np-NP.js';
import orIn from './or-IN.js';
import paIn from './pa-IN.js';
import plPl from './pl-PL.js';
import ptAo from './pt-AO.js';
import ptBR from './pt-BR.js';
import ptMz from './pt-MZ.js';
import ptPT from './pt-PT.js';
import ruRu from './ru-RU.js';
import skSk from './sk-SK.js';
import slSi from './sl-SI.js';
import sqAl from './sq-AL.js';
import srRs from './sr-RS.js';
import svSe from './sv-SE.js';
import taIn from './ta-IN.js';
import teIn from './te-IN.js';
import thTh from './th-TH.js';
import trTr from './tr-TR.js';
import ukUa from './uk-UA.js';
import urPk from './ur-PK.js';
import elGr from './el-GR.js';
import esVE from './es-VE.js';
import filPh from './fil-PH.js';
import roRo from './ro-RO.js';
import swKe from './sw-KE.js';
import swTz from './sw-TZ.js';
import viVn from './vi-VN.js';
import yoNg from './yo-NG.js';
import yueHk from './yue-HK.js';
import zhCn from './zh-CN.js';
import zhTw from './zh-TW.js';
import uzUz from './uz-UZ.js';
import myMm from './my-MM.js';
import siLk from './si-LK.js';
import kmKh from './km-KH.js';
import zuZa from './zu-ZA.js';

const LOCALES: { [key: string]: ConstructorOf<LocaleInterface> } = {
  'af-ZA': afZa,
  'am-ET': amEt,
  'ar-AE': arAe,
  'as-IN': asIn,
  'ar-LB': arLb,
  'ar-MA': arMa,
  'ar-SA': arSa,
  'az-AZ': azAz,
  'be-BY': beBy,
  'bg-BG': bgBg,
  'bn-BD': bnBd,
  'bn-IN': bnIn,
  'ca-ES': caEs,
  'cs-CZ': csCz,
  'da-DK': daDk,
  'de-AT': deAt,
  'de-CH': deCh,
  'de-DE': deDe,
  'ee-EE': eeEE,
  'el-GR': elGr,
  'en-AE': enAe,
  'en-AU': enAu,
  'en-BD': enBd,
  'en-CA': enCa,
  'en-GB': enGb,
  'en-GH': enGh,
  'en-HK': enHk,
  'en-IE': enIe,
  'en-IN': enIn,
  'en-JM': enJm,
  'en-KE': enKe,
  'en-LK': enLk,
  'en-MA': enMa,
  'en-MM': enMm,
  'en-MU': enMu,
  'en-MY': enMy,
  'en-NG': enNg,
  'en-NP': enNp,
  'en-NZ': enNz,
  'en-OM': enOm,
  'en-PH': enPh,
  'en-PK': enPk,
  'en-SA': enSa,
  'en-SG': enSg,
  'en-TT': enTt,
  'en-TZ': enTz,
  'en-UG': enUg,
  'en-US': enUs,
  'en-ZA': enZa,
  'en-ZW': enZw,
  'es-AR': esAr,
  'es-CL': esCl,
  'es-CO': esCo,
  'es-ES': esEs,
  'es-MX': esMx,
  'es-US': esUs,
  'fa-IR': faIr,
  'fi-FI': fiFi,
  'fil-PH': filPh,
  'fr-BE': frBe,
  'fr-CA': frCa,
  'fr-CH': frCh,
  'fr-FR': frFr,
  'fr-MA': frMa,
  'fr-SA': frSa,
  'gu-IN': guIn,
  'ha-NG': haNg,
  'hbo-IL': hboIl,
  'he-IL': heIl,
  'hi-IN': hiIn,
  'hr-HR': hrHr,
  'hu-HU': huHu,
  'id-ID': idId,
  'ig-NG': igNg,
  'is-IS': isIs,
  'it-IT': itIt,
  'ja-JP': jaJp,
  'jv-ID': jvId,
  'ka-GE': kaGe,
  'kn-IN': knIn,
  'ko-KR': koKr,
  'lt-LT': ltLt,
  'lv-LV': lvLv,
  'ml-IN': mlIn,
  'mr-IN': mrIn,
  'ms-MY': msMy,
  'ms-SG': msSg,
  'nb-NO': nbNo,
  'nl-NL': nlNl,
  'nl-SR': nlSr,
  'np-NP': npNp,
  'or-IN': orIn,
  'pa-IN': paIn,
  'pl-PL': plPl,
  'pt-AO': ptAo,
  'pt-BR': ptBR,
  'pt-MZ': ptMz,
  'pt-PT': ptPT,
  'ro-RO': roRo,
  'ru-RU': ruRu,
  'sk-SK': skSk,
  'sl-SI': slSi,
  'sq-AL': sqAl,
  'sr-RS': srRs,
  'sv-SE': svSe,
  'sw-KE': swKe,
  'sw-TZ': swTz,
  'ta-IN': taIn,
  'te-IN': teIn,
  'th-TH': thTh,
  'tr-TR': trTr,
  'uk-UA': ukUa,
  'ur-PK': urPk,
  'vi-VN': viVn,
  'yo-NG': yoNg,
  'yue-HK': yueHk,
  'zh-CN': zhCn,
  'zh-TW': zhTw,
  'es-VE': esVE,
  'uz-UZ': uzUz,
  'my-MM': myMm,
  'si-LK': siLk,
  'km-KH': kmKh,
  'zu-ZA': zuZa,
};

export default LOCALES;
