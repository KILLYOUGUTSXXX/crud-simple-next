import moment, { Moment } from "moment"


export const parseDate = (a: Moment | number | string) => {
  return a ? moment(a).format('DD MMMM YYYY') : null
}

export const parseCurrency = (a: number) => {
  return (a || '0').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}