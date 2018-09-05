import {headImg} from '../validator'

export default [
  {
    $id: 'RelativeCar',
    $type: 'RelativeCar',
    label: '适配车型',
    $el: {
      isMultiple: true,
      hasCheckBox: true
    },
    $default: []
  },
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
    $id: 'brandId',
    $type: 'select',
    label: '品牌',
    $el: {
      placeholder: '请选择'
    },
    $options: [],
    rules: [
      {
        required: true,
        message: '品牌不能为空',
        trigger: 'blur'
      }
    ]
  },
  {
    $id: 'title',
    $type: 'input',
    label: '广告语',
    $el: {
      placeholder: '请输入'
    },
    rules: [
      {
        required: true,
        message: '广告语不能为空',
        trigger: 'blur'
      }
    ]
  },
  {
    $id: 'isVisible',
    $type: 'switch',
    label: '前台客户可见',
    $default: true
  },
  {
    $id: 'isSoldSeparately',
    $type: 'switch',
    label: '可单独出售',
    $default: true
  },
  {
    $id: 'productPhoto',
    $type: 'UploadToQiniuGroup',
    label: '商品图片',
    $default: [''],
    rules: [
      {
        validator: headImg
      }
    ]
  }
]
