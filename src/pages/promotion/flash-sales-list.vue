
<template>
  <div :class="pageName">
    <el-row>
      <el-button @click="newRules(1)">新增规则</el-button>
    </el-row>
    <el-table :data="propsData">
      <el-table-column
        v-for="col in propsColumns"
        :key="col.prop"
        :prop="col.prop"
        minWidth="130px"
        v-bind="col">
      </el-table-column>
      <el-table-column
      label="操作"
      minWidth="250px"
      >
        <template slot-scope="scope">

            <el-button type="text">编辑</el-button>
            <el-button type="text">禁用</el-button>
            <el-button type="text">查看</el-button>

        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {flashSalesDetail} from '@/const/path'
export default {
  name: 'flash-sales-list',
  components: {},
  data() {
    return {
      propsData: [
        {
          tmarTitle: '啥',
          tmarPartakeCount: 5
        }
      ],
      propsColumns: [
        {
          prop: 'tmarTitle',
          label: '规则名称'
        },
        {
          prop: 'tmarPartakeCount',
          label: '参与次数'
        },
        {
          prop: 'tmarLimitCount',
          label: '抢购限定数量'
        },
        {
          prop: 'tmarDesc',
          label: '描述'
        },
        {
          prop: 'tmarCreatedAt',
          label: '创建时间'
        },
        {
          prop: 'tmarUpdatedAt',
          label: '修改时间'
        },
        {
          prop: 'tmarStatus',
          label: '状态'
        }
      ],
      pageName: 'flash-sales-list'
    }
  },
  mounted() {
    this.getFlashSalesList()
  },
  computed: {},
  methods: {
    newRules(isview) {
      this.$router.push({
        path: flashSalesDetail,
        query: {isview: isview}
      })
    },
    getFlashSalesList() {
      this.$axios
        .$get('/mall-deepexi-marking-center/api/v1/buyingRule/list')
        .then(resp => {
          console.log(resp)
        })
    }
  }
}
</script>
