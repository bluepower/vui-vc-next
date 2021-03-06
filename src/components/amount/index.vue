<template>
  <span :class="cls">
    <template v-if="!isCapital">
      {{ doFormat(doPrecision(state.formatValue, legalPrecision, isRoundUp), hasSeparator, separator) }}
    </template>
    <template v-else>
      {{ doCapital(doPrecision(state.formatValue, 4, isRoundUp)) }}
    </template>
  </span>
</template>

<script>
import { reactive, onMounted, computed, watch } from 'vue'
import animateUtil from '../../utils/animate'
import amountNumberCapital from '../../utils/numberCapital'
import { noop, isInBrowser, formatValueByGapStep } from '../../utils/index'

export default {
  name: 'v-amount',

  props: {
    // The number value
    value: {
      type: Number,
      default: 0
    },
    // The number precision
    precision: {
      type: Number,
      default: 2
    },
    // Whether the number should be round up
    isRoundUp: {
      type: Boolean,
      default: true
    },
    // Whether the thousand separator is existing
    hasSeparator: {
      type: Boolean,
      default: false
    },
    // The thousand separator
    separator: {
      type: String,
      default: ','
    },
    // Whether the number should be converted to Chinese capital
    isCapital: {
      type: Boolean,
      default: false
    },
    // Whether show animation when value changes
    isAnimated: {
      type: Boolean,
      default: false
    },
    // deprecated
    /* transition: {
      type: Boolean,
      default: false
    }, */
    // The animation duration (ms)
    duration: {
      type: Number,
      default: 1000
    }
  },

  setup(props) {
    const state = reactive({
      formatValue: 0, // The format value
      isMounted: false // Whether already mounted
    })

    onMounted(() => {
      state.isMounted = true
    })

    const cls = computed(() => {
      return ['v-amount', { 'numerical': !props.isCapital }]
    })

    // Calculate legal precision
    const legalPrecision = computed(() => {
      return props.precision > 0 ? props.precision : 0
    })

    const doPrecision = (value, precision, isRoundUp) => {
      const result = Number(`${value}e${precision}`)
      const rounded = isRoundUp ? Math.round(result) : Math.floor(result)
      return Number(`${rounded}e-${precision}`).toFixed(precision)
    }

    const doFormat = (value, hasSeparator, seperator) => {
      if (!hasSeparator) {
        return value
      }
      const arrNumber = value.split('.') || []
      const integerValue = arrNumber[0] || 0 // The integer part
      const decimalValue = arrNumber[1] || 0 // The decimal part
      const formatResult = formatValueByGapStep({
        step: 3,
        value: integerValue,
        gap: seperator,
        direction: 'right',
        range: 0,
        isAdd: 1,
        oldValue: ''
      })
      return decimalValue
        ? `${formatResult.value}.${decimalValue}`
        : `${formatResult.value}`
    }

    const doCapital = (value) => {
      return amountNumberCapital(value)
    }

    const doAnimate = (fromValue = 0, toValue = 0) => {
      const step = (percent) => {
        if (percent === 1) {
          state.formatValue = toValue
          return
        }
        state.formatValue = fromValue + (toValue - fromValue) * percent
      }
      const verify = (id) => id
      const animate = animateUtil()
      animate.start(step, verify, noop, props.duration, null, null)
    }

    watch(
      () => props.value,
      (val, oldVal) => {
        if (!isInBrowser && !state.isMounted) {
          state.formatValue = val
          return
        }
        if (props.isAnimated) {
          doAnimate(oldVal, val)
        } else {
          state.formatValue = val
        }
      },
      {
        immediate: true
      }
    )

    return {
      state,
      cls,
      legalPrecision,
      doPrecision,
      doFormat,
      doCapital
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/vui-variables.scss';

.v-amount {
  &.numerical {
    font-family: VC-Amount,"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",Arial,sans-serif;
  }
}

@font-face {
  font-family: VC-Amount;
  font-style: normal;
  font-weight: normal;
  src: $amount-font-family;
}
</style>
