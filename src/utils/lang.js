export const noop = function () { }

/**
 * Convert kebab-case to camelCase
 */
export const transformCamelCase = function (str) {
  const re = /-(\w)/g
  return str.replace(re, function ($0, $1) {
    return $1.toUpperCase()
  })
}

/**
 * Format value by gap step
 */
export function formatValueByGapStep({
  step,
  value,
  gap = ' ',
  direction = 'right',
  range,
  isAdd = 1,
  oldValue = ''
}) {
  if (value.length === 0) {
    return {
      value,
      range
    }
  }

  const arr = value && value.split('') || []
  let _range = range
  let showValue = ''

  if (direction === 'right') {
    for (let j = arr.length - 1, k = 0; j >= 0; j--, k++) {
      const m = arr[j]
      showValue = k > 0 && k % step === 0 ? m + gap + showValue : m + '' + showValue
    }
    if (isAdd === 1) {
      if (oldValue.length - showValue.length === -2) {
        _range = range + 1
      }
    } else {
      if (oldValue.length - showValue.length === 2) {
        _range = range - 1
      }
      if (_range <= 0) {
        _range = 0
      }
    }
  } else {
    arr.some((n, i) => {
      showValue = i > 0 && i % step === 0 ? showValue + gap + n : showValue + '' + n
    })
    const adjust = range % (step + 1) === 0 ? 1 * isAdd : 0
    _range = typeof range !== 'undefined' ? (range === 0 ? 0 : range + adjust) : showValue.length
  }

  return {
    value: showValue,
    range: _range
  }
}