<template>
  <div :class="pageName">
    <go-back></go-back>
    <base-layout :title="title" :hasEdit="!isView" btn-text="添加属性" @click="addRow">
      <el-table :data="propsData">
        <el-table-column
          v-for="col in propsColumns"
          :key="col.prop"
          :prop="col.prop"
          minWidth="130px"
          v-bind="col"
        ></el-table-column>
        <el-table-column minWidth="130px" prop="stock" label="活动库存">
          <template slot-scope="scope">
            <input-price v-model.number="scope.row.stock" :disabled="isView"/>
          </template>
        </el-table-column>
        <el-table-column minWidth="130px" prop="price1" label="*抢购价">
          <template slot-scope="scope">
            <input-price v-model.number="scope.row.price1" :disabled="isView"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100" v-if="!isView">
          <template slot-scope="scope">
            <!--<el-button size="mini" v-show="scope.$index !== 0" @click="sortRow(scope.$index, 'up')">上移</el-button>-->
            <!--<el-button size="mini" v-show="scope.$index !== (propsData.length - 1)" @click="sortRow(scope.$index, 'down')">下移</el-button>-->
            <el-button size="mini" type="danger" @click="delRow(scope.$index, scope.row)">撤出活动</el-button>
          </template>
        </el-table-column>
      </el-table>
    </base-layout>
  </div>
</template>
<script>
import GoBack from '@/components/GoBack'
import InputPrice from '@/components/goods-template/props-manage/input-price.vue'
import BaseLayout from '@/components/goods-template/base-layout'

export default {
  name: 'flash-sales-detail',
  components: {
    GoBack,
    InputPrice,
    BaseLayout
  },
  data() {
    return {
      pageName: 'flash-sales-detail',
      isView: false,
      dialogVisible: false,
      propsColumns: [
        {
          prop: 'id',
          label: '商品编号'
        },
        {
          prop: 'name',
          label: '商品名称'
        },
        {
          prop: 'prop',
          label: '商品规格'
        },
        {
          prop: 'price',
          label: '单价'
        },
        {
          prop: 'acc',
          label: '库存'
        },
        {
          prop: 'status',
          label: '商品状态'
        }
      ],
      propsData: [{id: 'dfafa'}]
    }
  },
  computed: {},
  methods: {
    // 基础属性
    addRow() {
      this.dialogVisible = true
      this.propsData.push({
        // key: [],
        // value: [],
        id: '',
        propNames: '',
        propValues: ''
        // propCodes: ''
      })
    },
    delRow(index, row) {
      this.$confirm('确定删除该属性吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.propsData.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    }
  }
}
</script>
