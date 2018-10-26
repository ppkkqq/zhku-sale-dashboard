<template>
  <div class="info-manage">
    <!--<div class="el-form-item el-form-item&#45;&#45;medium">-->
      <!--<label class="el-form-item__label" style="width: 150px">{{ prependName }}类型</label>-->
      <!--<div class="el-form-item__content" style="margin-left: 150px">-->
        <!--<el-select v-model="type" placeholder="请选择" @change="handleChange" :disabled="isView || isEdit">-->
          <!--<el-option-->
            <!--v-for="(value, key) in templateType"-->
            <!--:key="key"-->
            <!--:label="value"-->
            <!--:value="key">-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</div>-->
    <!--</div>-->
    <form-renderer
      :content="currentInfo"
      :beforeRenderItem="handleBeforeRender"
      :disabled="isView"
      label-width="150px"
      ref="formRender"
    />
  </div>
</template>
<script>
import {price} from '@/const/filter'
import FormRenderer from '@/components/el-form-renderer/index.js'
import InputPrice from '../props-manage/input-price'
import BaseLayout from '../base-layout'
import uploadToAli from 'upload-to-ali'

import goodsInfos from './goods-info/index.js'

import {goods, api} from './config.js'

const RELATIVE_CAR_NAME = ['carBrandId', 'carSeriesId', 'carModelId']
const BRAND_STATUS = 'forbidden'
const NEW_CARS = 'NEW_CARS'
const bundlePrice = 'bundlePrice'
const GOODS = 'GOODS'

export default {
  name: 'InfoManage',
  props: {
    prependName: String,
    value: Object,
    tempType: String,
    isCombo: Boolean,
    editStatus: String
  },
  data() {
    return {
      isLoading: false,
      renderInRadio: [
        'supportExchangeGoods',
        'supportReturnGoods',
        'supportInvoice'
      ],

      type: this.tempType.toUpperCase(),
      productPhoto: [],
      brandList: [],
      currentInfo: [],

      content: this.value || {},

      brandsSeries: [],
      brands: [],

      isCheckedAllCars: false
    }
  },
  components: {
    FormRenderer,
    uploadToAli,
    BaseLayout
  },
  watch: {
    value(newVal) {
      this.type = newVal.type || GOODS
      this.content = newVal || {}
      // this.initValue()
      this.setCurrentInfo()
    }
  },
  computed: {
    isView() {
      return this.editStatus === 'isView'
    },
    isEdit() {
      return this.editStatus === 'isEdit'
    },
    templateType() {
      return goods.type
    }
  },
  created() {
    this.setCurrentInfo()

    // 避免重复请求
    this.brandCache = []
  },
  destroyed() {
    const type = this.type.toUpperCase()
    const currentInfo = goodsInfos[type] || []

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
    validate() {
      return this.$refs.formRender
        .validate()
        .then(valid => {
          if (this.type !== NEW_CARS && this.isCheckedAllCars) {
            const value = this.$refs.formRender.getFormValue()
            if (
              value.RelativeCar &&
              value.RelativeCar[0] &&
              value.RelativeCar[0].length < 1
            ) {
              this.$message.info('适配车型品牌不能为空!')
              return false
            }
          }
          return true
        })
        .catch(e => {
          this.$message.warning(this.prependName + '信息填写有误!')
          return false
        })
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
        if (key === 'depositPercent') {
          info[key] = Number(value[key])
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
        if (item.$id === 'productPhoto') {
          const imgs = (content[item.$id] && content[item.$id].split(',')) || []
          !this.isView && imgs.push('')
          this.setValue({
            id: item.$id,
            value: imgs
          })
          return
        } else if (this.renderInRadio.indexOf(item.$id) > -1) {
          this.setValue({
            id: item.$id,
            value: content[item.$id] + '' // radio的value转为字符串，数字0不能被选中
          })
          return
        }
        this.setValue({
          id: item.$id,
          value: content[item.$id]
        })
      })

      this.$nextTick(() => {
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
        return
      }

      this.currentInfo = currentInfo

      this.$nextTick(() => {
        this.initValue() // 更新form-renderer value
      })
    },
    setBundlePrice(val) {
      this.bundlePrice = val
      this.setValue({
        id: bundlePrice,
        value: val && price(val)
      })
    },
    getBrands() {
      const type = this.type

      if (this.brandCache[type]) {
        this.brands = this.brandCache[type]
        return
      }

      this.isLoading = true
      this.$axios
        .$get(`${api.pcBrands}?type=${type}&size=999`)
        .then(resp => {
          this.isLoading = false
          const content =
            resp.payload.content &&
            Array.isArray(resp.payload.content) &&
            resp.payload.content.map(item => ({
              label: item.name,
              value: item.id,
              disabled: item.status === BRAND_STATUS
            }))
          this.brandCache[type] = content
          this.brands = content
        })
        .catch(e => (this.isLoading = false))
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
          this.brandsSeries = resp.payload || []
        })
        .catch(e => (this.isLoading = false))
    },
    emitModelChange(carModel) {
      this.$emit('modelChange', carModel)
    },

    handleBeforeRender(h, data, value) {
      if (data.$id === 'brandId') {
        this.getBrands()
        return this.renderCarBrand(h, data, value)
      }

      if (data.$type === 'UploadToQiniuGroup') {
        return this.renderUploadToAliGroup(h, data, value)
      }

      if (data.$type === 'RelativeCar') {
        this.getCarBrandsSeries()
        return this.renderRelativeCar(h, data, value)
      }

      if (data.$type === 'InputPrice') {
        return this.renderInputPrice(h, data, value)
      }
    },
    renderInputPrice(h, data, value) {
      return h(InputPrice, {
        props: {
          value: value
        },
        on: {
          input: val => {
            this.setValue({
              id: 'depositPercent',
              value: val
            })
          }
        }
      })
    },
    renderCarBrand(h, data, value) {
      return h(
        'el-select',
        {
          props: {
            value: value,
            placeholder: '请选择',
            options: this.brands
          },
          on: {
            input: val => {
              if (value === val) {
                return
              }
              this.setValue({
                id: 'brandId',
                value: val
              })
              if (this.type === NEW_CARS) {
                this.setValue({
                  id: 'RelativeCar',
                  value: [val, '', '']
                })
              }
            }
          }
        },
        this.brands.map(item =>
          h('el-option', {
            props: {
              key: item.value,
              ...item
            }
          })
        )
      )
    },
    renderRelativeCar(h, data, value) {
      return h(RelativeCar, {
        props: Object.assign({}, data.$el, {
          disabled: this.isView,
          value: value,
          type: this.type,
          options: this.brandsSeries
        }),
        on: {
          input: value => {
            this.setValue({
              id: 'RelativeCar',
              value: value
            })
          },
          brandChange: value => {
            if (this.type === NEW_CARS) {
              this.setValue({
                id: 'brandId',
                value: value
              })
            }
          },
          checkChange: val => {
            this.isCheckedAllCars = val
          },
          modelChange: val => {
            if (this.type === NEW_CARS) {
              this.emitModelChange(model)
            }
          }
        }
      })
    },
    renderUploadToAliGroup(h, data, value) {
      return h(
        'div',
        {
          class: 'upload-group'
        },
        value &&
          value
            .map((item, index) => {
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
                        value.splice(index, 1)
                      }
                    }
                  }),
                  h('span', index === 0 ? '主图' : '')
                ]
              )
            })
            .concat(
              h(
                'p',
                {
                  class: 'tips'
                },
                '(建议尺寸：750*750，仅支持jpg,png格式，图片大小1M以内)'
              )
            )
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
      .tips {
        color #b8b8b8
        font-size 12px
      }
      .upload-img-box {
        display flex
        height 100%

        .upload-img {
          margin auto
        }
      }
    }
  }
</style>
