//用户登录、获取主机信息
var capi = new (require('sdc-clients').CAPI)({
	url:"http://192.168.113.203:8080",
	username:"admin",
	password:"tot@ls3crit",
	logLevel:'warn'
});
capi.authenticate('wangjh', 'wjh_bcc', function (er, account) {
    account?console.log(account.login):console.log(er);
	
	var cloud = new (require('smartdc').CloudAPI)({
			url:'https://192.168.113.204',
			username:'wangjh',
			password:'wjh_bcc',
			logLevel:'warn'
		})
	cloud.listDatasets({ phone_number: '1755',
  forgot_password_code: 'McgACkMhvQEgaQJj',
  uuid: '3d3a42d7-80da-4e73-9de8-94e52b15edb1',
  city: null,
  deleted_at: null,
  updated_at: '2014-10-10T07:40:07+00:00',
  role: 1,
  customer_id: 3,
  postal_code: null,
  login: 'wangjh',
  approved_for_provisioning: true,
  country: null,
  company_name: 'bcc',
  created_at: '2014-06-09T06:22:51+00:00',
  alternate_email_address: null,
  asset_id: null,
  state: null,
  first_name: 'wang',
  activated_at: null,
  street_1: null,
  legacy_id: null,
  last_name: 'Jianhui',
  id: 3,
  activation_code: 'bce32e4e5ef827bc38ac17afd7f82e6c1111f15f',
  street_2: null,
  email_address: '1507632849@qq.com',
  business_first_name: '朢',
  business_last_name: 'jh',
  technical_contact_number: '',
  promotion_code: '',
  timezone: 'local',
  pref_language: 'zh',
  company: 'bcc',
  company_industry: 'it',
  company_size: '1000',
  company_address: 'cn',
  business_job_title: 'dev',
  business_contact_number: '1755',
  technical_job_title: '',
  technical_last_name: '',
  technical_first_name: '' },function(er, Datasets) {
		er?console.log(er):console.log(Datasets)
	})
	
});