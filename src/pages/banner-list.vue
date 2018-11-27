<template>
  <div :class="pageName">
    <el-data-table ref="dataTable"
                   :url="url"
                   :columns="columns"
                   :hasNew="true"
                   :hasEdit="true"
                   :hasDelete="true"
                   :hasOperation="true"
                   :isTree="false"
                   :hasPagination="true"
                   :extraButtons="extraButtons"
                   :searchForm="searchForm"
                   :operationAttrs="operationAttrs"
                   :extraParams="extraParams"
                   :form="form"
                   :beforeConfirm="beforeConfirm"
                   @edit="extraEdit"
                   @new="clickNew">
        <el-form slot="form" :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item prop="sort">
          <div>
            <span>排序</span>
            <el-tooltip class="item" effect="dark" content="首页展示顺序" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <el-input v-model="extraParams.sort" placeholder="请输入数字"></el-input>
         </el-form-item>
        </el-form>

      <div slot="form"
           prop="logo">
        <div class="form-label">
          <span class="star">*</span>图片</div>
        <span>
          <upload-to-ali @load="onUpLoadFile($event, 'extraParams.url')"
                         protocol="https"
                         :fileUrl="extraParams.url">
          </upload-to-ali>
        </span>
        <p class="tip-text ">(建议尺寸：pc端1200*360、移动端750*438，仅支持jpg,png格式，图片大小1M以内）</p>
      </div>

    </el-data-table>
  </div>
</template>

<script>
import {httpPattern, positiveInteger} from '@/const/pattern'
import {bannerList, bannerEdit} from '@/const/api'
import UploadToAli from 'upload-to-ali'

const NORMAL = 'NORMAL'
const FORBIDDEN = 'FORBIDDEN'

export default {
  name: 'banner-list',
  components: {
    UploadToAli
  },
  data() {
    const checkUrl = (rule, value, callback) => {
      //      if (value && !httpPattern.test(value)) {
      //        callback('请输入以http开头的跳转链接地址')
      //        return
      //      }
      callback()
    }
    const checkNum = (rule, value, callback) => {
      if (
        this.extraParams.sort &&
        !positiveInteger.test(this.extraParams.sort)
      ) {
        callback('请输入正整数')
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        sort: ''
      },
      pageName: 'banner-list',
      url: '/mall-deepexi-mall-config-api/api/v1/advertisements',
      columns: [
        {
          prop: 'sort',
          label: '排序',
          renderHeader: (h, {column, $index}) => {
            return h('span', {}, [
              column.label,
              h(
                'el-tooltip',
                {
                  attrs: {
                    effect: 'dark',
                    content: '首页展示顺序',
                    placement: 'top'
                  }
                },
                [
                  h('i', {
                    class: 'el-icon-question'
                  })
                ]
              )
            ])
          }
        },

        {prop: 'url', label: '图片', formatter: this.logoFormatter},
        {
          prop: 'group',
          label: '分组',
          formatter: row => (row.group === 'MOBILE' ? '移动端' : 'PC端')
        },
        {prop: 'jumpUrl', label: '跳转链接'},
        {
          prop: 'status',
          label: '状态',
          formatter: row => (row.status === NORMAL ? '启用' : '禁用')
        }
      ],
      operationAttrs: {
        width: '220px',
        fixed: 'right'
      },
      extraButtons: [
        {
          type: 'primary',
          text: '启用',
          show: row => {
            return row.status !== NORMAL
          },
          atClick: row => {
            this.switchStatus(row)
          }
        },
        {
          type: 'default',
          text: '禁用',
          show: row => {
            return row.status === NORMAL
          },
          atClick: row => {
            this.switchStatus(row)
          }
        }
      ],
      form: [
        {
          rules: [{required: false, trigger: 'blur', validator: checkUrl}],
          $el: {placeholder: '请输入以http://开头,并且长度在100以内的网址'},
          label: '跳转链接',
          $id: 'jumpUrl',
          $type: 'input'
        },
        {
          $el: {placeholder: ''},
          label: '分组',
          $id: 'group',
          $type: 'select',
          $options: [
            {
              label: 'pc端',
              value: 'PC'
            },
            {
              label: '移动端',
              value: 'MOBILE'
            }
          ]
        }
      ],
      searchForm: [
        {
          $el: {placeholder: ''},
          $type: 'select',
          $id: 'status',
          label: '状态',
          $options: [
            {
              label: '启用',
              value: NORMAL
            },
            {
              label: '禁用',
              value: FORBIDDEN
            }
          ]
        },
        {
          $el: {placeholder: ''},
          $type: 'select',
          $id: 'group',
          label: '分组',
          $options: [
            {
              label: 'PC端',
              value: 'PC'
            },
            {
              label: '移动端',
              value: 'MOBILE'
            }
          ]
        }
      ],
      extraParams: {
        url: '',
        sort: ''
      },
      rules: {
        sort: [{trigger: 'blur', validator: checkNum}]
      }
    }
  },
  methods: {
    logoFormatter(row) {
      return (
        <img
          src={row.url ? row.url : ''}
          style={{
            width: '100px',
            background: 'transparent',
            padding: '0'
          }}
        />
      )
    },
    onUpLoadFile(url, type) {
      this.extraParams.url = url
    },
    beforeConfirm() {
      if (!this.extraParams.url) {
        this.$message({
          type: 'warning',
          message: '请上传图片'
        })
      }
      return this.extraParams.url
    },
    extraEdit(row) {
      this.extraParams.url = row.url
      this.extraParams.sort = row.sort
    },
    clickNew() {
      this.extraParams.url = ''
    },
    switchStatus(row) {
      // 切换状态
      let changedObj = {
        status: row.status === NORMAL ? FORBIDDEN : NORMAL
      }

      this.$axios
        .$put(
          `/mall-deepexi-mall-config-api/api/v1/advertisements/${row.id}`,
          changedObj
        )
        .then(resp => {
          this.$refs.dataTable.getList()
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        })
        .catch(err => {})
    }
  },
  async asyncData({app}) {},
  mounted() {}
}
</script>
<style lang="stylus">
.banner-list {
  .form-label {
    margin-bottom: 5px;
  }

  .star {
    color: #f56c6c;
    margin-right: 5px;
  }

  .upload-to-ali {
    width: 60px;
  }

  .tip-text{
    font-size: 12px;
    color:#f56c6c;
  }
}
</style>
