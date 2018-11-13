<template>
  <div :class="pageName">
    <go-back></go-back>
    <base-layout
      title="设置商品"
      :hasEdit="!isView"
      btn-text="添加商品"
      @click="()=> {this.dialogVisible=true}"
    >
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
    <el-card shadow="never" class="base-layout" :hasEdit="!isView" @click="addRow" btn-text>
      <el-form ref="form" :model="form" label-width="100px" :disabled="isView">
        <el-form-item label="规则名称">
          <el-input v-model="form.name" placeholder="限30字符"></el-input>
        </el-form-item>
        <el-form-item label="参与次数">
          <el-input v-model="form.name" placeholder="未填写表示不限定"></el-input>
        </el-form-item>
        <el-form-item label="限定数量">
          <el-input v-model="form.name" placeholder="未填写表示不限定"></el-input>
        </el-form-item>
        <el-form-item label="规则描述">
          <el-input type="textarea" :rows="2" placeholder="限200字符" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="small">确定</el-button>
          <el-button @click="onCancel" size="small">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog title="添加商品" :visible.sync="dialogVisible" width="70%">
      <el-data-table
        ref="dataTable"
        :url="url"
        :columns="dialogColumns"
        :hasNew="false"
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
      ></el-data-table>
    </el-dialog>
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
      url: '',
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
      dialogColumns: [
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
      searchForm: [
        {
          $el: {
            placeholder: '请输入'
          },
          label: '商品编号',
          $id: 'id',
          $type: 'input'
        },
        {
          $el: {
            placeholder: '请输入'
          },
          label: '商品类目',
          $id: 'id',
          $type: 'input'
        },
        {
          $el: {
            placeholder: '请输入'
          },
          label: '商品名称',
          $id: 'id',
          $type: 'input'
        }
      ],
      operationAttrs: {
        width: 100,
        fixed: 'right'
      },
      extraButtons: [
        {
          text: '选择',
          type: 'primary',
          atClick: this.addRow
        }
      ],
      propsData: [{id: 'dfafa'}],
      form: {
        name: '',
        description: ''
      }
    }
  },
  computed: {
    isView() {
      return this.$route.query.isView > 0
    }
  },
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
    },
    onSubmit() {},
    onCancel() {
      this.$router.back()
    }
  }
}
</script>
<style lang="stylus">
.flash-sales-detail {
  .base-layout {
    margin-bottom: 50px

    .base--edit-btn {
      float: right
      padding: 3px 0
    }
  }
}
</style>
