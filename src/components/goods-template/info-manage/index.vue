<template>
  <div class="info-manage">
    <div class="el-form-item el-form-item--medium">
      <label class="el-form-item__label" style="width: 110px">模板类型</label>
      <div class="el-form-item__content" style="margin-left: 110px">
        <el-select v-model="type" placeholder="请选择" @change="handleChange" :disabled="isView">
          <el-option
            v-for="(value, key) in templateType"
            :key="key"
            :label="value"
            :value="key">
          </el-option>
        </el-select>
      </div>
    </div>
    <form-renderer
      :content="currentInfo"
      :beforeRenderItem="handleBeforeRender"
      :disabled="isView"
      label-width="110px"
      ref="formRender"
    />
  </div>
</template>
<script>
import FormRenderer from 'el-form-renderer'
import BaseLayout from '../base-layout'
import uploadToAli from 'upload-to-ali'
import RelativeCar from './relation-car'

import goodsInfos from './goods-info/index.js'

import {goods, api} from './config.js'

export default {
  name: 'InfoManage',
  props: {
    value: Object,
    tempType: String,
    isView: Boolean,
    isCombo: Boolean
  },
  data() {
    return {
      isLoading: false,

      type: this.tempType,
      productPhoto: [],
      brandList: [],
      currentInfo: [],

      selectedRelativeCar: [], // 关联车型

      content: this.value || {},

      brandsSeries: []
    }
  },
  components: {
    FormRenderer,
    uploadToAli,
    BaseLayout
  },
  watch: {
    value(newVal) {
      this.type = newVal.type || 'NEW_CARS'
      this.content = newVal || {}
      // this.initValue()
      this.setCurrentInfo()
    }
  },
  computed: {
    templateType() {
      if (this.isCombo) {
        return combo.type
      }
      return goods.type
    }
  },
  created() {
    this.setCurrentInfo()

    // 避免重复请求
    this.hasRequestBrandsSeries = false
  },
  destroyed() {
    const type = this.type
    const currentInfo = goodsInfos[type]

    const index = currentInfo.findIndex(item => item.$id === 'brandId')

    if (index > -1) {
      currentInfo[index]['$options'] = []
    }
  },
  methods: {
    updateValue(values) {
      Object.keys(values).forEach(key => {
        this.$refs.formRender.updateValue({
          id: key,
          value: values[key]
        })
      })
    },
    validate(fn) {
      this.$refs.formRender.validate(fn)
    },
    setValue({id, value}) {
      this.$refs.formRender && this.$refs.formRender.updateValue({id, value})
    },
    getValue() {
      const value = this.$refs.formRender.getFormValue()
      let info = {}
      const array2string = val =>
        (Array.isArray(val) ? val.join(',') : val) || ''
      Object.keys(value).forEach(key => {
        if (key === 'RelativeCar') {
          info['carBrandId'] = array2string(this.selectedRelativeCar[0])
          info['carModelId'] = array2string(this.selectedRelativeCar[1])
          info['carSeriesId'] = array2string(this.selectedRelativeCar[2])
        } else if (key === 'depositPercent') {
          info[key] = Number(value[key]) || null
        } else if (key === 'productPhoto') {
          // 去掉最后一个空，设计上有问题
          // info[key] = value[key] && value[key].slice(0, -1).join(',')
          info[key] = value[key] && value[key].filter(item => !!item).join(',')
        } else if (value[key] !== undefined) {
          // info[key] = array2string(value[key])
          info[key] = value[key]
        }
      })
      return info
    },
    initValue() {
      const content = this.content
      this.currentInfo.forEach(item => {
        // if (content[item.$id] === undefined) {
        //   return
        // }
        if (item.$id === 'productPhoto') {
          const imgs = (content[item.$id] && content[item.$id].split(',')) || []
          !this.isView && imgs.push('')
          this.setValue({
            id: item.$id,
            value: imgs
          })
          return
        } else if (item.$id === 'RelativeCar') {
          this.selectedRelativeCar = [
            content['carBrandId'],
            content['carModelId'],
            content['carSeriesId']
          ]
          this.setValue({
            id: item.$id,
            value: this.selectedRelativeCar
          })
          return
        }
        this.setValue({
          id: item.$id,
          value: content[item.$id]
        })
      })

      this.$nextTick(() => {
        // todo 直接this.$refs.formRender.clearValidate()会报错
        this.$refs.formRender &&
          this.$refs.formRender.clearValidate &&
          this.$refs.formRender.clearValidate()
      })
    },

    handleChange(type) {
      this.content = {} // 切换清除数据
      // 切换信息模板
      this.setCurrentInfo()

      this.$emit('typeChange', type)
    },

    setCurrentInfo() {
      const type = this.type
      const currentInfo = goodsInfos[type]

      if (!currentInfo) {
        this.currentInfo = []
        // this.initValue()  // 更新form-renderer value
        return
      }

      const index = currentInfo.findIndex(item => item.$id === 'brandId')

      // 切换品牌列表
      if (index > -1 && currentInfo[index]['$options'].length < 1) {
        this.$axios
          .$get(`${api.pcBrands}?type=${type}&status=normal&size=999`)
          .then(resp => {
            currentInfo[index]['$options'] =
              resp.payload.content &&
              Array.isArray(resp.payload.content) &&
              resp.payload.content.map(item => ({
                label: item.name,
                value: item.id
              }))
            this.currentInfo = currentInfo
            this.$nextTick(() => {
              this.initValue() // 更新form-renderer value
            })
          })
          .catch(e => console.log(e))
        return
      }

      this.currentInfo = currentInfo

      // form-renderer 的  watch 导致初始化数据错误
      this.$nextTick(() => {
        this.initValue() // 更新form-renderer value
      })
    },
    getCarBrandsSeries() {
      // 获取适配车型
      if (this.hasRequestBrandsSeries) {
        return
      }
      this.hasRequestBrandsSeries = true
      this.isLoading = true
      this.$axios
        .$get(api.carBrandsSeries)
        .then(resp => {
          this.isLoading = false
          this.brandsSeries = resp.payload.content || []
        })
        .catch(e => (this.isLoading = false))
    },

    handleBeforeRender(h, data, value) {
      if (data.$type === 'UploadToQiniuGroup') {
        return this.renderUploadToQiniuGroup(h, data, value)
      }

      if (data.$type === 'RelativeCar') {
        this.getCarBrandsSeries()
        return this.renderRelativeCar(h, data, value)
      }
    },
    renderRelativeCar(h, data, value) {
      return h(RelativeCar, {
        props: Object.assign({}, data.$el, {
          value: value,
          options: this.brandsSeries
        }),
        on: {
          input: value => {
            this.selectedRelativeCar = value
            // data.$default = value
          }
        }
      })
    },
    renderUploadToQiniuGroup(h, data, value) {
      return h(
        'div',
        {
          class: 'upload-group'
        },
        value &&
          value.map((item, index) => {
            return h(
              'div',
              {
                class: 'upload-item'
              },
              [
                h(uploadToAli, {
                  props: {
                    fileUrl: item,
                    disabled: index > 9 || this.isView,
                    showDel: !this.isView
                  },
                  on: {
                    load: imgUrl => {
                      value.splice(index, 1, imgUrl)
                      if (index === value.length - 1) {
                        value.push('')
                      }
                    },
                    delete: () => {
                      value.splice(index, 1, '')
                    }
                  }
                }),
                h('span', index === 0 ? '主图' : '')
              ]
            )
          })
      )
    }
  }
}
</script>
<style lang="stylus">
  .info-manage {
    .upload-group {
      > .upload-item {
        display inline-block
        margin-right 10px
        text-align center
        vertical-align top
      }
      .icon-del {
        font-size 20px
        font-style normal
        line-height 1
        padding 0
      }
    }
  }
</style>
