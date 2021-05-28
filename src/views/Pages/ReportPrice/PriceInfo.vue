<style>
  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
    font-size: 18px;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters" class="form">
        <el-form-item prop="goodname">
          <el-input auto-complete="off" placeholder="商品名称" v-model="filters.goodname"></el-input>
        </el-form-item>

        <el-form-item prop="goodsclass">
          <el-input auto-complete="off" placeholder="请选择商品分类" v-model="filters.goodsclass"></el-input>
        </el-form-item>

        <el-form-item prop="factory">
          <el-input auto-complete="off" placeholder="请选择厂家" v-model="filters.factory"></el-input>
        </el-form-item>

        <el-form-item>
          <kt-button
            icon="el-icon-refresh"
            :label="$t('action.reset')"
            type="primary"
            @click="resetForm('filters')"
          />
        </el-form-item>

        <el-form-item>
          <kt-button
            icon="fa fa-search"
            label="查询"
            type="primary"
            @click="clickqurey"
          />
        </el-form-item>
        <br/>
        <el-upload
          :action="imgUpload"
          :on-success="handleExcelSuccess"
          :show-file-list="false"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :max-size="2048"
          :before-upload="beforeAvatarUpload"
        >
          <kt-button icon="el-icon-s-check" label="导入厂家报价" type="primary"/>
        </el-upload>

        <el-form-item :inline="true" prop="Title">
          <el-input oninput ="value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')" auto-complete="off" placeholder="出厂价供货价比率" v-model="filters.FactorypriceRate"></el-input>
        </el-form-item>
        <el-form-item  class="ControlCSSWidth"  prop="Title">
          <el-input  oninput ="value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')" auto-complete="off" placeholder="控价低" v-model="filters.lowactivePriceRate"></el-input>
        </el-form-item>

        <el-form-item class="ControlCSSWidth" prop="Title">
          <el-input  oninput ="value=value.replace(/[^\-\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')" auto-complete="off" placeholder="控价高" v-model="filters.highactivePriceRate"></el-input>
        </el-form-item>

        <!--  <kt-button icon="el-icon-s-check" label="导入厂家报价" type="primary" @click="uploadPrice"/>
          <el-button icon="el-icon-s-check" type="primary" label="导入厂家报价" id="uploadButtonexcel"></el-button>

          <el-form-item>
            <input type="file" style="max-width: 150px;" @change="inputFileChange" ref="inputer" multiple accept="xlsx">
            <kt-button icon="el-icon-s-check" label="导入厂家报价" type="primary" @click="uploadPrice"/>
          </el-form-item> -->
        <!-- <el-form-item>
          <kt-button
            icon="el-icon-refresh"
            label="审核"
            type="primary"
            @click="review"
            perms="pages:activity:checked"
          />
        </el-form-item>
       <el-form-item>-->
        <!--<kt-button label="新增" type="primary" @click="handleAdd" />-->
        <!--</el-form-item>-->
      </el-form>
    </div>
    <div class="toolbar" style="float:right;padding-top:10px;padding-right:15px;">
      <el-form :inline="true" :size="size">
        <el-form-item>
          <el-button-group>
            <el-tooltip content="刷新" placement="top">
              <el-button
                icon="fa fa-refresh"
                @click="$refs.CyTable.findPageBeforeRestPages(filters)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="列显示" placement="top">
              <el-button icon="fa fa-filter" @click="displayFilterColumnsDialog"></el-button>
            </el-tooltip>

            <el-tooltip content="导出" placement="top">
              <el-button icon="fa fa-file-excel-o" @click="downloadExcel" id="downloadExcel"></el-button>
            </el-tooltip>
          </el-button-group>
        </el-form-item>
      </el-form>
      <!--表格显示列界面-->
      <table-column-filter-dialog
        ref="tableColumnFilterDialog"
        @handleFilterColumns="handleFilterColumns"
        :columns="columns"
      ></table-column-filter-dialog>
    </div>

    <!--表格内容栏-->
    <cy-table
      :max-height="500"
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      @selectionChange="selectionChange"
      @handleDelete="handleDelete"
      @handleEdit="handleDetail"
      ref="CyTable"
    ></cy-table>


    <el-dialog :visible.sync="dialogVisibleImageList" title="图片" @closed="beforeClose">
      <div style="max-height:500px;overflow: auto;">
        <div v-for="(file,index) in filelist" :key="index" :tabindex="index" style="width:100%">
          <img style="max-height:500px;" :src="file" alt/>
        </div>
      </div>
    </el-dialog>

    <el-upload
      :action="imgUpload"
      :on-success="handleSuccess"
      :show-file-list="false"
      accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
      :max-size="2048"
    >
      <el-button v-show="false" size="small" type="primary" id="uploadButton"></el-button>
    </el-upload>

    <el-dialog :visible.sync="dialogVisibleReviw" title="审核" width="30%">
      <el-form
        :model="dataStatusForm"
        label-width="120px"
        ref="dataStatusForm"
        label-position="right"
        inline
      >
        <el-row>
          <el-form-item label="请选择" prop="status">
            <el-select v-model="dataStatusForm.status" style="width: 300px;">
              <el-option
                v-for="item in Roptions"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click.native="submitStatus">提交</el-button>
        <el-button @click="dialogVisibleReviw = false">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import PopupTreeInput from "@/components/PopupTreeInput";
  import KtTable from "@/views/Core/KtTable";
  import TreeSelect from "@riophae/vue-treeselect";
  import KtButton from "@/views/Core/KtButton";
  import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
  import {format, formatDate} from "@/utils/datetime";
  import CyTable from "@/views/Core/CyTable";
  import ImgUpload from "@/views/Core/ImgUpload";
  import {exportExcel} from "@/utils/excel";
  import {Loading} from "element-ui";

  export default {
    components: {
      PopupTreeInput,
      KtTable,
      CyTable,
      KtButton,
      TableColumnFilterDialog,
      ImgUpload,
      TreeSelect
    },
    data() {
      return {
        uploadfiles: '',
        dataStatusForm: {},
        dialogVisibleReviw: false,
        statusOptions: [
          {key: "0", value: "审核中"},
          {key: "1", value: "审核通过"},
          {key: "2", value: "审核失败"}
        ],
        Roptions: [
          {key: 1, value: "审核通过"},
          {key: 2, value: "审核不通过"}
        ],
        //  imgsList: [],
        picList: [],
        imageSizeLimit: 10, //图片上传个数控制
        imageAccept: ".jpg,.jpeg,.png,.JPG,.JPEG", //图片上传格式
        imgUpload: this.utils.getUpLoadHost(),
        typeOptions: [], //所属分类
        shopOptions: [], //店铺集合
        disabled: false,
        dialogVisibleImg: false,
        size: "small",
        loading: false,
        filters: {
          FactorypriceRate: '',
          lowactivePriceRate: '',
          highactivePriceRate: '',
          status: "",
          goodname: "",
          goodsclass: "",
          factory:"",
          t: "goods_imports",
          create_time: "desc"
        },
        dataForm: {
          id: "",
          Title: "",
          quizMemo: "",
          InvestMemo: "",
          Type_TestOrLearing: "",
          testclass: "",
          Picture: "",
          ReportNeedMoney: "",
          TestNeedMoney: "",
          quizStatus: "",
          PagePos: ""

        },
        dataFormRules: {

          goodname: [{required: true, message: "请输入产品名称", trigger: "blur"}]
        },
        columns: [],
        filterColumns: [],
        pageRequest: {pageNum: 1, pageSize: 10},
        pageResult: {},
        checked: [],
        operation: false, // true:新增, false:编辑
        dialogVisible: false, // 新增编辑界面是否显示
        editLoading: false,
        checkpage: false,
        deptData: [],
        dialogVisibleImageList: false,
        filelist: [],
        popupQuestionTypeData: [],
        popuptestclassData: [],
        popupQuizData: [],
        popupPagePosData: [],
        popupTreeProps: {
          label: "name",
          children: "children"
        },
        editorOption: {
          modules: {
            toolbar: {
              container: [
                ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
                ["blockquote", "code-block"], //引用，代码块
                [{header: 1}, {header: 2}], // 标题，键值对的形式；1、2表示字体大小
                [{list: "ordered"}, {list: "bullet"}], //列表
                [{script: "sub"}, {script: "super"}], // 上下标
                [{indent: "-1"}, {indent: "+1"}], // 缩进
                [{direction: "rtl"}], // 文本方向
                [{size: ["small", false, "large", "huge"]}], // 字体大小
                [{header: [1, 2, 3, 4, 5, 6, false]}], //几级标题
                [{color: []}, {background: []}], // 字体颜色，字体背景颜色
                [{font: []}], //字体
                [{align: []}], //对齐方式b
                ["clean"], //清除字体样式
                ["image"] //上传图片、上传视频
              ], // 工具栏
              handlers: {
                image: function (value) {
                  if (value) {
                    // 调用iview图片上传
                    $("#uploadButton").click();
                  } else {
                    this.quill.format("image", false);
                  }
                }
              }
            }
          },
          theme: "snow"
        },
        login_shop_id: ""
      };
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill;
      }
    },
    methods: {

      handleExcelSuccess(res) {
        let loading = Loading.service({});
        loading.close();


        let this_ = this;
        // 获取富文本组件实例
        debugger;
        this_.editLoading = true;
        let params = Object.assign({}, res.data);
        //params.t = "goods_imports";

        // params.imgs = this.imgsList.map(item => item.url).toString();
        //params.Picture = this.picList.map(item => item.url).toString();

        //params.status = "0";

        this_.editLoading = true;

        this_.utils.request.cmn(params, ' pricereport-service/priceExcel/saveExcel', this_.editInfoBack);
        //this_.utils.request.editInfo(params, this_.editInfoBack);
        /*

        let quill = this.$refs.myQuillEditor.quill;
        // 如果上传成功
        if (res.data.imgUrl) {
          debugger;
          // 获取光标所在位置
          let length = quill.getSelection().index;
          // 插入图片，res为服务器返回的图片链接地址

          quill.insertEmbed(length, "image", '/' + res.data.imgUrl);
          // 调整光标到最后
          quill.setSelection(length + 1);
        } else {
          // 提示信息，需引入Message
          Message.error("图片插入失败");
        }*/
      },
      handleSuccess(res) {
        // 获取富文本组件实例
        //debugger;
        let quill = this.$refs.myQuillEditor.quill;
        // 如果上传成功
        if (res.data.imgUrl) {
          debugger;
          // 获取光标所在位置
          let length = quill.getSelection().index;
          // 插入图片，res为服务器返回的图片链接地址

          quill.insertEmbed(length, "image", '/' + res.data.imgUrl);
          // 调整光标到最后
          quill.setSelection(length + 1);
        } else {
          // 提示信息，需引入Message
          Message.error("图片插入失败");
        }
      }
      ,
      onEditorReady(editor) {
        // 准备编辑器
      }
      ,
      onEditorBlur() {
      }
      , // 失去焦点事件
      onEditorFocus() {
      }
      , // 获得焦点事件
      onEditorChange(e) {
      }
      , // 内容改变事件
      saveHtml: function (event) {
      }
      ,
      handlePictureCardPreview(data) {
        // debugger;
        var url = data.url;
        this.filelist = [];
        this.filelist.push(url);
        this.dialogVisibleImageList = true;
      },

      beforeAvatarUpload(file) {
        //debugger;
        let loading = Loading.service({
          fullscreen: true,
          text: '拼命加载中...',
// target:'#main'
        });
         },


      handleImgUploadRemove(data) {
        debugger;
        var index = data.index;
        this.picList.splice(index, 1);
      }
      ,
      handleImgUploadChange(data) {
         debugger;
        this.picList = data.filelist;
        if (this.picList > this.imageSizeLimit) {////限制数量
          this.picList = [this.picList[this.picList.length - 1]];
        }
      }
      ,

      /*   handleImgImgUploadRemove(data) {
             //debugger;
             var index = data.index;
             this.imgsList.splice(index, 1);
         },
         handleImgImgUploadChange(data) {
            // debugger;
             this.imgsList = data.filelist;
         },
*/
      //取消按钮
      cleanDataForm() {
        let this_ = this;
        this.dialogVisible = false;
        if (this.$refs["dataForm"]) {
          this.$refs["dataForm"].resetFields();
        }
        console.log(this.dataForm);

        this.picList = [];
        // this.imgsList = [];
      }
      ,
      addQuiz: function (params) {
        let this_ = this;
        this.dialogVisible = true;
        this.operation = false;
        if (this.$refs["dataForm"]) {
          this.$refs["dataForm"].resetFields();
        }
        this.dataForm.status = 0;
        if (this.login_shop_id) {
          this.dataForm.shop_id = this.login_shop_id;
        }
        this.dataForm.parentName = "";

        this.picList = [];
        // this.imgsList = [];
      }
      ,
      // 显示编辑界面
      handleDetail: function (params) {
        //debugger;
        this.dialogVisible = true;
        this.operation = false;
        this.$nextTick(() => {
          let this_ = this;
          params.row.parentName = params.row.type;
          this.dataForm = Object.assign({}, params.row);
          this.picList = [];
          // this.imgsList = [];

          if (params.row.Picture) {
            $.each(params.row.Picture.split(","), function (key, val) {
              let param = {};
              if (this_.utils.isNull(val)) {
              } else {
                param.url = val;
                this_.picList.push(param);
              }
            });
          }

        });
      }
      ,
      //保存修改
      submitForm: function () {
        var this_ = this;

        this_.$refs.dataForm.validate(valid => {
          if (valid) {
            let params = Object.assign({}, this_.dataForm);
            params.t = "goods_imports";

            // params.imgs = this.imgsList.map(item => item.url).toString();
            params.Picture = this.picList.map(item => item.url).toString();

            if (!params.Picture) {
              this.$message({message: "请选择主图", type: "error"});
              return;
            }


            params.status = "0";

            this_.editLoading = true;
            this_.utils.request.editInfo(params, this_.editInfoBack);
          }
        });
      }
      ,
      // 新增修改回调
      editInfoBack: function (data) {
        this.editLoading = false;
        if (data.code == 200) {
          this.$message({message: "操作成功", type: "success"});
          this.findPage();
          this.dialogVisible = false;
        } else {
          this.$message({message: "操作失败, " + data.msg, type: "error"});
        }
      }
      ,
      clickqurey: function (data) {
        debugger;
        localStorage.setItem('thisPricefilters', JSON.stringify(this.filters));
        this.findPage();
      },
      findPage: function (data) {

        this.$refs.CyTable.findPage(this.filters);
      }
      ,

      //列表下载
      downloadExcel() {
        this.$confirm("确定下载列表文件?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let filename = "商品管理";
            this.exportData(this.filters, this.filterColumns, filename);
          })
          .catch(() => {
          });
      }
      ,
      //excle导出
      exportData(filters, filterColumns, fileName) {
        if (filters == undefined || filters == null) {
          filters = {};
        }
        filters.start = '';///null error
        filters.limit = '';
        this.utils.request.requestPostUrl(filters, "pricereport-service/priceExcel/downloadExcel", res => {
          debugger;
          window.open("https://admin.edu.eggsoft.cn/test/"+res.data.downexcel, "_blank");
        });
      }
      ,
      // 批量删除
      handleDelete: function (data) {
        var ids = "";
        for (var i = 0; i < data.params.length; i++) {
          ids = ids + data.params[i].id + ",";
        }

        data.t = "goods_imports";
        data.ids = ids;
        this.utils.request.batchDeleteInfo(data, this.deleteInfoBack);
      }
      ,
      deleteInfoBack: function () {
        this.findPage();
        this.dialogVisible = false;
        this.operation = false;
      }
      ,
      // 显示查询
      queryInfo: function () {
        this.findPage(this.filters);
      }
      ,
      selectionChange: function (params) {
        console.log(params);
        this.checked = params.selections;
      }
      ,
      // 显示新增界面
      handleAdd: function () {
        this.dialogVisible = true;
        this.operation = true;
        if (this.$refs["dataForm"]) {
          this.$refs["dataForm"].resetFields();
        }
      }
      ,
      // 处理表格列过滤显示
      handleFilterColumns: function (data) {
        this.filterColumns = data.filterColumns;
        this.$refs.tableColumnFilterDialog.setDialogVisible(false);
      }
      ,

      // 处理表格列过滤显示
      displayFilterColumnsDialog: function () {
        this.$refs.tableColumnFilterDialog.setDialogVisible(true);
      }
      ,

      // 时间格式化
      dateFormat: function (row, column, cellValue, index) {
        return format(row[column.property]);
      }
      ,

      // 处理表格列过滤显示
      initColumns: function () {
        this.columns = [
          {prop: "id", label: "ID", minWidth: 120},
          {prop: "num", label: "原始序号", minWidth: 120},
          {prop: "goodname", label: "产品名称", minWidth: 120},
          {prop: "goodsclass", label: "分类", minWidth: 120},
          {prop: "specification", label: "规格", minWidth: 120},
          {prop: "unit", label: "单位", minWidth: 120},
          {prop: "AFactoryPrice", label: "出厂价->供货价", minWidth: 120},
          {prop: "activePrice", label: "活动控价", minWidth: 120},
          {prop: "retailprice", label: "建议零售价", minWidth: 120},
          {prop: "Shelflife", label: "保质期", minWidth: 120},
          {prop: "factory", label: "厂家", minWidth: 120},
          {
            prop: "Agoodspicture",
            label: "产品图片",
            minWidth: 120,
            formatter: this.showPhto
          },
          {
            prop: "create_time",
            label: "创建时间",
            minWidth: 180,
            formatter: this.timestampToTime
          }
        ];
        var temp = [];
        $.each(this.columns, function (key, val) {
          temp.push(val);
        });
        this.filterColumns = temp;
      }
      ,

      showPhto(row, column, cellValue, index) {
        if (cellValue != null && "" != cellValue) {
          return (
            '<i class="el-icon-zoom-in"><div style="display:none">' +
            cellValue +
            "</div></i>"
          );
        }
      }
      ,

      resetForm(formName) {
        (this.filters = {
          status: "",
          name: "",
          shop_id: "",
          t: "goods_imports"
        }),
          this.$refs.CyTable.resetForm();
        this.findPage();
      }
      ,

      timestampToTime(row, column, cellValue, index) {
        var date = new Date(cellValue); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes() + ':';
        let s = date.getSeconds();
        return Y + M + D + h + m + s;
      }
      ,
      // 所属题库初始化
      querypageList() {
        var that = this;
        this.utils.request.querypageList({t: "goods_imports"}, function (data) {
          that.shopOptions = data.data;
        });
      }
      ,

      handlePreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
      ,
      handlePicRemove(file, fileList) {
        if (picFileList && picFileListt.length == 0) {
          this.dataForm.Picture = "";
        }
      }
      ,
      handleImgsRemove(file, fileList) {
        if (imgsFileList && imgsFileList.length == 0) {
          this.dataForm.imgs = "";
        }
      }
      ,
      beforeClose() {
        this.filelist = [];
      }
      ,
      async findDicType() {
        var this_ = this;

        let letres = await this.utils.request.queryDicList('trainOrtest');
        if (letres.code = 200) {
          this_.popupQuestionTypeData = letres.data;
        }

        letres = await this.utils.request.queryDicList('testclass');
        if (letres.code = 200) {
          this_.popuptestclassData = letres.data;
        }
        //debugger;
        //
        letres = await this.utils.request.queryDicList('quizStatusType');
        if (letres.code = 200) {
          this_.popupQuizData = letres.data;
        }
        letres = await this.utils.request.queryDicList('PagePos');
        if (letres.code = 200) {
          this_.popupPagePosData = letres.data;
        }
      }
      ,


      review(data) {
        if (this.checked.length < 1) {
          this.$message({message: "审核数据不能为空", type: "error"});
          return;
        }
        this.dialogVisibleReviw = true;
      }
    },
    async mounted() {
      await this.findDicType();

      this.initColumns();
      //debugger;
      let thisPricefilters = localStorage.getItem('thisPricefilters');
      if (thisPricefilters != null) {
        let letthisPricefilters = JSON.parse(thisPricefilters);
        this.filters = letthisPricefilters;
      }

      this.querypageList();

      $(document).on(
        "click",
        ".el-icon-zoom-in",
        function (e) {
          let urlList = $(e.target)
            .find("div")
            .html();
          this.filelist = urlList.split(",");
          this.dialogVisibleImageList = true;
        }.bind(this)
      );
    }
  };
</script>

<style scoped>
  /deep/ .form .el-input__inner {
    width: 340px;
  }

  /deep/ .el-icon-zoom-in {
    cursor: pointer;
  }


  .textarea >>> .el-textarea__inner {
    font-family: "Microsoft" !important;
    width: 640px;
  }



  /deep/ .form .ControlCSSWidth .el-input__inner {
    width: 140px;
  }
</style>
