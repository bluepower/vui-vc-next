<template>
  <transition :name="transitionName">
    <div
      class="v-tab-pane"
      v-show="activePane"
      role="tabpanel"
      :tab="name"
    >
      <slot></slot>
    </div>
  </transition>
</template>

<script>
import { computed, inject, onMounted, onUnmounted } from 'vue'

export default {
  name: 'v-tab-pane',

  props: {
    label: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const rootTabs = inject('rootTabs')
    const paneItem = {
      name: props.name,
      label: props.label,
      disabled: props.disabled
    }

    const activePane = computed(() => rootTabs.state.currentName === props.name)

    const transitionName = computed(
      () =>
        `v-tab-slide-${
          rootTabs.state.prevIndex > rootTabs.currentIndex.value
            ? 'right'
            : 'left'
        }`
    )

    onMounted(() => rootTabs.addPane(paneItem))
    onUnmounted(() => rootTabs.removePane(paneItem))

    return {
      rootTabs,
      activePane,
      transitionName
    }
  }
}
</script>

<style lang="scss">
// @import '../../assets/styles/vui.scss';

.v-tab-pane {
  position: relative;
  width: 100%;
  transform: translateZ(0);
}

.v-tab-slide-left,
.v-tab-slide-right {
  &-enter {
    opacity: 0.01;
  }

  &-enter-active {
    transition: all 300ms;
  }

  &-leave-active {
    position: absolute;
    top: 0;
    transition: all 300ms;
  }

  &-leave-to {
    opacity: 0.01;
  }
}

.v-tab-slide-left {
  &-enter {
    transform: translateX(100%);
  }

  &-leave-to {
    transform: translateX(-100%);
  }
}

.v-tab-slide-right {
  &-enter {
    transform: translateX(-100%);
  }

  &-leave-to {
    transform: translateX(100%);
  }
}
</style>
