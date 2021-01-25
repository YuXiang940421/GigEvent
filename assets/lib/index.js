function getUserInfo() {
  axios.get("/my/userinfo").then(res => {
    setAvatarAndName(res.data.data);
  });
}
getUserInfo();
function setAvatarAndName(data) {
  let name = data.nickname || data.username;
  $(".user_name").html(`欢迎&nbsp; ${name}`);
  if (data.user_pic) {
    $(".text_avatar").hide();
    $(".layui-nav-img").attr("scr", data.user_pic).show();
  } else {
    $(".text_avatar").text(name[0].toUpperCase()).show();
    $(".layui-nav-img").hide();
  }
}
$("#exit").on("click", function () {
  layer.confirm("确定退出登录?", { icon: 3, title: "提示" }, function (index) {
    localStorage.removeItem("token");
    getUserInfo();
    layer.close(index);
  });
});
