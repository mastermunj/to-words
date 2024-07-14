import { ConstructorOf, LocaleInterface } from '../types';

import eeEE from './ee-EE';
import enAe from './en-AE';
import enBd from './en-BD';
import enGb from './en-GB';
import enGh from './en-GH';
import enIe from './en-IE';
import enIn from './en-IN';
import enMm from './en-MM';
import enMu from './en-MU';
import enNg from './en-NG';
import enNp from './en-NP';
import enPh from './en-PH';
import enUs from './en-US';
import esEs from './es-ES';
import esMx from './es-MX';
import faIr from './fa-IR';
import frBe from './fr-BE';
import frFr from './fr-FR';
import guIn from './gu-IN';
import hiIn from './hi-IN';
import koKr from './ko-KR';
import mrIn from './mr-IN';
import nlSr from './nl-SR';
import ptBR from './pt-BR';
import trTr from './tr-TR';

const LOCALES: { [key: string]: ConstructorOf<LocaleInterface> } = {
  'ee-EE': eeEE,
  'en-AE': enAe,
  'en-BD': enBd,
  'en-GB': enGb,
  'en-GH': enGh,
  'en-IE': enIe,
  'en-IN': enIn,
  'en-MM': enMm,
  'en-MU': enMu,
  'en-NG': enNg,
  'en-NP': enNp,
  'en-PH': enPh,
  'en-US': enUs,
  'es-ES': esEs,
  'es-MX': esMx,
  'fa-IR': faIr,
  'fr-BE': frBe,
  'fr-FR': frFr,
  'gu-IN': guIn,
  'hi-IN': hiIn,
  'ko-KR': koKr,
  'mr-IN': mrIn,
  'nl-SR': nlSr,
  'pt-BR': ptBR,
  'tr-TR': trTr,
};

export default LOCALES;
