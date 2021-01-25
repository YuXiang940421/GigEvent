axios.defaults.baseURL = "http://api-breakingnews-web.itheima.net";
axios.interceptors.request.use(function (config) {
  console.log(config);
  if (config.url.startsWith("/my")) {
    config.headers.Authorization = localStorage.getItem("token");
  }
  return config;
});
axios.interceptors.response.use(function (response) {
  if (response.config.url.startsWith("/my")) {
    if (response.data.status !== 0) {
      layer.msg("获取用户信息失败");
      localStorage.removeItem("token");
      location.href = "/home/login.html";
    }
  }
  return response;
});
