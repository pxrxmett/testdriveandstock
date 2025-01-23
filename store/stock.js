export const state = () => ({
  stockData: [],
  lastUpdate: null
})

export const mutations = {
  SET_STOCK_DATA(state, data) {
    state.stockData = data
    state.lastUpdate = new Date().toISOString()
  }
}

export const actions = {
  updateStockData({ commit }, data) {
    commit('SET_STOCK_DATA', data)
  }
}

export const getters = {
  getStockData: state => state.stockData,
  getLastUpdate: state => state.lastUpdate
}