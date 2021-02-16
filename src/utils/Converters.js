import Converter from './Converter';

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
    this.validConvTypes = ['frommetric', 'tometric', 'fromjpmeasure', 'tojpmeasure'];
    this.loadBaseConverters();
    this.currYear = new Date().getFullYear(); // TEMPORARY TODO: remove this line
  }
  clearConvTypeDicts() {
    this.convTypeToConvCodesDict = {}; // key = convType, value = list of convCodes
    this.convTypeToConvInfoDict = {}; // key = convType, value = list of (convCode, convDisplay) tuples
  }
  loadBaseConverters() { // this can alternatively be done from external file
    console.log('*** loadBaseConverters'); 
    this.tempConvCodes = ['c2f', 'f2c']; // these can use negative numbers
    this.minimumCentigrade = -274;
    this.minimumFahrenheit = -460;
    const convTuples = [
      ["c2f", "°C to °F", "°C", "", "°F", 0.0, 1, "frommetric"],
      ["km2mi", "kilometers to miles", "kilometers", "kilometer", "miles", 0.621371, 2, "frommetric"],
      ["m2ft", "meters to feet", "meters", "meter", "feet", 3.28084, 3, "frommetric"],
      ["cm2in","centimeters to inches", "centimeters", "centimeter", "inches", 0.393701, 3, "frommetric"],
      ["sqm2sqft","square meters to square feet","square meters","square meter", "square feet", 10.7640, 3, "frommetric"],
      ["kg2lb","kilograms to pounds", "kilograms","kilogram", "pounds", 2.2046, 3, "frommetric"],
      ["ml2oz","milliliters to fluid ounces", "milliliters", "milliliter", "fluid oz", 0.033814, 3, "frommetric"],
      ["f2c","°F to °C", "°F", "","°C", 0.0, 1, "tometric"],
      ["mi2km","miles to kilometers","miles", "mile", "km", 1.60934, 2, "tometric"],
      ["ft2m","feet to meters","feet","foot", "meters", 0.3048, 3, "tometric"],
      ["in2cm","inches to centimeters", "inches", "inch", "cm", 2.54, 3, "tometric"],
      ["sqft2sqm","square feet to square meters","square feet", "square foot", "sq meters", 0.0929, 3, "tometric"],
      ["lb2kg","pounds to kilograms", "pounds","pound", "kilograms", 0.45359, 3, "tometric"],
      ["oz2ml","fluid ounces to milliliters","fluid oz","","milliliters", 29.5735, 3, "tometric"],
      ["acre2tsubo", "acres to tsubo", "acres", "acre","tsubo", 1224.18, 2, "tojpmeasure", "坪"],
      ["sqm2tsubo", "square meters to tsubo", "square meters", "square meter","tsubo", 0.3025, 2, "tojpmeasure", "坪"],
      ["sqft2tsubo", "square feet to tsubo", "square feet", "square foot", "tsubo",  0.0281, 3, "tojpmeasure", "坪"],
      ["sqm2jo", "square meters to jo", "square meters", "square meter", "jo", 0.605, 2, "tojpmeasure", "畳"],
      ["sqft2jo", "square feet to jo", "square feet", "square foot", "jo",  0.0562, 3, "tojpmeasure", "畳"],
      ["tsubo2acre", "tsubo to acres", "tsubo", "", "acres", 0.0008169, 5, "fromjpmeasure", "坪"],
      ["tsubo2sqm", "tsubo to square meters", "tsubo", "", "square meters", 3.3058, 2, "fromjpmeasure", "坪"],
      ["tsubo2sqft", "tsubo to square feet", "tsubo", "", "square feet",  35.584, 2, "fromjpmeasure", "坪"],
      ["jo2sqm", "jo to square meters", "jo", "", "square meters", 1.653, 2, "fromjpmeasure", "畳"],
      ["jo2sqft", "jo to square feet", "jo", "", "square feet.", 17.79, 2, "fromjpmeasure", "畳"],
      ["go2ml", "go to ml (sake)", "go", "", "ml", 180.4, 2, "fromjpmeasure", "合"],
      ["ml2go", "ml to go (sake)", "milliliters", "milliliter", "go", 0.005544, 4, "tojpmeasure", "合"],
      ["go2floz", "go to fluid oz (sake)", "go", "", "fluid oz.", 6.1, 2, "fromjpmeasure", "合"],
      ["floz2go", "fluid oz to go (sake)", "fluid oz", "", "go", 0.1639, 3, "tojpmeasure", "合"],	
      ["sh2ml", "shaku to ml (sake)", "shaku", "", "ml", 18.04, 1, "fromjpmeasure", "勺"],
      ["ml2sh", "ml to shaku (sake)", "milliliters", "milliliter", "shaku", 0.05544, 3, "tojpmeasure", "勺"],
      ["sh2floz", "shaku to fluid oz (sake)", "shaku", "", "fluid oz", 0.61, 3, "fromjpmeasure", "勺"],
      ["floz2sh", "fluid oz to shaku (sake)", "fluid oz", "fluid oz", "shaku", 1.639, 3, "tojpmeasure", "勺"],
    ]
    for (const convTuple of convTuples) {
      this.loadOneConverter(convTuple);  // separate method so it can be used independently 
    }
  }     
  /**
   * Load a single converter. 
   */
  loadOneConverter(convTuple) {
    if (this.validConvTypes.includes(convTuple[7])) { // make sure convType is valid and not misspelled
      this.convDict[convTuple[0]] = new Converter(...convTuple)  // use convCode as index, overwrite if it already exists
      this.clearConvTypeDicts();  // will recalculate these when necessary
    } else { // TODO raise error?
      console.log('** invalid converter type: ' + convTuple[7]);
      alert ('invalid converter type ' + convTuple[7]);
    }
    // console.log('**loading one converter.');
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
    if ((convCode === "c2f") && (amt1<this.minimumCentigrade)) return true;
    if ((convCode == "f2c") && (amt1<this.minimumFahrenheit)) return true;
    return false;
  }

  getEquationString(convCode, amt1, eqstring=" = ") {
    let result = '';
    try {result = this.convDict[convCode].getEquationString(amt1, eqstring);} 
    catch (error) {}
    return result;
  }

  getEquationArray(convCode, amt1, eqstring="= ") {
    let result = ['', ''];
    try {result = this.convDict[convCode].getEquationArray(amt1, eqstring);} 
    catch (error) {}
    return result;
  }

  getFirstConvCodeFromConvType(convType) { // temp uses radioProps
    const radioProps = this.convTypeToRadioProps(convType);
    return radioProps[0].value;
  }

  convTypeToRadioProps(convType) {
    if (['tometric'].includes(convType)) {
      return [
        {label: '°F to °C', value: 'f2c' },
        {label: 'miles to kilometers', value: 'mi2km' },
        {label: 'feet to meters', value: 'ft2m' },
        {label: 'inches to centimeters"', value: 'in2cm' },
        {label: 'square feet to square meters', value: 'sqft2sqm' },
        {label: 'pounds to kilograms', value: 'lb2kg' },
        {label: 'fluid ounces to milliliters', value: 'oz2ml' },    
      ];
    } else if (['frommetric'].includes(convType)) {
      return [
        {label: '°C to °F', value: 'c2f' },
        {label: 'kilometers to miles', value: 'km2mi' },
        {label: 'meters to feet', value: 'm2ft' },
        {label: 'centimeters to inches', value: 'cm2in' },     
        {label: 'square meters to square feet', value: 'sqm2sqft' },
        {label: 'kilograms to pounds', value: 'kg2lb' },
        {label: 'milliliters to fluid ounces', value: 'ml2oz' },
      ];
    } else if (['tojpmeasure'].includes(convType)) {
      return [
        {label: 'square meters to tsubo', value: 'sqm2tsubo' },
        {label: 'jpmeasure 1', value: 'jpmeasure1' },
        {label: 'jpmeasure 2', value: 'jpmeasure2' },
        {label: 'jpmeasure 3', value: 'jpmeasure3' },
        {label: 'jpmeasure 4', value: 'jpmeasure4' },
        {label: 'jpmeasure 5', value: 'jpmeasure5' },
        {label: 'jpmeasure 6', value: 'jpmeasure6' },
        {label: 'jpmeasure 7', value: 'jpmeasure7' },
        {label: 'jpmeasure 8', value: 'jpmeasure8' },
        {label: 'jpmeasure 9', value: 'jpmeasure9' },
        {label: 'jpmeasure 10', value: 'jpmeasure10' },
      ];
    } else if (['fromjpmeasure'].includes(convType)) {
      return [
        {label: 'tsubo to square meters', value: 'tsubo2sqm' },
        {label: 'jpmeasure 1', value: 'jpmeasure1' },
        {label: 'jpmeasure 2', value: 'jpmeasure2' },
        {label: 'jpmeasure 4', value: 'jpmeasure4' },
        {label: 'jpmeasure 5', value: 'jpmeasure5' },
      ];
    } else if (['tojpyear', 'fromjpyear'].includes(convType)) {
      return [
        {label: 'jpyears 1', value: 'jpyears1' },
        {label: 'jpyears 2', value: 'jpyears2' },
        {label: 'jpyears 3', value: 'jpyears3' },
        {label: 'jpyears 4', value: 'jpyears4' },
        {label: 'jpyears 5', value: 'jpyears5' },       
        {label: 'jpyears 6', value: 'jpyears6' },   
        {label: 'jpyears 7', value: 'jpyears7' },   
        {label: 'jpyears 8', value: 'jpyears8' },   
      ];
    } else {
      return [
        {label: 'zodiac 1', value: 'zodiac1' },
      ];
    }
  }

  convCodeToDisplay(convCode) {
    return ('display version of ' + convCode);
  }

  getResult(fromValue, convCode) {
    return 2 * fromValue;
  }

  getInitFromValue(cvtype) {
    if (['tojpyear', 'tozodiac'].includes(cvtype)) {
      return this.currYear.toString();
    } else {
      return '1';
    }
  }

  convTypeToConvCodes(convType) {
    // console.log('convTypeToConvCodes for ' + convType);
    if (['tometric', 'frommetric'].includes(convType)) {
      return ['metric1', 'metric2 ','metric3 ','metricmetric4',
      'metric5', 'metric6','metric7'];
    } else if (['tojpmeasure', 'fromjpmeasure', 'tozodiac'].includes(convType)) {
      return ['converter B1', 'converter B2','converter B3',
      'converter converter B4','converter B5', 'converterB6', 'converterB7'];
    } else {
      return ['jyears B1', 'jyears B2','jyears B3',
      'jyears jyears B4','jyears B5', 'jyears B7', 'jyears B7',
      'jyears jyears C4','jyears C5', 'jyears C6', 'jyears C7'];
    }
  }
}

export default Converters;