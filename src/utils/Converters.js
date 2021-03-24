import Converter from './Converter';
import {cv} from './modes';

/**
 * This class is a collection of Converter objects, along with methods for retrieval, 
 * indexing and conversion.
 * The constructor sets up a dictionary of Converter objects, using the convCode as the index.
 * Ordinary conversion operations are handed off to the individual Converter object.
 * Separate convTypeToConvCodesDict and convTypeToConvInfoDict dictionaries are used to populate 
 * lists of available conversions in the UI, and these are created as they're needed.
 */
class Converters {
  constructor () {
    this.convDict = {}; // key = convCode, value = converter object
    this.clearConvTypeDicts(); // set these to empty dicts
    this.validConvTypes = [cv.FROMMETRIC, cv.TOMETRIC, cv.FROMJPMEASURE, cv.TOJPMEASURE];
    this.tempConvCodes = ['c2f', 'f2c']; // these can use negative numbers
    this.minimumCentigrade = -274;
    this.minimumFahrenheit = -460;
    this.loadBaseConverters();
    this.currYear = new Date().getFullYear(); // TEMPORARY TODO: remove this line
  }
  clearConvTypeDicts() {
    this.convTypeToConvCodesDict = {}; // key = convType, value = list of convCodes
    this.convTypeToConvInfoDict = {}; // key = convType, value = list of (convCode, convDisplay) tuples
  }
  /**
   * Returns true if valid conversion type
   */
  isValidConvType(convType) {
    return this.validConvTypes.includes(convType);
  }
  /**
   * Return true for temperature conversions 'f2c' or 'c2f'.
   */
  isTempConv(convCode) {return this.tempConvCodes.includes(convCode);}
  /**
   * Is the given temperature below absolute zero?
   */
  isTooCold(convCode, amt1) {
    if (!(this.isTempConv(convCode))) return false;
    if ((convCode === 'c2f') && (amt1<this.minimumCentigrade)) return true;
    if ((convCode === 'f2c') && (amt1<this.minimumFahrenheit)) return true;
    return false;
  }
  /**
   * Make both convType dictionaries at the same time. They are used to populate UI radio buttons.
   * convTypeToConvCodesDict - key is convType, each value is array of convCode strings.
   * convTypeToConvInfoDict - key is convType, value is array of [convCode, conv display] tuples
   */
  makeConvTypeToConvDicts() {
    this.clearConvTypeDicts();
    for (const [theCode, oneConverter] of Object.entries(this.convDict)) {
      const theType = oneConverter.getConvType();
      const theDisplay = oneConverter.getConvDisplay();
      const theTuple = [theCode, theDisplay];
      if (this.convTypeToConvCodesDict.hasOwnProperty(theType)) {
        this.convTypeToConvCodesDict[theType].push(theCode);
      } else {
        this.convTypeToConvCodesDict[theType] = [theCode];
      }
      if (this.convTypeToConvInfoDict.hasOwnProperty(theType)) {
        this.convTypeToConvInfoDict[theType].push(theTuple);
      } else {
        this.convTypeToConvInfoDict[theType] = [theTuple];
      }
    }
  }
  /**
   * Return array of convCodes for a particular convType (e.g. 'tometric').
   * If dictionary is empty, call method to create it.
   */
  convTypeToConvCodes(convType) {
    if (Object.keys(this.convTypeToConvCodesDict).length===0) { this.makeConvTypeToConvDicts(); }
    if ((this.convTypeToConvCodesDict.hasOwnProperty(convType))) {
      return this.convTypeToConvCodesDict[convType];
    }
    return [];
  }

  /**
   * Return array of convInfo tuples for a particular convType.
   * If dictionary is empty, call method to create it.
   */
  convTypeToConvInfo(convType) {
    if (Object.keys(this.convTypeToConvCodesDict).length===0) { this.makeConvTypeToConvDicts(); }
    if ((this.convTypeToConvInfoDict.hasOwnProperty(convType))) {
      return this.convTypeToConvInfoDict[convType];
    }
    return [];
  }

  /**
   * Get total count of all converters currently available.
   */
  numberOfConvertersTotal() {
    return Object.keys(this.convDict).length;
  }
  /**
   * Find number of converters for one type, return maximum of those values.
   */
  maxConvertersPerType() {
    const numConvertersByType = [];
    for (const oneType of this.validConvTypes) {
      numConvertersByType.push(this.convTypeToConvCodes(oneType).length);
    }
    return Math.max(...numConvertersByType);
  }

  /**
   * Determine minimum allowed value for amt1 based on convType
   */
  getMinAmt(convCode) {
    if (convCode==='c2f') {return this.minimumCentigrade;}
    if (convCode==='f2c') {return this.minimumFahrenheit;}
    return 0;
  }

  /**
   * Pass along to Converter component, then adjust second line of return equation with 
   * warnings when there are problems.
   */
  getEquationArray(convCode, amt1, eqstring='= ') {
    const amt1Num = (amt1==='-') ? 0 : amt1;
    let result = ['', ''];
    try {
      result = this.convDict[convCode].getEquationArray(amt1Num, eqstring);
      if (isNaN(amt1Num)) {
        result[1] = 'is not a number';
      } else if (amt1Num<this.getMinAmt(convCode)) {
        result[1] = this.isTooCold(convCode, amt1Num) ? 'is below absolute zero':'is out of range';
      }
    }
    catch (error) {}
    return result;
  }

  // simple pass-through routines next
  getEquationString(convCode, amt1, eqstring=' = ') {
    let result = '';
    try {result = this.convDict[convCode].getEquationString(amt1, eqstring);}
    catch (error) {}
    return result;
  }
  getAmt2StringUnits(convCode, amt1) {
    let result = '';
    try {result = this.convDict[convCode].getAmt2StringUnits(amt1);}
    catch (error) {}
    return result;
  }
  getAmt2String(convCode, amt1) {
    let result = '';
    try {result = this.convDict[convCode].getAmt2String(amt1);}
    catch (error) {}
    return result;
  }
  getAmt2Float(convCode, amt1) {
    let result = '';
    try {result = this.convDict[convCode].getAmt2Float(amt1);}
    catch (error) {}
    return result;
  }
  getAmt1StringUnits(convCode, amt1) {
    let result = '';
    try {result = this.convDict[convCode].getAmt1StringUnits(amt1);}
    catch (error) {}
    return result;
  }
  getUnitKanji(convCode) {
    let result = '';
    try {result = this.convDict[convCode].getUnitKanji();}
    catch (error) {}
    return result;
  }

  getFirstConvCodeFromConvType(convType) { // temp uses radioProps
    const radioProps = this.convTypeToRadioProps(convType);
    return radioProps[0].value;
  }

  radioIndexToConvCode(convType, radioIndex) {
    const radioProps = this.convTypeToRadioProps(convType);
    return radioProps[radioIndex].value;
  }

  /**
   * Returns array of objects {label: convDisplayText, value: convCode} to make radio buttons.
   * Simply converts array of arrays provided by convTypeToConvInfo to array of objects 
   * needed by react-native-simple-radio-button API.
   */
  convTypeToRadioProps(convType) {
    const rpArray = [];
    if (this.validConvTypes.includes(convType)) {
      const cInfoTupleArray = this.convTypeToConvInfo(convType);
      let radioIx = 0;
      for (const [convCode, convDesc] of cInfoTupleArray) {
        const oneRadioPropObj = {label: convDesc, value: convCode, ixValue: radioIx};
        rpArray.push(oneRadioPropObj);
        radioIx += 1;
      }
    }
    return rpArray;
  }

  loadBaseConverters() { // this can alternatively be done from external file
    // console.log('*** loadBaseConverters'); 
    const convTuples = [
      ['c2f', '°C to °F', '°C', '', '°F', 0.0, 1, 'frommetric'],
      ['km2mi', 'kilometers to miles', 'kilometers', 'kilometer', 'miles', 0.621371, 2, 'frommetric'],
      ['m2ft', 'meters to feet', 'meters', 'meter', 'feet', 3.28084, 3, 'frommetric'],
      ['cm2in','centimeters to inches', 'centimeters', 'centimeter', 'inches', 0.393701, 3, 'frommetric'],
      ['sqm2sqft','sq meters to sq feet','square meters','square meter', 'square feet', 10.7640, 3, 'frommetric'],
      ['kg2lb','kilograms to pounds', 'kilograms','kilogram', 'pounds', 2.2046, 3, 'frommetric'],
      ['ml2oz','milliliters to fluid ounces', 'milliliters', 'milliliter', 'fluid oz', 0.033814, 3, 'frommetric'],
      ['f2c','°F to °C', '°F', '','°C', 0.0, 1, 'tometric'],
      ['mi2km','miles to kilometers','miles', 'mile', 'km', 1.60934, 2, 'tometric'],
      ['ft2m','feet to meters','feet','foot', 'meters', 0.3048, 3, 'tometric'],
      ['in2cm','inches to centimeters', 'inches', 'inch', 'cm', 2.54, 3, 'tometric'],
      ['sqft2sqm','sq feet to sq meters','square feet', 'square foot', 'sq meters', 0.0929, 3, 'tometric'],
      ['lb2kg','pounds to kilograms', 'pounds','pound', 'kilograms', 0.45359, 3, 'tometric'],
      ['oz2ml','fluid ounces to milliliters','fluid oz','','milliliters', 29.5735, 3, 'tometric'],
      ['sqm2jo', 'square meters to jo', 'square meters', 'square meter', 'jo', 0.605, 2, 'tojpmeasure', '畳'],
      ['sqft2jo', 'square feet to jo', 'square feet', 'square foot', 'jo',  0.0562, 3, 'tojpmeasure', '畳'],
      ['jo2sqm', 'jo to square meters', 'jo', '', 'square meters', 1.653, 2, 'fromjpmeasure', '畳'],
      ['jo2sqft', 'jo to square feet', 'jo', '', 'square feet.', 17.79, 2, 'fromjpmeasure', '畳'],
      ['go2ml', 'go to ml (sake)', 'go', '', 'ml', 180.4, 2, 'fromjpmeasure', '合'],
      ['ml2go', 'ml to go (sake)', 'milliliters', 'milliliter', 'go', 0.005544, 4, 'tojpmeasure', '合'],
      ['go2floz', 'go to fluid oz (sake)', 'go', '', 'fluid oz.', 6.1, 2, 'fromjpmeasure', '合'],
      ['floz2go', 'fluid oz to go (sake)', 'fluid oz', '', 'go', 0.1639, 3, 'tojpmeasure', '合'],	
      ['sh2ml', 'shaku to ml (sake)', 'shaku', '', 'ml', 18.04, 1, 'fromjpmeasure', '勺'],
      ['ml2sh', 'ml to shaku (sake)', 'milliliters', 'milliliter', 'shaku', 0.05544, 3, 'tojpmeasure', '勺'],
      ['sh2floz', 'shaku to fluid oz (sake)', 'shaku', '', 'fluid oz', 0.61, 3, 'fromjpmeasure', '勺'],
      ['floz2sh', 'fluid oz to shaku (sake)', 'fluid oz', 'fluid oz', 'shaku', 1.639, 3, 'tojpmeasure', '勺'],
      ['acre2tsubo', 'acres to tsubo', 'acres', 'acre','tsubo', 1224.18, 2, 'tojpmeasure', '坪'],
      ['sqm2tsubo', 'square meters to tsubo', 'square meters', 'square meter','tsubo', 0.3025, 2, 'tojpmeasure', '坪'],
      ['sqft2tsubo', 'square feet to tsubo', 'square feet', 'square foot', 'tsubo',  0.0281, 3, 'tojpmeasure', '坪'],
      ['tsubo2acre', 'tsubo to acres', 'tsubo', '', 'acres', 0.0008169, 5, 'fromjpmeasure', '坪'],
      ['tsubo2sqm', 'tsubo to square meters', 'tsubo', '', 'square meters', 3.3058, 2, 'fromjpmeasure', '坪'],
      ['tsubo2sqft', 'tsubo to square feet', 'tsubo', '', 'square feet',  35.584, 2, 'fromjpmeasure', '坪'],
    ];
    for (const convTuple of convTuples) {
      this.loadOneConverter(convTuple);  // separate method so it can be used independently 
    }
  }
  /**
   * Load a single converter. 
   */
  loadOneConverter(convTuple) {
    if (this.validConvTypes.includes(convTuple[7])) { // make sure convType is valid and not misspelled
      this.convDict[convTuple[0]] = new Converter(...convTuple);  // use convCode as index, overwrite if it already exists
      this.clearConvTypeDicts();  // will recalculate these when necessary
    } else {
      console.log('** invalid converter type: ' + convTuple[7]);
      // alert ('invalid converter type ' + convTuple[7]);
    }
    // console.log('**loading one converter.');
  }

}

export default Converters;