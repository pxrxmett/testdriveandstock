import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _795f08ac = () => interopDefault(import('../pages/upload/index.vue' /* webpackChunkName: "pages/upload/index" */))
const _212d875c = () => interopDefault(import('../pages/stock/import-success.vue' /* webpackChunkName: "pages/stock/import-success" */))
const _0d18fd0a = () => interopDefault(import('../pages/upload/add.vue' /* webpackChunkName: "pages/upload/add" */))
const _f232e8cc = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))
const _19e4ee90 = () => interopDefault(import('../pages/cars/_id/edit-status.vue' /* webpackChunkName: "pages/cars/_id/edit-status" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/upload",
    component: _795f08ac,
    name: "upload"
  }, {
    path: "/stock/import-success",
    component: _212d875c,
    name: "stock-import-success"
  }, {
    path: "/upload/add",
    component: _0d18fd0a,
    name: "upload-add"
  }, {
    path: "/",
    component: _f232e8cc,
    name: "index"
  }, {
    path: "/cars/:id?/edit-status",
    component: _19e4ee90,
    name: "cars-id-edit-status"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
