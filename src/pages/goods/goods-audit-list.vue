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
      :headerButtons="headerButtons"
      :isTree="false"
      :hasPagination="true"
      :extraButtons="extraButtons"
      :searchForm="searchForm"
      :extraParams="extraParams"
      :operationAttrs="operationAttrs"
      :customQuery="customQuery"
      @reset="handleReset"
      @selection-change="handleSelectChange"
    >
      <template slot="search">
        <el-form-item label="申请时间">
          <el-date-picker
            :clearable="false"
            @change="setTime"
            value-format="yyyy-MM-dd"
            v-model="dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="后台类目" prop="catalogId">
          <back-end-category-select @change="handleSelect('catalogId', $event)" ref="catalogId"></back-end-category-select>
        </el-form-item>
        <el-form-item label="商品渠道" prop="channel">
          <el-select v-model="customQuery.channel" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </template>

    </el-data-table>
    <el-dialog :title="'批量审核'" :visible.sync="dialogVisible" >
      <el-form label-width="100px">
        <el-form-item label="审核结果：">
          <el-radio-group v-model="judgement">
            <el-radio label="通过"></el-radio>
            <el-radio label="不通过"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述：" v-if="judgement=='不通过'">
          <el-input type="textarea" v-model="description" :autosize="{ minRows: 2}"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="commit">提 交</el-button>
          <el-button @click="cancel">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {goodsLists, getNeedCheckPcItem, goodsCancelApply} from '@/const/api'
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
      options: [
        {
          value: 1,
          label: '我买网'
        },
        {
          value: 4,
          label: '京东'
        },
        {
          value: 2,
          label: '自营'
        }
      ],
      pageName: 'goods-list',
      url: getNeedCheckPcItem, //goodsLists, //
      judgement: '通过',
      description: '',
      columns: [
        {
          type: 'selection',
          'show-overflow-tooltip': true
        },
        {
          prop: 'code',
          label: '商品编号',
          'show-overflow-tooltip': true
        },
        {
          prop: 'name',
          label: '商品名称',
          minWidth: '120',
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
          prop: 'catalogId',
          label: '后台类目',
          minWidth: '120',
          'show-overflow-tooltip': true
        },
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
          minWidth: '180',
          formatter: row => {
            return formatDate(row.pcApplyAt, 'YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          prop: 'status',
          label: '状态',
          formatter: row => status2String[row.status]
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
                productId: row.id
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
                productId: row.id
              }
            })
          }
        }
      ],
      headerButtons: [
        {
          text: '批量审核',
          type: 'primary',
          atClick: this.batchJudging
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
        }
      ],
      operationAttrs: {
        fixed: 'right',
        minWidth: 150
      },
      dateRange: '',
      customQuery: {
        catalogId: '',
        pcApplyStart: '',
        pcApplyEnd: '',
        channel: ''
      },
      extraParams,
      selected: []
    }
  },
  methods: {
    // handleSelectChannel(item){
    //   console.log(item)
    //   this.customQuery.channel = item.value
    // },
    commit() {
      console.log(this.description, this.judgement)
      this.dialogVisible = false
      let data = null
      let ids = []
      this.selected.forEach(item => {
        ids.push(item.id)
      })
      if (this.judgement == '通过') {
        data = {
          status: 'passed',
          rejectReason: null,
          ids: ids
        }
      } else {
        data = {
          status: 'rejected',
          rejectReason: this.description,
          ids: ids
        }
      }

      this.$axios
        .$put(
          '/mall-deepexi-product-center/api/v1/admin/items/item/bacthAudit',
          data
        )
        .then(res => {
          this.$refs.dataTable.getList()
          this.$message({
            type: 'success',
            message: '审核成功！'
          })
        })
        .catch(err => {
          this.$message.error('审核失败，请稍后再试。')
        })
    },
    cancel() {
      this.dialogVisible = false
    },
    batchJudging() {
      // console.log(this.selected)
      if (!this.selected.length) {
        this.$message.error('请选择要审核的商品！')
        return
      }
      this.dialogVisible = true
      this.description = ''
      this.judgement = '通过'
    },
    handleSelectChange(val) {
      console.log(val)
      this.selected = val
    },
    handleSelect(type, ids) {
      // if(!ids){
      //   return
      // }else{
      //   if(ids.length===1)
      //   {return}
      // }
      this.customQuery[type] = ids[ids.length - 1]
    },
    setTime() {
      this.customQuery.pcApplyStart = this.dateRange[0]
      this.customQuery.pcApplyEnd = this.dateRange[1]
    },
    handleReset() {
      this.customQuery.startDate = ''
      this.customQuery.endDate = ''
      this.dateRange = []
    }
  },
  async asyncData({app}) {}
}
</script>
<style lang="stylus" scoped>
  .goods-list {
  }
</style>
