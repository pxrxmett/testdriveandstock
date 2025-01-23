import Vue from 'vue'
import Toasted from 'vue-toasted'

Vue.use(Toasted, {"position":"top-right","duration":3000,"keepOnHover":true,"theme":"bubble"})

const globals = [{"name":"success","message":(message) => message,"options":{"type":"success","theme":"bubble","duration":3000}},{"name":"error","message":(message) => message,"options":{"type":"error","theme":"bubble","duration":5000}}]
if(globals) {
  globals.forEach(global => {
    Vue.toasted.register(global.name, global.message, global.options)
  })
}

export default function (ctx, inject) {
  inject('toast', Vue.toasted)
}
