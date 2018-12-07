import range from 'lodash/range'
import map from 'lodash/map'

//订单类型
export const orderTypeOptions = [
  {value: 'NEW_VEHICLE_ORDER_TYPE', label: '新车订单'},
  {value: 'AFTER_SALES_ORDER_TYPE', label: '售后订单'},
  {value: 'MAINTAI_AFTER_SALES_ORDER_TYPE', label: '保养订单'},
  {value: 'BOUTIQUE_AFTER_SALES_ORDER_TYPE', label: '精品订单'},
  {value: 'SERVICE_AFTER_SALES_ORDER_TYPE', label: '服务订单'}
]
//订单状态
export const orderStatusOptions = [
  {value: 'to_be_paid', label: '待支付定金'},
  {value: 'intention_buy', label: '意向支付'},
  {value: 'paid_part', label: '支付部分定金'},
  {value: 'paid', label: '订转定'},
  {value: 'installment_commented', label: '已办理金融分期'},
  {value: 'balance_payment_commented', label: '已支付尾款'},
  {value: 'invoice_commented', label: '已开具发票'},
  {value: 'insurance_commented', label: '已办理车险'},
  {value: 'car_cards_commented', label: '已验车上牌'},
  {value: 'boutique_commented', label: '已加装精品'},
  {value: 'car_deliver_commented', label: '车辆交付完成'},
  {value: 'commented', label: '已评价'}
]

export const goodsType = {
  NEW_CARS: '新车',
  UNKEEP: '保养',
  BOUTIQUE: '精品',
  SERVICE: '服务',
  INSURANCE: '保险',
  FINANCE: '金融'
}

//商品类型
export const productType = {
  NEW_CAR: '新车',
  INSURANCE: '保险',
  MAINTAIN: '保养',
  FINANCE: '金融',
  INSTALLMENT: '分期',
  SERVICE: '服务',
  MANHOUR: '工时',
  BOUTIQUE: '精品',
  FREE_BOUTIQUE: '免费精品',
  新车: 'NEW_CAR',
  保险: 'INSURANCE',
  保养: 'MAINTAIN',
  金融: 'FINANCE',
  分期: 'INSTALLMENT',
  服务: 'SERVICE',
  工时: 'MANHOUR',
  精品: 'BOUTIQUE',
  免费精品: 'FREE_BOUTIQUE'
}

export const goodsStatus = {
  rejected: '驳回',
  passed: '审核通过',
  unaudited: '待审核',
  draft: '草稿',
  canceled: '已取消申请'
}
export const goodsSource = {
  post: '自定义',
  template: '总部模板',
  head_template: '自定义模板'
}

// 套餐列表界面 前后端数据转换（键值对 后端数据：前端数据）
//todo:  后端还没有提供相关字段  可能全都得改
export const comboStatus = {
  REJECTED: '驳回',
  PASSED: '审核通过',
  UNAUDIT: '待审核'
}
export const comboSource = {
  POST: '自定义',
  TEMPLATE: '总部模板',
  HEAD_TEMPLATE: '自定义模板'
}

// 属性管理
export const inputMethods = {
  INPUT: '手工输入',
  SELECT: '选项输入'
}

//车型年款
export const yearOptions = map(range(10), item => {
  const year = new Date().getFullYear()
  return {
    label: `${year - item}年款`,
    value: `${year - item}年款`
  }
})

//预约状态

export const subscribeType = {
  WAITING_STORE: '待到店',
  ALREADY_STORE: '已到店',
  WAITING_MAINTENANCE: '待保养',
  ALREADY_MAINTENANCE: '已保养',
  WAITING_PICK_CAR: '待取车',
  ALREADY_PICK_CAR: '已取车'
}
//证件类型
export const certificateType = {
  1: '身份证',
  2: '护照',
  3: '台胞证',
  4: '军官证',
  5: '回乡证',
  6: '驾驶证',
  7: '行驶证'
}
export const source = {
  1: '我买网',
  4: '京东',
  2: '自营'
}
