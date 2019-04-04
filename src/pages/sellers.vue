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
      :hasOperation="true"
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
import {sellersLists, goodsCancelApply, getPicture} from '@/const/api'
import {getGoodsOnOffStatus, formatDate} from '@/const/filter'
import {goodsDetail, goodsPublish, goodsUseTplPublish} from '@/const/path'
import BackEndCategorySelect from '@/container/back-end-category-select/'
import Viewer from 'viewer'
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
  name: 'sellers',
  components: {
    BackEndCategorySelect,
    Viewer
  },
  mixins: [searchFormMixin],
  data() {
    let extraParams = {}
    return {
      pageName: 'goods-list',
      url: sellersLists,
      columns: [
        {
          prop: 'user',
          label: '用户名',
          minWidth: '120',
          'show-overflow-tooltip': true
        },
        {
          prop: 'storename',
          label: '店铺名',
          minWidth: '150'
        },
        {
          prop: 'idcard',
          label: '身份证',
          minWidth: '150'
        },
        {
          prop: 'pic1',
          label: '身份证正面',
          minWidth: '120',
          formatter: row => {
            if (row) {
              return (
                <viewer
                  height="40px"
                  width="40px"
                  src={getPicture + row.pic1}
                />
              )
            }
          }
        },
        {
          prop: 'pic2',
          label: '身份证正面',
          minWidth: '120',
          formatter: row => {
            if (row) {
              return (
                <viewer
                  height="40px"
                  width="40px"
                  src={getPicture + row.pic2}
                />
              )
            }
          }
        },
        {
          prop: 'starttime',
          label: '申请时间',
          minWidth: '150'
        }
      ],
      dialogVisible: false,
      form: [],
      extraButtons: [
        {
          text: '删除',
          type: 'danger',
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
          $el: {placeholder: '请输入用户名'},
          label: '用户名',
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
  },
  created() {
    this.getPicture = getPicture
  }
}
</script>
<style lang="stylus" scoped>
  .goods-list {

  }
</style>
