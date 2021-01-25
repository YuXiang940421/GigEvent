(function () {
  let form = layui.form;
  function getUserInfo() {
    axios.get("/my/userinfo").then(res => {
      //给表单赋值
      form.val("form", res.data.data);
    });
  }
  getUserInfo();
  $("form").on("submit", function (e) {
    e.preventDefault();
    axios.post("/my/userinfo", $(this).serialize()).then(res => {
      console.log(res);
      //window.parent ===> 获取到父页面的window对象
      if (res.data.status !== 0) {
        layer.msg("修改失败");
      }
      layer.msg("修改成功");
      parent.getUserInfo();
    });
  });
  form.verify({
    nickname: [/^[\S]{1,6}$/, "昵称长度要在1-6个字符"],
  });
  //重置按钮
  $("#reset").on("click", function (e) {
    e.preventDefault();
    getUserInfo();
  });
})();
