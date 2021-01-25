(function () {
  //登录注册跳转
  $(".login #login #loginA").on("click", function () {
    $(".login #login").stop().hide().next().stop().show();
  });
  $(".login #regi #loginA").on("click", function () {
    $(".login #regi").stop().hide().prev().stop().show();
  });
  //输入框校验
  let form = layui.form;
  form.verify({
    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    repass: function (value, item) {
      if (value !== $("#regi [name=password]").val()) {
        return "两次输入密码不一样";
      }
    },
  });
  //注册功能
  $("#regi").on("submit", function (e) {
    e.preventDefault();
    axios.post("/api/reguser", $(this).serialize()).then(res => {
      if (res.data.status !== 0) return layer.msg(res.data.message);
      layer.msg("注册成功,请登录", { icon: 1, time: 2000 }, function () {
        $("#regi input").val("");
        $("#regi #loginA").click();
      });
    });
  });
  //登录功能
  $("#login").on("submit", function (e) {
    e.preventDefault();
    axios.post("/api/login", $(this).serialize()).then(res => {
      if (res.data.status !== 0) return layer.msg("用户名或密码错误");
      localStorage.setItem("token", res.data.token);
      layer.msg("登陆成功,即将跳转后台首页", { icon: 1, time: 2000 }, function () {
        location.href = "/home/index.html";
      });
    });
  });
})();
