<template>
 <div>
   <el-button><nuxt-link to="/promotion/flash-sales-new">新建规则</nuxt-link></el-button>
   <el-data-table
     ref="dataTable"
     :url="url"
     :columns="propsColumns"
     :hasNew="false"
     :hasEdit="false"
     :hasDelete="false"
     :hasPagination="true"
     data-path="payload.list"
     totalPath="payload.total"
     :operationAttrs="operationAttrs"
     :extraButtons="extraButtons"
   >
   </el-data-table>
    <div style="width: 200px;margin: 50px auto;">
      预售规则:
      1、预售商品为自营商品，如果商品待上架状态，则商品上架后，规则立即生效;如果商品已上架，规则立即生效。
      2、一个商品只能建立一种规则(新增规则时,要过滤之前已经选择的商品)。
    </div>
 </div>
</template>

<script>
export default {
  name: 'promote-sales-list',
  data() {
    return {
      url:
        'http://levy.ren:3000/mock/477/mall-deepexi-marking-center/api/v1/presellRule/list',
      propsColumns: [
        {
          prop: 'tmarTitle',
          label: '规则名称'
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
      operationAttrs: {
        width: 240,
        fixed: 'right'
      },
      extraButtons: [
        //   {
        //     text: '编辑',
        //     type: 'primary',
        //     atClick: row => {
        //       this.$router.push({
        //         path: flashSalesDetail,
        //         query: {
        //           id: row.tmarId
        //         }
        //       })
        //     }
        //   },
        //   {
        //     type: 'primary',
        //     text: '启用',
        //     show: row => {
        //       return activityStatus[row.tmarStatus]==="禁用"
        //     },
        //     atClick: row => {
        //       this.switchStatus(row)
        //     }
        //   },
        //   {
        //     type: 'default',
        //     text: '禁用',
        //     show: row => {
        //       return activityStatus[row.tmarStatus]==="启用"
        //     },
        //     atClick: row => {
        //       this.switchStatus(row)
        //     }
        //   },
        //   {
        //     text: '查看',
        //     type: 'primary',
        //     atClick: row => {
        //       this.$router.push({
        //         path: flashSalesDetail,
        //         query: {
        //           isView:1,
        //           id: row.tmarId
        //         }
        //       })
        //     }
        //   }
        //
      ]
    }
  }
}
</script>

<style scoped>
</style>
