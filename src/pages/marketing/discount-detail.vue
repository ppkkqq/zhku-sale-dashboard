<template>
  <div :class="pageName">
    <base-layout title="基本信息" :hasEdit="false" btn-text>
      <el-form ref="form" :model="form" label-width="100px" :rules="rules" :disabled="true">
        <el-form-item label="活动名称" prop="title">
          <el-input v-model.trim="form.title"></el-input>
        </el-form-item>
        <el-form-item label="生效时间">
          <el-date-picker
            v-model="form.date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
          <el-tooltip class="item" effect="dark" content="注：活动开始时间必须在创建时间24小时之后" placement="bottom">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="限制设置">
          <el-radio-group v-model="form.isLimited">
            <el-radio :label="0">
              <div class="flex">
                <span class="el-checkbox__label">不限购</span>
              </div>
            </el-radio>
            <el-radio :label="1">
              <div class="flex">
                <span class="el-checkbox__label">每人每种商品限购</span>
                <span class="flex el-checkbox__label">
                  <el-input
                    type="number"
                    v-model.number="form.account"
                    size="mini"
                    @blur="toInteger(form, 'account')"
                  ></el-input>
                </span>
                <span class="el-checkbox__label">件</span>
              </div>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </base-layout>
    <el-card shadow="never" class="base-layout">
      <el-row type="flex" justify="end" class="red">注：折扣价格惠自动抹去角、分</el-row>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column
          prop="name"
          label="商品"
          :min-width="300"
          :formatter="logoFormatter"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          v-for="(column,index) in columns"
          :key="index"
          :prop="column.prop"
          :label="column.label"
          :width="column.minWidth"
          :formatter="column.formatter"
        >
          <template slot-scope="scope" v-if="!(column.prop=='name'||column.type=='selection')">
            <el-input-number
              :disabled="true"
              v-model.number="scope.row[column.prop]"
              :controls="false"
              :min="0"
              @blur="setDiscount(scope.row, column.prop)"
              placeholder="填写调整后可用量"
            ></el-input-number>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import BaseLayout from '@/components/goods-template/base-layout'
import {InputNumber} from 'element-ui'
import {price, formatDate} from '@/const/filter'
import {discountDetail} from '@/const/api'
import {discountStatus} from '@/const/marketing'

import {addRule} from '@/const/api.js'
import {updateRule} from '@/const/api.js'
import {ruleDetail} from '@/const/api.js'

export default {
  name: 'discount-detail',
  components: {
    BaseLayout,
    'el-input-number': InputNumber
  },
  data() {
    return {
      pageName: 'discount-detail',
      activeName: '1',
      date: [],
      props: {
        label: 'name',
        children: 'children'
      },
      tableData: [],
      submitData: {},
      columns: [
        {
          prop: 'goodsDiscount',
          label: '折扣（折）',
          minWidth: 120
        },
        {
          prop: 'goodsReducePrice',
          label: '减价（元）',
          minWidth: 120
        },
        {
          prop: 'goodsActivityPrice',
          label: '打折后（元）',
          minWidth: 120
        }
      ],
      rules: {
        title: [
          {
            required: true,
            message: '活动名称不能为空',
            trigger: 'change'
          },
          {
            max: 10,
            message: '优惠卷名称必须在1-10个字内',
            trigger: 'change'
          }
        ],
        approve1: [
          {
            required: true,
            message: '生效时间不能为空',
            trigger: 'change'
          }
        ]
      },
      form: {
        name: '',
        isLimited: 0,
        account: 0
      },
      selection: []
    }
  },
  computed: {
    query() {
      return this.$route.query
    }
  },
  methods: {
    logoFormatter(row) {
      if (!row || !row.productPhoto) return
      let imgUrl = row.productPhoto.split(',')[0]
      let sellPrice = price(row.goodsPrice)
      return (
        <div style="display:flex;align-items:center">
          <img
            src={imgUrl ? imgUrl : ''}
            style={{
              width: '100px',
              background: 'transparent',
              padding: '0',
              marginRight: '20px'
            }}
          />
          <div>
            <div>{row.goodsName}</div>
            <div>￥{sellPrice}</div>
          </div>
        </div>
      )
    }
  },
  created() {
    if (this.query.activityId) {
      this.$axios
        .$get(discountDetail, {
          params: {
            activityId: this.query.activityId
          }
        })
        .then(res => {
          if (!res.payload) return
          this.form = res.payload
          this.form.date = [
            formatDate(res.payload.startTime, 'YYYY-MM-DD HH:mm:ss'),
            formatDate(res.payload.endTime, 'YYYY-MM-DD HH:mm:ss')
          ]
          this.form.isLimited = res.payload.limitCount == -1 ? 0 : 1
          this.form.account =
            res.payload.limitCount == -1 ? 0 : res.payload.limitCount
          this.tableData = res.payload.activityGoodsList || []
        })
    }
  }
}
</script>
<style lang="stylus">
.discount-detail {
  .base-layout {
    margin-bottom: 20px
  }

  .flex {
    display: flex
    flex-wrap: nowrap
  }

  .el-input {
    max-width: 600px
  }

  .el-date-editor {
    width: 600px
  }

  .el-range-separator {
    width: 40px
  }

  .el-checkbox__label {
    line-height: 36px
    box-sizing: border-box
  }

  .el-radio+.el-radio {
    margin-left: 0
  }

  .el-radio {
    display: flex
    flex-wrap: nowrap
  }

  .el-radio__input {
    vertical-align: middle
    line-height: 36px
  }

  .flex .el-checkbox__label {
    padding-left: 0
    padding-right: 10px
  }

  .cell .el-input-number {
    width: 100%
  }

  .el-table {
    margin-bottom: 20px
  }

  .red {
    color: red
  }
}
</style>
