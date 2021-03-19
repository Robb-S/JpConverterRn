import {decodeHtmlCharCodes} from './helpers';
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
    this.loadJYears()               // load data and prepare indexes
    this.zToYearsDict = {};         // this will be set up only after it's requested
    this.loadZYears();
    // this.initRadioPosNowEraModern = null;     // used for setting initial position of radio buttons
    // this.initRadioPosNowEraHistoric = null;
  }
  /**
   * Returns true if valid conversion type
   */
  isValidConvType(convType) {
    return this.validConvTypes.includes(convType);
  }
  /**
   * Load JYears data initially.  This can be extended further back into historical eras, and it can be
   * adapted to load from an external file.
   */
  loadJYears() {
    this.yDict = {}; // this will hold all the OneEra objects, indexed by eraCode
    this.jYearTuples = [         // utf-8 and html encoding
      ['reiwa', 'Reiwa', '令和', 2019, 0],
      ['heisei', 'Heisei', '平成', 1989, 2019],
      ['showa', 'Sh&#333;wa', '昭和', 1926, 1989],
      ['taisho', 'Taish&#333;', '大正', 1912, 1926],
      ['meiji', 'Meiji', '明治', 1868, 1912],
      ['keio', 'Kei&#333;', '慶応', 1865, 1868],
      ['genji', 'Genji', '元治', 1864, 1865],
      ['bunkyu', 'Bunky&#363;', '文久', 1861, 1864],
      ['manen', "Man'en", '万延', 1860, 1861],
      ['ansei', 'Ansei', '安政', 1854, 1860],
      ['kaei', 'Kaei', '嘉永', 1848, 1854],
      ['koka', 'K&#333;ka', '弘化', 1844, 1848],
      ['tenpo', 'Tenp&#333;', '天保', 1830, 1844],
      ['bunsei', 'Bunsei', '文政', 1818, 1830],
      ['bunka', 'Bunka', '文化', 1804, 1818],
      ['kyowa', 'Ky&#333;wa', '享和', 1801, 1804],
      ['kansei', 'Kansei', '寛政', 1789, 1801],
      ['tenmei', 'Tenmei', '天明', 1781, 1789],
      ['anei', "An'ei", '安永', 1772, 1781],
      ['meiwa', 'Meiwa', '明和', 1764, 1772],
      ['horeki', 'H&#333;reki', '宝暦', 1751, 1764],
      ['kanen', "Kan'en", '寛延', 1748, 1751],
      ['enkyo2', 'Enky&#333;', '延享', 1744, 1748],
      ['kanpo', 'Kanp&#333;', '寛保', 1741, 1744],
      ['genbun', 'Genbun', '元文', 1736, 1741],
      ['kyoho', 'Ky&#333;h&#333;', '享保', 1716, 1736],
      ['shotoku', 'Sh&#333;toku', '正徳', 1711, 1716],
      ['hoei', 'H&#333;ei', '宝永', 1704, 1711],
      ['genroku', 'Genroku', '延享', 1688, 1704],
    ]; // (source: http://www.meijigakuin.ac.jp/~watson/ref/nengo-utf8.html and Nelson)
    this.nowEraCode = '';
    const startYears = this.jYearTuples.map((jYearTuple) => {return jYearTuple[3];}); // get all starting years
    this.minYear = Math.min(...startYears); // find the minimum (earliest) starting year in use
    let tempEraCodeAllList = [];            // include historical years
    let tempEraCodeModernList = [];         // just since Meiji restoration
    for (const jYearTuple of this.jYearTuples) {
      const oneEraObject = new OneEra(...jYearTuple); // tuple items are parameters to instantiate OneEra object
      const oneEraCode = oneEraObject.getEraCode();
      this.yDict[oneEraCode] = oneEraObject; // use eraCode as index
      if (oneEraObject.getEndYear()===0) { this.nowEraCode = oneEraCode; } // set the current era
      tempEraCodeAllList.push(oneEraCode);
      if (oneEraObject.getStartYear()>= this.modernEraStart) {  // include startyears for sorting
        tempEraCodeModernList.push([oneEraCode, oneEraObject.getStartYear()]);
      }
    }
    this.eraCodeAllListSorted = [...tempEraCodeAllList.sort()];  // alpha sort list of all eras
    // next sort array of tuples in reverse order by startYear, then add only eraCodes to new list
    tempEraCodeModernList.sort(function(a, b){return b[1]-a[1];});
    this.eraCodeModernListSorted = tempEraCodeModernList.map((oneTuple) => {return oneTuple[0]});
    this.maxYear = this.yDict[this.nowEraCode].getStartYear() + 98; // year 99 of current era
  }

  getNowYear() {return this.nowYear; }
  getNowEra() {return this.nowEraCode;}
  isNowEra(eraCode) {return this.nowEraCode===eraCode};
  getMinYear() { return this.minYear; }
  getMaxYear() { return this.maxYear; }
  getEName(eraCode) {return this.yDict[eraCode].getEName(); }
  getENameRaw(eraCode) {return this.yDict[eraCode].getENameRaw(); }
  getJName(eraCode) {return this.yDict[eraCode].getJName(); }
  getStartYear(eraCode) {return this.yDict[eraCode].getStartYear();}
  getEndYear(eraCode) {return this.yDict[eraCode].getEndYear();}
  getNumYears(eraCode) {return this.yDict[eraCode].getNumYears();}
  isValidEraCode(eraCode) {return this.eraCodeAllListSorted.includes(eraCode);}
  isValidIYear(iYear) { 
    if (isNaN(iYear)) {return false;}
    const iiYear = parseInt(iYear);
    return ( (iiYear>=this.getMinYear() ) && (iiYear<=this.getMaxYear()) );
  }
  /**
   * Return '(1-xx)' hint for input text box.  Calculate current era year if current era.
   * Return '' for bad eraCode, because eraCode setting in MainScreen is async so it might
   * lag, and momentarily be set to convCode from another screen.
   */
  getHint(eraCode) {
    if (!this.isValidEraCode(eraCode)) return ('');
    const numYears = (this.isNowEra(eraCode)) ?
      (this.getNowYear() - this.getStartYear(eraCode) + 1) : this.getNumYears(eraCode);
    return '(1-' + numYears + ')';
  }
  /**
   * Return list of tuples for display in radio buttons: [eraCode, dispName]
   * dispName is romaji name (with macrons) followed by kanji
   * @param string eraType 'modern' or 'all'
   */
  getEraNamesPlusCodes(eraType) {
    const theEras = [];
    const listToUse = (eraType==='modern') ? this.eraCodeModernListSorted : this.eraCodeAllListSorted;
    for (const eraCode of listToUse) {
      let oneTuple = [this.getEName(eraCode)+ ' ' + this.getJName(eraCode), eraCode];
      theEras.push(oneTuple);
    }
    return theEras;
  }

  /**
   * Return [radioProps, nowPos] tuple - first is array of objects {label: displayText, value: eraCode} 
   * to make radio buttons. Simply converts array of arrays provided by getEraNamesPlusCodes to
   * array of objects needed by react-native-simple-radio-button API.
   * second (nowPos) is position of current era within this array
   * @param string eraType 'modern' or 'all'
   */
  eraTypeToRadioProps(eraType) {
    // console.log('** inside eraTypeToRadioProps ', eraType);
    const rpArray = [];
    let nowPos = null;
    let arrayPos = -1; // increment array position within loop
    const eraNamesTupleArray = this.getEraNamesPlusCodes(eraType);
    for (const [desc, eraCode] of eraNamesTupleArray) {
      const oneRadioPropObj = {label: desc, value: eraCode};
      rpArray.push(oneRadioPropObj);
      arrayPos += 1;
      if (this.isNowEra(eraCode)) {nowPos=arrayPos;}
    }
    return [rpArray, nowPos];
  }

  /** 
   * Convert from International year, return list with 0, 1, or 2 tuples of [eName, jName, eraYear].
   * (Transition years such as 2019 will be in two different eras.)
   */
  iYearToJYear(iYear) {
    // console.log('** iYearToJYear ' + iYear + ' **');
    const jYears1 = []; // fill with tuple(s) of (startYear, eraCode) for matching era(s), then sort it
    const jYears2 = []; // fill this with tuple(s) of (eName, jName, eraYear)
    if ((iYear<this.minYear) || (iYear>this.maxYear+1)) {return jYears2;} // return blank if out of range
    for (const [eraCode, oneEra] of Object.entries(this.yDict)) {
      // console.log( 'iYear for ' + oneEra.getEraCode());
      if (oneEra.isIYearInEra(iYear)) {
        jYears1.push([oneEra.getStartYear(), eraCode]);
      }
    }
    jYears1.sort(function(a, b){return a[0]-b[0];});   // sort in order by start year
    for (const [startYear, eraCode] of jYears1) {
      jYears2.push([this.yDict[eraCode].getEName(), this.yDict[eraCode].getJName(),
        this.yDict[eraCode].iYearToEraYear(iYear)]);
    }
    // console.log(jYears2);
    return jYears2;
  }

   /** 
   * Converting from International year, return two-line display (array of two strings) 
   * showing Japanese era year or years. 
   */
  iYearToJYearEq(iYear) {
    const jYears = this.iYearToJYear(iYear); // get array of 0, 1 or 2 tuples
    let eq = ['',''];
    if (jYears.length===0) { // out of range
       eq = [ iYear.toString() , ''];
     } else if (jYears.length===1) { // one era to display
       const [eName1, jName1, jYear1] = jYears[0];
       eq[0] = iYear.toString() + ' is';
       eq[1] = eName1 + ' ' + jName1 + ' ' + jYear1;
     } else { // length===2, so it spans two eras
      const [eName1, jName1, jYear1] = jYears[0];
      const [eName2, jName2, jYear2] = jYears[1];
      eq[0] = iYear.toString() + ' is ' +  eName1 + ' ' + jName1 + ' ' + jYear1;
      eq[1] = 'and ' +  eName2 + ' ' + jName2 + ' ' + jYear2;
     }
    return eq;
  }

  /**
   * Return international year, or 0 if out of range, or -1 if bad eraCode.
   * jYear parameter could be a string, so parse it.
   */
  jYearToIYear(eraCode, jYear) {
    if (!this.isValidEraCode(eraCode)) {return (-1);} // eraCode not found    
    const maxJYear = this.isNowEra(eraCode) ? 99 : this.yDict[eraCode].getNumYears(); // 99 if now era
    if (jYear>=1 && jYear<=maxJYear) {
      return this.yDict[eraCode].getStartYear() + parseInt(jYear) - 1; 
    }
    else {return 0;}
  }
  /**
   * Return string tuple for display.
   */
  jYearToIYearEq(eraCode, jYear) {
    let eq=['', ''];
    const dispEName = capitalize(this.getEName(eraCode)); 
    if (isNaN(jYear) || parseInt(jYear)===0) { // nothing entered yet
      eq[0] = dispEName + ' era';
      eq[1] = '(please enter year above)';
    } else {
      const iYear = this.jYearToIYear(eraCode, jYear);
      if (iYear>-1) {
        const iYearDisp = (iYear==0) ? 'not a valid date' : iYear.toString();
        eq[0] = dispEName + ' ' + jYear;
        eq[1] = 'is ' + iYearDisp;
      } // else eraCode not found if -1, so just leave it blank
    }
    return eq;
  }

  /** 
   * Load collection of new ZodiacEra objects into dictionary
   */
  loadZYears() {
    this.zFromYearDict = {};   // look up years (mod 12) to get zodiac data
    const zodTuples = [ // yearmod (mod 12), eName, jName (animal), jName (kanji for zodiac sign)
      [0, 'monkey', '猿', '申'],
      [1, 'rooster', '鳥', '酉'],
      [2, 'dog', '犬', '戌'],
      [3, 'boar', '猪', '亥'],
      [4, 'rat', '鼠', '子'],
      [5, 'ox', '牛', '丑'],
      [6, 'tiger', '虎', '寅'],
      [7, 'rabbit', '兎', '卯'],
      [8, 'dragon', '龍', '辰'],
      [9, 'snake', '蛇', '巳'],
      [10, 'horse', '馬', '午'],
      [11, 'sheep', '羊', '未'],
    ];
    for (const zodTuple of zodTuples) { // use yearMod as index, overwrite if it already exists
      this.zFromYearDict[zodTuple[0]] = new ZodiacYear(...zodTuple);
    }
  }

  getZodEName(theyear) { return (this.zFromYearDict[theyear%12].getEName()); }
  getZodJName(theyear) { return (this.zFromYearDict[theyear%12].getJName()); }
  getZodJZName(theyear) { return (this.zFromYearDict[theyear%12].getJZName()); }
  getZodEquationString(theyear) {
    if (isNaN(theyear) || theyear<1) return theyear;
    const oneZod = this.zFromYearDict[theyear%12];
    return `${theyear} is year of the ${oneZod.getEName()}`;
  }
  getZodEquationArray(theyear) {
    if (isNaN(theyear) || theyear<1) return [theyear,''];
    const oneZod = this.zFromYearDict[theyear%12];
    return [`${theyear}`, `is year of the ${oneZod.getEName()}`];
  }
}

/**
 * era object: eraCode (simple name), eName (name with macrons), jName (kanji), 
 * startYear, endYear, numYears (calculated)
 */
export class OneEra { // TODO: don't export, use locally only
  constructor (eraCode, eName, jName, startYear, endYear) {
    this.eraCode = eraCode;
    this.eName = eName;
    this.jName = jName;
    this.startYear = startYear;
    this.endYear = endYear;
    if (this.endYear === 0) {this.numYears = 0;}  // used for current era
    else {this.numYears = this.endYear - this.startYear + 1;}
  }
  isIYearInEra(iYear) {
    if (this.endYear===0) {return iYear>=this.startYear;}
    else {return ((iYear>=this.startYear) && (iYear<=this.endYear));}
  }
  iYearToEraYear(iYear) {
    if (this.isIYearInEra(iYear)) {return iYear-this.startYear+1;}
    else {return 0;}
  }
  getEraCode() {return this.eraCode;}
  getEName() {return decodeHtmlCharCodes(this.eName);}
  getENameRaw() {return this.eName;}
  getJName() { return this.jName; }
  getStartYear() {return this.startYear;}
  getEndYear() {return this.endYear;}
  getNumYears() { return this.numYears;}
}

/**
 * Each ZodiacYear object stores info for one type of zodiac year.
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

 function capitalize(ttext) {
  if (ttext==null) return '';
  if (ttext.length>0) {
    return ttext.charAt(0).toUpperCase() + ttext.slice(1);
  } else {
    return '';
  }
}

export default YearConverters;