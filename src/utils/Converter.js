import { cv } from "./modes";

// Note: this is a matter of preference but (1) a lot of places name constants like const TEMP_CONV_CODES = ...
// (2) If you have a lot of constants sometimes it is nice to store them in a constants.js or .ts file so they can be exported and reused.

const tempConvCodes = ["c2f", "f2c"];

/**
 * One converter object contains conversion rate, labels, etc. to perform one type of
 * conversion and report results.
 * Methods: conversion result as float, string (to sig digits), string with units,
 * full equation string.
 */

class Converter {
  constructor(
    convCode,
    convDisplay,
    unit1,
    unit1single,
    unit2,
    convFactor,
    sigDigits,
    convType,
    unitKanji = ""
  ) {
    this.convCode = convCode; // eg "mi2km"
    this.convDisplay = convDisplay; // eg "miles to kilometers"
    this.unit1 = unit1; // eg "miles"

    if (unit1single.length > 0) {
      this.unit1single = unit1single;
    } // e.g. "mile" (if blank then same as unit1)
    else {
      this.unit1single = this.unit1;
    }

    this.unit2 = unit2; // eg "kilometers"
    this.convFactor = convFactor; // eg 1.60934
    this.sigDigits = sigDigits; // eg 2 (digits after decimal point)
    this.convType = convType; // eg "tometric" / "frommetric" / "tojpmeasure" / "fromjpmeasure"

    if (tempConvCodes.includes(this.convCode)) this.unitSpacer = "";
    // space before unit name, none if degree sign
    else this.unitSpacer = " ";
    this.unitKanji = unitKanji;
  }

  /**
   * Return conversion result as floating point.  Mostly used internally.
   */

  getAmt2Float(amt1) {
    // Note: Removed the else/if and else because they are not necessary
    if (this.convCode === "f2c") {
      return ((amt1 - 32.0) * 5.0) / 9.0;
    }

    if (this.convCode === "c2f") {
      return (amt1 * 9.0) / 5.0 + 32.0;
    }

    return amt1 * this.convFactor;
  }

  /**
   * Return result as string, with x significant digits after decimal point.
   */

  getAmt2String(amt1) {
    const amt2 = this.getAmt2Float(amt1);
    return amt2.toFixed(this.sigDigits);
  }

  /**
   * Return string with conversion result + units.
   */

  getAmt2StringUnits(amt1) {
    const hasKanji =
      this.unitKanji.length > 0 && this.convType === cv.TOJPMEASURE;
    const kpart = hasKanji ? " (" + this.unitKanji + ")" : "";
    const amt2str = this.getAmt2String(amt1);
    return amt2str + this.unitSpacer + this.unit2 + kpart;
  }

  /**
   * Return string with original amount plus units.
   */

  getAmt1StringUnits(amt1) {
    const hasKanji =
      this.unitKanji.length > 0 && this.convType === cv.FROMJPMEASURE;
    const kpart = hasKanji ? " (" + this.unitKanji + ")" : "";
    const units = this.getCorrectUnits(amt1);
    return amt1.toString() + this.unitSpacer + units + kpart;
  }

  /**
   * Return full equation as string.
   */

  getEquationString(amt1, eqstring = " = ") {
    return (
      this.getAmt1StringUnits(amt1) + eqstring + this.getAmt2StringUnits(amt1)
    );
  }

  /**
   * Return full equation as array of line 1 and line 2.
   */

  getEquationArray(amt1, eqstring = "= ") {
    const line1 = this.getAmt1StringUnits(amt1);
    const line2 = eqstring + this.getAmt2StringUnits(amt1);
    return [line1, line2];
  }

  getCorrectUnits(amt1) {
    // '1' gets singular, but '1.0' gets plural
    if (amt1 === "1" || amt1 === 1) {
      return this.unit1single;
    }

    // Note: removed the else here because it is not really necessary. The if (amt1)... is already an early return.
    return this.unit1;
  }

  // get properties next
  getConvCode() {
    return this.convCode;
  }
  getConvDisplay() {
    return this.convDisplay;
  }
  getUnit1() {
    return this.unit1;
  }
  getUnit1Single() {
    return this.unit1single;
  }
  getUnit2() {
    return this.unit2;
  }
  getConvFactor() {
    return this.convFactor;
  }
  getSigDigits() {
    return this.sigDigits;
  }
  getConvType() {
    return this.convType;
  }
  getUnitKanji() {
    return this.unitKanji;
  }
}

export default Converter;
