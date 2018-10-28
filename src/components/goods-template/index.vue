<template>
  <div class="goods-template">
    <h1>{{ title }}</h1>

    <template v-if="useTpl">
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
        :prependName="prependName"
        :value="infoData"
        :tempType="currentTempType"
        :editStatus="editStatus"
        @typeChange="onTypeChange"
        :isCombo="false"
      />
    </base-layout>

    <props-manage
      v-if="!noPropsManage"
      :title="prependName + '属性'"
      :propsData="propsData"
      :skusData="skusData || []"
      :type="currentTempType"
      :isView="isView"
      class="margin-top"
      ref="PropsManage"
    />

    <base-layout
      v-if="hasRichText"
      :title="name.goods + '介绍'"
    >
      <product-description
        ref="richText"
        :content="description"
        :editorDisabled="editorDisabled"
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

import BackEndCategory from '@/container/back-end-category-select'

const hasGoodsRichTexts = ['GOODS']

const TEMPLATE_NAME = '模板'
const GOODS_NAME = '商品'

const GOODS = 'GOODS'

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

    useTpl: {
      type: Boolean,
      default: false
    }, // 使用模板发布标识

    // template: 自定义模板, 总部模板: head_template, 自定义新增: post
    source: {
      type: String,
      default: 'head_template'
    },

    // ITEM：商品，TEMPLATE：模板商品
    templateId: {
      type: String,
      default: 'ITEM'
    }
  },
  data() {
    return {
      propsManageLoading: false,
      categories: [],
      currentTempType: GOODS,
      schemeTableData: [],

      infoData: {},
      skusData: [],
      propsData: [],
      bundleContent: {},
      description: '',
      catalogId: '',

      isLoading: false,
      editorDisabled: false
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

      return hasGoodsRichTexts.indexOf(type) > -1
    },
    prependName() {
      const append = this.isTemp ? TEMPLATE_NAME : ''

      return GOODS_NAME + append
    },
    noPropsManage() {
      return false
    }
  },
  watch: {
    content(newVal) {
      if (this.editStatus === 'isEdit') {
        this.controlEditorFocus()
      }
      this.setData(newVal)
    }
  },
  created() {
    this.cache = {}

    this.name = {
      template: TEMPLATE_NAME,
      goods: GOODS_NAME
    }

    this.setData(this.content)
  },
  methods: {
    handlePriceChange(val) {
      this.$refs.infoManage && this.$refs.infoManage.setBundlePrice(val)
    },

    handleSelect(val) {
      if (val && val.length) {
        this.catalogId = val[val.length - 1]
        this.getCatalogDetail(this.catalogId)

        this.$refs.PropsManage && this.$refs.PropsManage.clear()
      }
    },
    getCatalogDetail(id) {
      this.catalogId = id

      this.propsManageLoading = true

      if (this.cache[id]) {
        this.setPropData(this.cache[id])
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
          this.setPropData(payload)
          this.cache[id] = payload
        })
        .catch(e => {
          this.propsManageLoading = false
        })
    },
    setPropData(payload) {
      const catalog = payload.catalog

      this.propsData =
        (payload.attributeGroups &&
          payload.attributeGroups.reduce((con, group, index) => {
            if (!group.attributeList || group.attributeList.length < 1) {
              return con
            }
            return con.concat(
              group.attributeList.map(attr => {
                return {
                  // require: attr.require,
                  // groupName: group.name,
                  // sort: index,
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
        []

      this.skusData = []
    },

    setData(newVal) {
      let propsData

      this.infoData = newVal
      this.catalogId = newVal.catalogId
      this.description = newVal.detail

      // 处理字段不统一的问题
      propsData = newVal.attributes

      this.schemeTableData = newVal.bundleContent || []
      this.currentTempType = newVal.type || GOODS

      this.skusData =
        (newVal.skuDtos &&
          newVal.skuDtos.sort((a, b) => {
            return a.sort > b.sort
          })) ||
        []

      this.propsData =
        (propsData &&
          propsData.sort((a, b) => {
            return a.sort > b.sort
          })) ||
        []

      this.$nextTick(() => {
        this.$refs.PropsManage && this.$refs.PropsManage.updateSkuCol()
      })
    },

    onTypeChange(type) {
      this.propsData = []
      this.currentTempType = type
      this.skusData = []
      this.$refs.PropsManage && this.$refs.PropsManage.clear()
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
        this.$refs.infoManage.validate().then(valid => {
          if (!valid) {
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
        // source: this.source,
        templateId: this.templateId,
        // type: this.currentTempType,
        detail: richText,
        ...infoManage
      }

      this.submit({
        ...data,
        catalogId,
        status: 'unaudited',
        goodsType: '142', //142常温(默认值) ，143生鲜
        // type: this.currentTempType,
        ...PropsManage
      })
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
    },

    // 手动控制编辑器是否可以输入
    // 解决点击编辑按钮进入页面时，填充editor，触发change事件，导致进入页面会滚动到底部的bug
    controlEditorFocus() {
      this.editorDisabled = !this.editorDisabled
    }
  },
  mounted() {
    if (this.editStatus === 'isEdit' || this.editStatus === 'isView') {
      this.controlEditorFocus()
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
    .margin-top-sm {
      margin-top 10px
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
    .block {
      display block
    }
  }
</style>
