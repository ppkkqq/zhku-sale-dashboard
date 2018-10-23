const mode = process.env.MODE

// if (mode == 'prod') {
require('dotenv').config()
// }

const gateway = process.env.GATEWAY || 'http://malldev.gtytong.com'

const config = {
  projectNo: '1339d494e3b0474d90c232c882f173e7',
  aliIconFont: '',
  env: {
    mock: {
      '/mock': 'http://levy.ren:3000/mock/95',
      '/mall-deepexi-member-center': 'http://levy.ren:3000/mock/308',
      '/mall-deepexi-shop-center': 'http://levy.ren:3000/mock/326',
      '/mall-deepexi-trade-center': 'http://levy.ren:3000/mock/344',
      '/mall-deepexi-product-center': 'http://levy.ren:3000/mock/281',
      '/mall-deepexi-mall-config-api': 'http://levy.ren:3000/mock/290',
      '/mall-deepexi-evaluate-center': 'http://levy.ren:3000/mock/299',
      '/mall-deepexi-stock-center': 'http://levy.ren:3000/mock/335',
      '/mall-deepexi-settle-center': 'http://levy.ren:3000/mock/317',
      '/mall-deepexi-account-center': 'http://levy.ren:3000/mock/371',
      '/security': gateway
    },
    dev: {
      //内网：http://192.168.31.35:8083
      '/mall-deepexi-member-center': gateway,
      '/mall-deepexi-shop-center': gateway,
      '/mall-deepexi-trade-center': gateway,
      '/mall-deepexi-product-center': gateway,
      '/mall-deepexi-mall-config-api': gateway,
      '/mall-deepexi-evaluate-center': gateway,
      '/mall-deepexi-stock-center': gateway,
      '/mall-deepexi-settle-center': gateway,
      '/mall-deepexi-account-center': gateway,
      '/security': gateway
    },
    test: {
      //内网：http://192.168.31.35:8083
      '/mall-deepexi-member-center': gateway,
      '/mall-deepexi-shop-center': gateway,
      '/mall-deepexi-trade-center': gateway,
      '/mall-deepexi-product-center': gateway,
      '/mall-deepexi-mall-config-api': gateway,
      '/mall-deepexi-evaluate-center': gateway,
      '/mall-deepexi-stock-center': gateway,
      '/mall-deepexi-settle-center': gateway,
      '/mall-deepexi-account-center': gateway,
      '/security': gateway
    }
  }
}

let axios = {
  proxy: true
}

let context =
  process.env.CONTEXT && process.env.CONTEXT.length > 1
    ? `/${process.env.CONTEXT}/`
    : '/'

if (mode == 'prod') {
  axios = {
    proxy: false,
    baseURL: process.env.API_SERVER
  }
}

module.exports = {
  mode: 'spa',
  env: {
    PROJECT_NO: process.env.PROJECT_NO || config.projectNo,
    NO_LOGIN: process.env.NO_LOGIN,
    OSS_KEY: process.env.OSS_KEY,
    OSS_SECRET: process.env.OSS_SECRET,
    OSS_BUCKET: process.env.OSS_BUCKET,
    OSS_REGION: process.env.OSS_REGION,
    OSS_DIR: process.env.OSS_DIR,
    OSS_CUSTOM_DOMAIN: process.env.OSS_CUSTOM_DOMAIN
  },
  proxy: {...config.env[mode]},
  router: {
    middleware: ['meta'],
    mode: 'hash'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: '云鼎商城平台管理端',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {'http-equiv': 'x-ua-compatible', content: 'IE=edge, chrome=1'}
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href:
          '//gtytoss.oss-cn-hangzhou.aliyuncs.com/platform/favicon-1540276038073.png'
      }
    ]
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#1890ff'
  },
  css: [
    {
      src: '~assets/global.styl',
      lang: 'stylus'
    }
  ],
  srcDir: 'src/',
  /*
   ** Build configuration
   */
  build: {
    publicPath: gateway + context,
    extractCSS: true,
    babel: {
      plugins: [
        [
          'component',
          {
            libraryName: 'element-ui',
            styleLibraryName: 'theme-chalk'
          }
        ]
      ]
    },
    /*
     ** Run ESLint on save
     */
    extend(config, {isDev}) {
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  plugins: [
    {
      src: '~/plugins/axios'
    },
    {
      src: '~/plugins/element'
    }
  ],
  modules: ['@nuxtjs/axios'],
  axios
}
