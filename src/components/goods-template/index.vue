<template>
  <div class="goods-template">
    <h1>{{ title }}</h1>

    <template  v-if="useTpl">
      <h3 v-if="editStatus==='isEdit'" class="padding-tb">第二步 查看并调整商品信息</h3>
    </template>
    <template v-else>
      <div class="el-form-item el-form-item--medium">
        <label class="el-form-item__label" style="width: 110px">后台类目</label>
        <div class="el-form-item__content" style="margin-left: 110px">
          <back-end-category
            @change="handleSelect"
            :catalogId="catalogId"
            :disabled="isView"
          />
        </div>
      </div>
    </template>

    <base-layout :title="prependName + '信息'">
      <info-manage
        ref="infoManage"
        :value="templateInfo"
        :tempType="currentTempType"
        :isView="isView"
        @typeChange="onTypeChange"
        :isCombo="isCombo"
      />
    </base-layout>

    <props-manage
      :title="prependName + '属性'"
      :propsData="templateInfo.itemAttributes"
      :skusData="templateInfo.skus || []"
      :type="currentTempType"
      :isView="isView"
      :isCombo="isCombo"
      class="margin-top"
      ref="PropsManage"
    />

    
    

    

    <base-layout
      v-if="hasRichText"
      :title="(isCombo ? name.combo : name.goods) + '介绍'"
    >
      <product-description
        ref="richText"
        :content="templateInfo.detail"
        :disabled="isView"
      />
    </base-layout>

    <div class="text-right margin-top" v-if="!isView">
      <el-button @click="$router.back()">取消</el-button>
      <el-button type="primary" @click="onSubmit" v-loading="isLoading">提交</el-button>
    </div>
  </div>
</template>
<script>
import InfoManage from './info-manage/index.vue'
import PropsManage from './props-manage/index.vue'
import ProductDescription from './product-description'

import BaseLayout from './base-layout'
import {backendCatalogTree, backendCatalogDetail} from '@/const/api'

import BackEndCategory from '@/container/back-end-category'

const hasGoodsRichTexts = ['NEW_CARS', 'BOUTIQUE', 'UNKEEP']
const hasComboRichTexts = ['UNKEEP', 'BOUTIQUE', 'MAINTENANCE']

const TEMPLATE_NAME = '模板'
const GOODS_NAME = '商品'
const COMBO_NAME = '套餐'

export default {
  name: 'goodsTemplate',
  props: {
    url: {
      type: String,
      required: true
    },
    title: String,
    editStatus: String, // isNew, isEdit, isView
    content: Object,

    isTemp: {
      // 是否模板
      type: Boolean,
      default: true
    },
    isCombo: {
      // 是否套餐
      type: Boolean,
      default: false
    },

    useTpl: {
      type: Boolean,
      default: false
    }, // 使用模板发布标识

    // template: 自定义模板, 总部模板: head_template, 自定义新增: post
    source: {
      type: String,
      default: 'head_template'
    }
  },
  data() {
    return {
      propsManageLoading: false,
      categories: [],
      currentTempType: 'NEW_CARS',
      schemeTableData: [],
      templateInfo: {
        info: {},
        itemAttributes: [],
        skus: []
      },

      bundleContent: {},

      isLoading: false,

      catalogId: ''
    }
  },
  components: {
    InfoManage,
    PropsManage,
    ProductDescription,
    BackEndCategory,

    BaseLayout
  },
  computed: {
    isView() {
      return this.editStatus === 'isView'
    },
    hasRichText() {
      const type = this.currentTempType
      if (this.isCombo) {
        return hasComboRichTexts.indexOf(type) > -1
      }
      return hasGoodsRichTexts.indexOf(type) > -1
    },
    prependName() {
      const append = this.isTemp ? TEMPLATE_NAME : ''
      if (this.isCombo) {
        return COMBO_NAME + append
      }
      return GOODS_NAME + append
    }
  },
  watch: {
    content(newVal) {
      // 处理字段不统一的问题
      if (this.isCombo) {
        this.templateInfo = {
          ...newVal,
          catalogId: newVal.catagoryId,
          type: newVal.type && newVal.type.toUpperCase(),
          itemAttributes: newVal.bundleAttributes
          // propsData: newVal.bundleAttributes
        }

        this.bundleContent = {
          bundleItemList: newVal.pcBundleContentList || [],
          itemBundleList: newVal.itemBundleList || []
        }

        this.catalogId = newVal.catagoryId
        // this.propsData = newVal.itemAttributes

        this.currentTempType = newVal.type && newVal.type.toUpperCase()
      } else {
        this.templateInfo = newVal
        this.catalogId = newVal.catalogId
        // this.propsData = newVal.itemAttributes

        this.schemeTableData = newVal.bundleContent || []

        this.currentTempType = newVal.type
      }

      this.$nextTick(() => {
        this.$refs.PropsManage && this.$refs.PropsManage.updateSkuCol()
      })
    }
  },
  created() {
    if (this.isCombo) {
      this.currentTempType = 'UNKEEP'
    }
    this.cache = {}

    this.name = {
      template: TEMPLATE_NAME,
      goods: GOODS_NAME,
      combo: COMBO_NAME
    }
    // this.templateInfo = this.content
    // this.propsData = this.content.itemAttributes || []
  },
  methods: {
    handlePriceChange(price) {
      this.$refs.infoManage &&
        this.$refs.infoManage.setValue({
          id: 'bundlePrice',
          value: price
        })
    },
    handleSelect(val) {
      if (val && val.length) {
        this.catalogId = val[val.length - 1]
        this.getTemplate(this.catalogId)
      }
    },
    getTemplate(id) {
      this.catalogId = id

      this.propsManageLoading = true

      if (this.cache[id]) {
        this.initData(this.cache[id])
        return
      }

      this.$axios
        .$get(backendCatalogDetail(id))
        .then(resp => {
          const payload = resp.payload
          this.propsManageLoading = false
          if (!payload) {
            return
          }
          this.initData(payload)
          this.cache[id] = payload
        })
        .catch(e => {
          this.propsManageLoading = false
        })
    },
    initData(payload) {
      const catalog = payload.catalog
      // this.templateInfo.info = resp.payload
      this.templateInfo = {
        brandId: '',
        name: catalog.name,
        productPhoto: '',
        title: catalog.description,
        type: this.currentTempType,
        subscription: null,
        depositPercent: null,
        carBrandId: '',
        carModelId: '',
        carSeriesId: '',
        itemAttributes:
          (payload.attributeGroups &&
            payload.attributeGroups.reduce((con, group, index) => {
              if (!group.attributeList || group.attributeList.length < 1) {
                return con
              }
              return con.concat(
                group.attributeList.map(attr => {
                  return {
                    groupName: group.name,
                    sort: index,
                    editMode: attr.editMode,
                    initCode:
                      (attr.attributeValue &&
                        attr.attributeValue
                          .map(attrValue => attrValue.code)
                          .join(',')) ||
                      '',
                    propCode: '',
                    propValue: '',
                    initValue:
                      (attr.attributeValue &&
                        attr.attributeValue
                          .map(attrValue => attrValue.value)
                          .join(',')) ||
                      '',
                    type: 'base',
                    propName: attr.name
                  }
                })
              )
            }, [])) ||
          [],
        skus: []
      }
    },

    onTypeChange(type) {
      this.currentTempType = type
    },
    onSubmit() {
      if (!this.useTpl && !this.catalogId) {
        this.$message.warning('请先选择类目！')
        return
      }

      if (this.$refs.PropsManage && !this.$refs.PropsManage.validate()) {
        return
      }

      this.$refs.infoManage &&
        this.$refs.infoManage.validate(valid => {
          if (!valid) {
            this.$message.warning('模板信息填写有误!')
            return
          }

          this.handleSubmit()
        })
    },
    handleSubmit() {
      const PropsManage =
        (this.$refs.PropsManage && this.$refs.PropsManage.getValue()) || {}
      const infoManage =
        (this.$refs.infoManage && this.$refs.infoManage.getValue()) || {}
      const richText =
        (this.$refs.richText && this.$refs.richText.getValue()) || ''

      const catalogId = this.catalogId

      const data = {
        source: this.source,
        type: this.currentTempType,
        detail: richText,
        ...infoManage
      }

      if (this.isCombo) {
        this.submit({
          ...data,
          catagoryId: catalogId, // 套餐字段待统一
          type: this.currentTempType.toLowerCase(), // 待修改

          source: this.source.toUpperCase(), // 商品待修改，统一大写

          bundleAttributes: PropsManage.itemAttributes
        })
      } else {
        this.submit({
          ...data,
          catalogId,
          type: this.currentTempType,
          ...PropsManage
        })
      }
    },
    submit(data) {
      let fetch

      const url = this.url

      if (this.editStatus === 'isNew') {
        fetch = this.$axios.$post(url, data)
      } else if (this.editStatus === 'isEdit') {
        fetch = this.$axios.$put(`${url}/${this.content.id}`, data)
      }
      this.isLoading = true

      fetch &&
        fetch
          .then(resp => {
            this.isLoading = false
            this.$router.back()
          })
          .catch(e => {
            this.isLoading = false
          })
    }
  }
}
</script>
<style lang="stylus">
  .goods-template {
    .el-cascader {
      width 500px
    }
    .margin-top {
      margin-top 30px
    }
    .padding-tb {
      padding-top 30px
      padding-bottom 30px
    }
    > h1 {
      padding-bottom 20px
      border-bottom 1px solid #eee
      margin-bottom 20px
      font-size 1.5em
    }
  }
</style>
