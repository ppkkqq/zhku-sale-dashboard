<template>
  <div>
    <el-data-table
      :url="url"
      :columns="dialogColumns"
      :hasOperation="true"
      :hasPagination="true"
      :extraButtons="extraButtons"
      dataPath="payload"
      :form="form"
      dialogNewTitle="新增会员等级"
      @edit="extraEdit"
      @new="clickNew"
    >
      <el-form slot="form">
        <el-form-item prop="growth_range">
          <span>成长值范围</span>
          <el-input v-model="extraParams.lowerValue"></el-input><span>—</span>
          <el-input v-model="extraParams.upperValue"></el-input>
        </el-form-item>
      </el-form>
      <div slot="form"
           prop="levelIcon">
        <span>等级图标
          <upload-to-ali v-model="extraParams.url">
          </upload-to-ali>
            建议80*80像素，支持.JPG\.JPEG\.PNG格式
        </span>
      </div>
      <div slot="form"
           prop="regularDeduction">
        <span>定期自动计算</span>
        <el-switch
          v-model="isAutomaticCalculate"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
        <span>开启后以注册日期为节点，满1年时，扣减后重新计算</span>
        <p>扣减</p>
        <el-input v-model="extraParams.regularDeduction" :disabled="!isAutomaticCalculate"></el-input>
        <span>成长值</span>
      </div>
      <div slot="form"
           prop="isInternalWelfare">
        <span>内部员工专享</span>
        <el-switch
          v-model="extraParams.isInternalWelfare"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
        <span>开启后，内部员工注册后默认此等级</span>
      </div>
    </el-data-table>
  </div>
</template>

<script>
import UploadToAli from 'upload-to-ali'
export default {
  name: 'member-grade-category',
  components: {
    UploadToAli
  },
  data() {
    return {
      url:
        'http://levy.ren:3000/mock/308/mall-deepexi-member-center/api/v1/mcMemberLevel',
      dialogColumns: [
        {
          prop: 'gradeName',
          label: '等级名称',
          width: '130px'
        },
        {
          prop: 'levelIcon',
          label: '图标',
          width: '130px',
          formatter: this.logoFormatter
        },
        {
          prop: 'growth_range',
          label: '成长值范围',
          width: '130px',
          formatter: row => {
            if (row.lowerValue === '0' && row.upperValue === '0') {
              return '无'
            } else if (row.lowerValue && !row.upperValue) {
              return row.lowerValue + '以上'
            } else {
              return row.lowerValue + '-' + row.upperValue
            }
          }
        },
        {
          prop: 'internalWelfare',
          label: '内部专享',
          width: '100px',
          formatter: row => (row.internalWelfare === 'yes' ? '开启' : '')
        },
        {
          prop: 'regularDeduction',
          label: '说明',
          default: '',
          formatter: row => {
            if (!row.regularDeduction) {
              return '永久有效'
            }
            return `有效期1年，1年后扣除${
              row.regularDeduction
            }成长值，根据剩余成长值重新计算级别`
          }
        }
      ],
      extraButtons: [
        {
          type: 'primary',
          text: '配置权益',
          atClick: row => alert('跳转' + row.code)
        }
        // {
        //   type: 'info',
        //   text: '配置',
        //   atClick: row => alert('跳转' + row.code)
        // },
        // {
        //   type: 'default',
        //   text: '删除',
        //   atClick: row => alert('跳转' + row.code)
        // }
      ],
      form: [
        {
          label: '等级名称',
          $id: 'gradeName',
          $type: 'input'
        }
      ],
      extraParams: {
        url: '',
        lowerValue: '',
        upperValue: '',
        isInternalWelfare: false,
        regularDeduction: ''
      },
      isAutomaticCalculate: false
    }
  },
  methods: {
    logoFormatter(row) {
      return (
        <img
          src={row.levelIcon ? row.levelIcon : ''}
          style={{
            width: '100px',
            background: 'transparent',
            padding: '0'
          }}
        />
      )
    },
    extraEdit(row) {
      this.extraParams.url = row.url
      this.extraParams.lowerValue = row.lowerValue
      this.extraParams.upperValue = row.upperValue
      this.extraParams.isInternalWelfare = row.isInternalWelfare
      this.extraParams.regularDeduction = row.regularDeduction
      this.isAutomaticCalculate = !!row.regularDeduction
    },
    clickNew() {
      this.extraParams.url = ''
      this.extraParams.lowerValue = ''
      this.extraParams.upperValue = ''
      this.extraParams.isInternalWelfare = false
      this.extraParams.regularDeduction = ''
      this.isAutomaticCalculate = false
    }
  }
}
</script>

<style scoped>
</style>
