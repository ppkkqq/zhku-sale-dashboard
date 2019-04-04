<template>
  <div :class="pageName">
    <el-data-table
      totalPath="payload.total"
      dataPath="list"
      ref="dataTable"
      :url="url"
      :columns="columns"
      :hasNew="false"
      :hasEdit="false"
      :hasDelete="false"
      :hasOperation="false"
      :isTree="false"
      :hasPagination="true"
      :extraButtons="extraButtons"
      :searchForm="searchForm"
      :extraParams="extraParams"
      :operationAttrs="operationAttrs"
      :customQuery.sync="customQuery"
      @reset="handleReset"
    >
    </el-data-table>
  </div>
</template>

<script>
import {ordersLists, goodsCancelApply} from '@/const/api'
import {getGoodsOnOffStatus, formatDate} from '@/const/filter'
import {goodsDetail, goodsPublish, goodsUseTplPublish} from '@/const/path'
import BackEndCategorySelect from '@/container/back-end-category-select/'

// searchForm中slot（门店和后台类目）查询取值和重置都在mixIn中
import searchFormMixin from '@/mixins/search-form-slot'
import qs from 'qs'

const equal = '='
const valueSeparator = '~'
const paramSeparator = ','
const valueSeparatorPattern = new RegExp(valueSeparator, 'g')
const queryFlag = 'q='
const queryPattern = new RegExp('q=.*' + paramSeparator)
export default {
  name: 'orders',
  components: {
    BackEndCategorySelect
  },
  mixins: [searchFormMixin],
  data() {
    let extraParams = {}
    return {
      pageName: 'goods-list',
      url: ordersLists,
      columns: [
        {
          prop: 'name',
          label: '商品名称',
          minWidth: '200',
          'show-overflow-tooltip': true
        },
        {
          prop: 'myPrice',
          label: '价格'
        },
        {
          prop: 'shoujianren',
          label: '收货人',
          minWidth: '100',
          'show-overflow-tooltip': true
        },
        {
          prop: 'tel',
          label: '手机号',
          minWidth: '150'
        },
        {
          prop: 'date',
          label: '下单时间',
          minWidth: '150'
        }
      ],
      dialogVisible: false,
      form: [],
      extraButtons: [
        {
          text: '查看',
          type: 'primary',
          atClick: row => {
            this.$router.push({
              path: '/goods/goods-detail',
              query: {
                // isView: 1,
                goodid: row.goodid
              }
            })
          }
        }
      ],
      searchForm: [
        {
          $el: {placeholder: '请输入商品名称'},
          label: '商品名称',
          $id: 'name',
          $type: 'input'
        }
      ],
      operationAttrs: {
        fixed: 'right'
      },
      customQuery: {
        catalogId: ''
      },
      extraParams
    }
  },
  methods: {
    handleSelect(type, ids) {
      // if(!ids){
      //   return
      // }else{
      //   if(ids.length===1)
      //   {return}
      // }
      this.customQuery[type] = ids[ids.length - 1]
    },
    handleReset() {
      this.customQuery.catalogId = ''
    }
  },
  mounted() {
    let matches = location.href.match(queryPattern)
    if (matches) {
      let query = matches[0].substr(2).replace(valueSeparatorPattern, equal)
      let params = qs.parse(query, {delimiter: paramSeparator})
      if (params.catalogId) {
        this.customQuery.catalogId = params.catalogId
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  .goods-list {

  }
</style>
