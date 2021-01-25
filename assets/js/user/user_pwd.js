(function () {
  //表单验证
  let form = layui.form;
  form.verify({
    pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    newpwd: function (value, item) {
      if (value === $("[name=oldPwd]").val()) {
        return "新密码不能原密码一致";
      }
    },
    renewpwd: function (value, item) {
      if (value !== $("[name=newPwd]").val()) {
        return "两次输入密码不一致";
      }
    },
  });
  //提交请求
  $("form").on("submit", function (e) {
    e.preventDefault();
    axios.post("/my/updatepwd", $(this).serialize()).then(res => {
      if (res.data.status !== 0) {
        return layer.msg(res.data.message);
      }
      layer.msg("修改密码成功");
      this.reset();
    });
  });
})();
