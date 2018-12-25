<template>
  <div class="earnest-inflation-detail">
    <div class="form-title">
      <h1 >查看定金膨胀</h1>
    </div>
    <base-layout title="基本信息" btn-text>
      <el-form ref="submitForm" :model="submitForm" label-width="110px" :disabled="true">
        <el-form-item label="活动名称" prop="title">
          <el-col :span="6"><el-input v-model.trim="submitForm.title" placeholder="最多支持10个字"></el-input></el-col>
        </el-form-item>
        <el-form-item >
          <template slot="label">
            <span class="star">*</span><span>活动商品</span>
          </template>
        <base-layout title="商品" class="goodsBox" btn-text>
          <div style="display: flex;" v-for="item in selectGoods">
            <div class="shopBox-img">
              <img style="width: 100%;height: 100%;" :src="item.productPhoto && item.productPhoto.split(',')[0]" >
            </div>
            <div style="margin-left: 10px;">
              <p >{{item.name}}</p>
              <p >￥{{item.sellPrice}}</p>
            </div>
          </div>
        </base-layout>
        </el-form-item>
        <el-form-item label="定金支付时间" prop="earnestPayStartTime">
          <el-date-picker
            @change="setEarnestPayTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="earnestPayTime"
            type="datetimerange"
            :clearable=false
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <p style="color:#aaa">注：活动开始时间必须在创建时间24小时之后</p>
        </el-form-item>

        <el-form-item label="定金比例" prop="despositRatio">
          <div style="display: flex;flex-direction: column">
            <el-col :span="5"><el-input v-model.number="submitForm.despositRatio" placeholder="请输入定金比例"></el-input></el-col>
            <p style="color:#aaa">注：定金比例范围只能选择1%-50%（输入数字即可）</p>
          </div>


        </el-form-item>

        <el-form-item label="定金膨胀" class="inflation" prop="isExpansion">
          <template slot="label">
            <span class="star">*</span><span>定金膨胀</span>
          </template>
          <el-radio-group v-model="submitForm.isExpansion">

            <div style="display: flex">
              <el-radio :label="1" >是</el-radio>
              <el-radio :label="0">否</el-radio>
            </div>

          </el-radio-group>
          <el-form :model="submitForm" ref="form3" :disabled="true">
            <el-form-item prop="expansionRatio">
              <div style="display: flex">
                <span style="margin-right: 10px;">定金膨胀比例</span>
                <el-col :span="5"><el-input placeholder="请输入定金膨胀比例" v-model="submitForm.expansionRatio"></el-input></el-col>
              </div>
             </el-form-item>
              <p style="color:#aaa">注：只能选择1.1-3倍区间</p>
              <p style="font-size: 12px;color:rgb(255,90,90)">示例：定金为10元时，若设置定金膨胀比例为1.1倍，则用户支付10元定金，膨胀后可抵11元，即用户在支付尾款时少支付1元</p>
          </el-form>
        </el-form-item>



        <el-form-item label="尾款支付时间"  prop="tailPayStartTime">
          <el-date-picker
            @change="setTailPayTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="tailPayTime"
            type="datetimerange"
            :clearable=false
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item prop="isRange">
          <template slot="label">
            <span class="star">*</span><span>发货时间</span>
          </template>
          <el-radio-group v-model="submitForm.isRange" @change="setDeliverTime">
            <el-form  :model="submitForm" ref="form2" :disabled="true">

              <el-radio :label="1" style="margin-bottom: 20px;">
                  <el-form-item prop="deliveryTime">
                    <el-date-picker
                      v-model="submitForm.deliveryTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      :clearable=false
                      placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
              </el-radio>

            <el-col :span="4">
              <el-radio :label="2">
                <el-form-item prop="finalpayDeliveryTime">
                  <span>尾款支付</span>
                  <el-input v-model="submitForm.finalpayDeliveryTime" placeholder="请输入数字"></el-input>
                  <span>天后发货</span>
                </el-form-item>
              </el-radio>
            </el-col>
            </el-form>
          </el-radio-group>
          <p style="color:#aaa">注：请输入大于1小于90的数字</p>
        </el-form-item>
        <el-form-item label="商品金额:" >
            <span>选择商品后可见</span>
          <el-table
            :data="selectGoods"
            border
            style="width: 60%">
            <el-table-column
              prop="name"
              label="商品">
            </el-table-column>
            <el-table-column
              prop="goodPresaleMoney"
              label="预售定金">
            </el-table-column>
            <el-table-column
              prop="goodPrediscountMoney"
              label="定金膨胀后可抵">
            </el-table-column>
            <el-table-column
              prop="goodAdvanceSaleMoney"
              label="预售尾款">
            </el-table-column>
            <el-table-column
              prop="goodPreferentialMoney"
              label="优惠金额">
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </base-layout>
  </div>
</template>

<script>
import {earnestDetail} from '@/const/api'
import {earnestInflationList} from '@/const/path'
import BaseLayout from '@/components/goods-template/base-layout'
import {price, formatDate} from '@/const/filter'

export default {
  name: 'earnest-inflation-detail',
  components: {
    BaseLayout
  },
  data() {
    return {
      earnestPayTime: '',
      tailPayTime: '',
      selectGoods: [],
      props: {
        label: 'name',
        children: 'children'
      },
      outerVisible: false,
      submitForm: {
        despositRatio: '', //定金比例
        expansionRatio: '', //定金膨胀比例
        isExpansion: '',
        title: '',
        earnestPayStartTime: '',
        earnestPayEndTime: '',
        tailPayStartTime: '',
        tailPayEndTime: '',
        deliveryTime: '',
        finalpayDeliveryTime: '',
        activeGoodDtoList: [],
        isRange: ''
      }
    }
  },
  methods: {
    addCommodity() {
      this.outerVisible = true
    },
    setEarnestPayTime() {
      this.submitForm.earnestPayStartTime = this.earnestPayTime[0]
      this.submitForm.earnestPayEndTime = this.earnestPayTime[1]
    },
    setTailPayTime() {
      this.submitForm.tailPayStartTime = this.tailPayTime[0]
      this.submitForm.tailPayEndTime = this.tailPayTime[1]
    },
    setDeliverTime() {
      if (this.submitForm.isRange === 1) {
        this.submitForm.finalpayDeliveryTime = ''
      } else {
        this.submitForm.deliveryTime = ''
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid1 => {
        this.$refs['form2'].validate(valid2 => {
          this.$refs['form3'].validate(valid3 => {
            if (!valid1 || !valid2 || !valid3) {
              return
            }

            delete this.submitForm.isRange

            if (this.selectGoods.length === 0) {
              this.$message({
                type: 'error',
                message: '必须选择商品'
              })

              return
            }

            this.submitForm.activeGoodDtoList = this.selectGoods.map(
              selectGoodsItem => {
                return {
                  inGoodSkuJsonDto: {
                    goodId: selectGoodsItem.shopId,
                    goodName: selectGoodsItem.name,
                    goodImgUrl: selectGoodsItem.productPhoto.split(',')[0],
                    goodSkuId: selectGoodsItem.skuId,
                    originalMoney: selectGoodsItem.sellPrice,
                    stockCount: selectGoodsItem.stockCount
                  },
                  goodPrediscountMoney: selectGoodsItem.goodPrediscountMoney, //定金膨胀可抵
                  goodPresaleMoney: selectGoodsItem.goodPresaleMoney //预售定金
                }
              }
            )
            console.log(this.$route.query.id, !this.isView)
            if (this.$route.query.id && !this.isView) {
              this.$axios
                .$put(`${editEarnest}?id=${this.$route.query.id}`)
                .then(res => {
                  this.$router.push(earnestInflationList)
                })
            } else {
              this.$axios.$post(`${addEarnest}`, this.submitForm).then(res => {
                this.$router.push(earnestInflationList)
              })
            }
          })
        })
      })
    }
  },
  computed: {},

  watch: {
    'submitForm.despositRatio': {
      handler: function(val) {
        if (val > 50 || val < 1) {
          // 超出正常比例范围，不修改定金值
          return
        }
        this.selectGoods.map(goodsItem => {
          // 定金 = 定金比例 * 商品原价
          return this.$set(
            goodsItem,
            'goodPresaleMoney',
            price(val / 100 * goodsItem.sellPrice)
          )
        })
      }
    },
    'submitForm.expansionRatio': {
      handler: function(val) {
        if (val > 3 || val < 1.1) {
          return
        }
        //定金膨胀后金额 = 膨胀倍数 * 定金金额
        this.selectGoods.map(goodsItem => {
          this.$set(
            goodsItem,
            'goodPrediscountMoney',
            price(val * goodsItem.goodPresaleMoney)
          )

          //预售尾款= 商品原价 - 定金膨胀后金额
          this.$set(
            goodsItem,
            'goodAdvanceSaleMoney',
            price(goodsItem.sellPrice - goodsItem.goodPrediscountMoney)
          )

          //优惠金额 = 定金膨胀后金额 - 定金金额
          this.$set(
            goodsItem,
            'goodPreferentialMoney',
            price(goodsItem.goodPrediscountMoney - goodsItem.goodPresaleMoney)
          )

          return goodsItem
        })
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.$axios
        .$get(`${earnestDetail}?id=${this.$route.query.id}`)
        .then(res => {
          this.submitForm.title = res.payload.title
          this.submitForm.despositRatio = res.payload.despositRatio
          this.submitForm.isExpansion = res.payload.isExpansion
          this.submitForm.expansionRatio = res.payload.expansionRatio
          this.submitForm.deliveryTime = formatDate(
            res.payload.deliveryTime,
            'YYYY-MM-DD HH:mm:ss'
          )
          this.submitForm.finalpayDeliveryTime =
            res.payload.finalpayDeliveryTime
          this.selectGoods = res.payload.activeGoodDtoList
          this.selectGoods = res.payload.activeGoodDtoList.map(goodsItem => {
            return {
              productPhoto: goodsItem.inGoodSkuJsonDto.goodImgUrl,
              name: goodsItem.inGoodSkuJsonDto.goodName,
              sellPrice: goodsItem.inGoodSkuJsonDto.originalMoney
            }
          })
          this.earnestPayTime = [
            formatDate(res.payload.depositStartTime, 'YYYY-MM-DD HH:mm:ss'),
            formatDate(res.payload.despositEndTime, 'YYYY-MM-DD HH:mm:ss')
          ]
          this.tailPayTime = [
            formatDate(res.payload.finalpayStartTime, 'YYYY-MM-DD HH:mm:ss'),
            formatDate(res.payload.finalpayEndTime, 'YYYY-MM-DD HH:mm:ss')
          ]
        })
    }
  }
}
</script>

<style lang="stylus">
  .earnest-inflation-detail {
    //星标
    .star {
      color:rgb(245,115,113);
      padding-right: 4px;
    }

    .form-title {
      margin-bottom: 10px;
      padding-bottom: 10px;
      font-size:18px;
    }
    .el-radio-group {
      display: flex;
      flex-direction: column;
    }
    .el-radio {
        display: flex
        flex-wrap: nowrap
      }
    .el-radio+.el-radio {
      margin-left: 0
    }
    .el-radio__input {
      vertical-align: middle
      line-height: 36px
    }
    .inflation {
      .el-radio__label {
        margin-top:10px;
        margin-right:13px;
      }
    }
    .goodsBox {
      width: 60%;
      .el-card__header {
        padding:4px 23px;
      }
      .el-card__body{
        padding:10px;
      }
      .shopBox-img {
        width: 70px;
        height: 70px;
      }
    }
  }

</style>
