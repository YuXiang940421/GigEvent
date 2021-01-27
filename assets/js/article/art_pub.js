(function () {
  let form = layui.form;
  //初始化富文本
  initEditor();

  // 初始化图片裁剪器
  let $image = $("#image");

  // 裁剪选项
  let cropperOption = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 初始化裁剪区域
  $image.cropper(cropperOption);

  //获取并渲染文章分类
  axios.get("/my/article/cates").then(res => {
    if (res.data.status !== 0) return layer.msg(res.data.message);
    res.data.data.forEach(value => {
      $("form [name=cate_id]").append(`<option value="${value.Id}">${value.name}</option>`);
    });
    form.render();
  });

  //选择图片设置到裁剪区域
  //模拟点击
  $("#btnChooseCoverImage").on("click", function (e) {
    e.preventDefault();
    $("form [type=file]").click();
  });

  //上传文件监听
  $("form [type=file]").on("change", function () {
    if (!this.files[0]) return;
    let newImgURL = URL.createObjectURL(this.files[0]);
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(cropperOption); // 重新初始化裁剪区域
  });

  //阻止表单默认行为
  $("form").on("submit", function (e) {
    e.preventDefault();
  });

  //发布/存为草稿
  $("#pubBtn").on("click", "button", function () {
    let fd = new FormData($("form")[0]);
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      // 将 Canvas 画布上的内容，转化为 blob 格式的字符串
      .toBlob(blob => {
        //追加属性
        fd.append("cover_img", blob);
        fd.append("state", $(this).attr("data-state"));
        fd.append("content", $("textarea").val());

        addArt(fd);
      });
  });

  //发送请求
  function addArt(data) {
    axios.post("/my/article/add", data).then(res => {
      if (res.data.status !== 0) return layer.msg(res.data.message);
      layer.msg("发布成功");
      location.href = "/article/art_list.html";
    });
  }
})();
