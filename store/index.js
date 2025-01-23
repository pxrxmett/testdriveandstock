export const state = () => ({
  uploadStatus: null,
  uploadProgress: 0,
  uploadError: null
})

export const mutations = {
  SET_UPLOAD_STATUS(state, status) {
    state.uploadStatus = status
  },
  SET_UPLOAD_PROGRESS(state, progress) {
    state.uploadProgress = progress
  },
  SET_UPLOAD_ERROR(state, error) {
    state.uploadError = error
  }
}

export const actions = {
  async uploadFile({ commit }, file) {
    try {
      commit('SET_UPLOAD_STATUS', 'uploading')
      commit('SET_UPLOAD_ERROR', null)

      const result = await uploadService.uploadFile(file)
      
      commit('SET_UPLOAD_STATUS', 'completed')
      return result
    } catch (error) {
      commit('SET_UPLOAD_STATUS', 'error')
      commit('SET_UPLOAD_ERROR', error.message)
      throw error
    }
  }
}