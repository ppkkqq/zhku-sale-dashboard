
<template>
  <div :class="pageName">
    <el-data-table ref="dataTable" :url="url" :columns="columns" :headerButtons="headerButtons" :hasNew="false" :hasEdit="false" :hasDelete="false" :hasOperation="true" :isTree="false" :single="false" :hasPagination="true" :extraButtons="extraButtons" :operationAttrs="operationAttrs" :searchForm="searchForm" :dataPath="dataPath" :totalPath="totalPath" :customQuery="customQuery">
      <template slot="search">
        <el-form-item label="门店名称" prop="shopId">
          <store-select @change="handleSelect('shopId', $event)" ref="shopId"></store-select>
        </el-form-item>
      </template>
    </el-data-table>
  </div>
</template>

<script>
import {shopList} from '@/const/api'
import {businessStatus} from '@/const/store'
import {areaList} from 'el-area-select'
import {formatDate} from '@/const/filter'
import StoreSelect from '@/container/store-select/'
import searchFormMixin from '@/mixins/search-form-slot'

export default {
  name: 'store-list',
  components: {StoreSelect},
  mixins: [searchFormMixin],
  data() {
    const format = {
      date: (row, column, val) => formatDate(val, 'YYYY-MM-DD HH:mm')
    }
    return {
      pageName: 'store-list',
      url: shopList,
      columns: [
        {prop: 'code', label: '门店编号', minWidth: '100px'},
        {prop: 'name', label: '门店名称', minWidth: '170px'},
        {prop: 'aliasName', label: '简称', minWidth: '100px'},
        {
          prop: 'provinceCode',
          label: '所属地区',
          formatter: row => {
            return areaList['provinceList'][row.proviceCode]
          }
        },
        {
          prop: 'brandNameList',
          label: '经营品牌',
          minWidth: '170px',
          formatter: row => {
            return row.brandNameList && row.brandNameList.join('、')
          }
        },
        {
          prop: 'businessStatus',
          label: '经营状态',
          formatter: row => {
            return businessStatus[row.businessStatus]
          }
        },
        {
          prop: 'createdAt',
          label: '创建时间',
          minWidth: '140px',
          formatter: (row, column, val) => format.date(row, column, val)
        }
      ],
      headerButtons: [
        {
          text: '新增',
          type: 'primary',
          atClick: row => {
            this.onGoDetail()
          }
        }
      ],
      extraButtons: [
        {
          text: '查看',
          type: 'primary',
          atClick: row => {
            this.onGoDetail(row.id, true)
          }
        },
        {
          text: '编辑',
          atClick: row => {
            this.onGoDetail(row.id, false)
          }
        } /*,
        {
          text: '删除',
          type: 'danger',
          atClick: row => {
            this.onDelete(row.id)
          }
        }*/
      ],
      operationAttrs: {
        width: 250,
        fixed: 'right'
      },
      totalPath: 'payload.totalElements',
      dataPath: 'payload.content',
      form: [],
      searchForm: [
        {
          $type: 'input',
          $id: 'code',
          label: '门店编号',
          $el: {placeholder: '请输入'}
        },
        {
          $type: 'select',
          $id: 'proviceCode',
          label: '所属地区',
          $el: {placeholder: '请输入'},
          $options: Object.keys(areaList['provinceList']).map(k => {
            return {
              label: areaList['provinceList'][k],
              value: k
            }
          })
        }
      ]
    }
  },
  methods: {
    // handleSelect(name, $event) {
    //   console.log(name)
    //   this.customQuery.name = ''
    // },
    onDelete(id) {
      if (!id) {
        return
      }

      this.$confirm('确认删除吗', '提示', {
        type: 'warning'
      })
        .then(res => {
          this.$axios.$delete(`${shopList}/${id}`).then(res => {
            this.$refs.dataTable.getList()
          })
        })
        .catch(er => {})
    },
    /*
      @func onGoDetail
      @desc 新增或者查看、编辑门店
      @param string id 编辑、查看门店所需参数
      @param string isView 是否查看状态
    */
    onGoDetail(id, isView) {
      let query = {}
      if (id) {
        //存在id的情况下
        query = {
          id: id,
          isView: isView ? 1 : 0
        }
      }
      this.$router.push({
        path: 'store-detail',
        query: query
      })
    }
  },
  async asyncData({app}) {},
  mounted() {}
}
</script>
<style scoped>
</style>
