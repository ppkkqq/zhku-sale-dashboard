const prefix = '/mock'

// const MALL_CONFIG = '/car-deepexi-mall-config-api/api/v1'
// const PRODUCT_CENTER = '/car-deepexi-product-center/api/v1'
// const MEMBER_CENTER = '/car-deepexi-member-center/api/v1'
const shopCenter = '/mall-deepexi-shop-center/api/v1'
// const TRADE_CENTER = '/car-deepexi-trade-center/api/v1'
// const APPLICATION = '/moby-application-api/api/v1' //应用中心
// const EVALUATE_CENTER = '/car-deepexi-evaluate-center/api/v1' //评价中心
const fakeProductCenter = prefix + '/deepexi-product-center/api/v1'

export const PRODUCT_CENTER = '/mall-deepexi-product-center/api/v1'
export const MEMBER_CENTER = '/mall-deepexi-member-center/api/v1'
export const TRADE_CENTER = '/mall-deepexi-trade-center/api/v1'
export const MALL_CONFIG = '/mall-deepexi-mall-config-api/api/v1'
export const APPLICATION = '/mall-application-api/api/v1'
export const EVALUATE_CENTER = '/mall-deepexi-evaluate-center/api/v1'
export const ACCOUNT_CENTER = '/mall-deepexi-account-center/api/v1'
export const MARKETING_CENTER = '/mall-deepexi-marking-center/api/v1'

// 品牌管理
// 根据id 修改品牌信息
export const productBrandEdit = id => PRODUCT_CENTER + `/pcBrands/${id}`
// 获取所有品牌列表
// export const productBrandList = deepexiProductCenter + '/pcBrands/list'
export const pcBrands = PRODUCT_CENTER + `/pcBrands`

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

// 会员信息
export const mcMemberInfos = MEMBER_CENTER + '/mcMemberAccounts'
//下载导入模板
export const memberImportTem = MEMBER_CENTER + '/mcMemberAccounts/template'
//导出会员
export const menberAccountsExport =
  MEMBER_CENTER + '/mcMemberAccounts/menberAccountsExport'
// 属性管理
// crud
export const attributes = PRODUCT_CENTER + '/attributes'

// 属性组管理
// crud
export const attributeGroups = PRODUCT_CENTER + '/attributeGroups'

// 商品模板管理
// 列表
export const templateList = PRODUCT_CENTER + '/templates' // 原接口
// export const shopTemplateList = PRODUCT_CENTER + '/shop/templates' // 门店模板
export const adminTemplateList = PRODUCT_CENTER + '/admin/templates'
// 启用禁用
export const templateStatus = id =>
  PRODUCT_CENTER + `/shop/templates/${id}/status`
// 授权
export const grantShop = id =>
  PRODUCT_CENTER + `/shop/templates/${id}/grantShop`
export const grantList = id =>
  PRODUCT_CENTER + `/shop/templates/${id}/grant/list`

// 套餐模板管理
// 列表
export const pcBundleTempaltes = PRODUCT_CENTER + '/pcBundleTempaltes' // 原接口
// export const shopPcBundleTempaltes = PRODUCT_CENTER + '/pcBundleTempaltes' // 门店模板
export const adminPcBundleTempaltes =
  PRODUCT_CENTER + '/admin/pcBundleTempaltes'
// 授权
export const bundleGrantShop = id =>
  PRODUCT_CENTER + `/admin/pcBundleTempaltes/${id}/grantShop` // 单个
export const bundleGrantList = id =>
  PRODUCT_CENTER + `/admin/pcBundleTempaltes/${id}/grant/list` // 单个 店铺列表

// 启用禁用
export const bundleStatus = id =>
  PRODUCT_CENTER + `/admin/pcBundleTempaltes/${id}/status`

// 反馈 crud
export const feedback = MALL_CONFIG + '/feedbacks'

//车型基础数据管理
export const carBrandsSeries = PRODUCT_CENTER + '/pcCarBrandSeries'
export const carModels = PRODUCT_CENTER + '/pcCarModels'
//商品管理
export const shopItems = `${PRODUCT_CENTER}/shop/items`
export const productDetail = id => `${PRODUCT_CENTER}/shop/items/${id}`

//套餐管理
//TODO:  后端接口还没有给我。。。。
export const pcBundles = PRODUCT_CENTER + '/admin/pcBundles'
export const comboLists = PRODUCT_CENTER + '/pcBundleTempaltes'
export const bundlesAudit = id =>
  PRODUCT_CENTER + `/admin/pcBundles/${id}/status`

//客户
//客户列表
export const getShopUserInfo = `${MEMBER_CENTER}/mcMemberAccounts/getShopUserInfo`

//客户详情

//subscribes/list
//我的预约
export const customerSubscribes = `${TRADE_CENTER}/subscribes/list`
//我的关注
export const customerFocus = `${APPLICATION}/goodsAttentions/headquarters/personalCollectsDetails`
//我的评价
export const customerEvaluate = `${EVALUATE_CENTER}/ecEvaluations/tree`
//我的证件
export const customerCertificatess = `${MEMBER_CENTER}/mcCertificatess/list`
// 售后
export const refundList = TRADE_CENTER + '/refund/supplier/platlist'
export const refundAudit = TRADE_CENTER + '/refund/supplier/audit'
export const refundDetail = TRADE_CENTER + '/refund/supplier/detail'

// 新增筛选条件
export const filterConditions = PRODUCT_CENTER + '/item/conditions'
// 根据前台类目id获取筛选条件
export const selectedFilterCondition =
  PRODUCT_CENTER + '/item/conditions/findByCategory'
// 获取类目下所有筛选条件
export const AllfilterCondition =
  PRODUCT_CENTER + '/item/conditions/findAllAttribute'

//--------------------此线上面接口会被删除，所需接口放到此线下面--------------------
// 首页广告页面
export const bannerList = MALL_CONFIG + '/advertisements'
export const bannerEdit = id => MALL_CONFIG + `/advertisements/${id}`

//首页推荐位
export const recommendList = MALL_CONFIG + '/featuredFirsts'
//订单列表
//(平台查询订单列表)
export const orderList = TRADE_CENTER + '/order/shopOrderList'
export const orderDetail = TRADE_CENTER + '/order/shopOrderDetail'

//商品来源
export const orderPlat = TRADE_CENTER + '/order/magement/orderPlat'

//查询物流
export const logistics = TRADE_CENTER + '/logistics'
export const findLogisticsInfo = TRADE_CENTER + '/logistics/findLogisticsInfo'

//导出订单列表
export const exportExcel = TRADE_CENTER + '/order/exportExcel'

//商品
// export const goodsLists = PRODUCT_CENTER + '/manager/pcItems'
export const goodsLists = PRODUCT_CENTER + '/manager/pcItems/plat'
export const goodsListsFromSkuId = PRODUCT_CENTER + '/pcItemSkus/get/item'

// 商品审核
export const goodsAudit = id => PRODUCT_CENTER + `/admin/items/${id}/status`
export const getNeedCheckPcItem =
  PRODUCT_CENTER + '/manager/pcItems/getNeedCheckPcItem'
export const getNeedCheckPcById =
  PRODUCT_CENTER + '/manager/pcItems/getNeedCheckPcById'

// 源通币
export const currency = ACCOUNT_CENTER + '/admin/currency'
export const records = ACCOUNT_CENTER + '/admin/currency/records'

// 会员
export const address =
  MEMBER_CENTER + `/mcDeliveryAddress/getUserDeliveryAddressInfo`
export const collect = MEMBER_CENTER + `/mcItemCollects/getUserCollectInfo`
export const browserHistory =
  MEMBER_CENTER + `/mcMemberBrowse/getUserBrowseInfo`
export const memberBaseInfo =
  MEMBER_CENTER + `/mcMemberAccounts/getUserBasicInfo`

//前台类目树
export const frontendCatalogTree = PRODUCT_CENTER + '/pcPrecategorys/tree'
export const frontendCatalogDetail = id =>
  PRODUCT_CENTER + `/pcPrecategorys/${id}`
export const frontendCatalogBaseUrl = PRODUCT_CENTER + `/pcPrecategorys`
export const bindBackendUrl = PRODUCT_CENTER + `/pcPrecategoryCatalogs`

//后台类目树
export const prdCatalogs = PRODUCT_CENTER + '/prdCatalogs/tree'
export const backendCatalogTree = PRODUCT_CENTER + '/prdCatalogs/tree'
export const backendCatalogDetail = id => PRODUCT_CENTER + `/prdCatalogs/${id}`
export const backendCatalogBaseUrl = PRODUCT_CENTER + `/prdCatalogs`
export const catalogAttr = PRODUCT_CENTER + `/catalogAttr`

// 门店列表
export const shopList = shopCenter + '/shops'

// 营销
// 促销活动
export const activityList = MARKETING_CENTER + '/activity/list'
export const activityStatus = MARKETING_CENTER + '/activity/status'

//限时抢购
//新增限时抢购规则信息

export const buyingRuleAddRule = MARKETING_CENTER + '/buying/rule/add'
export const buyingRuleDetail = MARKETING_CENTER + '/buying/rule/detail'
export const flashSalesList = MARKETING_CENTER + '/buying/rule/list'
export const flashSalesStatus = MARKETING_CENTER + '/buying/rule/status'
export const flashSalesActivityStatus =
  MARKETING_CENTER + '/buying/rule/activity/status'
//预售规则
export const ruleList = MARKETING_CENTER + '/presell/rule/list'
export const addRule = MARKETING_CENTER + '/presell/rule/add'
export const goodQuery = MARKETING_CENTER + '/presell/rule/goods/query'
export const updateRule = MARKETING_CENTER + '/presell/rule/update'
export const ruleDetail = MARKETING_CENTER + '/presell/rule/detail'

//积分详细
export const queryIntegralList = id =>
  ACCOUNT_CENTER + `/point/member/${id}/list`
