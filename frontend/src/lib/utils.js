// eslint-disable-next-line no-promise-executor-return
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
