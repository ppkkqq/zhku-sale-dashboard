import {headImg} from '../validator'

const oppositeGroup = [
  {
    label: '0', // 数字0 radio不能选中
    value: '0',
    defaultSlot: '是'
  },
  {
    label: '1',
    value: '1',
    defaultSlot: '否'
  }
]
export default [
  {
    $id: 'name',
    $type: 'input',
    label: '商品名称',
    $el: {
      placeholder: '请输入'
    },
    rules: [
      {
        required: true,
        message: '商品名称不能为空',
        trigger: 'blur'
      }
    ]
  },
  {
    $id: 'title',
    $type: 'input',
    label: '商品标签',
    $el: {
      placeholder: '请输入'
    },
    rules: [
      {
        required: true,
        message: '商品标签不能为空',
        trigger: 'blur'
      }
    ]
  },
  {
    $id: 'supportExchangeGoods',
    $type: 'radio-group',
    label: '支持换货',
    $options: oppositeGroup
  },
  {
    $id: 'supportReturnGoods',
    $type: 'radio-group',
    label: '支持退货',
    $options: oppositeGroup
  },
  {
    $id: 'supportInvoice',
    $type: 'radio-group',
    label: '支持开发票',
    $options: oppositeGroup
  },
  {
    $id: 'productPhoto',
    $type: 'UploadToQiniuGroup',
    label: '商品图片',
    $default: [''],
    rules: [
      {
        required: true,
        validator: headImg
      }
    ]
  }
]
