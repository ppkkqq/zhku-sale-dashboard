<template>
  <el-crud-tree
    ref='tree'
    class="floor-management"
    :url="url"
    :add-node-button-filter="addNodeButtonFilter"
    :delete-node-button-filter="deleteNodeButtonFilter"
    :change-visible="changeVisible"
    @node-click="handleNodeClick"
    @clear-node="handleClearNode"
    @create-type="setAddType"
    @createData="createData"
  >
    <div v-if="isEditRoot">
      <el-card
        class="box-card"
        header="编辑楼层">
        <el-form :model="editForm"
                 :rules="editFormRules"
                 :disabled="!editForm.id"
                 ref="editForm"
                 label-width="100px"
                 class="demo-editForm">
          <!--<el-form-item label="父级节点"-->
                        <!--prop="name">-->
            <!--<el-input disabled v-model="editForm.parentName"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="节点名称"
                        prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="描述"
                        prop="description">
            <el-input v-model="editForm.description"></el-input>
          </el-form-item>

          <!--<el-form-item label="是否末级类目"-->
          <!--prop="isLeaf">-->
          <!--<el-radio-group v-model="editForm.isLeaf"-->
          <!--:disabled="hasChildren || editForm.hasAttributeGroups">-->
          <!--<el-radio label="1">是</el-radio>-->
          <!--<el-radio label="0">否</el-radio>-->
          <!--</el-radio-group>-->
          <!--</el-form-item>-->

          <el-form-item label="分类图标"
                        prop="displayUrl">
            <upload-to-ali @load="onUpLoadFile($event, 'editForm','categoryUrl')"
                           accept="image/png, image/jpeg, image/jpg"
                           :fileUrl="editForm.displayUrl">
            </upload-to-ali>
            <!--<div class="el-form-item__warning">-->
            <!--建议尺寸：26*34，仅支持png格式，图片大小1M以内。-->
            <!--</div>-->
          </el-form-item>

          <el-form-item label="广告图"
                        prop="displayUrl">
            <!--<div class="el-form-item__warning">-->
            <!--建议尺寸：1190*109，显示在楼层底部位置-->
            <!--</div>-->
            <upload-to-ali @load="onUpLoadFile($event, 'editForm','advertiseUrl')"
                           accept="image/png, image/jpeg, image/jpg"
                           :fileUrl="editForm.displayUrl">
            </upload-to-ali>
            <el-input placeholder="请输入广告位地址" v-model.trim="editForm.displayUrl"></el-input>
            <el-button><a :href="editForm.displayUrl" target="_blank">测试</a></el-button>
            <!--<div class="el-form-item__warning">-->
            <!--建议尺寸：215*605，显示在楼层左侧位置-->
            <!--</div>-->
          </el-form-item>
          <!--<el-form-item label="关联类目"-->
          <!--prop="name">-->
          <!--<el-input v-model="editForm.name"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item>
            <el-button type="primary"
                       @click="updateNode">保存</el-button>
            <el-button type="normal"
                       @click="resetNode">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <template>
        <el-card class="box-card"
                 header="推荐商品">
          <backend-category-goods-list
            :data="backendTree"
            :baseUrl="bindBackendUrl"
            :node="editForm"
            :rootId="rootId"
            @save="setNode"
            @refresh="loadBackendTree"
            :props="defaultProps" />
        </el-card>
      </template>
    </div>
    <div v-else>
      <el-card

        class="box-card"
        header="编辑子楼层">
        <el-form :model="editForm"
                 :rules="editFormRules"
                 :disabled="!editForm.id"
                 ref="editForm"
                 label-width="100px"
                 class="demo-editForm">
          <el-form-item label="父级节点"
                        prop="name">
            <el-input disabled v-model="editForm.parentName"></el-input>
          </el-form-item>
          <el-form-item label="楼层名称"
                        prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="描述"
                        prop="description">
            <el-input v-model="editForm.description"></el-input>
          </el-form-item>

          <el-form-item label="关联类目"
                        prop="name">
            <!--<el-input v-model="editForm.name"></el-input>-->
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="updateNode">保存</el-button>
            <el-button type="normal"
                       @click="resetNode">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>


    <!-- 新增节点 -->
    <template slot="create">
      <div v-if="isAddRoot">
        <el-card
          class="box-card"
          header="新增楼层">
          <el-form :model="newForm"
                   :rules="newFormRules"
                   ref="newForm"
                   label-width="100px"
                   class="demo-newForm">
            <el-form-item label="节点名称"
                          prop="name">
              <el-input v-model="newForm.name"></el-input>
            </el-form-item>
            <el-form-item label="描述"
                          prop="description">
              <el-input v-model="newForm.description"></el-input>
            </el-form-item>

            <el-form-item label="分类图标"
                          prop="categoryUrl">
              <upload-to-ali @load="onUpLoadFile($event, 'newForm','categoryUrl')"
                             accept="image/png, image/jpeg, image/jpg"
                             :fileUrl="newForm.categoryUrl">
              </upload-to-ali>
            </el-form-item>

            <el-form-item label="广告图"
                          prop="advertiseUrl">
              <!--<div class="el-form-item__warning">-->
              <!--建议尺寸：1190*109，显示在楼层底部位置-->
              <!--</div>-->
              <upload-to-ali @load="onUpLoadFile($event, 'newForm','advertiseUrl')"
                             accept="image/png, image/jpeg, image/jpg"
                             :fileUrl="newForm.advertiseUrl">
              </upload-to-ali>
              <el-input placeholder="请输入广告位地址" v-model.trim="newForm.advertiseUrl"></el-input>
              <el-button><a :href="newForm.advertiseUrl" target="_blank">测试</a></el-button>
              <!--<div class="el-form-item__warning">-->
              <!--建议尺寸：215*605，显示在楼层左侧位置-->
              <!--</div>-->
            </el-form-item>
            <!--<el-form-item label="关联类目"-->
            <!--prop="name">-->
            <!--<el-input v-model="newForm.name"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item>
              <el-button type="primary"
                         @click="addNode">保存</el-button>
              <el-button type="normal"
                         @click="resetNode('add')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <template>
          <el-card class="box-card"
                   header="推荐商品">
            <backend-category-goods-list
              :data="backendTree"
              :baseUrl="bindBackendUrl"
              :node="newForm"
              :rootId="rootId"
              @save="setNode"
              @refresh="loadBackendTree"
              :props="defaultProps" />
          </el-card>
        </template>
      </div>
      <div v-else>
        <el-card
          class="box-card"
          header="新增子楼层">
          <el-form :model="newForm"
                   :rules="newFormRules"
                   ref="newForm"
                   label-width="100px"
                   class="demo-newForm">
            <el-form-item label="父级节点"
                          prop="parentName">{{newForm.parentName}}
              <!--<el-input disabled v-model=""></el-input>-->
            </el-form-item>
            <el-form-item label="楼层名称"
                          prop="name">
              <el-input v-model="newForm.name"></el-input>
            </el-form-item>
            <el-form-item label="描述"
                          prop="description">
              <el-input v-model="newForm.description"></el-input>
            </el-form-item>

            <el-form-item label="关联类目"
                          prop="categoryIdList">
              <!--<el-input v-model="newForm.categoryIdList"></el-input>-->
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         @click="addNode">保存</el-button>
              <el-button type="normal"
                         @click="resetNode">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </template>

  </el-crud-tree>
</template>

<script>
import ElCrudTree from '@/components/floor-tree/el-crud-tree'
import UploadToAli from 'upload-to-ali'
import {
  backendCatalogBaseUrl,
  // frontendCatalogBaseUrl,
  selectedFilterCondition,
  AllfilterCondition
} from '@/const/api'

import BindAttributeFilter from '@/components/category/bind-attribute-filter'

//这个组件 bind-frontend-category  用来显示楼层关联的类目
// import BindFrontendCategory from '../components/category/bind-frontend-category'
import BackendCategoryGoodsList from '../components/category/backend-category-goods-list'

export default {
  name: 'floor-management',
  components: {
    ElCrudTree,
    UploadToAli,
    // BindFrontendCategory,   //   前台类目  用于楼层关联
    BindAttributeFilter,
    BackendCategoryGoodsList //后台商品  返回商品列表   用于一级楼层 推荐
  },
  data() {
    const checkName = (rule, value, callback) => {
      const tree = this.$refs.tree
      if (!value) {
        callback('请输入节点名称')
      } else if (tree.names.includes(value) && tree.status !== 'updateNode') {
        callback('节点名称已存在')
      } else {
        callback()
      }
    }
    return {
      isAddRoot: false,
      isEditRoot: true,
      pageName: 'floor-management',
      url: `/mall-deepexi-mall-config-api/api/v1/floor`,
      // bindBackendUrl: bindBackendUrl,
      // bindFrontendUrl: '/mall-deepexi-mall-config-api/api/v1/floor',
      bindBackendUrl: '/mall-deepexi-mall-config-api/api/v1/floor',
      backendTree: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      editFormRules: {
        name: [{required: true, message: '请输入类目名称', trigger: 'blur'}]
      },
      editForm: {
        parentName: '',
        name: '',
        description: '',
        categoryUrl: '',
        advertiseUrl: '',
        isLeaf: '1'
        // categoryIdList:[]
      },
      newFormRules: {
        name: [{required: true, trigger: 'blur', validator: checkName}]
      },
      newForm: {
        id: '',
        parentId: '',
        parentName: '',
        name: '',
        description: '',
        categoryUrl: '',
        advertiseUrl: '',
        categoryId: '',
        // categoryIdList:[],
        isLeaf: '1'
      },

      selectedFilters: [],

      compareData: {}, // 点击节点时初始化出数据同editForm，用于判断新增属性是否可点击
      rootId: ''
    }
  },
  methods: {
    createData(id, name) {
      this.newForm.parentId = id
      this.newForm.parentName = name
    },
    resetNode() {
      this.newForm = {
        id: '',
        parentId: '',
        parentName: '',
        name: '',
        description: '',
        categoryUrl: '',
        advertiseUrl: '',
        categoryId: '',
        // categoryIdList:[],
        isLeaf: '1'
      }
    },
    setAddType(type) {
      this.isAddRoot = type === 'addRoot' ? true : false
      // if(!this.isAddRoot){
      //   this.rootId = ''
      // }
      //type 值有两种情况 'addChild'   addRoot
    },
    //树形
    addNodeButtonFilter(node, data) {
      return !data.secondFloors
    },
    deleteNodeButtonFilter(node, data) {
      return !node.isLeaf
    },
    handleNodeClick({data, node}) {
      console.log(data, node)
      this.editForm = {...data}
      this.compareData = {...data}
      this.isEditRoot = node.parent.parent ? false : true
      this.rootId = data.id
      // 获取筛选条件
      this.getSelectedFilters()
    },
    handleClearNode() {
      this.editForm = {}
      this.compareData = {}
      this.selectedFilters = []
    },
    changeVisible(val) {
      //弹窗出现或者消失
      // this.newForm = {
      //   name: '',
      //   description: '',
      //   isLeaf: '1',
      //
      //   id:'',
      //   parentId:'',
      //   parentName:'',
      //
      //   categoryUrl:'',
      //   advertiseUrl:'',
      //   categoryId:'',
      //   // categoryIdList:[],
      // }
    },
    setNode(data) {
      this.$refs.tree.mergeNode(this.editForm.id, data)
    },
    //todo  编辑  还没有对
    updateNode() {
      console.log(this.compareData.id)
      // 节点保存成功
      // this.$refs.newForm.validate(valid => {
      //   if (valid) {
      //     const {name, description, parentId, categoryIdList} = this.newForm
      //     let obj = {}
      //     let url = this.url
      //     if (this.isAddRoot) {
      //       obj = {
      //         categoryId: '',
      //         name,
      //         description,
      //         classifyIcon: this.newForm.categoryUrl,
      //         advertisementPhoto: this.newForm.advertiseUrl
      //       }
      //       url = url + `/updateFloor?id=${this.compareData.id}`
      //     } else {
      //       obj = {
      //         name,
      //         description,
      //         categoryIdList: categoryIdList || []
      //       }
      //       url = url + `/updateSecondFloor?id=${this.compareData.id}`
      //     }
      //     this.$refs.tree.updateNode(obj, url)
      //   }
      // })
    },
    addNode() {
      // 新增节点保存成功
      this.$refs.newForm.validate(valid => {
        if (valid) {
          const {name, description, parentId, categoryIdList} = this.newForm
          let obj = {}
          let url = this.url
          if (this.isAddRoot) {
            obj = {
              parentId: '',
              name,
              description,
              classifyIcon: this.newForm.categoryUrl,
              advertisementPhoto: this.newForm.advertiseUrl
            }
            url = url + '/createFloor'
          } else {
            obj = {
              parentId,
              name,
              description,
              categoryIdList: categoryIdList || []
            }
            url = url + '/createSecondFloor'
          }
          this.$refs.tree.addNode(obj, url)
        }
      })
    },
    //form
    onUpLoadFile(value, key, type) {
      // onUpLoadFile($event, 'editForm')
      // console.log(value ,key)
      this.$set(this[key], type, value)
    },
    //detail
    loadBackendTree() {
      this.$axios.$get(`${backendCatalogBaseUrl}/tree`).then(result => {
        this.backendTree = result.payload
      })
    },

    // 获取筛选条件
    async getSelectedFilters() {
      // let url = selectedFilterCondition + `?preCategoryId=${this.editForm.id}`
      //
      // try {
      //   let resp = await this.$axios.$get(url)
      //   let data = resp.payload || []
      //   this.selectedFilters = data
      // } catch (e) {}
    }
  },
  mounted: function() {
    this.loadBackendTree()
  },
  watch: {
    // newForm (val){
    //   console.log('我是watch',val)
    // }
  },
  computed: {
    hasChildren() {
      return (this.editForm.children || []).length > 0
    }
  }
}
</script>

<style lang="stylus">
  .el-dialog__wrapper{
    .el-dialog{
      .el-dialog__footer{
        text-align center
      }
    }
  }
  .floor-management {
    display: flex;

    .el-form-item__warning {
      color: #dcdcdc;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
      top: 100%;
      left: 0;
    }

    .upload-to-ali {
      text-align: center;

      .upload-img-box {
        display: flex;
        width: 60px;
        height: 60px;

        .upload-img {
          margin: auto;
        }
      }
    }

    .box-card {
      height: 100%;
    }
  }
</style>
