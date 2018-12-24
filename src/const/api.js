const prefix = '/mock'

const shopCenter = '/mall-deepexi-shop-center/api/v1'
const fakeProductCenter = prefix + '/deepexi-product-center/api/v1'
export const PRODUCT_CENTER = '/mall-deepexi-product-center/api/v1'
export const MEMBER_CENTER = '/mall-deepexi-member-center/api/v1'
export const TRADE_CENTER = '/mall-deepexi-trade-center/api/v1'
export const MALL_CONFIG = '/mall-deepexi-mall-config-api/api/v1'
export const APPLICATION = '/mall-application-api/api/v1'
export const EVALUATE_CENTER = '/mall-deepexi-evaluate-center/api/v1'
export const ACCOUNT_CENTER = '/mall-deepexi-account-center/api/v1'
export const MARKETING_CENTER = '/mall-deepexi-marking-center/api/v1'

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
export const adminTemplateList = PRODUCT_CENTER + '/admin/templates'

// 反馈 crud
export const feedback = MALL_CONFIG + '/feedbacks'

//商品管理
export const shopItems = `${PRODUCT_CENTER}/shop/items`

//客户详情
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

//积分规则配置
export const pointConfigRule = ACCOUNT_CENTER + '/pointConfig/rule'
//批量充值模板下载
export const template = ACCOUNT_CENTER + '/shoppingCard/template'
//批量充值
export const batchInpour = ACCOUNT_CENTER + '/shoppingCard/batchInpour'

//获取前台类目集合
export const catalog = PRODUCT_CENTER + '/pcPrecategorys/tree'

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
export const queryIntegralList = id => ACCOUNT_CENTER + `/point/${id}/list`
// 楼层 获取单个一级前台类目 的前台类目详情
export const frontCatalogSingle = MALL_CONFIG + `/floor/pcCategory`

//会员等级
export const mcMemberLevel = MEMBER_CENTER + `/mcMemberLevel`
export const levelBenefit = MEMBER_CENTER + `/mcMemberLevel/levelBenefit`
export const experienceStrategy =
  MEMBER_CENTER + `/mcMemberLevel/experienceStrategy`
//搜索下拉获得会员等级
export const levelItem = MEMBER_CENTER + '/mcMemberLevel/levelItem'
//会员标签按钮
export const updateMemberType =
  MEMBER_CENTER + '/mcMemberAccounts/updateMemberType'
//用户画像
export const getUserIconInfo =
  MEMBER_CENTER + '/mcMemberAccounts/getUserIconInfo'

//积分配置
export const pointConfig = ACCOUNT_CENTER + '/pointConfig'

//积分配置列表
export const pointConfigList = pointConfig + '/scene'
//最近三个月积分统计查询
export const queryIntegralCount = id => ACCOUNT_CENTER + `/point/${id}/count`
export const queryCurrencyDetail = ACCOUNT_CENTER + '/admin/shoppingCard/detail'
export const queryCurrencyList = ACCOUNT_CENTER + '/admin/shoppingCard/query'
