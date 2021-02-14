/**
 * A collection of helper functions and data for handling navigation and display
 * of various conversion categories and types.
 * conversion categories:  ['metric', 'jpmeasure', 'jpyear', 'zodiac']
 * conversion types: ['tometric', 'frommetric', .... 'tozodiac']
 */
import { clr } from './colors';

/* determine order of display for various conversion categories */
const navOrder = ["metric", "jpmeasure", "jpyear", "zodiac"];

/**
 * Get screen number from ID of conversion category.
 */
export function catToSnum(cvcatID) {
  return navOrder.indexOf(cvcatID);
}
/**
 * Return style with background color based on screen number.
 */
export function snumToBgStyle(screenNum) {
  if (screenNum==null) return { backgroundColor: clr.black};
  const cvcatID = navOrder[screenNum];
  const bgcol = cvcats[cvcatID].backgroundColor;
  return { backgroundColor: bgcol };
}
/**
 * Return display name (e.g. "to Japanese measures') from screenNum and direction boolean
 */
export function getDispName(screenNum, dirBoolean) {
  const dirID = dirBoolean ? 'tojp' : 'fromjp'; // dirID used in object, from boolean
  const cat = navOrder[screenNum]; // conversion category used in object, from screenNum
  const dname = cvcats[cat][dirID].dname;
  return dname.charAt(0).toUpperCase() + dname.slice(1);
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
export function cvCatToCvType(cvCatId, dirBoolean) {
  if (cvCatId==null) return null;
  const dirId = dirBoolean ? 'tojp' : 'fromjp';
  const cvType = cvcats[cvCatId][dirId].id;
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

/**
 * Basic data object for handling navigation and display between conversion categories, 
 * directions and converstion types
 */
const cvcats = {
  "metric" : {
    id: "metric",
    dname: "metric units",
    backgroundColor: clr.medGreen,
    tojp: {
      id: "tometric",
      dname: "to metric",
    },
    fromjp: {
      id: "frommetric",
      dname: "from metric",
    },
  },
  "jpmeasure" : {
    id: "jpmeasure",
    dname: "Japanese measures",
    backgroundColor: clr.medIndigo,
    tojp: {
      id: "tojpmeasure",
      dname: "to Japanese measures",
    },
    fromjp: {
      id: "fromjpmeasure",
      dname: "from Japanese measures",
    },
  },
  "jpyear" : {
    id: "jpyear",
    dname: "Japanese years",
    backgroundColor: clr.deepOrange,
    tojp: {
      id: "tojpyear",
      dname: "to Japanese years",
    },
    fromjp: {
      id: "fromjpyear",
      dname: "from Japanese years",
    },
  },
  "zodiac" : {
    id: "zodiac",
    dname: "zodiac years",
    backgroundColor: clr.red,
    tojp: {
      id: "tozodiac",
      dname: "zodiac years",
    },
    fromjp: {
      id: "dummy",
      dname: "dummy",
    },
  },
}

