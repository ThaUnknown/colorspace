// [KR, KB]
export const matrixCoefficients = {
  'BT.601': [0.299, 0.114],
  'BT.709': [0.2126, 0.0722],
  'BT.2020': [0.2627, 0.0593],
  FCC: [0.3, 0.11],
  SMPTE240M: [0.212, 0.087]
}

// 8-bit [Y offset, Y scale, C scale]
export const levels = {
  TV: [16, 219, 224],
  PC: [0, 255, 255]
}

// null: no conversion
export const libassYCbCrMap = [['BT.601', 'TV'], null, null, ['BT.601', 'TV'], ['BT.601', 'PC'], ['BT.709', 'TV'], ['BT.709', 'PC'], ['SMPTE240M', 'TV'], ['SMPTE240M', 'PC'], ['FCC', 'TV'], ['FCC', 'PC']]

export const webYCbCrMap = {
  bt709: 'BT.709',
  bt470bg: 'BT.601',
  smpte170m: 'BT.601',
  'bt2020-ncl': 'BT.2020'
}

export const svgStart = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'f\'><feColorMatrix type=\'matrix\' values=\''
export const svgEnd = '\'/></filter></svg>#f")'
