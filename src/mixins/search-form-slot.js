/**
 * Created by Edgar on 2018/8/9.
 *
 * 模块： 商品管理
 * 子模块： 商品列表，套餐列表
 * 功能描述：用于dataTable的slot(后台类目，门店)查询项目使用
 *
 * 使用方法：见pages/goods-list.vue
 *
 */

// 引用如下，
// `<el-data-table
//       @reset="handleReset"
//     >
//       <template slot="search">
//         <el-form-item label="后台类目" prop="catalogId">
//           <back-end-category @change="handleSelect('catalogId', $event)" ref="catalogId" ></back-end-category>
//         </el-form-item>
//         <el-form-item label="门店" prop="shopId" >
//           <store-select @change="handleSelect('shopId', $event)" ref="shopId"></store-select>
//         </el-form-item>
//       </template>
//     </el-data-table>
// `

export default {
  data() {
    return {
      customQuery: {
        shopId: '',
        catalogId: ''
      }
    }
  },
  methods: {
    handleReset() {
      this.customQuery.catalogId = ''
      this.customQuery.shopId = ''

      this.$refs.catalogId &&
        this.$refs.catalogId.$refs.cascader.handlePick([], true)

      // todo考虑其他方法
      // 调用select的清除方法，接受一个event对象，这里构造e对象，是为了调用方法时不报错
      let e = {
        stopPropagation: () => {}
      }
      this.$refs.shopId && this.$refs.shopId.$refs.store.deleteSelected(e)
    },
    handleSelect(type, v) {
      if (type === 'catalogId') {
        let copyV = !!v && [...v]
        this.customQuery[type] = copyV.pop()
        return
      }
      this.customQuery[type] = v
    }
  }
}
