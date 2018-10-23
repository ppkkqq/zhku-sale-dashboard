<template>
  <div :class="pageName">
    <el-data-table
      totalPath="payload.total"
      data-path="payload.list"
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
      :customQuery="customQuery"
      @reset="handleReset"
    >
      <template slot="search">
        <el-form-item label="后台类目" prop="catalogId">
          <back-end-category-select @change="handleSelect('catalogId', $event)" ref="catalogId"></back-end-category-select>
        </el-form-item>
      </template>
    </el-data-table>
  </div>
</template>

<script>
import {goodsLists, getNeedCheckPcItem, goodsCancelApply} from '@/const/api'
import {goodsListColumns} from '@/const/goods'
import {listSearchForm} from '@/const/goods'
import {getGoodsOnOffStatus, formatDate} from '@/const/filter'
import {goodsDetail, goodsPublish, goodsUseTplPublish} from '@/const/path'
import BackEndCategorySelect from '@/container/back-end-category-select/'

// searchForm中slot（门店和后台类目）查询取值和重置都在mixIn中
import searchFormMixin from '@/mixins/search-form-slot'

const status2String = {
  passed: '审核通过',
  unaudited: '待审核',
  rejected: '审核拒绝',
  canceled: '已取消申请',
  draft: '草稿'
}
const channels = ['我买网', '京东', '自营']
export default {
  name: 'goods-list',
  components: {
    BackEndCategorySelect
  },
  mixins: [searchFormMixin],
  data() {
    let extraParams = {}
    return {
      pageName: 'goods-list',
      url: getNeedCheckPcItem, //goodsLists, //
      columns: [
        {
          prop: 'code',
          label: '商品编号',
          'show-overflow-tooltip': true
        },
        {
          prop: 'name',
          label: '商品名称',
          minWidth: '200',
          'show-overflow-tooltip': true
        },
        {
          prop: 'channel',
          label: '商品渠道',
          formatter: row => {
            return channels[row.channel]
          }
        },
        {
          prop: 'catalogName',
          label: '后台类目'
        },
        // {
        //   prop: 'status',
        //   label: '状态',
        //   formatter: row => status2String[row.status]
        // },
        // {
        //   prop: 'shelf',
        //   label: '上架/下架',
        //   formatter: row => {
        //     return row.onCount + '/' + row.offCount
        //   }
        // },
        {
          prop: 'pcApplyAt',
          label: '申请时间',
          minWidth: '150',
          formatter: row => {
            return formatDate(row.createdAt, 'YYYY-MM-DD HH:mm:ss')
          }
        }
      ],
      dialogVisible: false,
      form: [],
      extraButtons: [
        {
          text: '审核',
          type: 'primary',
          atClick: row => {
            this.$router.push({
              path: '/goods/goods-audit-detail',
              query: {
                productId: row.itemId
              }
            })
          }
        },
        {
          text: '查看',
          atClick: row => {
            this.$router.push({
              path: '/goods/goods-audit-detail',
              query: {
                isView: 1,
                productId: row.itemId
              }
            })
          }
        }
      ],
      searchForm: [
        {
          $el: {placeholder: '请输入商品编号'},
          label: '商品编号',
          $id: 'code',
          $type: 'input'
        },
        {
          $el: {placeholder: '请输入商品名称'},
          label: '商品名称',
          $id: 'name',
          $type: 'input'
        },
        {
          $el: {
            type: 'daterange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd'
          },
          label: '申请时间',
          $id: 'name',
          $type: 'datePicker'
        }
      ],
      operationAttrs: {
        fixed: 'right',
        minWidth: 150
      },
      customQuery: {
        catalogId: '',
        pcApplyStart: '',
        pcApplyEnd: ''
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
    }
  },
  async asyncData({app}) {},
  mounted() {}
}
</script>
<style lang="stylus" scoped>
.goods-list {
}
</style>
