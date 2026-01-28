import { ConstructorOf, LocaleInterface } from '../types';

import arAe from './ar-AE';
import arMa from './ar-MA';
import arSa from './ar-SA';
import bnIn from './bn-IN';
import daDk from './da-DK';
import deDe from './de-DE';
import eeEE from './ee-EE';
import enAe from './en-AE';
import enAu from './en-AU';
import enBd from './en-BD';
import enCa from './en-CA';
import enGb from './en-GB';
import enGh from './en-GH';
import enIe from './en-IE';
import enIn from './en-IN';
import enKe from './en-KE';
import enMa from './en-MA';
import enMm from './en-MM';
import enMu from './en-MU';
import enMy from './en-MY';
import enNg from './en-NG';
import enNp from './en-NP';
import enNz from './en-NZ';
import enOm from './en-OM';
import enPh from './en-PH';
import enPk from './en-PK';
import enSa from './en-SA';
import enSg from './en-SG';
import enUs from './en-US';
import enZa from './en-ZA';
import esAr from './es-AR';
import esEs from './es-ES';
import esMx from './es-MX';
import esUs from './es-US';
import faIr from './fa-IR';
import frBe from './fr-BE';
import frFr from './fr-FR';
import frMa from './fr-MA';
import frSa from './fr-SA';
import guIn from './gu-IN';
import haNg from './ha-NG';
import hiIn from './hi-IN';
import idId from './id-ID';
import itIt from './it-IT';
import knIn from './kn-IN';
import koKr from './ko-KR';
import lvLv from './lv-LV';
import mrIn from './mr-IN';
import msMy from './ms-MY';
import nbNo from './nb-NO';
import nlNl from './nl-NL';
import nlSr from './nl-SR';
import npNp from './np-NP';
import paIn from './pa-IN';
import plPl from './pl-PL';
import ptBR from './pt-BR';
import ptPT from './pt-PT';
import ruRu from './ru-RU';
import srRs from './sr-RS';
import svSe from './sv-SE';
import taIn from './ta-IN';
import teIn from './te-IN';
import trTr from './tr-TR';
import urPk from './ur-PK';
import esVE from './es-VE';
import filPh from './fil-PH';
import roRo from './ro-RO';
import swKe from './sw-KE';

const LOCALES: { [key: string]: ConstructorOf<LocaleInterface> } = {
  'ar-AE': arAe,
  'ar-MA': arMa,
  'ar-SA': arSa,
  'bn-IN': bnIn,
  'da-DK': daDk,
  'de-DE': deDe,
  'ee-EE': eeEE,
  'en-AE': enAe,
  'en-AU': enAu,
  'en-BD': enBd,
  'en-CA': enCa,
  'en-GB': enGb,
  'en-GH': enGh,
  'en-IE': enIe,
  'en-IN': enIn,
  'en-KE': enKe,
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
  'en-US': enUs,
  'en-ZA': enZa,
  'es-AR': esAr,
  'es-ES': esEs,
  'es-MX': esMx,
  'es-US': esUs,
  'fa-IR': faIr,
  'fil-PH': filPh,
  'fr-BE': frBe,
  'fr-FR': frFr,
  'fr-MA': frMa,
  'fr-SA': frSa,
  'gu-IN': guIn,
  'ha-NG': haNg,
  'hi-IN': hiIn,
  'id-ID': idId,
  'it-IT': itIt,
  'kn-IN': knIn,
  'ko-KR': koKr,
  'lv-LV': lvLv,
  'mr-IN': mrIn,
  'ms-MY': msMy,
  'nb-NO': nbNo,
  'nl-NL': nlNl,
  'nl-SR': nlSr,
  'np-NP': npNp,
  'pa-IN': paIn,
  'pl-PL': plPl,
  'pt-BR': ptBR,
  'pt-PT': ptPT,
  'ro-RO': roRo,
  'ru-RU': ruRu,
  'sr-RS': srRs,
  'sv-SE': svSe,
  'sw-KE': swKe,
  'ta-IN': taIn,
  'te-IN': teIn,
  'tr-TR': trTr,
  'ur-PK': urPk,
  'es-VE': esVE,
};

export default LOCALES;
