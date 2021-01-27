(function () {
  let form = layui.form;
  let laypage = layui.laypage;
  //请求参数对象
  const query = {
    pagenum: 1, //int	页码值
    pagesize: 5, //int	每页显示多少条数据
    cate_id: "", //	string	文章分类的 Id
    state: "", //	string	文章的状态，可选值有：已发布、草稿
  };
  let count;
  let listNum;
  getList();
  function getList() {
    console.log(query.pagenum);
    //列表渲染
    axios.get("/my/article/list", { params: query }).then(res => {
      // console.log(res.data);
      if (res.data.status !== 0) return layer.msg(res.data.message);
      $("tbody").html(template("listInfo", res.data));
      //分页
      count = res.data.total;
      listNum = res.data.data.length;
      getPage();
    });

    //分类获取和渲染
    axios.get("/my/article/cates").then(res => {
      if (res.data.status !== 0) return layer.msg(res.data.message);
      res.data.data.forEach(value => {
        $("form [name=cate_id]").append(`<option value="${value.Id}">${value.name}</option>`);
      });
      form.render();
    });
  }

  //设置时间格式
  template.defaults.imports.formaTime = function (time) {
    let date = new Date(time);
    let year = date.getFullYear().toString().padStart(4, "0");
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    let hour = date.getHours().toString().padStart(2, "0");
    let min = date.getMinutes().toString().padStart(2, "0");
    let sec = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
  };

  //筛选功能
  $(".list_form form").on("submit", function (e) {
    e.preventDefault();
    query.cate_id = $("form [name=cate_id]").val();
    query.state = $("form [name=state]").val();
    console.log(query);
    getList();
  });

  //分页功能
  function getPage() {
    laypage.render({
      elem: "list_page", //注意，这里的 test1 是 ID，不用加 # 号
      count, //数据总数，从服务端得到
      curr: query.pagenum, //获取起始页
      limit: query.pagesize,
      limits: [
        query.pagesize,
        query.pagesize * 2,
        query.pagesize * 3,
        query.pagesize * 4,
        query.pagesize * 5,
      ],
      groups: 5,
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      jump: function (obj, first) {
        query.pagesize = obj.limit;
        query.pagenum = obj.curr;
        if (!first) {
          getList();
        }
      },
    });
  }

  //删除功能
  $("body").on("click", ".delBtn", function () {
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, index => {
      axios.get("/my/article/delete/" + $(this).attr("data-id")).then(res => {
        if (res.data.status !== 0) return layer.msg(res.data.message);
        //判定是否是当页(除第一页)的最后一条
        if (listNum === 1 && count > 1) {
          query.pagenum--;
        }
        getList();
        layer.close(index);
      });
    });
  });

  //编辑功能
  $("body").on("click", ".editBtn", function () {
    let id = $(this).attr("data-id");
    location.href = `/article/art_edit.html?id=${id}`;
  });
})();
