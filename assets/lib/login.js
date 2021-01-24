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
