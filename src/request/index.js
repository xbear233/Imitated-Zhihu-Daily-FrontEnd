import axios from 'axios';

// 创建一个 axios 实例
const service = axios.create({
	// baseURL: 'https://news-at.zhihu.com/api/4', // 所有的请求地址前缀部分
	timeout: 6000, // 请求超时时间毫秒
})

// 添加一个请求拦截器
//自动在header加上jwt token
// service.interceptors.request.use(function (config) {
//     // Do something before request is sent
// 	if (window.sessionStorage.getItem("token")) {
// 		config.headers.Authorization  = window.sessionStorage.getItem("token")
// 		// console.log("***config***",config)
// 	}
//     return config;
//   }, function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   });


//处理后端返回的未授权认证错误
service.interceptors.response.use(function (response) {
    // Do something with response data
    //只返回response的data部分
    return response.data;
  }, function (error) {
    // Do something with response error
	// console.log("***"+error)
	if(error.response.status=='401'){
		window.location="/"
	}
    return Promise.reject(error);
});


export default service