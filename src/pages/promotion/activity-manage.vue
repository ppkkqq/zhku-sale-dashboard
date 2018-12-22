<template>
  <div :class="pageName">
    <el-data-table
      ref="dataTable"
      :url="url"
      :columns="columns"
      :hasNew="true"
      :hasEdit="false"
      :hasDelete="false"
      :hasOperation="true"
      :isTree="false"
      :hasPagination="true"
      data-path="payload.list"
      totalPath="payload.total"
      :searchForm="searchForm"
      :operationAttrs="operationAttrs"
      :extraButtons="extraButtons"
      :customQuery="customQuery"
      @reset="handleReset"
      :onNew="onNew"
    >
      <template slot="search">
        <el-form-item label="活动时间">
          <el-date-picker
            :clearable="false"
            @change="setTime"
            value-format="yyyy-MM-dd HH:mm"
            v-model="dateRange"
            type="datetimerange"
            range-separator="-"
            start-placeholder="活动开始时间"
            end-placeholder="活动结束时间"
          ></el-date-picker>
        </el-form-item>
      </template>
    </el-data-table>
  </div>
</template>

<script>
import {} from '@/const/config'
import {columns, searchForm} from '@/const/marketing'
import {activityList, activityStatus} from '@/const/api'
import {activityDetail, activityPublish} from '@/const/path'

export default {
  name: 'activity-manage',
  components: {},
  data() {
    return {
      pageName: 'activity-manage',
      url: activityList,
      dateRange: '',
      customQuery: {
        startDate: '',
        endDate: ''
      },
      operationAttrs: {
        width: 220,
        fixed: 'right'
      },
      loading: false,
      dialogVisible: false,
      confirmDialogVisible: false,
      dialogType: '',
      reviewForm: {
        approve: 'true',
        rejectRemark: ''
      },
      columns,
      extraButtons: [
        {
          text: '编辑',
          type: 'primary',
          atClick: row => this.go2Detail(row, 0)
        },
        {
          text: '启用',
          type: 'danger',
          show: row => row.tmaStatus == '0',
          atClick: this.changeStatus
        },
        {
          text: '禁用',
          type: 'danger',
          show: row => row.tmaStatus == '1',
          atClick: this.changeStatus
        },
        {
          text: '查看',
          atClick: row => this.go2Detail(row, 1)
        }
      ],
      searchForm,
      dialogRow: {}
    }
  },
  methods: {
    onNew() {
      this.$router.push('/promotion/activity-publish')
    },
    handleReset() {
      this.customQuery.startDate = ''
      this.customQuery.endDate = ''
      this.dateRange = []
    },
    setTime() {
      this.customQuery.startDate = this.dateRange[0]
      this.customQuery.endDate = this.dateRange[1]
    },
    go2Detail(row, isView) {
      if (isView) {
        this.$router.push({
          path: activityDetail,
          query: {
            isView: isView
          }
        })
      } else {
        this.$router.push({
          path: activityPublish,
          query: {
            activityId: row.id
          }
        })
      }
    },
    changeStatus(row) {
      if (this.loading) return
      this.loading = true
      this.$axios
        .$put(activityStatus, {
          tmaId: '',
          status: !row.tmaStatus
        })
        .then(res => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.$refs.dataTable.getList()
        })
        .catch(err => {
          this.loading = false
        })
    }
  }
}
</script>
