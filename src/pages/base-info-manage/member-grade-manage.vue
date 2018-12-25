<template>
  <div>
    <div class="title">新增会员等级</div>
    <el-data-table
      ref="dataTableList"
      :url="url"
      :columns="dialogColumns"
      :hasOperation="true"
      :hasPagination="false"
      :extraButtons="extraButtons"
      :hasDelete="false"
      dataPath="payload"
      :form="form"
      :extraParams="extraParams"
      :beforeConfirm="beforeConfirm"
      @edit="extraEdit"
      @new="clickNew"
      style="margin-bottom: 30px"
    >
      <el-form slot="form" :rules="rulesNum" :model="extraParams" ref="allRules">
        <el-form-item prop="growth_range" label="*成长值下限：" >
          <el-col :span="6"><el-input v-model="extraParams.lowerValue"></el-input></el-col>
        </el-form-item>

        <el-form-item prop="levelIcon" label="*等级图标：">
          <upload-to-ali accept="image/png, image/jpeg, image/jpg"
                         v-model="extraParams.levelIcon"
                         :size="Number.MAX_SAFE_INTEGER">
          </upload-to-ali>
        <span class="tip-text">建议80*80像素，支持.JPG\.JPEG\.PNG格式</span>
        </el-form-item>
        <div style="margin-bottom: 10px;">
        <span>定期自动计算</span>
        <el-switch
          v-model="isAutomaticCalculate"
          active-color="#409eff"
          inactive-color="#dcdfe6">
        </el-switch>
        <span class="tip-text">开启后以注册日期为节点，满1年时，扣减后重新计算</span>
        <el-form-item prop="regular_deduction"  v-show="isAutomaticCalculate">
          <el-col :span="6">&nbsp;</el-col>
          <el-col :span="1.5">扣减</el-col>
          <el-col :span="4"><el-input v-model="extraParams.regularDeduction"></el-input></el-col>
          <el-col :span="3">成长值</el-col>
        </el-form-item>
        </div>
        <span>内部员工专享</span>
        <el-switch
          v-model="extraParams.internalWelfare"
          active-color="#409eff"
          inactive-color="#dcdfe6"
          active-value="OPEN"
          inactive-value="CLOSE">
        </el-switch>
        <span class="tip-text">开启后，内部员工注册后默认此等级</span>
      </el-form>
    </el-data-table>
    <el-dialog title="会员权益配置" :visible.sync="memberBenefitsVisible" width="50%">
      <el-data-table
        ref="dataTable"
        :url="memberBenefitsUrl"
        :customQuery="memberBenefitsQuery"
        :columns="benefitsColumns"
        :hasNew="false"
        :hasEdit="false"
        :hasDelete="false"
        :hasOperation="false"
        :isTree="false"
        :hasPagination="false"
        data-path="payload"
        @update="getData"
      >
        <el-table-column
          label="外部会员">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row['normalAccount']"
              active-color="#409eff"
              inactive-color="#dcdfe6"
              active-value="OPEN"
              inactive-value="CLOSE"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="内部员工">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row['internalStaff']"
              active-color="#409eff"
              inactive-color="#dcdfe6"
              active-value="OPEN"
              inactive-value="CLOSE"
            />
          </template>
        </el-table-column>
      </el-data-table>
      <el-button type="primary" @click="confirmEdit" class="btn-mg">确定</el-button>
      <el-button @click="()=>{this.memberBenefitsVisible = false}" class="btn-mg">取消</el-button>
    </el-dialog>

    <el-card>
      <div slot="header">
        <span class="title">成长值计算策略</span>
        <el-button style="float:right;" v-if="!isEdit" @click="isEdit = !isEdit">编辑</el-button>
      </div>
      <el-data-table
        ref="dataTable"
        :url="growthValueUrl"
        :columns="growthValueColumns"
        :extraButtons="extraButtons"
        :hasNew="false"
        :hasEdit="false"
        :hasDelete="false"
        :hasOperation="false"
        :hasPagination="false"
      >
        <el-table-column
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#409eff"
              inactive-color="#dcdfe6"
              active-value="OPEN"
              inactive-value="CLOSE"
              @change="growthValueConfirm(scope.row)"
              :disabled=!isEdit>
            </el-switch>
          </template>
        </el-table-column>
      </el-data-table>
    </el-card>
  </div>
</template>

<script>
import {mcMemberLevel, levelBenefit, experienceStrategy} from '@/const/api'

import {positiveInteger} from '@/const/pattern'
export default {
  name: 'member-grade-category',
  components: {},
  data() {
    const checkLevelName = (rule, value, callback) => {
      if (!value) {
        callback('等级名称不能为空')
        return
      } else if (value.length > 30) {
        callback('字符超出30字符限制')
        return
      }
      callback()
    }
    const checkNum = (rule, value, callback) => {
      if (!this.extraParams.lowerValue && this.extraParams.lowerValue !== 0) {
        callback('成长值下限不能为空')
        return
      } else if (
        this.extraParams.lowerValue != 0 &&
        !positiveInteger.test(this.extraParams.lowerValue)
      ) {
        callback('请输入正整数')
        return
      }
      callback()
    }
    const checkNum2 = (rule, value, callback) => {
      if (this.isAutomaticCalculate && !this.extraParams.regularDeduction) {
        callback('自动计算开启后成长值不能为空')
        return
      } else if (
        this.extraParams.regularDeduction &&
        !positiveInteger.test(this.extraParams.regularDeduction)
      ) {
        callback('请输入正整数')
        return
      }
      callback()
    }
    return {
      ruleForm: {
        lowerValue: '',
        regularDeduction: ''
      },
      isEdit: false,
      memberData: [],
      url: mcMemberLevel,
      memberBenefitsUrl: levelBenefit,
      memberBenefitsQuery: {},
      memberBenefitsVisible: false,
      growthValueData: [],
      growthValueUrl: experienceStrategy,
      dialogColumns: [
        {
          prop: 'levelName',
          label: '等级名称',
          width: '100px'
        },
        {
          prop: 'levelIcon',
          label: '图标',
          width: '110px',
          formatter: this.logoFormatter
        },
        {
          prop: 'growth_range',
          label: '成长值范围',
          width: '100px',
          formatter: row => {
            if ((row.lowerValue || row.lowerValue == 0) && !row.upperValue) {
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
          formatter: row => {
            return row.internalWelfare === 'OPEN' ? '开启' : ''
          }
        },
        {
          prop: 'regularDeduction',
          label: '说明',
          width: '250px',
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
          atClick: this.getMemberBenefits
        },
        {
          type: 'danger',
          text: '删除',
          atClick: this.checkCanDelete
        }
      ],
      form: [
        {
          label: '*等级名称',
          $id: 'levelName',
          $type: 'input',
          rules: [{required: false, trigger: 'blur', validator: checkLevelName}]
        }
      ],
      extraParams: {
        levelIcon: '',
        lowerValue: '',
        internalWelfare: 'CLOSE',
        regularDeduction: 0
      },
      isAutomaticCalculate: true,
      benefitsColumns: [
        {
          prop: 'benefitName',
          label: '用户权益'
        }
      ],
      growthValueColumns: [
        {
          prop: 'behavior',
          label: '用户行为'
        },
        {
          prop: 'description',
          label: '奖励成长值'
        },
        {
          prop: 'rewardContent',
          label: '说明'
        }
      ],
      rulesNum: {
        growth_range: [{trigger: 'blur', validator: checkNum}],
        regular_deduction: [{trigger: 'blur', validator: checkNum2}]
      }
    }
  },
  watch: {
    isAutomaticCalculate: function() {
      if (!this.isAutomaticCalculate) {
        this.extraParams.regularDeduction = 0
      }
    }
  },
  methods: {
    logoFormatter(row) {
      return (
        <img
          src={row.levelIcon ? row.levelIcon : ''}
          style={{
            width: '60px',
            background: 'transparent',
            padding: '0'
          }}
        />
      )
    },
    extraEdit(row) {
      this.$refs['allRules'] ? this.$refs['allRules'].resetFields() : ''
      this.extraParams.levelIcon = row.levelIcon
      this.extraParams.lowerValue = row.lowerValue
      this.extraParams.internalWelfare = row.internalWelfare
      this.extraParams.regularDeduction = row.regularDeduction
      this.isAutomaticCalculate = !!row.regularDeduction
    },
    clickNew() {
      this.$refs['allRules'] ? this.$refs['allRules'].resetFields() : ''
      this.extraParams.levelIcon = ''
      this.extraParams.lowerValue = ''
      this.extraParams.internalWelfare = 'CLOSE'
      this.extraParams.regularDeduction = 0
      this.isAutomaticCalculate = true
    },
    // onUpLoadFile(levelIcon, type) {
    //   this.extraParams.levelIcon = levelIcon
    // },
    getMemberBenefits(row) {
      // this.memberId = row.id
      this.memberBenefitsVisible = true
      this.memberBenefitsQuery = {id: row.id}
      this.memberBenefitsUrl = levelBenefit + '?id=' + row.id
    },
    confirmEdit() {
      let newArr = this.memberData.map(item => {
        return {
          id: item.id,
          normalAccount: item.normalAccount,
          internalStaff: item.internalStaff
        }
      })
      this.$axios
        .$put(levelBenefit, newArr)
        .then(result => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        })
        .catch(err => {
          this.$message.error('操作失败! 请稍后再试!')
        })
        .finally(res => {
          this.memberBenefitsVisible = false
        })
    },
    beforeConfirm() {
      if (!this.extraParams.levelIcon) {
        this.$message({
          type: 'warning',
          message: '请上传图片'
        })
        return false
      }
      this.$refs['allRules'].validate(valid => {
        console.log(valid)
        this.valid = valid
      })
      return this.valid
    },
    getData(data) {
      this.memberData = data
    },
    getGrowthValueData() {
      this.$axios
        .$get(experienceStrategy)
        .then(resp => {
          this.growthValueData = resp.payload
        })
        .catch()
    },
    growthValueConfirm(row) {
      let newArr = [
        {
          id: row.id,
          status: row.status
        }
      ]
      this.$axios
        .$put(experienceStrategy, newArr)
        .then(result => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        })
        .catch(err => {
          this.$message.error('操作失败! 请稍后再试!')
        })
    },
    // getValueData(data) {
    //   this.growthValueData = data
    // },
    checkCanDelete(row) {
      this.$confirm('是否删除该会员等级', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          this.$axios
            .$delete(`${mcMemberLevel}/${row.id}`)
            .then(result => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.$refs.dataTableList.getList()
            })
            .catch(error => {
              if (error.response) {
                if (error.response.status == 408) {
                  this.$confirm('无法删除该会员等级', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  })
                }
              }
            })
        })
        .catch()
    }
  },
  created() {
    this.getGrowthValueData()
  }
}
</script>

<style scoped>
.tip-text {
  font-size: 12px;
  color: #aaa;
}
.title {
  font-size: 20px;
  font-weight: 600;
}
.btn-mg {
  margin: 15px;
}
</style>
