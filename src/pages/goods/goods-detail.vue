<template>
  <div class="goods-detail">
    <el-card shadow="never"
             class="border-0">
      <div slot="header">
        <h2>{{data.name}}</h2>
      </div>
      <card-table header="基础信息">
        <table-info style="width:700px">
          <tr>
            <td class="label">后台类目</td>
            <td class="value"
                colspan="3">{{catalogName}}</td>
          </tr>
          <tr>
            <td class="label">品牌</td>
            <td class="value"
                colspan="3">{{brandName}}</td>
          </tr>
          <tr>
            <td class="label">定金</td>
            <td class="value"
                colspan="3">{{price(data.depositPercent || 0)}}</td>
          </tr>
          <tr>
            <td class="label">广告语</td>
            <td class="value"
                colspan="3">{{data.title}}</td>
          </tr>
          <tr>
            <td class="label">商品图片</td>
            <td class="value"
                colspan="3">
              <img :src="item"
                   v-for="(item,index) in productPhoto"
                   :key="index" />
            </td>
          </tr>
        </table-info>
      </card-table>
      <card-table header="模板属性">
        <el-table :data="data.itemAttributes || []"
                  border>
          <el-table-column prop="groupName"
                           label="属性组"
                           width="100px">
          </el-table-column>
          <el-table-column prop="propName"
                           label="属性名">
          </el-table-column>
          <el-table-column prop="propValue"
                           label="属性值">
          </el-table-column>
          <el-table-column prop="type"
                           :formatter="formatter"
                           label="属性类型">
          </el-table-column>
        </el-table>
      </card-table>
      <card-table header="规格组合"
                  v-if=" skuTableColumn.length > 0">
        <el-table :data="skuTableData || []"
                  border>
          <el-table-column v-for="(item,index) in skuTableColumn"
                           :prop="item.prop"
                           :label="item.label"
                           :key="index">
          </el-table-column>

        </el-table>
      </card-table>
      <card-table header="配置方案">
        <el-table :data="data.bundleContent || []"
                  border>
          <el-table-column prop="type"
                           label="方案类型"
                           :formatter="formatterGoodType"
                           width="200px">
          </el-table-column>
          <el-table-column prop="bundleName"
                           label="方案名称">
          </el-table-column>

        </el-table>
      </card-table>

    </el-card>
  </div>
</template>

<script>
import CardTable from '@/components/card-table'
import TableInfo from '@/components/table-info'
import {price} from '@/const/filter'
import {productDetail} from '@/const/api'
import {goodsType} from '@/const/config'
import zipObject from 'lodash/zipObject'
import split from 'lodash/split'
export default {
  name: 'goods-detail',
  components: {
    CardTable,
    TableInfo
  },
  data() {
    return {
      data: {},
      tableData: []
    }
  },
  methods: {
    formatter(row, column) {
      return row['type'] === 'base' ? '基础属性' : '销售属性'
    },
    formatterGoodType(row, column) {
      return goodsType[row.type]
    },
    price
  },
  computed: {
    isNewCar() {
      return true
    },
    id() {
      return this.$route.query.productId
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
        {
          label: '指导价',
          prop: 'guidePrice'
        },
        {
          label: '优惠价',
          prop: 'preferentialPrice',
          type: 'price'
        }
      ])
    },
    skuTableData() {
      const result = (this.data.skus || []).map(item => {
        const {
          propNames = '',
          propValues = '',
          minPrice,
          maxPrice,
          preferentialPrice,
          guidePrice
        } = item
        const data = zipObject(split(propNames, ','), split(propValues, ','))
        data.preferentialPrice = price(preferentialPrice) || 0
        data.guidePrice = price(guidePrice) || 0
        data.priceRange = `${minPrice || 0},${maxPrice || 0}`

        return data
      })
      return result
    },
    catalogName() {
      return this.data.prdCatalog ? this.data.prdCatalog.name : ''
    },
    brandName() {
      const brandList = this.data.brandList || []
      const brand = brandList[0] || {}
      return brand.name || ''
    },
    productPhoto() {
      return split(this.data.productPhoto, ',')
    }
  },
  mounted() {
    this.$axios.$get(productDetail(this.id)).then(result => {
      this.data = result.payload
    })
  }
}
</script>

<style lang="stylus">
.goods-detail {
  .car-info {
    display: flex;
    width: 100%;

    .img {
      margin-right: 30px;
    }

    .table {
      flex: 1;
    }

    img {
      max-width: 120px;
    }
  }

  .value {
    img {
      width: 100px;
    }
  }

  .tab-container {
    margin-top: 30px;
    min-height: 300px;
  }
}
</style>
