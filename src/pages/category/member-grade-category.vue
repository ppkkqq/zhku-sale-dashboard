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
      :extraParams="extraParams"
      dialogNewTitle="新增会员等级"
      @edit="extraEdit"
      @new="clickNew"
    >
      <el-form slot="form">
        <el-form-item prop="growth_range" label="成长值范围：">
          <el-col :span="4"><el-input v-model="extraParams.lowerValue"></el-input></el-col>
          <el-col :span="1"><span>——</span></el-col>
          <el-col :span="4"><el-input v-model="extraParams.upperValue"></el-input></el-col>
        </el-form-item>
      </el-form>
      <div slot="form"
           prop="levelIcon">
        <el-form-item prop="growth_range" label="等级图标：">
          <upload-to-ali @load="onUpLoadFile($event, 'extraParams.levelIcon')"
                         protocol="https"
                         :fileUrl="extraParams.levelIcon">
          </upload-to-ali>
        <span class="tip-text">建议80*80像素，支持.JPG\.JPEG\.PNG格式</span>
        </el-form-item>
      </div>
      <div slot="form" prop="regularDeduction">
        <div>
        <span>定期自动计算</span>
        <el-switch
          v-model="isAutomaticCalculate"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
        <span class="tip-text">开启后以注册日期为节点，满1年时，扣减后重新计算</span>
        <el-form-item prop="growth_range">
          <el-col :span="3">&nbsp;</el-col>
          <el-col :span="1.5">扣减</el-col>
          <el-col :span="4"><el-input v-model="extraParams.regularDeduction" :disabled="!isAutomaticCalculate"></el-input></el-col>
          <el-col :span="3">成长值</el-col>
        </el-form-item>
        </div>
      </div>
      <div  slot="form"
           prop="internalWelfare">
        <span>内部员工专享</span>
        <el-switch
          v-model="extraParams.internalWelfare"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="yes"
          inactive-value="no">
        </el-switch>
        <span class="tip-text">开启后，内部员工注册后默认此等级</span>
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
          prop: 'levelName',
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
      ],
      form: [
        {
          label: '等级名称',
          $id: 'levelName',
          $type: 'input'
        }
      ],
      extraParams: {
        levelIcon: '',
        lowerValue: '',
        upperValue: '',
        internalWelfare: 'no',
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
      this.extraParams.levelIcon = row.levelIcon
      this.extraParams.lowerValue = row.lowerValue
      this.extraParams.upperValue = row.upperValue
      this.extraParams.internalWelfare = row.internalWelfare
      this.extraParams.regularDeduction = row.regularDeduction
      this.isAutomaticCalculate = !!row.regularDeduction
    },
    clickNew() {
      this.extraParams.levelIcon = ''
      this.extraParams.lowerValue = ''
      this.extraParams.upperValue = ''
      this.extraParams.internalWelfare = 'no'
      this.extraParams.regularDeduction = ''
      this.isAutomaticCalculate = false
    },
    onUpLoadFile(levelIcon, type) {
      this.extraParams.levelIcon = levelIcon
    }
  }
}
</script>

<style scoped>
.tip-text {
  font-size: 12px;
  color: #f56c6c;
}
</style>
