<template>
  <div :class="pageName">
    <el-data-table ref="dataTable"
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
                   :searchForm="searchForm">
    </el-data-table>
  </div>
</template>

<script>
import {formatDate} from '@/const/filter'
import {mcMemberInfos} from '@/const/api'

export default {
  name: 'customer-list',
  data() {
    return {
      pageName: 'customer-list',
      url: `${mcMemberInfos}/headquarters`, //总部端分页查询
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
          prop: 'createdAt',
          label: '注册时间',
          formatter: row => formatDate(row.createdAt)
        }
      ],
      loading: false,
      extraButtons: [
        {
          text: '查看',
          atClick: this.go2Detail
        },
        {
          text: '启用',
          show: row => row.status === 2,
          type: 'primary',
          atClick: this.toggleStatus
        },
        {
          text: '禁用',
          show: row => row.status === 1,
          type: 'danger',
          atClick: this.toggleStatus
        }
      ],
      searchForm: [
        {
          $el: {
            placeholder: '请输入客户姓名'
          },
          label: '客户姓名',
          $id: 'name',
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
      ]
    }
  },
  methods: {
    go2Detail(row) {
      this.$router.push(`/customer-detail?memberId=${row.id}`)
    },
    toggleStatus({id, status}) {
      this.loading = true
      this.$axios
        .$put(`${mcMemberInfos}/${id}`, {
          // status: status === 1 ? 2 : 1
          status: 3 - status
        })
        .then(() => {
          this.loading = false
          this.$refs.dataTable.getList()
        })
        .catch(e => {
          this.loading = false
          console.log(e)
        })
    }
  }
}
</script>

<style scoped>
</style>
