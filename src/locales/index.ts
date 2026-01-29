import { ConstructorOf, LocaleInterface } from '../types';

import afZa from './af-ZA';
import arAe from './ar-AE';
import arMa from './ar-MA';
import arSa from './ar-SA';
import beBy from './be-BY';
import bgBg from './bg-BG';
import bnIn from './bn-IN';
import caEs from './ca-ES';
import csCz from './cs-CZ';
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
import fiFi from './fi-FI';
import frBe from './fr-BE';
import frFr from './fr-FR';
import frMa from './fr-MA';
import frSa from './fr-SA';
import guIn from './gu-IN';
import haNg from './ha-NG';
import heIl from './he-IL';
import hiIn from './hi-IN';
import hrHr from './hr-HR';
import huHu from './hu-HU';
import idId from './id-ID';
import isIs from './is-IS';
import itIt from './it-IT';
import knIn from './kn-IN';
import koKr from './ko-KR';
import ltLt from './lt-LT';
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
import skSk from './sk-SK';
import slSi from './sl-SI';
import sqAl from './sq-AL';
import srRs from './sr-RS';
import svSe from './sv-SE';
import taIn from './ta-IN';
import teIn from './te-IN';
import thTh from './th-TH';
import trTr from './tr-TR';
import ukUa from './uk-UA';
import urPk from './ur-PK';
import elGr from './el-GR';
import esVE from './es-VE';
import filPh from './fil-PH';
import roRo from './ro-RO';
import swKe from './sw-KE';
import viVn from './vi-VN';

const LOCALES: { [key: string]: ConstructorOf<LocaleInterface> } = {
  'af-ZA': afZa,
  'ar-AE': arAe,
  'ar-MA': arMa,
  'ar-SA': arSa,
  'be-BY': beBy,
  'bg-BG': bgBg,
  'bn-IN': bnIn,
  'ca-ES': caEs,
  'cs-CZ': csCz,
  'da-DK': daDk,
  'de-DE': deDe,
  'ee-EE': eeEE,
  'el-GR': elGr,
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
  'fi-FI': fiFi,
  'fil-PH': filPh,
  'fr-BE': frBe,
  'fr-FR': frFr,
  'fr-MA': frMa,
  'fr-SA': frSa,
  'gu-IN': guIn,
  'ha-NG': haNg,
  'he-IL': heIl,
  'hi-IN': hiIn,
  'hr-HR': hrHr,
  'hu-HU': huHu,
  'id-ID': idId,
  'is-IS': isIs,
  'it-IT': itIt,
  'kn-IN': knIn,
  'ko-KR': koKr,
  'lt-LT': ltLt,
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
  'sk-SK': skSk,
  'sl-SI': slSi,
  'sq-AL': sqAl,
  'sr-RS': srRs,
  'sv-SE': svSe,
  'sw-KE': swKe,
  'ta-IN': taIn,
  'te-IN': teIn,
  'th-TH': thTh,
  'tr-TR': trTr,
  'uk-UA': ukUa,
  'ur-PK': urPk,
  'vi-VN': viVn,
  'es-VE': esVE,
};

export default LOCALES;
