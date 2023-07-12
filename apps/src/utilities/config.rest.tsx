export const baseUrl = 'http://177.89.33.5:5544'

export default ({
  cashEntry: {
    bulk: '/bulk/cash-entry',
    bulkParams: '/bulk/cash-entry/:ids',
    main: '/cash-entry',
    params: '/cash-entry/:ids'
  },
  cashEntryDetail: {
    main: '/cash-entry-detail',
    params: '/cash-entry-detail/:ids',
    all: '/cash-entry-detail?refid=:refids'
  }
})