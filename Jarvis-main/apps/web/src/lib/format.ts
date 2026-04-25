export const formatMoney = (value: number): string =>
  new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(value);

export const formatNumber = (value: number): string => new Intl.NumberFormat("ko-KR").format(value);

export const formatPercent = (value: number): string => `${value.toFixed(1)}%`;
