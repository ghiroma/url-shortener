export default () => ({
  region: process.env.REGION || 'ap-northeast-1',
  apiVersion: process.env.API_VERSION || '2012-08-10',
  port: process.env.PORT || 3000
});
