(function () {
  let form = layui.form;
  //初始化页面
  function setPage() {
    axios.get("/my/article/cates").then(res => {
      //im
      $("tbody").html(template("artInfo", res.data));
    });
  }
  setPage();
  //添加
  let index;
  $("#add").on("click", function () {
    //im
    index = layer.open({
      type: 1,
      title: "添加文章类别",
      //im
      content: $("#addInfo").html(),
      area: "500px",
    });
  });
  //im
  $("body").on("submit", "#addForm", function (e) {
    e.preventDefault();
    let data = $(this).serialize();
    axios.post("/my/article/addcates", data).then(res => {
      if (res.data.status !== 0) return layer.msg(res.data.message);
      layer.close(index);
      setPage();
    });
  });
  //修改
  let editIndex;
  $("body").on("click", ".editBtn", function () {
    editIndex = layer.open({
      type: 1,
      title: "修改文章类别",
      content: $("#editInfo").html(),
      area: "500px",
    });
    axios.get("/my/article/cates/" + $(this).attr("data-id")).then(res => {
      form.val("editForm", res.data.data);
    });
  });
  $("body").on("submit", "#editForm", function (e) {
    e.preventDefault();
    axios.post("/my/article/updatecate", $(this).serialize()).then(res => {
      if (res.data.status !== 0) return layer.msg(res.data.message);
      layer.close(editIndex);
      setPage();
    });
  });
  //删除
  $("body").on("click", ".delBtn", function () {
    layer.confirm("确定删除?", { icon: 3, title: "提示" }, index => {
      axios.get("/my/article/deletecate/" + $(this).attr("data-id")).then(res => {
        if (res.data.status !== 0) return layer.msg(res.data.message);
        setPage();
      });
      layer.close(index);
    });
  });
})();
