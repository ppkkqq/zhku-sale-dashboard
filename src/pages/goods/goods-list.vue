<template>
  <div :class="pageName">
    <el-data-table
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
      :tableAttrs="tableAttrs"
      :customQuery="customQuery"
      :table="tableAttrs"
      @reset="handleResetSearch"
    >
      <template slot="search">
        <el-form-item label="状态" prop="status">
          <el-select @change="handleStatus" v-model="status">
            <el-option
              v-for="it in goodsStatusSelect"
              v-bind="it"
              :key="it.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="后台类目" prop="catalogId">
          <back-end-category @change="handleSelect('catalogId', $event)" ref="catalogId" ></back-end-category>
        </el-form-item>
        <el-form-item label="门店" prop="shopId" >
          <store-select @change="handleSelect('shopId', $event)" ref="shopId"></store-select>
        </el-form-item>

        <el-form-item label="商品来源" prop="source" >
          <el-select v-model="customQuery.source" placeholder="请选择">
            <el-option
              v-for="it in source"
              v-bind="it"
              :key="it.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </template>
    </el-data-table>

    <el-dialog title="商品审核" :visible.sync="dialogVisible" class="verify-dialog">
      <el-form ref="form" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="商品名称">
          {{row.name}}
        </el-form-item>

        <el-form-item label="审核结果" prop="agree">
          <el-radio v-model="formData.agree" :label="true">同意</el-radio>
          <el-radio v-if="!isEdit" v-model="formData.agree" :label="false">拒绝</el-radio>
        </el-form-item>

        <el-form-item  v-if="!formData.agree" label="拒绝理由" prop="rejectReason">
          <el-input class="reason-textarea" type="textarea" v-model="formData.rejectReason" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" v-loading="isAuditLoading" @click="handleAudit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {goodsLists, goodsAudit} from '@/const/api'
import {goodsListColumns, searchForm} from '@/const/goods'
import StoreSelect from '@/container/store-select/'
import BackEndCategory from '@/container/back-end-category/'

// searchForm中slot（门店和后台类目）查询取值和重置都在mixIn中
import searchFormMixin from '@/mixins/search-form-slot'
import {goodsStatus, goodsSource} from '@/const/config'
import {Object2Options} from '@/const/filter'

let allStatus = 'rejected,passed,unaudited'
export default {
  name: 'goods-list',
  components: {
    'store-select': StoreSelect,
    BackEndCategory
  },
  mixins: [searchFormMixin],
  data() {
    let extraParams = {}
    const goodsStatusSelect = Object2Options(goodsStatus).filter(
      it => it.value !== 'draft' && it.value !== 'canceled'
    )
    return {
      goodsStatusSelect,
      status: '',
      source: Object2Options(goodsSource),
      pageName: 'goods-list',
      url: goodsLists,
      columns: goodsListColumns,
      row: {},
      isEdit: false,
      dialogVisible: false,
      isAuditLoading: false,
      formData: {
        agree: true,
        rejectReason: ''
      },
      placeholderRadio: '0.00',
      form: [],
      rules: {},
      extraButtons: [
        {
          text: '查看',
          type: 'primary',
          atClick: row => {
            this.$router.push({
              path: '/goods-detail',
              query: {
                isView: 1,
                productId: row.id
              }
            })
          }
        },
        {
          text: '审核',
          atClick: row => {
            this.row = row
            this.isEdit = false
            this.showDialog()
          },
          show: row => {
            return row.status === 'unaudited'
          }
        }
      ],
      searchForm: searchForm,
      operationAttrs: {
        width: 200,
        fixed: 'right'
      },
      customQuery: {
        status: allStatus,
        source: ''
      },
      tableAttrs: {
        'tooltip-effect': 'light',
        'cell-style': e => {
          const row = e.row
          const typeToColor = {
            update: '#F56C6C'
          }
          return {color: typeToColor[e.column.property]}
        }
      },
      extraParams
    }
  },
  watch: {
    'formData.agree': function(agree) {
      // 切换同意，清空拒绝信息
      if (agree) {
        this.formData.rejectReason = ''
      } else {
        this.$refs.form.clearValidate()
      }
    },

    dialogVisible: function(value) {
      if (!value) {
        this.$refs.form.resetFields()
      }
    }
  },
  methods: {
    handleResetSearch() {
      // 调用searchFormMixin的方法
      this.handleReset()
      this.status = ''
    },
    handleStatus(v) {
      if (!!v) {
        this.customQuery.status = v
      } else {
        this.customQuery.status = allStatus
      }
    },
    showDialog() {
      this.dialogVisible = true
    },
    handleAudit() {
      let url = goodsAudit(this.row.id)
      this.$refs.form.validate(valid => {
        if (!valid) return

        this.isAuditLoading = true
        this.$axios
          .$put(url, {...this.formData})
          .then(res => {
            this.$message.success('操作成功')
            this.isAuditLoading = false
            this.dialogVisible = false
            this.$refs.dataTable.getList()
          })
          .catch(err => {
            this.$message.fail('操作失败')
            this.isAuditLoading = false
          })
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  .goods-list {
    .reason-textarea {
      margin-top 15px
    }

    .verify-dialog {
      .label {
        width 120px
        text-align right
        display inline-block
        margin-right 20px
      }

      .item {
        margin-bottom 15px
      }
    }

  }
</style>
