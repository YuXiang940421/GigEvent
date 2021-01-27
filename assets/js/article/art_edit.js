(function () {
  //通过 URLSearchParams 对象，获取 URL 传递过来的参数
  let params = new URLSearchParams(location.search);
  let artId = params.get("id");
  let form = layui.form;

  // 初始化图片裁剪器
  let $image = $("#image");

  //初始化分类列表
  setCate();

  function setCate() {
    //初始化富文本
    initEditor();

    //获取并渲染文章分类
    axios.get("/my/article/cates").then(res => {
      if (res.data.status !== 0) return layer.msg(res.data.message);
      res.data.data.forEach(value => {
        $("form [name=cate_id]").append(`<option value="${value.Id}">${value.name}</option>`);
      });
      form.render();
      getArt();
    });
  }
  //获取文章
  function getArt() {
    axios.get("/my/article/" + artId).then(res => {
      console.log(res.data.data.content);
      form.val("addArticle", {
        title: res.data.data.title,
        cate_id: res.data.data.cate_id,
      });
      tinyMCE.activeEditor.setContent(res.data.data.content);
      //初始化图片区域
      setCropper(res.data.data.cover_img);
    });
  }

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
        fd.append("Id", artId);

        editArt(fd);
      });
  });

  //初始化图片区域
  let cropperOption;
  function setCropper(coverImg) {
    $image.attr("src", "http://api-breakingnews-web.itheima.net" + coverImg);

    // 裁剪选项
    cropperOption = {
      aspectRatio: 400 / 280,
      preview: ".img-preview",
    };

    // 初始化裁剪区域
    $image.cropper(cropperOption);
  }

  //发送请求
  function editArt(data) {
    axios.post("/my/article/edit", data).then(res => {
      if (res.data.status !== 0) return layer.msg(res.data.message);
      layer.msg("修改成功");
      location.href = "/article/art_list.html";
    });
  }
})();
