<template>
  <div :class="pageName">
    <el-data-table ref="dataTable" :url="url" :columns="columns" :headerButtons="headerButtons" :hasNew="false" :hasEdit="false" :hasOperation="true" :isTree="false" :single="false" :hasPagination="true" :extraButtons="extraButtons" :operationAttrs="operationAttrs" :searchForm="searchForm" :dataPath="dataPath" :totalPath="totalPath" :customQuery="customQuery" @reset="handleReset" v-loading="cacheLoading">
      <template slot="search">
        <el-form-item label="后台类目">
          <el-cascader :options="catalogTree" :props="props" v-model="catalog" @change="handleChange">
          </el-cascader>
        </el-form-item>
      </template>
    </el-data-table>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <el-checkbox-group v-model="shopNames" :span="12" v-loading="cacheLoading">
        <div v-for="(shop) in shops" :key="shop.shopId">
          <el-checkbox :label="shop.shopName" :disabled="shop.businessStatus=='closed'">
            <div class="space-between">
              <span>{{shop.shopName}}</span>
              <div class="range-group">
                <span>授权折扣</span>
                <span>
                  <el-input type="number" v-model="shop.minProportion" placeholder="最小值" size="mini" @input.native="handleInput($event,'min', shop, 'minProportion','maxProportion')"></el-input>
                  至
                  <el-input type="number" v-model="shop.maxProportion" placeholder="最大值" size="mini" @blur="handleInput($event,'max', shop, 'minProportion','maxProportion')"></el-input>
                </span>
              </div>
            </div>
          </el-checkbox>
        </div>
      </el-checkbox-group>

      <div class="text-right btn-group">
        <el-button @click="cancel" size="small">取 消</el-button>
        <el-button type="primary" @click="confirm" v-loading="confirmLoading || cacheLoading" size="small">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  adminTemplateList,
  shopList,
  templateStatus,
  backendCatalogTree,
  grantShop,
  grantList
} from '@/const/api'
// import {supplierDetail} from '@/const/path'
import {templateType, tplStatus} from '@/const/goods'
import {formatDate} from '@/const/filter'
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'goods-template-list',
  components: {},
  data() {
    const format = {
      date: (row, column, val) => formatDate(val, 'YYYY-MM-DD HH:mm:ss')
    }
    return {
      pageName: 'goods-template-list',
      confirmLoading: false,
      url: `${adminTemplateList}`,
      columns: [
        {
          prop: 'name',
          label: '模板名称',
          minWidth: 220,
          'show-overflow-tooltip': true
        },
        {prop: 'prdCatalog.name', label: '后台类目', minWidth: 100},
        {
          prop: 'type',
          label: '模板类型',
          minWidth: 120,
          formatter: row => {
            return templateType[row.type]
          }
        },
        {
          prop: 'status',
          label: '状态',
          formatter: row => {
            return tplStatus[row.useStatus]
          }
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
          text: '编辑',
          type: 'primary',
          atClick: row => {
            this.onGoDetail(row.id, true)
          }
        },
        {
          text: '启用',
          show: row => {
            return row.useStatus == 'DISABLE'
          },
          atClick: row => {
            this.onToggle('ENABLE', row.id)
          }
        },
        {
          text: '禁用',
          show: row => {
            return row.useStatus == 'ENABLE'
          },
          atClick: row => {
            this.onToggle('DISABLE', row.id)
          }
        },
        {
          text: '门店授权',
          type: 'success',
          atClick: row => {
            this.onGrant(row.id)
          }
        }
      ],
      operationAttrs: {
        width: 320,
        fixed: 'right'
      },
      totalPath: 'payload.totalElements',
      dataPath: 'payload.content',
      searchForm: [
        {
          $type: 'input',
          $id: 'name',
          label: '模板名称',
          $el: {placeholder: '请输入'}
        },
        {
          $type: 'select',
          $id: 'type',
          label: '模板类型',
          $el: {placeholder: '请输入'},
          $options: Object.keys(templateType).map(k => {
            return {
              label: templateType[k],
              value: k
            }
          })
        }
      ],
      customQuery: {
        catalogId: ''
      },
      catalog: [],
      props: {
        label: 'name',
        value: 'id'
      },
      catalogTree: [],
      shops: [],
      dialogTitle: '选择授权门店',
      dialogVisible: false,
      shopNames: [],
      shopIds: [],
      templateId: '',
      cacheLoading: false,
      cache: {}
    }
  },
  methods: {
    handleChange(value) {
      this.customQuery.catalogId = value[value.length - 1]
    },
    handleReset() {
      this.catalog = []
    },
    handleInput(event, type, object, minProp, maxProp) {
      const val = event.target.value
      if (val < 0 || val > 100) {
        switch (type) {
          case 'min':
            object[minProp] = 0
            break
          case 'max':
            object[maxProp] = 100
            break
        }
        this.$message({
          type: 'warning',
          message: '折扣范围0-100'
        })
      }
      const min = Number(object[minProp])
      const max = object[maxProp]
      if (max != null && max < min) {
        this.$message({
          type: 'warning',
          message: '起始值要小于终止值'
        })
        switch (type) {
          case 'min':
            object[minProp] = 0
            break
          case 'max':
            object[maxProp] = min
            break
        }
      }
    },
    /*
      @func onGoDetail
      @desc 新增或者查看供应商
      @param string id 编辑、查看供应商所需参数
      @param string isEdit 查看供应商所需参数
    */
    onGoDetail(id, isEdit) {
      let query = {}
      if (id) {
        //存在id的情况下
        query = {
          templateId: id,
          isEdit: isEdit ? 1 : 0
        }
      }
      this.$router.push({
        path: '/templates/goods-template-detail',
        query: query
      })
    },
    onToggle(toggle, id) {
      let url = templateStatus(id)
      this.$axios
        .$put(url, {
          useStatus: toggle
        })
        .then(res => {
          this.$refs.dataTable.getList()
        })
        .catch(err => console.warn(err))
    },
    setListCheck() {
      this.shopNames = []
      this.shops.forEach(shop => {
        if (shop.grant) {
          this.shopNames.push(shop.shopName)
        }
      })
    },
    getGrantList(id) {
      let url = grantList(id)
      this.$axios
        .$get(url)
        .then(res => {
          this.shops = res.payload
          this.cache[id] = res.payload
          this.setListCheck()
          this.cacheLoading = false
        })
        .catch(err => {
          console.warn(err)
          this.cacheLoading = false
        })
    },
    onGrant(id) {
      this.dialogVisible = true
      this.cacheLoading = true
      this.templateId = id

      if (this.cache[id]) {
        this.shops = this.cache[id]
        this.setListCheck()
        this.cacheLoading = false
        return
      }
      this.getGrantList(id)
    },
    confirm() {
      // if (!this.shopNames.length) {
      //   this.dialogVisible = false
      //   return
      // }
      let grantShops = this.shopNames.map(name => {
        let shop = this.shops.find(shop => shop.shopName == name)
        return {
          shopId: shop.shopId,
          minProportion: shop.minProportion,
          maxProportion: shop.maxProportion
        }
      })
      this.cacheLoading = true
      let url = grantShop(this.templateId)
      this.$axios
        .$put(url, grantShops)
        .then(res => {
          this.$message({
            type: 'success',
            message: '授权成功!'
          })
          this.getGrantList(this.templateId)
          this.templateId = ''
        })
        .catch(err => {
          console.warn(err)
          this.cacheLoading = false
        })
      this.dialogVisible = false
    },
    cancel() {
      this.dialogVisible = false
      this.templateId = ''
    }
  },
  created() {
    this.$axios
      .$get(backendCatalogTree)
      .then(res => {
        this.catalogTree = res.payload
      })
      .catch(err => console.warn(err))
  }
}
</script>
<style lang="stylus">
.goods-template-list {
  .btn-group {
    margin-top: 20px;
  }

  .space-between {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .el-checkbox {
    width: 100%;
  }

  .el-checkbox__label {
    width: 100%;
    line-height: 36px;
    box-sizing: border-box;
  }

  .range-group .el-input {
    width: 30%;
  }

  .range-group {
    width: 60%;
    box-sizing: border-box;
  }
}
</style>
