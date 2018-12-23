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
    @addItems="addItems"
  >
    <!--编辑主楼层  确认无误-->
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
          <el-form-item label="节点名称"
                        prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="描述"
                        prop="description">
            <el-input v-model="editForm.description"></el-input>
          </el-form-item>
          <el-form-item label="分类图标"
                        prop="classifyIcon">
            <upload-to-ali
              :disabled="!editForm.id"
              v-model="editForm.classifyIcon"
              accept="image/png, image/jpeg, image/jpg"
              :compressOptions="{}">
            </upload-to-ali>
          </el-form-item>
          <el-form-item label="广告图"
                        prop="advertisementPhoto">
            <upload-to-ali
              :disabled="!editForm.id"
              v-model="editForm.advertisementPhoto"
              accept="image/png, image/jpeg, image/jpg"
              :compressOptions="{}">
            </upload-to-ali>
            <el-input placeholder="请输入广告位地址" v-model.trim="editForm.advertisementPhoto"></el-input>
            <el-button><a :href="editForm.advertisementPhoto" target="_blank">测试</a></el-button>
          </el-form-item>
          <el-form-item label="关联类目"
                        prop="category">
            <bind-frontend-category
              :data="frontendTree"
              :disabled="!editForm.id"
              :isRoot="true"
              :categoryName="editForm.categoryName"
              ref="BindFrontendCategory"
              @catalogIds="setCatalogIds"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="updateNode">保存</el-button>
            <el-button type="normal"
                       @click="resetNode('edit')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <template>
        <el-card class="box-card"
                 :disabled="!editForm.id"
                 header="推荐商品">
          <backend-category-goods-list
            ref="BackendCategoryGoodsList"
            :data="backendTree"
            :baseUrl="bindBackendUrl"
            :disabled="!editForm.id"
            :node="editForm"
            :rootId="rootId"
            @save="setNode"
            @refresh="refreshEditRoot"
            :props="defaultProps" />
        </el-card>
      </template>
    </div>
    <div v-if="isEditSecond">
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
            <!--//todo-->
            <bind-frontend-category
              :data="singleFrontendTree"
              :disabled="!editForm.id"
              :isRoot="false"
              :categoryName="editForm.secondCategoryName"
              ref="BindFrontendCategory"
              @catalogIds="setCatalogIds"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="updateNode">保存</el-button>
            <el-button type="normal"
                       @click="resetNode('edit')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>


    <!-- 新增节点 -->
    <template slot="create">
      <div v-if="isAddRoot">
        <el-card v-if="isFirstStep"
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
                          prop="classifyIcon">
              <upload-to-ali accept="image/png, image/jpeg, image/jpg"
                             v-model="newForm.classifyIcon"
                             :compressOptions="{}">
              </upload-to-ali>
            </el-form-item>
            <el-form-item label="广告图"
                          prop="advertisementPhoto">
              <upload-to-ali accept="image/png, image/jpeg, image/jpg"
                             v-model="newForm.advertisementPhoto"
                             :compressOptions="{}">
              </upload-to-ali>
              <el-input placeholder="请输入广告位地址" v-model.trim="newForm.advertisementPhoto"></el-input>
              <el-button><a :href="newForm.advertisementPhoto" target="_blank">测试</a></el-button>
            </el-form-item>
            <el-form-item label="关联类目"
                          prop="category">
              <bind-frontend-category
                :data="frontendTree"
                :disabled="false"
                :isRoot="true"
                :categoryName="newForm.categoryName"
                ref="BindFrontendCategory"
                @catalogIds="setCatalogIds"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         @click="addNode">保存</el-button>
              <el-button type="normal"
                         @click="resetNode('add')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <template v-else>
          <el-card class="box-card"
                   header="推荐商品">
            <backend-category-goods-list
              :data="backendTree"
              :baseUrl="bindBackendUrl"
              :node="newForm"
              :rootId="rootId"
              @save="setNode"
              @refresh="refreshEditRoot"
              :props="defaultProps" />
          </el-card>
        </template>
      </div>
      <div v-if="isAddSecond">
        <el-card
          class="box-card"
          header="新增子楼层">
          <el-form
            :model="newForm"
            :rules="newFormRules"
            ref="newForm"
            label-width="100px"
            class="demo-newForm">
            <el-form-item label="父级节点"
                          prop="parentName">{{newForm.parentName}}
            </el-form-item>
            <el-form-item label="楼层名称"
                          prop="name">
              <el-input v-model="newForm.name"></el-input>
            </el-form-item>
            <el-form-item label="描述"
                          prop="description">
              <el-input v-model="newForm.description"></el-input>
            </el-form-item>

            <!--//todo :categoryName="newForm.categoryName" 这里还没有对好  -->
            <el-form-item
              label="关联类目"
              prop="category">
              <bind-frontend-category
                :data="singleFrontendTree"
                :disabled="false"
                :isRoot="false"
                :categoryName="newForm.categoryName"
                ref="BindFrontendCategory"
                @catalogIds="setCatalogIds"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         @click="addNode">保存</el-button>
              <el-button type="normal"
                         @click="resetNode('add')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </template>

  </el-crud-tree>
</template>

<script>
import BindAttributeFilter from '@/components/category/bind-attribute-filter'
import BackendCategoryGoodsList from '@/components/category/backend-category-goods-list'
import BindFrontendCategory from '@/components/category/bind-frontend-category'
import ElCrudTree from '@/components/floor-tree/el-crud-tree'
import {
  AllfilterCondition,
  backendCatalogBaseUrl,
  frontCatalogSingle,
  frontendCatalogBaseUrl,
  frontendCatalogTree,
  selectedFilterCondition
} from '@/const/api'

//这个组件 bind-frontend-category  用来显示楼层关联的类目
// import BindFrontendCategory from '../components/category/bind-frontend-category'

export default {
  name: 'floor-management',
  components: {
    ElCrudTree,
    BindFrontendCategory, //   前台类目  用于楼层关联
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
      singleFloorId: '',
      singleFrontendTree: [],
      isFirstStep: false,
      isAddRoot: false,
      isEditSecond: false,
      isAddSecond: false,
      isEditRoot: true,
      pageName: 'floor-management',
      url: `/mall-deepexi-mall-config-api/api/v1/floor`,
      // bindBackendUrl: bindBackendUrl,
      frontendCatalogBaseUrl: frontendCatalogBaseUrl,
      bindBackendUrl: '/mall-deepexi-mall-config-api/api/v1/floor',
      backendTree: [],
      frontendTree: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      editFormRules: {
        name: [{required: true, message: '请输入类目名称', trigger: 'blur'}],
        advertisementPhoto: [
          {required: true, message: '请上传广告图', trigger: 'blur'}
        ]
      },
      editForm: {
        secondCategoryName: '',
        id: '',
        parentName: '',
        name: '',
        description: '',
        classifyIcon: '',
        advertisementPhoto: '',
        categoryName: ''
      },
      newFormRules: {
        name: [{required: true, trigger: 'blur', validator: checkName}],
        advertisementPhoto: [
          {required: true, message: '请上传广告图', trigger: 'blur'}
        ]
      },
      newForm: {
        id: '',
        parentId: '',
        parentName: '',
        name: '',
        description: '',
        classifyIcon: '',
        advertisementPhoto: '',
        categoryId: '',
        categoryName: ''
      },

      selectedFilters: [],
      floorId: '',
      compareData: {}, // 点击节点时初始化出数据同editForm，用于判断新增属性是否可点击
      rootId: '',
      catalogIds: ''
    }
  },
  methods: {
    async refreshEditRoot(id) {
      await this.$refs.tree.loadTree()
      let temp = {}
      this.$refs.tree.tree.forEach(item => {
        if (item.id == id) {
          // console.log('item', item)
          temp = item
        }
      })
      if (!this.isAddRoot) {
        this.editForm = temp
        // console.log('editForm', this.editForm)
      } else {
        this.newForm = temp
        // console.log('newForm', this.newForm)
      }
    },
    addItems(id) {
      this.isFirstStep = false
      this.rootId = id
      this.floorId = id
      if (id) {
        this.loadBackendTree()
      }
      // console.log('isFirstStep', this.isFirstStep)
    },
    setCatalogIds(isRoot, ids) {
      // console.log('测试', ids)
      this.catalogIds = ids
    },
    createData(id, name) {
      this.newForm.parentId = id
      this.newForm.parentName = name
    },
    resetNode(type) {
      if (type == 'edit') {
        this.$refs.BindFrontendCategory.resetName()
        this.editForm = this.compareData
        return
      }
      if (type == 'add') {
        this.newForm = {
          id: '',
          parentId: '',
          parentName: '',
          name: '',
          description: '',
          categoryUrl: '',
          advertiseUrl: '',
          categoryId: '',
          categoryName: ''
        }
        this.$refs.BindFrontendCategory.resetName()
      }
    },
    setAddType(type) {
      this.catalogIds = ''
      if (type === 'addRoot') {
        this.isFirstStep = true
        this.isEditRoot = true
        this.isAddSecond = false
        this.isEditSecond = false
        this.isAddRoot = true
      } else {
        this.isAddRoot = false
        this.isEditRoot = true
        this.isAddSecond = true
        this.isEditSecond = false
      }
      this.newForm = {
        id: '',
        parentId: '',
        parentName: '',
        name: '',
        description: '',
        classifyIcon: '',
        advertisementPhoto: '',
        categoryId: '',
        categoryName: ''
      }
      // console.log('isAddRoot', this.isAddRoot)
      // console.log('isFirstStep', this.isFirstStep)
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
      // console.log(data, node)
      this.editForm = {...data, parentName: node.parent.data.name || ''}
      this.compareData = {...data, parentName: node.parent.data.name || ''}
      if (node.parent.parent) {
        this.isEditRoot = false
        this.isEditSecond = true
        this.isAddRoot = false
        this.isAddSecond = false
      } else {
        this.isEditRoot = true
        this.isEditSecond = false
        this.isAddRoot = false
        this.isAddSecond = true
      }
      if (data.parentId == '0') {
        this.singleFloorId = data.id
      } else {
        this.singleFloorId = data.parentId
      }
      this.loadSingleFrontendTree()
      if (this.isEditRoot) {
        this.floorId = data.id
        if (data.id) {
          this.loadBackendTree()
        }
      }
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
      // console.log(this.compareData.id)
      // 节点保存成功
      this.$refs.editForm.validate(valid => {
        if (valid) {
          const {name, description} = this.editForm
          let obj = {}
          let url = this.url
          if (this.isEditRoot) {
            obj = {
              categoryId: this.catalogIds,
              name,
              description,
              classifyIcon: this.editForm.classifyIcon,
              advertisementPhoto: this.editForm.advertisementPhoto
            }
            url = url + `/updateFloor?id=${this.compareData.id}`
            // console.log('compareData',this.compareData)
            // console.log('editForm',this.editForm)
            // console.log('catalogIds',this.catalogIds)
            if (
              this.catalogIds &&
              this.catalogIds !== this.compareData.categoryId
            ) {
              // debugger
              this.$confirm(
                '更改楼层将会清除当前所有的推荐商品, 是否继续?',
                '提示',
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }
              )
                .then(() => {
                  this.floorId = this.editForm.id
                  this.$axios
                    .$delete(
                      `/mall-deepexi-mall-config-api/api/v1/floor/clearItem?floorId=${
                        this.rootId
                      }`
                    )
                    .then(result => {
                      this.$axios
                        .$post(url, obj)
                        .then(result => {
                          this.$axios
                            .$get(
                              `/mall-deepexi-mall-config-api/api/v1/floor/category?floorId=${
                                this.floorId
                              }`
                            )
                            .then(result => {
                              this.backendTree = result.payload
                              // console.log(this.backendTree)
                              this.refreshEditRoot(this.editForm.id)
                            })
                        })
                        .catch()
                    })
                    .catch(err => {
                      console.log(err)
                    })
                })
                .catch(() => {})
            }
          } else {
            obj = {
              name,
              description,
              secondCategoryId: this.catalogIds
            }
            url = url + `/updateSecondFloor?id=${this.compareData.id}`
            this.$refs.tree.updateNode(obj, url)
          }
        }
      })
    },
    addNode() {
      // 新增节点保存成功
      this.$refs.newForm.validate(valid => {
        if (valid) {
          const {name, description, parentId} = this.newForm
          let obj = {}
          let url = this.url
          if (this.isAddRoot) {
            obj = {
              parentId: '',
              name,
              description,
              categoryId: this.catalogIds,
              classifyIcon: this.newForm.classifyIcon,
              advertisementPhoto: this.newForm.advertisementPhoto
            }
            url = url + '/createFloor'
          } else {
            obj = {
              parentId,
              name,
              description,
              secondCategoryId: this.catalogIds
            }
            url = url + '/createSecondFloor'
          }
          this.$refs.tree.addNode(this.isAddRoot, obj, url)
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
      this.$axios
        .$get(
          `/mall-deepexi-mall-config-api/api/v1/floor/category?floorId=${
            this.floorId
          }`
        )
        .then(result => {
          this.backendTree = result.payload
          // console.log(this.backendTree, result)
        })
    },
    loadFrontendTree() {
      this.$axios.$get(frontendCatalogTree).then(result => {
        this.frontendTree = result.payload
      })
    },
    loadSingleFrontendTree() {
      this.$axios
        .$get(`${frontCatalogSingle}?floorId=${this.singleFloorId}`)
        .then(result => {
          this.singleFrontendTree = result.payload
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
    // this.loadBackendTree()
    this.loadFrontendTree()
  },
  watch: {
    // newForm (val){
    //   console.log('我是watch',val)
    // }
    // floorId(val) {
    //   if (val) {
    //     this.loadBackendTree()
    //   }
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
