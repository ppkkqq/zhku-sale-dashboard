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
import {usersLists, goodsCancelApply, delCol} from '@/const/api'
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
  name: 'users',
  components: {
    BackEndCategorySelect
  },
  mixins: [searchFormMixin],
  data() {
    let extraParams = {}
    return {
      pageName: 'goods-list',
      url: usersLists,
      columns: [
        {
          prop: 'user',
          label: '用户名',
          minWidth: '120',
          'show-overflow-tooltip': true
        },
        {
          prop: 'sex',
          label: '性别',
          formatter: row => {
            return row.sex ? '女' : '男'
          }
        },
        {
          prop: 'tel',
          label: '手机号',
          minWidth: '150'
        },
        {
          prop: 'email',
          label: '邮箱',
          minWidth: '150'
        },
        {
          prop: 'sell',
          label: '是否为卖家',
          minWidth: '150',
          formatter: row => {
            return row.sell ? '是' : '否'
          }
        }
      ],
      dialogVisible: false,
      form: [],
      extraButtons: [
        {
          text: '删除',
          type: 'danger',
          atClick: row => {
            this.$confirm('确定删除该用户吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios
                .$post(delCol, {
                  user: row.user,
                  issell: row.sell
                })
                .then(res => {
                  if (res == 'success') {
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    })
                    this.$refs.dataTable.getList()
                  } else {
                    this.$message({
                      type: 'error',
                      message: '删除失败!'
                    })
                  }
                })
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
  }
}
</script>
<style lang="stylus" scoped>
  .goods-list {

  }
</style>
