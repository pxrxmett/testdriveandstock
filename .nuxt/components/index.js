export { default as CarTable } from '../../components/CarTable.vue'
export { default as DashboardHeader } from '../../components/DashboardHeader.vue'
export { default as StatsCards } from '../../components/StatsCards.vue'
export { default as StockEditCarStatus } from '../../components/stock/EditCarStatus.vue'
export { default as UploadFileUpload } from '../../components/upload/FileUpload.vue'
export { default as UploadFileValidation } from '../../components/upload/FileValidation.vue'
export { default as UploadPageHeader } from '../../components/upload/PageHeader.vue'
export { default as UploadProgressSteps } from '../../components/upload/ProgressSteps.vue'
export { default as UploadCard } from '../../components/upload/UploadCard.vue'
export { default as UploadHeader } from '../../components/upload/UploadHeader.vue'
export { default as UploadSection } from '../../components/upload/UploadSection.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
