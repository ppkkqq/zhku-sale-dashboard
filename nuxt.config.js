const mode = process.env.MODE

if (mode == 'prod') {
  require('dotenv').config()
}

const gateway = process.env.API_SERVER || 'http://portal.deepexi.top'

const config = {
  projectNo: '321af7ccb5314f52b6f6cb9090af664c',
  aliIconFont: '',
  env: {
    mock: {
      '/mock': 'http://levy.ren:3000/mock/95',
      '/car-deepexi-mall-config-api': 'http://levy.ren:3000/mock/129',
      '/car-deepexi-member-center': 'http://levy.ren:3000/mock/111',
      '/car-deepexi-shop-center': 'http://levy.ren:3000/mock/113',
      '/car-deepexi-trade-center': 'http://levy.ren:3000/mock/117',
      '/car-deepexi-product-center': 'http://levy.ren:3000/mock/109',
      '/moby-application-api': 'http://levy.ren:3000/mock/164',
      '/car-deepexi-evaluate-center': 'http://levy.ren:3000/mock/173',
      '/car-deepexi-car-center': 'http://levy.ren:3000/mock/200',
      '/security': 'http://portal.deepexi.top'
    },
    dev: {
      //内网：http://192.168.31.35:8083
      '/mock': 'http://levy.ren:3000/mock/95',
      '/car-deepexi-member-center': gateway,
      '/car-deepexi-mall-config-api': gateway,
      '/car-deepexi-product-center': gateway,
      '/car-deepexi-trade-center': gateway,
      '/car-deepexi-shop-center': gateway,
      '/moby-application-api': gateway,
      '/car-deepexi-evaluate-center': gateway,
      '/car-deepexi-car-center': gateway,
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
    NO_LOGIN: process.env.NO_LOGIN
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
    title: '百得利总部管理端',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {'http-equiv': 'x-ua-compatible', content: 'IE=edge, chrome=1'}
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: context + 'favicon.ico'
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
