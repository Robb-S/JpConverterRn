import {cv} from './modes';
/**
 * Container for era objects, zodiac objects
 * prop: yDict (eraCode: OneEra), eraCodeAllList (alpha sorted), 
 * eraCodeModernList (reverse date sorted), nowEraCode (based on ending year of 0), 
 * modernEraStart (1868), jYearTuples (list of tuples) for loading and sorting, 
 * zFromYearDict (yearMod: ZodiacYear), zToYearsDict (zodCode: list of years), nowYear
 */
class YearConverters {
  constructor () {
    this.nowYear = new Date().getFullYear();
    this.minYear = 100000;          // set this later
    this.modernEraStart = 1868      // beginning of Meiji era
    // this.htmlparse = HTMLParser();
    // this.loadJYears()               // load data and prepare indexes
    this.zToYearsDict = {};         // this will be set up only after it's requested
    this.loadZYears();
  }
  loadZYears() {
    this.zFromYearDict = {};   // look up years (mod 12) to get zodiac data
    const zodTuples = [ // yearmod (mod 12), eName, jName (animal), jName (kanji for zodiac sign)
      [0, "monkey", "猿", "申"],     
      [1, "rooster", "鳥", "酉"],
      [2, "dog", "犬", "戌"],
      [3, "boar", "猪", "亥"],
      [4, "rat", "鼠", "子"],
      [5, "ox", "牛", "丑"],
      [6, "tiger", "虎", "寅"],
      [7, "rabbit", "兎", "卯"],
      [8, "dragon", "龍", "辰"],
      [9, "snake", "蛇", "巳"],
      [10, "horse", "馬", "午"],
      [11, "sheep", "羊", "未"],
    ];
    for (const zodTuple of zodTuples) { // use yearMod as index, overwrite if it already exists
      this.zFromYearDict[zodTuple[0]] = new ZodiacYear(...zodTuple);
    }
  }
  getNowYear() {return this.nowYear; }
  getZodEName(theyear) { return (this.zFromYearDict[theyear%12].getEName()); }
  getZodJName(theyear) { return (this.zFromYearDict[theyear%12].getJName()); }
  getZodJZName(theyear) { return (this.zFromYearDict[theyear%12].getJZName()); }
  getZodEquationStr(theyear) {
    if (isNaN(theyear) || theyear<1) return theyear;
    const oneZod = this.zFromYearDict[theyear%12];
    return `${theyear} is year of the ${oneZod.getEName()}`;
  }
  getZodEquationArr(theyear) {
    if (isNaN(theyear) || theyear>1) return [theyear,''];
    const oneZod = this.zFromYearDict[theyear%12];
    return [`${theyear}`, `is year of the ${oneZod.getEName()}`];
  }
}

/**
 * Each object stores info for one type of zodiac year.
 */
class ZodiacYear {
  constructor (yearMod, eName, jName, jZName) {
    this.yearMod = yearMod;
    this.eName = eName;
    this.jName = jName;
    this.jZName = jZName;
  }
  getYearMod() { return this.yearMod; }
  getEName() { return this.eName; }
  getJName() { return this.jName; }
  getJZName() { return this.jZName; }
 }

export default YearConverters;