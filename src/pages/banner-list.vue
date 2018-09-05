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
                   :extraParams="extraParams"
                   :form="form"
                   :beforeConfirm="beforeConfirm"
                   @edit="extraEdit"
                   @new="clickNew">
      <div slot="form"
           prop="logo">
        <div class="form-label">
          <span class="star">*</span>图片</div>
        <span>
          <upload-to-ali @load="onUpLoadFile($event, 'extraParams.url')"
                         :fileUrl="extraParams.url">
          </upload-to-ali>
        </span>
      </div>
    </el-data-table>
  </div>
</template>

<script>
import {httpPattern} from '@/const/pattern'
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
    return {
      pageName: 'banner-list',
      url: bannerList,
      columns: [
        {prop: 'url', label: '图片', formatter: this.logoFormatter},
        {prop: 'jumpUrl', label: '跳转链接'},
        {
          prop: 'status',
          label: '状态',
          formatter: row => (row.status === NORMAL ? '启用' : '禁用')
        }
      ],
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
        }
      ],
      extraParams: {
        url: ''
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
        .$put(bannerEdit(row.id), changedObj)
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
}
</style>
