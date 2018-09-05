<template>
  <div class="el-table-simple">
    <el-button size="small" type="primary" v-if="hasNew" @click="addRow">{{newBtnTxt}}</el-button>
    <el-table
      :data="data"
      v-bind="table"
      style="width: 100%">
      <el-table-column
        :key="i"
        v-bind="it"
        v-for="(it,i) in columns"
      >
        <template slot-scope="scope">
          <slot>
            <!--可编辑-->
            <input-number
              v-if="it.editable"
              :handleChange="handleChange"
              :default-num="scope.row[it.prop]"></input-number>
            <span v-else>{{ scope.column.formatter ? scope.column.formatter(scope.row) : scope.row[it.prop]}}</span>
          </slot>
        </template>
      </el-table-column>

      <!--操作列-->
      <el-table-column
        fixed="right"
        label="操作"
        v-if="hasDelete"
      >
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="deleteRow(scope.$index)"
            type="danger"
            size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
      <slot name="operate"></slot>

    </el-table>
  </div>
</template>

<script>
import InputNumber from '@/components/input-number'
export default {
  name: 'el-table-simple',
  components: {
    'input-number': InputNumber
  },
  props: {
    table: {
      type: Object
    },
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },

    newBtnTxt: {
      type: String,
      default: '新增'
    },

    // 按钮
    hasDelete: {
      type: Boolean,
      default: false
    },
    hasNew: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },

  methods: {
    deleteRow(index) {
      this.$emit('delete', index)
    },
    addRow() {
      this.$emit('add')
    },

    handleChange(v) {
      this.$emit('changeNumber', v)
    },
    getTableData() {
      this.$emit('getTableData', 'da')
    }
  }
}
</script>
