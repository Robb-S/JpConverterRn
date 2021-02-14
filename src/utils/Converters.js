class Converters {

  constructor (thename='dummyname') {
    this.name = thename;
    console.log('** inside Converters constructor');
  }

  getFirstConvCodeFromConvType(convType) { // temp uses radioProps
    const radioProps = this.convTypeToRadioProps(convType);
    return radioProps[0].value;
  }

  convTypeToRadioProps(convType) {
    if (['tometric'].includes(convType)) {
      return [
        {label: 'to metric 1', value: 'tometric1' },
        {label: 'square feet to square meters', value: 'sqft2sqm' },
        {label: 'to metric 3', value: 'tometric3' },
        {label: 'to metric 4', value: 'tometric4' },
        {label: 'to metric 5', value: 'tometric5' },        
      ];
    } else if (['frommetric'].includes(convType)) {
      return [
        {label: 'from metric 1', value: 'frmetric1' },
        {label: 'square meters to square feet', value: 'sqm2sqft' },
        {label: 'from metric 3', value: 'frmetric3' },
        {label: 'from metric 4', value: 'frmetric4' },
        {label: 'from metric 5', value: 'frmetric5' },     
      ];
    } else if (['tojpmeasure', 'fromjpmeasure'].includes(convType)) {
      return [
        {label: 'jpmeasure 1', value: 'jpmeasure1' },
        {label: 'jpmeasure 2', value: 'jpmeasure2' },
        {label: 'tsubo to square meters', value: 'jpmeasure3' },
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