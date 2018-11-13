<template>
 <div>
   <el-button><nuxt-link to="/promotion/flash-sales-new">新建规则</nuxt-link></el-button>
   <el-table
     :data="tableData"
     show-header="false"
     border>
     <el-table-column
       prop="name"
       label="规则名称"
       width="120">
     </el-table-column>
     <el-table-column
       prop="detail"
       label="描述"
       width="220">
     </el-table-column>
     <el-table-column
       prop="startTime"
       label="创建时间"
       width="120">
     </el-table-column>
     <el-table-column
       prop="editTime"
       label="修改时间"
       width="140">
     </el-table-column>
     <el-table-column
       prop="status"
       label="状态"
       width="140">
     </el-table-column>
     <el-table-column
       prop="action"
       label="操作"
       width="180">
       <template slot-scope="scope">
         <el-button type="text" size="small">编辑</el-button>
         <el-button type="text" size="small">禁用</el-button>
         <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
       </template>
     </el-table-column>
   </el-table>
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
      tableData: [
        {
          name: '两款围巾预售',
          detail: '很好',
          startTime: '',
          editTime: '',
          status: '开启',
          action: ''
        },
        {
          name: '两款毛巾预售',
          detail: '',
          startTime: '',
          editTime: '',
          status: '禁用'
        }
      ]
    }
  }
}
</script>

<style scoped>
</style>
