<template>
  <div :class="pageName">
    <el-data-table
      ref="dataTable"
      v-loading="loading"
      :url="url"
      :columns="columns"
      :hasNew="false"
      :hasEdit="false"
      :hasDelete="false"
      :hasOperation="true"
      :isTree="false"
      :hasPagination="true"
      :extraButtons="extraButtons"
      :operationAttrs="operationAttrs"
      :searchForm="searchForm"
      :dataPath="dataPath"
      :totalPath="totalPath">
    </el-data-table>

    <el-dialog :title="topUpDialogTitle" :visible.sync="topUpDialogVisible">
      <el-form ref="topUpform" label-width="100px" label-position="right" :model="topUpform" :rules="topUpRules">
        <template v-if="currentDialog === single">
          <el-form-item label="昵称">
            {{topUpform.nickName}}
          </el-form-item>
          <el-form-item label="手机号">
            {{topUpform.mobile}}
          </el-form-item>
          <el-form-item label="当前源通币">
            {{topUpform.coin || 0}}
          </el-form-item>
          <el-form-item label="充值数量" prop="count">
            <el-input v-model.trim="topUpform.count"></el-input>
          </el-form-item>
        </template>
        <template v-else>

        </template>

        <el-form-item>
          <el-button type="primary" @click="topUp">保存</el-button>
          <el-button @click="topUpDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {formatDate} from '@/const/filter'
import {mcMemberInfos, getShopUserInfo} from '@/const/api'
import {customerDetail} from '@/const/path'

const dialogTitle = {
  batch: '批量充值',
  single: '源通币充值'
}
const single = 'single'
const batch = 'batch'
export default {
  name: 'customer-list',
  data() {
    const validateCount = (rule, value, callback) => {
      if (!value) {
        callback('请输入数量')
      } else {
        callback()
      }
    }
    return {
      pageName: 'customer-list',
      url: getShopUserInfo, //总部端分页查询
      totalPath: 'payload.total',
      dataPath: 'payload.list',
      columns: [
        {
          prop: 'nickName',
          label: '昵称'
        },
        {
          prop: 'realName',
          label: '姓名'
        },
        {
          prop: 'mobile',
          label: '手机号'
        },
        {
          prop: 'gender',
          label: '性别'
        },
        {
          prop: 'birthday',
          label: '生日'
        },
        {
          prop: 'email',
          label: '邮箱'
        },
        {
          prop: 'createdAt',
          label: '创建时间',
          formatter: row => formatDate(row.createdAt)
        },
        {
          prop: 'updatedAt',
          label: '最后登录时间',
          formatter: row => formatDate(row.updatedAt)
        }
      ],
      loading: false,
      operationAttrs: {
        width: '200px'
      },
      extraButtons: [
        {
          text: '源通币充值',
          type: 'primary',
          atClick: this.showTopUp
        },
        {
          text: '查看',
          atClick: this.go2Detail
        }
      ],
      searchForm: [
        {
          $el: {
            placeholder: '请输入客户姓名'
          },
          label: '昵称',
          $id: 'nickName',
          $type: 'input'
        },
        {
          $el: {
            placeholder: '请输入手机号'
          },
          label: '手机号',
          $id: 'mobile',
          $type: 'input'
        }
      ],

      single,
      batch,
      topUpform: {
        count: 0
      },
      topUpRules: {
        count: {trigger: 'blur', validator: validateCount}
      },
      currentDialog: single,
      topUpDialogTitle: dialogTitle[this.currentDialog],
      topUpDialogVisible: false
    }
  },
  watch: {
    topUpDialogVisible: function(isShow) {
      if (!isShow) {
        this.topUpform = {}
        this.$refs.topUpform.resetFields()
      }
    }
  },
  methods: {
    go2Detail(row) {
      this.$router.push(`${customerDetail}?memberId=${row.id}`)
    },
    topUp() {
      this.$refs.topUpform.validate(valid => {
        if (valid) {
          this.topUpDialogVisible = false
        }
      })
    },
    showTopUp(row) {
      this.currentDialog = single
      this.topUpDialogVisible = true
      this.topUpform = row
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
