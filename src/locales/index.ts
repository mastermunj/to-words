import { ConstructorOf, LocaleInterface } from '../types';

import bnIn from './bn-IN';
import eeEE from './ee-EE';
import enAe from './en-AE';
import enAu from './en-AU';
import enBd from './en-BD';
import enGb from './en-GB';
import enGh from './en-GH';
import enIe from './en-IE';
import enIn from './en-IN';
import enMm from './en-MM';
import enMu from './en-MU';
import enNg from './en-NG';
import enNp from './en-NP';
import enOm from './en-OM';
import enPh from './en-PH';
import enUs from './en-US';
import esAr from './es-AR';
import esEs from './es-ES';
import esMx from './es-MX';
import faIr from './fa-IR';
import frBe from './fr-BE';
import frFr from './fr-FR';
import guIn from './gu-IN';
import hiIn from './hi-IN';
import knIn from './kn-IN';
import koKr from './ko-KR';
import lvLv from './lv-LV';
import mrIn from './mr-IN';
import nlSr from './nl-SR';
import npNp from './np-NP';
import ptBR from './pt-BR';
import trTr from './tr-TR';
import urPk from './ur-PK';
import esVE from './es-VE';

const LOCALES: { [key: string]: ConstructorOf<LocaleInterface> } = {
  'bn-IN': bnIn,
  'ee-EE': eeEE,
  'en-AE': enAe,
  'en-AU': enAu,
  'en-BD': enBd,
  'en-GB': enGb,
  'en-GH': enGh,
  'en-IE': enIe,
  'en-IN': enIn,
  'en-MM': enMm,
  'en-MU': enMu,
  'en-NG': enNg,
  'en-NP': enNp,
  'en-OM': enOm,
  'en-PH': enPh,
  'en-US': enUs,
  'es-AR': esAr,
  'es-ES': esEs,
  'es-MX': esMx,
  'fa-IR': faIr,
  'fr-BE': frBe,
  'fr-FR': frFr,
  'gu-IN': guIn,
  'hi-IN': hiIn,
  'kn-IN': knIn,
  'ko-KR': koKr,
  'lv-LV': lvLv,
  'mr-IN': mrIn,
  'nl-SR': nlSr,
  'np-NP': npNp,
  'pt-BR': ptBR,
  'tr-TR': trTr,
  'ur-PK': urPk,
  'es-VE': esVE,
};

export default LOCALES;
