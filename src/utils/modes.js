/**
 * A collection of helper functions and data for handling navigation and display
 * of various conversion categories and types.
 * conversion categories:  ['metric', 'jpmeasure', 'jpyear', 'zodiac']
 * conversion types: ['tometric', 'frommetric', .... 'tozodiac']
 */
import { clr } from './colors';

/* determine order of display for various conversion categories */
const navOrder = ["metric", "jpmeasure", "jpyear", "zodiac"];
const defaultInstructions = 'Choose conversion units below, then enter amount to convert above.';
const zodiacInstructions = 'Enter international year above.';
const tojpyearInstructions = 'Enter year (1688-present) above.';
const fromjpyearInstructions = 'Choose Japanese era below, then enter year above.';
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
  const bgcol = cvcats[cvcatID].backgroundColor;
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

export function getInstructions(cvtype) {
  const [screenNum, dirBoolean] = fromCvType(cvtype);
  if (screenNum==null) return null;
  const dirID = dirBoolean ? 'tojp' : 'fromjp'; // dirID used in object, from boolean
  const cat = navOrder[screenNum]; // conversion category used in object, from screenNum
  const instructions = cvcats[cat][dirID].instructions;
  return instructions;
}

/**
 * Return display name (e.g. "to Japanese measures') from screenNum and direction boolean
 */
export function getDispName(cvtype) {
  const [screenNum, dirBoolean] = fromCvType(cvtype);
  const dirID = dirBoolean ? 'tojp' : 'fromjp'; // dirID used in object, from boolean
  const cat = navOrder[screenNum]; // conversion category used in object, from screenNum
  const dname = cvcats[cat][dirID].dname;
  return dname;
}

/**
 * Return conversion type ID (e.g. "tojpmeasure') from screenNum and direction
 */
export function getCvType(screenNum, dirBoolean) {
  if (screenNum==null) return null;
  const dirID = dirBoolean ? 'tojp' : 'fromjp';
  const cat = navOrder[screenNum];
  const cvid = cvcats[cat][dirID].id;
  return cvid;
}
/**
 * Return conversion type ID (e.g. "tojpmeasure') from cvtype and direction
 */
export function catToCvType(cat, dirBoolean) {
  if (cat==null) return null;
  const dirId = dirBoolean ? 'tojp' : 'fromjp';
  const cvType = cvcats[cat][dirId].id;
  return cvType;
}
/**
 * string constants to catch misspellings
 */
export const cv = {
  METRIC: 'metric',
  JPMEASURE: 'jpmeasure',
  JPYEAR: 'jpyear',
  ZODIAC: 'zodiac',
  TOJP: true,
  FROMJP: false,
}

function fromCvType(cvtype) {
  switch (cvtype) {
    case 'tometric':
      return [catToSnum(cv.METRIC), cv.TOJP];
    case 'frommetric':
      return [catToSnum(cv.METRIC), cv.FROMJP];
    case 'tojpmeasure':
      return [catToSnum(cv.JPMEASURE), cv.TOJP];
    case 'fromjpmeasure':
      return [catToSnum(cv.JPMEASURE), cv.FROMJP];
    case 'tojpyear':
      return [catToSnum(cv.JPYEAR), cv.TOJP];
    case 'fromjpyear':
      return [catToSnum(cv.JPYEAR), cv.FROMJP];
    case 'tozodiac':
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
    id: "metric",
    dname: "metric units",
    backgroundColor: clr.medGreen,
    backgroundColor2: clr.lightGreen,
    tojp: {
      id: "tometric",
      dname: "to metric",
      instructions: defaultInstructions,
    },
    fromjp: {
      id: "frommetric",
      dname: "from metric",
      instructions: defaultInstructions,
    },
  },
  "jpmeasure" : {
    id: "jpmeasure",
    dname: "Japanese measures",
    backgroundColor: clr.medIndigo,
    backgroundColor2: clr.lighterIndigo,
    tojp: {
      id: "tojpmeasure",
      dname: "to Japanese measures",
      instructions: defaultInstructions,
    },
    fromjp: {
      id: "fromjpmeasure",
      dname: "from Japanese measures",
      instructions: defaultInstructions,
    },
  },
  "jpyear" : {
    id: "jpyear",
    dname: "Japanese years",
    backgroundColor: clr.deepOrange,
    backgroundColor2: clr.lighterDeepOrange,
    tojp: {
      id: "tojpyear",
      dname: "to Japanese years",
      instructions: tojpyearInstructions,
    },
    fromjp: {
      id: "fromjpyear",
      dname: "from Japanese years",
      instructions: fromjpyearInstructions,
    },
  },
  "zodiac" : {
    id: "zodiac",
    dname: "zodiac years",
    backgroundColor: clr.red,
    backgroundColor2: clr.lighterRed,
    tojp: {
      id: "tozodiac",
      dname: "zodiac years",
      instructions: zodiacInstructions,
    },
    fromjp: {
      id: "dummy",
      dname: "dummy",
      instructions: defaultInstructions,
    },
  },
}

