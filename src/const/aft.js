import {Object2Options, formatDate, price} from '@/const/filter'

const format = {
  dateTime: (row, column, val) => formatDate(val, 'YYYY-MM-DD HH : mm : ss'),
  money: (row, column, val) => price(val)
}

// export const statusOpts = {
//   // 退款
//   REFUNDING: '退款中',
//   CONFIRM_REFUND: '确认退款',
//   CANCEL_REFUND: '取消退款',
//   // 退货
//   RETURNING: '退货中',
//   CONFIRM_RETURN: '确认退货',
//   CANCEL_RETURN: '取消退货退款',
//   // 换货
//   DAISHOUHUO: '待收货',
//   DAIFAHUO: '待发货',
//   CONFIRM_FAHUO: '确认换货',
//   CANCEL: '取消',
//   FAILED_REVIEW: '审核失败',

//   WAIT_AUDIT: '待审核',
//   AUDITED: '已审核',
//   REFUNDED: '已退款',
//   REJECTED: '已拒绝',
//   UNDER_REVIEW: '审核中'
// }

export const statusOpts = {
  // 退款
  under_review: '待审核',
  failed_review: '已拒绝',

  refunding: '退款中',
  confirm_refund: '退款已完成',
  cancel_refund: '退款已取消',

  // 退款退货：
  daifahuo: '待发货',
  daishouhuo: '待收货',
  returning: '退货中',
  confirm_return: '退货已完成',
  cancel_return: '退货已取消'
}

export const searchForm = [
  {
    $el: {
      placeholder: '请输入'
    },
    label: '售后申请编号',
    $id: 'refundOrderId',
    $type: 'input'
  },
  {
    $el: {
      placeholder: '请输入'
    },
    label: '订单编号',
    $id: 'tradeOrderId',
    $type: 'input'
  },
  {
    $el: {
      placeholder: '请输入'
    },
    label: '会员昵称',
    $id: 'memberName',
    $type: 'input'
  },
  {
    $el: {
      placeholder: '请输入'
    },
    label: '会员手机号',
    $id: 'mobile',
    $type: 'input'
  },
  {
    $el: {
      placeholder: '请输入'
    },
    label: '商品渠道',
    $id: 'orderPlat',
    $type: 'select',
    $options: [
      {
        label: '我买网',
        value: '1'
      },
      {
        label: '自营',
        value: '2'
      },
      {
        label: '京东',
        value: '4'
      }
    ]
  },
  {
    $el: {
      placeholder: '请输入'
    },
    label: '售后类型',
    $id: 'refundTypeCode',
    $type: 'select',
    $options: [
      {
        label: '退货退款',
        value: '2'
      },
      {
        label: '退款',
        value: '1'
      }
    ]
  },
  {
    $el: {
      placeholder: '请输入'
    },
    label: '售后申请状态',
    $id: 'status',
    $type: 'select',
    $options: Object2Options(statusOpts)
  }
]
export const columns = [
  {
    prop: 'id',
    label: '售后申请单号',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'tradeOrderId',
    label: '订单编号',
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    prop: 'source',
    label: '商品渠道',
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'memberName',
    label: '会员昵称',
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'mobile',
    label: '会员手机号',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'refundTypeName',
    label: '售后类型'
  },
  {
    prop: 'refundMoney',
    label: '退款总金额',
    minWidth: 100
  },
  {
    prop: 'createdAt',
    label: '售后申请时间',
    formatter: format.dateTime,
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    prop: 'status',
    label: '售后申请状态',
    minWidth: 120,
    formatter: row => statusOpts[row.status]
  }
]

export const AUDIT = 'AUDIT'
export const RECEIVING = 'RECEIVING'
export const REFUND = 'REFUND'
export const RETURN = 'RETURN'

export const under_review = 'under_review'
export const failed_review = 'failed_review'
export const refunding = 'refunding'
export const confirm_refund = 'confirm_refund'
export const cancel_refund = 'cancel_refund'
export const daifahuo = 'daifahuo'
export const daishouhuo = 'daishouhuo'
export const returning = 'returning'
export const confirm_return = 'confirm_return'
export const cancel_return = 'cancel_return'
