<template>
  <div class="creditspolicy-configuration">
    <el-card class="rule-card">
      <div slot="header" class="clearfix">
        <span class="card-title">积分规则配置</span>
        <el-button style="float:right;" @click="ruleIsDisabled = false">编辑</el-button>
      </div>

      <div class="conversion">
        <el-form ref="form" :model="rules" label-width="100px" :disabled=ruleIsDisabled>
          <el-form-item label="积分换算规则">
            <div class="conversion-content"><span>每消费</span>
              <el-col :span="3"><el-input v-model="rules.spendMoney"></el-input></el-col> <span>元得到</span>
              <el-col :span="3"><el-input v-model="rules.point"></el-input></el-col><span>积分</span>
            </div>
          </el-form-item>

          <el-form-item label="积分消耗规则">
            <div class="conversion-content"><span>每</span>
              <el-col :span="3"><el-input :disabled="true" v-model="rules.consumePoint"></el-input></el-col> <span>积分抵扣</span>
              <el-col :span="3"><el-input :disabled="true" v-model="rules.economizeMoney"></el-input></el-col> <span>元</span>
            </div>
          </el-form-item>

          <el-form-item label="备注说明：">
            <div class="conversion-content"><span>积分的消耗只能以1000的整数倍使用，圆通币、优惠卷支付的金额，无法换算积分</span></div>
          </el-form-item>

          <el-form-item v-if="ruleIsDisabled===false">
            <el-button type="primary"
                       @click="updateRules">保存</el-button>
            <el-button type="normal"
                       @click="resetRules">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="scene-card">
      <div slot="header" class="clearfix">
        <span class="card-title">积分场景配置</span>
        <el-button style="float:right;" @click="sceneIsDisabled = false">编辑</el-button>
      </div>
      <el-data-table
        ref="dataTable"
        :url="url"
        :columns="sceneColumns"
        :operationAttrs="operationAttrs"
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
            <el-switch v-model="value3"
              active-text="按月付费"
              inactive-text="按年付费"
              :disabled=sceneIsDisabled></el-switch>
          </template>
        </el-table-column>
        </el-data-table>
      <div style="margin-top: 10px;" v-if="sceneIsDisabled===false">
      <el-button type="primary"
                 @click="updateScene">保存</el-button>
      <el-button type="normal"
                 @click="resetScene">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import {pointConfigRule} from '@/const/api'
export default {
  name: 'creditspolicy-configuration',
  data() {
    return {
      url: '',
      rules: {},
      ruleIsDisabled: true,
      sceneIsDisabled: true,
      sceneColumns: [
        {
          prop: 'userAction',
          label: '用户行为'
        },
        {
          prop: 'userAction',
          label: '积分奖励规则'
        },
        {
          prop: 'userAction',
          label: '说明'
        }
      ],
      operationAttrs: {
        width: '220px',
        fixed: 'right'
      },
      extraButtons: [
        {
          type: 'primary',
          text: '开启',
          atClick: row => {
            this.switchStatus(row)
          }
        },
        {
          type: 'default',
          text: '禁用',
          show: row => {
            return row.status === true
          },
          atClick: row => {
            this.switchStatus(row)
          }
        }
      ]
    }
  },
  methods: {
    updateRules() {
      this.$axios.$post(pointConfigRule, this.rules).then(res => {
        this.$refs.dataTable.getList()
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
      })
      this.ruleIsDisabled = true
    },
    resetRules() {
      this.ruleIsDisabled = true
    },
    updateScene() {
      this.$axios.$put().then(res => {})
      this.sceneIsDisabled = true
    },
    resetScene() {
      this.sceneIsDisabled = true
    },
    getRules() {
      this.$axios.$get(pointConfigRule).then(res => {
        this.rules = res.payload
      })
    }
  },
  mounted() {
    this.getRules()
  }
}
</script>

<style  lang="stylus">
.creditspolicy-configuration {
  .card-title {
    font-size: 16px;
    float:left;
    margin-top:5px;
  }
  .conversion {
    .conversion-content {
      display: flex;
      white-space: nowrap;
      span {
        padding:0 10px;
      }
    }
  }
  .scene-card {
    margin-top: 50px;
  }
}
</style>
