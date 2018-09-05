const baseApi = '/optimus-api/api/v1'

const prefix = '/mock'

const mallConfigApi = '/car-deepexi-mall-config-api/api/v1'
const productCenter = '/car-deepexi-product-center/api/v1'
const memberCenter = '/car-deepexi-member-center/api/v1'
const shopCenter = '/car-deepexi-shop-center/api/v1'
const tradeCenter = '/car-deepexi-trade-center/api/v1'
const applicationCenter = '/moby-application-api/api/v1' //应用中心
const evaluateCenter = '/car-deepexi-evaluate-center/api/v1' //评价中心
const carCenter = '/car-deepexi-car-center/api/v1' //车辆中心
const fakeProductCenter = prefix + '/deepexi-product-center/api/v1'

export const goodsLists = productCenter + '/admin/items'
export const goodsAudit = id => productCenter + `/admin/items/${id}/status`

export const recommendList = mallConfigApi + '/featuredFirsts'

// 品牌管理
// 根据id 修改品牌信息
export const productBrandEdit = id => productCenter + `/pcBrands/${id}`
// 获取所有品牌列表
// export const productBrandList = deepexiProductCenter + '/pcBrands/list'
export const pcBrands = productCenter + `/pcBrands`

// 首页广告页面
export const bannerList = mallConfigApi + '/advertisements'
export const bannerEdit = id => mallConfigApi + `/advertisements/${id}`
// 门店列表
export const shopList = shopCenter + '/shops'

// 商品上下架管理
export const skusStocklist = fakeProductCenter + '/admin/items/skus/stocklist'
// 获取商品sku上下架列表
export const skusList = id => {
  return fakeProductCenter + `/admin/items/${id}/skus`
}
// 上下架-商品详情
export const sellerItems = id => fakeProductCenter + `/admin/items/${id}`
// 批量上架
export const skusOn = id => {
  return fakeProductCenter + `/seller/items/${id}/skus/on`
}
// 批量下架
export const skusOff = id => {
  return fakeProductCenter + `/seller/items/${id}/skus/off`
}

//后台类目树

export const prdCatalogs = productCenter + '/prdCatalogs/tree'
export const backendCatalogTree = productCenter + '/prdCatalogs/tree'
export const backendCatalogDetail = id => productCenter + `/prdCatalogs/${id}`
export const backendCatalogBaseUrl = productCenter + `/prdCatalogs`
export const catalogAttr = productCenter + `/catalogAttr`
//前台类目树
export const frontendCatalogTree = productCenter + '/pcPrecategorys/tree'
export const frontendCatalogDetail = id =>
  productCenter + `/pcPrecategorys/${id}`
export const frontendCatalogBaseUrl = productCenter + `/pcPrecategorys`
export const bindBackendUrl = productCenter + `/pcPrecategoryCatalogs`

// 会员信息
export const mcMemberInfos = memberCenter + '/mcMemberAccounts'

// 属性管理
// crud
export const attributes = productCenter + '/attributes'

// 属性组管理
// crud
export const attributeGroups = productCenter + '/attributeGroups'

// 商品模板管理
// 列表
export const templateList = productCenter + '/templates' // 原接口
// export const shopTemplateList = productCenter + '/shop/templates' // 门店模板
export const adminTemplateList = productCenter + '/admin/templates'
// 启用禁用
export const templateStatus = id =>
  productCenter + `/shop/templates/${id}/status`
// 授权
export const grantShop = id => productCenter + `/shop/templates/${id}/grantShop`
export const grantList = id =>
  productCenter + `/shop/templates/${id}/grant/list`

// 套餐模板管理
// 列表
export const pcBundleTempaltes = productCenter + '/pcBundleTempaltes' // 原接口
// export const shopPcBundleTempaltes = productCenter + '/pcBundleTempaltes' // 门店模板
export const adminPcBundleTempaltes = productCenter + '/admin/pcBundleTempaltes'
// 授权
export const bundleGrantShop = id =>
  productCenter + `/admin/pcBundleTempaltes/${id}/grantShop` // 单个
export const bundleGrantList = id =>
  productCenter + `/admin/pcBundleTempaltes/${id}/grant/list` // 单个 店铺列表

// 启用禁用
export const bundleStatus = id =>
  productCenter + `/admin/pcBundleTempaltes/${id}/status`

//订单列表
//(平台查询订单列表)
export const orderList = tradeCenter + '/carOrder/list'
export const orderDetail = tradeCenter + '/carOrder/detail'

// 反馈 crud
export const feedback = mallConfigApi + '/feedbacks'

//车型基础数据管理
export const carBrandsSeries = productCenter + '/pcCarBrandSeries'
export const carModels = productCenter + '/pcCarModels'

//商品管理
export const shopItems = `${productCenter}/admin/items`
export const productDetail = id => `${productCenter}/shop/items/${id}`

//套餐管理
//TODO:  后端接口还没有给我。。。。
export const pcBundles = productCenter + '/admin/pcBundles'
export const comboLists = productCenter + '/pcBundleTempaltes'
export const bundlesAudit = id =>
  productCenter + `/admin/pcBundles/${id}/status`

//客户

//客户详情

//subscribes/list
//我的预约
export const customerSubscribes = `${tradeCenter}/subscribes/list`
//我的关注
export const customerFocus = `${applicationCenter}/goodsAttentions/headquarters/personalCollectsDetails`
//我的评价
export const customerEvaluate = `${evaluateCenter}/ecEvaluations/tree`
//我的证件
export const customerCertificatess = `${memberCenter}/mcCertificatess/list`
//我的车辆
export const customerCars = `${carCenter}/ccCarBases/list`
