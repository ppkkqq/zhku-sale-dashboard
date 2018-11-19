<template>
  <div :class="pageName">
    <el-row :gutter="12">
      <el-col :span="24">
        <el-card >
          <el-button size="small" type="primary" :style="'margin-bottom: 22px;'" @click="onShowDialog" :disabled="currentRec.length === 6">新增</el-button>
          每个栏目最多配置6个推荐位，为了客户端的显示效果，推荐位个数需为双数。
          <el-data-table
            ref="dataTable"
            :url="recommendUrl"
            :columns="recommendColumns"
            :hasNew="false"
            :hasEdit="false"
            :hasDelete="false"
            :hasOperation="false"
            :isTree="false"
            dataPath='payload.content'
            :hasPagination="false"
            @update="onUpdate"
          >
            <el-table-column label="操作" min-width="210px">
              <template slot-scope="scope">
                <el-button v-for="(btn, i) in recommendExtraButtons"
                  v-if="'show' in btn
                  ? (typeof scope === undefined ? '' : btn.show(scope))
                  : true"
                  v-bind="btn" @click="btn.atClick(scope)" :key="i" size="small">{{btn.text}}</el-button>
              </template>
            </el-table-column>
          </el-data-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="新增推荐位" :visible.sync="dialogVisible">
      <el-data-table
        ref="goodsDataTable"
        :url="goodsUrl"
        :columns="goodsColumns"
        :hasNew="false"
        :hasEdit="false"
        :hasDelete="false"
        :hasOperation="true"
        :isTree="false"
        :hasPagination="true"
        :extraButtons="goodsExtraButtons"
        :searchForm="goodsSearchForm"
        :extraParams="extraParams"
        :tableAttrs="tableAttrs"
        :customQuery="customQuery"
        @reset="handleReset"
        dataPath='payload.list'
      >
      <template slot="search">
        <el-form-item label="后台类目" prop="catalogId">
          <back-end-category @change="handleSelect('catalogId', $event)" ref="catalogId" ></back-end-category>
        </el-form-item>
        <!--<el-form-item label="门店" prop="shopId" >-->
          <!--<store-select @change="handleSelect('shopId', $event)" ref="shopId"></store-select>-->
        <!--</el-form-item>-->
      </template>
    </el-data-table>
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button size="small" @click="dialogVisible = false">取 消</el-button>-->
      <!--</div>-->
    </el-dialog>
  </div>
</template>

<script>
import {goodsLists, recommendList} from '@/const/api'
import StoreSelect from '@/container/store-select/'
import BackEndCategory from '@/container/back-end-category/'

// searchForm中slot（门店和后台类目）查询取值和重置都在mixIn中
import searchFormMixin from '@/mixins/search-form-slot'

// const goodsStatus = {
//   ON: '上架',
//   NOT_ON: '下架'
// }
export default {
  name: 'index-recommend',
  components: {
    StoreSelect,
    BackEndCategory
  },
  mixins: [searchFormMixin],
  data() {
    let extraParams = {}
    // const selectColums = {
    //   type: 'selection'
    // }
    return {
      pageName: 'index-recommend',
      currentRec: [],
      // columnData: [
      //   {
      //     label: '热销车型',
      //     programa: '0'
      //   },
      //   {
      //     label: '优选精品',
      //     programa: '1'
      //   },
      //   {
      //     label: '保养套餐',
      //     programa: '2'
      //   }
      // ],
      recommendUrl: `${recommendList}?programa=0`,
      recommendColumns: [
        {
          prop: 'goodsInfo.name',
          label: '商品',
          minWidth: '170px',
          'show-overflow-tooltip': true
        },
        {
          prop: 'goodsInfo.shopName',
          label: '门店',
          minWidth: '170px',
          'show-overflow-tooltip': true
        }
        // {
        //   prop: 'goodsInfo.status',
        //   label: '状态',
        //   minWidth: '',
        //   formatter: row => {
        //     return goodsStatus[row.goodsInfo.status]
        //   }
        // }
      ],
      recommendExtraButtons: [
        {
          text: '删除',
          type: 'danger',
          atClick: scope => {
            this.onDelete(scope.row, scope.$index)
          }
        },
        {
          text: '上移',
          atClick: scope => {
            this.handleSort('up', scope.$index)
          },
          show: scope => {
            return scope.$index !== 0
          }
        },
        {
          text: '下移',
          atClick: scope => {
            this.handleSort('down', scope.$index)
          },
          show: scope => {
            return scope.$index !== this.currentRec.length - 1
          }
        }
      ],
      dialogVisible: false,
      goodsUrl: `${goodsLists}?featured=true`,
      goodsColumns: [
        {
          prop: 'name',
          label: '商品名称',
          'show-overflow-tooltip': true
        },
        // {
        //   prop: 'shopName',
        //   label: '门店'
        // },
        {
          prop: 'catalogName',
          label: '后台类目'
        }
      ],
      goodsExtraButtons: [
        {
          text: '选择',
          atClick: row => {
            this.onChooseGood(row)
          },
          show: row => {
            const selectArr = this.currentRec.filter(item => {
              return item.goodsInfo.goodsId === row.itemId
            })
            return selectArr.length === 0
          }
        }
      ],
      goodsSearchForm: [
        {
          $el: {
            placeholder: '请输入'
          },
          label: '商品名称',
          $id: 'name',
          $type: 'input'
        }
      ],
      operationAttrs: {
        width: 200,
        fixed: 'right'
      },
      tableAttrs: {
        'tooltip-effect': 'light'
      },
      extraParams
    }
  },
  methods: {
    onUpdate(data) {
      this.currentRec = data
    },
    onShowDialog(row) {
      this.dialogVisible = true
      // // 切换新增可选商品
      // let type = ''
      // switch (this.currentCol) {
      //   case '0':
      //   default:
      //     type = 'NEW_CARS'
      //     break
      //   case '1':
      //     type = 'BOUTIQUE'
      //     break
      //   case '2':
      //     type = 'UNKEEP'
      //     break
      // }

      this.goodsUrl = `${goodsLists}?featured=true`
    },
    onDelete(row, index) {
      if (!row) {
        return
      }

      this.$confirm('确认删除吗', '提示', {
        type: 'warning'
      })
        .then(res => {
          this.$axios.$delete(`${recommendList}/${row.id}`).then(res => {
            this.currentRec.splice(index, 1)
          })
        })
        .catch(er => {})
    },
    onChooseGood(row) {
      this.$axios
        .$post(`${recommendList}/createFeaturedFirst`, {
          programa: this.currentCol,
          itemId: row.itemId
        })
        .then(res => {
          this.dialogVisible = false
          this.$refs.dataTable.getList()
        })
    },
    handleSort(type, index) {
      // console.log(type,index)
      // console.log(this.$refs.dataTable.data[index].id)
      let nextId =
        type === 'up'
          ? this.$refs.dataTable.data[index - 1].id
          : this.$refs.dataTable.data[index + 1].id
      // console.log(nextId)
      this.$axios
        .$put(
          `${recommendList}/${this.$refs.dataTable.data[index].id +
            ',' +
            nextId}` /*, {
          operation: type
        }*/
        )
        .then(res => {
          let obj = this.currentRec.splice(index, 1)[0]
          this.currentRec.splice(type === 'up' ? index - 1 : index + 1, 0, obj)
        })
    }
    // handleNodeClick(column) {
    //   // 相同栏目，不再请求
    //   if (this.currentCol === column) {
    //     return
    //   }
    //   this.currentCol = column
    //   this.recommendUrl = `${recommendList}?programa=${column}`
    // }
  },
  mounted() {
    // // 设置默认当前栏目为热销车型
    // this.currentCol = 0
  }
}
</script>
<style lang="stylus">
  .index-recommend {
    .column-list {
      border-right: none;
    }
    .el-tree {
      // margin-top: 10px;
      margin-right: 20px;
    }
    .el-data-table {
      width: 100%;
    }
  }
</style>
