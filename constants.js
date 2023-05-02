export const matrixCoefficients = {
  'BT.601': [0.299, 0.587, 0.114],
  'BT.709': [0.2127, 0.7152, 0.0722],
  FCC: [0.3, 0.59, 0.11],
  SMPTE240M: [0.212, 0.701, 0.087]
}

export const libassYCbCrMap = ['BT.601', 'BT.601', 'BT.601', 'BT.601', 'BT.601', 'BT.709', 'BT.709', 'SMPTE240M', 'SMPTE240M', 'FCC', 'FCC']

export const webYCbCrMap = {
  bt709: 'BT.709',
  bt470bg: 'BT.601',
  smpte170m: 'BT.601'
}

export const svgStart = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'f\'><feColorMatrix type=\'matrix\' values=\''
export const svgEnd = '\'/></filter></svg>#f")'
