<template>
  <sku-column-item
    v-model="propValue"
    :row="row"
    :options="options"
    :disabled="isView"
  />
</template>
<script>
import SkuColumnItem from './sku-column-item'
export default {
  name: 'SkuColumnGroup',
  props: {
    prop: String,
    row: Object,
    default: [Array, Number, String],
    isView: Boolean,
    skuPropCodes: Object
  },
  data() {
    return {
      options: Array.isArray(this.default) ? this.default : ''
    }
  },
  watch: {
    default() {
      this.options = this.default
      if (Array.isArray(this.default)) {
        // 更新销售属性列不触发更新
        if (this.propValue === '') {
          return
        }

        // 删除销售属性的属性值时触发清空
        if (this.default.indexOf(this.propValue) < 0) {
          this.propCode = ''
          this.propValue = ''
        }
        return
      }
    }
  },
  computed: {
    curSkuPropCodes() {
      const skuPropCodes = this.skuPropCodes && this.skuPropCodes[this.prop]
      if (skuPropCodes) {
        return skuPropCodes.split(',')
      }
      return []
    },
    // todo 待优化，虽然很难看，但是能用
    propValue: {
      get() {
        const propNames =
          (this.row.propNames && this.row.propNames.split(',')) || []
        const propValues =
          (this.row.propValues && this.row.propValues.split(',')) || []

        const propIndex = propNames.indexOf(this.prop)

        if (propIndex > -1) {
          return propValues[propIndex]
        }
        return this.value || ''
      },
      set(val) {
        const propNames =
          (this.row.propNames && this.row.propNames.split(',')) || []
        const propValues =
          (this.row.propValues && this.row.propValues.split(',')) || []
        // const propCodes =
        //   (this.row.propCodes && this.row.propCodes.split(',')) || []

        const propIndex = propNames.indexOf(this.prop)
        // const codeIndex = this.options.indexOf(val)

        // this.curSkuPropCodes[0] 为设置input类型的设置code
        // const propCode =
        //   this.curSkuPropCodes[codeIndex] ||
        //   this.curSkuPropCodes[0] ||
        //   // this.curSkuPropCodes.join(',') ||
        //   ''

        if (propIndex > -1) {
          propValues.splice(propIndex, 1, val)
          // propCodes.splice(propIndex, 1, propCode)

          this.row.propValues = propValues.join(',')
          // this.row.propCodes = propCodes.join(',')
        } else {
          propNames.push(this.prop)
          propValues.push(val)
          // propCodes.push(propCode)

          this.row.propNames = propNames.join(',')
          this.row.propValues = propValues.join(',')
          // this.row.propCodes = propCodes.join(',')
        }
      }
    }
  },
  components: {
    SkuColumnItem
  }
  // beforeDestroy 有问题
  // beforeDestroy () {
  //   console.log(this.prop)
  // }
}
</script>
