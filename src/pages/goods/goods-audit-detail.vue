<template>
  <div class="goods-detail">
    <el-card shadow="never" class="border-0">
      <div slot="header">
        <h2>类目：{{catalogName}}</h2>
      </div>
      <el-form ref="form" :model="data" label-width="120px">
        <el-form-item label="商品名称">
          <el-input v-model="data.name" :disabled="isView"></el-input>
        </el-form-item>
        <el-form-item label="商品标签">
          <el-input v-model="data.title" :disabled="isView"></el-input>
        </el-form-item>
        <el-form-item label="商品编号">
          <el-input v-model="data.code" :disabled="isView"></el-input>
        </el-form-item>
        <el-form-item label="所属商户">
          <el-input v-model="channel" :disabled="isView"></el-input>
        </el-form-item>
        <div style="max-width:920px;display:flex;justify-content:space-between">
          <el-form-item label="支持换货">
            <el-radio-group v-model="data.supportExchangeGoods" :disabled="isView">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="支持退货">
            <el-radio-group v-model="data.supportReturnGoods" :disabled="isView">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="支持开发票">
            <el-radio-group v-model="data.supportInvoice" :disabled="isView">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item label="商品主图">
          <img
            :src="item"
            v-for="(item,index) in productPhoto"
            :key="index"
            style="width:200px;height:200px;margin-right:10px"
          >
        </el-form-item>
      </el-form>
      <card-table header="商品属性">
        <el-table :data="data.itemAttributes || []" border="">
          <!-- <el-table-column prop="groupName" label="属性组" width="100px"></el-table-column> -->
          <el-table-column prop="propName" label="属性名"></el-table-column>
          <el-table-column prop="propValue" label="属性值"></el-table-column>
          <el-table-column prop="type" :formatter="formatter" label="属性类型"></el-table-column>
        </el-table>
      </card-table>
      <!-- v-if="skuTableColumn.length > 0" -->

      <card-table header="规格组合">
        <el-table :data="skuTableData || []" border="">
          <el-table-column
            v-for="(item,index) in skuTableColumn"
            :prop="item.prop"
            :label="item.label"
            :key="index"
          ></el-table-column>
        </el-table>
      </card-table>
      <card-table header="商品简介">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="PC简介" name="web"></el-tab-pane>
          <el-tab-pane label="APP简介" name="app"></el-tab-pane>
        </el-tabs>
        <product-description ref="richText" :content="description" :editorDisabled="isView"/>
      </card-table>
      <card-table header="审核信息" v-if="!isView">
        <el-form label-width="120px">
          <el-form-item label="审核结果">
            <el-radio-group v-model="auditStatus">
              <el-radio :label="true">通过</el-radio>
              <el-radio :label="false">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="text-right margin-top">
            <el-button @click="$router.back()">取消</el-button>
            <el-button type="primary" @click="onSubmit" v-loading="isLoading">提交</el-button>
          </div>
        </el-form>
      </card-table>
    </el-card>
  </div>
</template>

<script>
import CardTable from '@/components/card-table'
import TableInfo from '@/components/table-info'
import ProductDescription from '@/components/goods-template/product-description'
import {price} from '@/const/filter'
import {getNeedCheckPcById, goodsAudit} from '@/const/api'
import {channel} from '@/const/goods'
import {goodsType} from '@/const/config'
import zipObject from 'lodash/zipObject'
import split from 'lodash/split'

const web = 'web'
const app = 'app'

export default {
  name: 'goods-detail',
  components: {
    CardTable,
    TableInfo,
    ProductDescription
  },
  data() {
    return {
      isLoading: false,
      data: {},
      tableData: [],
      auditStatus: false,
      description: '',
      activeName: 'web'
    }
  },
  methods: {
    formatter(row, column) {
      return row['type'] === 'base' ? '基础属性' : '销售属性'
    },
    formatterGoodType(row, column) {
      return goodsType[row.type]
    },
    price,
    handleClick() {
      if (this.activeName == web) {
        this.description = this.data.detail
      } else {
        this.description = this.data.mobileDetail
      }
    },
    onSubmit() {
      if (this.auditStatus) {
        let url = goodsAudit(this.$route.query.productId)
        this.$axios
          .$put(url, {
            agree: this.auditStatus
          })
          .then(result => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.$router.back()
          })
          .catch()
      }
    }
  },
  computed: {
    isView() {
      return this.$route.query.isView > 0
    },
    id() {
      return this.$route.query.productId
    },
    channel() {
      return channel[this.data.channel]
    },
    skuTableColumn() {
      const skus = this.data.skus || []
      if (skus.length === 0) return []

      const {propNames} = skus[0]
      let result
      if (propNames && propNames.length) {
        result = propNames.split(',').map(item => {
          return {
            label: item,
            prop: item
          }
        })
      } else {
        result = []
      }
      return result.concat([
        // {
        //   label: '指导价',
        //   prop: 'guidePrice'
        // },
        // {
        //   label: '优惠价',
        //   prop: 'preferentialPrice',
        //   type: 'price'
        // }
        {
          label: '口味',
          prop: 'guidePrice'
        },
        {
          label: '价格',
          prop: 'preferentialPrice',
          type: 'price'
        },
        {
          label: '数量',
          prop: 'preferentialPrice',
          type: 'price'
        }
      ])
    },
    skuTableData() {
      const result = (this.data.skus || []).map(item => {
        const {
          propNames = '',
          propValues = ''
          // minPrice,
          // maxPrice,
          // preferentialPrice,
          // guidePrice
        } = item
        const data = zipObject(split(propNames, ','), split(propValues, ','))
        // data.preferentialPrice = price(preferentialPrice) || 0
        // data.guidePrice = price(guidePrice) || 0
        // data.priceRange = `${minPrice || 0},${maxPrice || 0}`

        return data
      })
      return result
    },
    catalogName() {
      return this.data.prdCatalog ? this.data.prdCatalog.name : ''
    },
    // brandName() {
    //   const brandList = this.data.brandList || []
    //   const brand = brandList[0] || {}
    //   return brand.name || ''
    // },
    productPhoto() {
      return split(this.data.productPhoto, ',')
    }
  },
  mounted() {
    this.$axios
      .$get(getNeedCheckPcById, {params: {id: this.$route.query.productId}})
      .then(result => {
        if (result.payload) {
          this.data = result.payload
          this.description = this.data.detail
        }
      })
      .catch()
  }
}
</script>

<style lang="stylus">
.goods-detail {
  .car-info {
    display: flex
    width: 100%

    .img {
      margin-right: 30px
    }

    .table {
      flex: 1
    }

    img {
      max-width: 120px
    }
  }

  .value {
    img {
      width: 100px
    }
  }

  .el-input {
    max-width: 800px
  }

  .tab-container {
    margin-top: 30px
    min-height: 300px
  }
}
</style>
