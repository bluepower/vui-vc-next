<template>
  <router-link
    to="/"
    class="v-back"
  >&lt; Home</router-link>
  <div class="v-example">
    <p>Tag - Demo colors</p>
    <v-tag
      v-for="(cMap, cKey) in computedColors"
      :key="cKey"
      type="fill"
      size="large"
      shape="circle"
      :fill-color="cMap.base || '#EFEFEF'"
      @click="showTagPopup('center', true, cKey, cMap)"
    >{{ cKey }}</v-tag>
    <v-popup
      position="center"
      transition="v-bounce"
      v-model:value="popupShow.center"
    >
      <div class="v-example-popup v-example-popup-center">
        <h3>{{ popupShow.cKey }}</h3>
        <ul>
          <li
            v-for="(subValue, subKey) in popupShow.cMap"
            :key="subKey"
            :class="rowCls(subKey)"
            :style="rowStyle(subValue)"
          >
            <span class="caption">
              <span v-if="popupShow.cKey !== 'shades'">{{ popupShow.cKey }}</span>
              <span v-if="subKey !== 'base'">{{ formatSubColorKey(subKey) }}</span>
            </span>
            <span v-if="subValue !== 'transparent'">
              {{ subValue.toUpperCase() }}
            </span>
          </li>
        </ul>
      </div>
    </v-popup>
  </div>
  <div class="v-example">
    <p>Tag Shape - Circle</p>
    <v-tag
      type="fill"
      size="small"
      shape="circle"
      fill-color="#FC5353"
    >100</v-tag>
    <v-tag
      type="fill"
      size="small"
      shape="circle"
      fill-color="#36C"
      font-color="#FFF"
    >promotion</v-tag>
    <v-tag
      type="ghost"
      size="small"
      shape="circle"
    >10%</v-tag>
    <v-tag
      type="fill"
      size="small"
      shape="circle"
      sharp="bottom-right"
      fill-color="#36C"
      font-color="#FFF"
    >half price</v-tag>
  </div>
  <div class="v-example">
    <p>Tag Shape - Special</p>
    <v-tag
      type="fill"
      shape="coupon"
      fill-color="#36C"
      font-color="#FFF"
    >Coupon Ticket</v-tag>
    <v-tag
      type="fill"
      shape="quarter"
      fill-color="#FC9191"
      font-color="#FFF"
    >&times;</v-tag>
    <v-tag
      type="fill"
      shape="bubble"
      fill-color="#999"
      font-color="#FFF"
    >88</v-tag>
  </div>
  <div class="v-example">
    <p>Tag Shape - No fill color</p>
    <v-tag
      type="fill"
      shape="square"
      fill-color
    >&pound;100</v-tag>
  </div>
</template>

<script>
import { computed } from 'vue'
// import VTag from '../components/tag/index.vue'
// import VPopup from '../components/popup/index.vue'
import colors from '../constants/colors'
import { kebab, formatColor } from '../utils/index'
import useShowPopup from '../composables/useShowPopup'

export default {
  name: 'tag-demo',

  inheritAttrs: false,

  // components: {
  //   VTag,
  //   VPopup
  // },

  setup() {
    const popup = useShowPopup()

    // show/hide popup for tag demo
    const showTagPopup = (type, isShow, cKey, cMap) => {
      const popupShowVal = popup.mapping.value
      popupShowVal[type] = isShow
      popupShowVal['cKey'] = cKey
      popupShowVal['cMap'] = cMap
    }

    const computedColors = computed(() => {
      const colorsMap = {}

      Object.keys(colors).forEach((key) => {
        const kebabKey = kebab(key)
        colorsMap[kebabKey] = colors[key]
      })

      return colorsMap
    })

    const rowCls = (colorKey) => {
      return [
        'row-item',
        `${/darken|base|black/.test(colorKey) ? 'white-text' : 'black-text'}`
      ]
    }

    const rowStyle = (colorValue) => {
      return {
        'background-color': colorValue
      }
    }

    const formatSubColorKey = (colorKey) => formatColor(colorKey)

    return {
      computedColors,
      popupShow: popup.mapping,
      showTagPopup,
      rowCls,
      rowStyle,
      formatSubColorKey
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/vui-example.scss';

.v-example-popup {
  width: 80vw;

  h3 {
    margin-bottom: 30px;
  }

  .row-item {
    padding: 20px;
    display: flex;

    span {
      font-size: 20px;
    }

    span.caption {
      margin-left: 0;
      display: flex;
      flex: 1;
    }
  }

  .white-text {
    color: #fff;
  }

  .black-text {
    color: #000;
  }
}
</style>
