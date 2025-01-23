export default {
  // Target (คงเดิม)
  target: 'server',

  // Global page headers (คงเดิม)
  head: {
    title: 'testdrive2',
    htmlAttrs: {
      lang: 'th'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Auto import components (คงเดิม)
  components: true,

  // Global CSS (คงเดิม)
  css: [
    '~/assets/css/main.css',
    '~/assets/css/upload.css'
  ],

  // เพิ่ม Modules ที่จำเป็น
  modules: [
    // ระบบจัดการ HTTP requests
    '@nuxtjs/axios',
    
    // ระบบแจ้งเตือน (Toast notifications)
    '@nuxtjs/toast',
    
    // ระบบจัดการ Authentication (ถ้าต้องการ)
    '@nuxtjs/auth-next'
  ],

  // กำหนดค่า Axios
  axios: {
    baseURL: process.env.API_URL || 'http://localhost:3000/api'
  },

  // กำหนดค่า Toast
  toast: {
    position: 'top-right',
    duration: 3000,
    keepOnHover: true,
    theme: 'bubble',
    // กำหนดรูปแบบ toast สำหรับแต่ละประเภท
    register: [
      {
        name: 'success',
        message: message => message,
        options: {
          type: 'success',
          theme: 'bubble',
          duration: 3000
        }
      },
      {
        name: 'error',
        message: message => message,
        options: {
          type: 'error',
          theme: 'bubble',
          duration: 5000
        }
      }
    ]
  },

  // Build Configuration (คงเดิม)
  build: {
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-property-in-object', { loose: true }]
      ]
    }
  },

  // Build modules (คงเดิม)
  buildModules: [
    '@nuxtjs/tailwindcss'
  ],

  // Server Configuration (คงเดิม)
  server: {
    port: 3000,
    host: 'localhost'
  }
}