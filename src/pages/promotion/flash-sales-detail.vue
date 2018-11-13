
<template>
  <div :class="pageName">
    <go-back></go-back>
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
          <input-price v-model.number="scope.row.stock"/>
        </template>
      </el-table-column>
      <el-table-column minWidth="130px" prop="price1" label="*抢购价">
        <template slot-scope="scope">
          <input-price v-model.number="scope.row.price1"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import GoBack from '@/components/GoBack'
import InputPrice from '@/components/goods-template/props-manage/input-price.vue'

export default {
  name: 'flash-sales-detail',
  components: {
    GoBack,
    InputPrice
  },
  data() {
    return {
      pageName: 'flash-sales-detail',
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
  methods: {}
}
</script>
