/**
 * A collection of helper functions and data for handling navigation and display
 * of various conversion categories and types.
 * conversion categories: ['metric', 'jpmeasure', 'jpyear', 'zodiac']
 * conversion types: ['tometric', 'frommetric', .... 'tozodiac']
 */
import { clr } from './colors';

/**
 * string constants to catch misspellings
 */
export const cv = {
  METRIC: 'metric',
  TOMETRIC: 'tometric',
  FROMMETRIC: 'frommetric',
  JPMEASURE: 'jpmeasure',
  TOJPMEASURE: 'tojpmeasure',
  FROMJPMEASURE: 'fromjpmeasure',
  JPYEAR: 'jpyear',
  TOJPYEAR: 'tojpyear',
  FROMJPYEAR: 'fromjpyear',
  ZODIAC: 'zodiac',
  TOZODIAC: 'tozodiac',
  TOJP: true,
  FROMJP: false,
  TOJPID: 'tojp',
  FROMJPID: 'fromjp',
}

/* determine order of display for various conversion categories */
const navOrder = [cv.METRIC, cv.JPMEASURE, cv.JPYEAR, cv.ZODIAC];
const defaultInstructions = 'Select conversion units below, then enter amount above.';
const zodiacInstructions = 'Enter international year above.';
const tojpyearInstructions = 'Enter year (1688-present) above.';
const fromjpyearInstructions = 'Select Japanese era below, then enter year above.';
/**
 * Get screen number from ID of conversion category.
 */
export function catToSnum(cvcatID) {
  return navOrder.indexOf(cvcatID);
}
/**
 * Return style with background color based on screen number.
 */
export function getBgStyle(cvtype) {
  const [screenNum, dirBoolean] = fromCvType(cvtype);
  if (screenNum==null) return { backgroundColor: clr.black};
  const cvcatID = navOrder[screenNum];
  const bgcol = cvcats[cvcatID].backgroundColor1;
  return { backgroundColor: bgcol };
}
/**
 * Return style with secondary background color based on screen number.
 */
export function getBgStyle2(cvtype) {
  const [screenNum, dirBoolean] = fromCvType(cvtype);
  if (screenNum==null) return { backgroundColor: clr.black};
  const cvcatID = navOrder[screenNum];
  const bgcol = cvcats[cvcatID].backgroundColor2;
  return { backgroundColor: bgcol };
}

export function getBgStyles(cvtype) {
  const [screenNum, dirBoolean] = fromCvType(cvtype);
  if (screenNum==null) return [{backgroundColor: clr.black}, {backgroundColor: clr.black}];
  const cvcatID = navOrder[screenNum];
  const bgcol1 = cvcats[cvcatID].backgroundColor1;
  const bgcol2 = cvcats[cvcatID].backgroundColor2;
  return [{ backgroundColor: bgcol1 },{ backgroundColor: bgcol2 }];
}

export function getInstructions(cvtype) {
  const [screenNum, dirBoolean] = fromCvType(cvtype);
  if (screenNum==null) return null;
  const dirID = dirBoolean ? cv.TOJPID : cv.FROMJPID; // dirID used in object
  const cat = navOrder[screenNum]; // conversion category used in object, from screenNum
  const instructions = cvcats[cat][dirID].instructions;
  return instructions;
}

/**
 * Return display name (e.g. "to Japanese measures') from screenNum and direction boolean
 */
export function getDispName(cvtype) {
  const [screenNum, dirBoolean] = fromCvType(cvtype);
  if (screenNum==null) return null;
  const dirID = dirBoolean ? cv.TOJPID : cv.FROMJPID; // dirID used in object
  const cat = navOrder[screenNum]; // conversion category used in object, from screenNum
  const dname = cvcats[cat][dirID].dname;
  return dname;
}

/**
 * Return conversion type ID (e.g. "tojpmeasure') from screenNum and direction
 */
export function getCvType(screenNum, dirBoolean) {
  if (screenNum==null) return null;
  const dirID = dirBoolean ? cv.TOJPID : cv.FROMJPID; // dirID used in object
  const cat = navOrder[screenNum];
  const cvtype = cvcats[cat][dirID].cvtype;
  return cvtype;
}
/**
 * Return conversion type ID (e.g. "tojpmeasure') from cvtype and direction
 */
export function catToCvType(cat, dirBoolean) {
  if (cat==null) return null;
  const dirID = dirBoolean ? cv.TOJPID : cv.FROMJPID; // dirID used in object
  const cvType = cvcats[cat][dirId].cvtype;
  return cvType;
}

function fromCvType(cvtype) {
  switch (cvtype) {
    case cv.TOMETRIC:
      return [catToSnum(cv.METRIC), cv.TOJP];
    case cv.FROMMETRIC:
      return [catToSnum(cv.METRIC), cv.FROMJP];
    case cv.TOJPMEASURE:
      return [catToSnum(cv.JPMEASURE), cv.TOJP];
    case cv.FROMJPMEASURE:
      return [catToSnum(cv.JPMEASURE), cv.FROMJP];
    case cv.TOJPYEAR:
      return [catToSnum(cv.JPYEAR), cv.TOJP];
    case cv.FROMJPYEAR:
      return [catToSnum(cv.JPYEAR), cv.FROMJP];
    case cv.TOZODIAC:
      return [catToSnum(cv.ZODIAC), cv.TOJP];
    default:
      return [null, null];
  }
}

/**
 * Basic data object for handling navigation and display between conversion categories, 
 * directions and converstion types
 */
const cvcats = {
  "metric" : {
    dname: "metric units",
    backgroundColor1: clr.medGreen,
    backgroundColor2: clr.lightGreen,
    tojp: {
      cvtype: cv.TOMETRIC,
      dname: "to metric",
      instructions: defaultInstructions,
    },
    fromjp: {
      cvtype: cv.FROMMETRIC,
      dname: "from metric",
      instructions: defaultInstructions,
    },
  },
  "jpmeasure" : {
    dname: "Japanese measures",
    backgroundColor1: clr.medIndigo,
    backgroundColor2: clr.lighterIndigo,
    tojp: {
      cvtype: cv.TOJPMEASURE,
      dname: "to Japanese measures",
      instructions: defaultInstructions,
    },
    fromjp: {
      cvtype: cv.FROMJPMEASURE,
      dname: "from Japanese measures",
      instructions: defaultInstructions,
    },
  },
  "jpyear" : {
    dname: "Japanese years",
    backgroundColor1: clr.deepOrange,
    backgroundColor2: clr.lighterDeepOrange,
    tojp: {
      cvtype: cv.TOJPYEAR,
      dname: "to Japanese years",
      instructions: tojpyearInstructions,
    },
    fromjp: {
      cvtype: cv.FROMJPYEAR,
      dname: "from Japanese years",
      instructions: fromjpyearInstructions,
    },
  },
  "zodiac" : {
    dname: "zodiac years",
    backgroundColor1: clr.red,
    backgroundColor2: clr.lighterRed,
    tojp: {
      cvtype: cv.TOZODIAC,
      dname: "zodiac years",
      instructions: zodiacInstructions,
    },
    fromjp: {
      cvtype: "dummy",
      dname: "dummy",
      instructions: defaultInstructions,
    },
  },
}

