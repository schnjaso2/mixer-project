export const knob = {
  regular: {
    readOnly: false,
    displayInput: false,
    size: 45,
    startAngle: -160,
    endAngle: 160,
    unit: '%',
    min: 0,
    max: 100,
    trackWidth: 5,
    barWidth: 5,
    trackColor: '#000',
    barColor: '#49afd9',
    bgColor: '#0F171C',
    bgFull: true,
    scale: {
      enabled: true,
      type: 'dots',
      color: '#49afd9',
      width: 1,
      quantity: 20,
      height: 2,
      spaceWidth: 5
    },
    animate: {
      enabled: true,
      duration: 500,
      ease: 'linear'
    },
  },
  eq: {
    readOnly: false,
    displayInput: false,
    size: 45,
    startAngle: -160,
    endAngle: 160,
    unit: '%',
    min: -35,
    max: 35,
    trackWidth: 5,
    barWidth: 5,
    trackColor: '#000',
    barColor: '#49afd9',
    bgColor: '#0F171C',
    bgFull: true,
    scale: {
      enabled: true,
      type: 'dots',
      color: '#49afd9',
      width: 1,
      quantity: 20,
      height: 2,
      spaceWidth: 5
    },
    animate: {
      enabled: true,
      duration: 1000,
      ease: 'linear'
    },
  }
}