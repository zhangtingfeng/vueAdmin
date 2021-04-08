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
        <el-form-item prop="Title">
          <el-input auto-complete="off" placeholder="方案名称" v-model="filters.Title"></el-input>
        </el-form-item>

        <el-form-item prop="status">
          <el-select clearable filterable placeholder="请选择在线状态" v-model="filters.status">
            <el-option
              :key="item.val"
              :label="item.dicName"
              :value="item.val"
              v-for="item in popupQuizData"
            ></el-option>
          </el-select>
          <!--  <el-select v-model="filters.status" placeholder="在线状态">
              <el-option label="上线状态" :value="1"></el-option>
              <el-option label="离线状态" :value="2"></el-option>
            </el-select>-->
        </el-form-item>
        <el-form-item>
          <kt-button icon="el-icon-s-check" label="新增" type="primary" @click="addQuiz"/>
          <kt-button
            icon="fa fa-search"
            label="查询"
            type="primary"
            @click="$refs.CyTable.findPageBeforeRestPages(filters)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="el-icon-refresh"
            :label="$t('action.reset')"
            type="primary"
            @click="resetForm('filters')"
          />
        </el-form-item>
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
    <!--新增编辑界面-->
    <el-dialog title="方案详情" width="70%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form
        :model="dataForm"
        label-width="80px"
        :rules="dataFormRules"
        ref="dataForm"
        :inline="true"
        :size="size"
        class="form"
      >
        <el-form-item label="ID" prop="id" v-show="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="名称" prop="Title">
          <el-input v-model="dataForm.Title" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="所属分类" prop="Type_TestOrLearing">
          <el-select v-model="dataForm.Type_TestOrLearing" placeholder="请选择分类" clearable filterable>
            <el-option
              v-for="item in popupQuestionTypeData"
              :key="item.val"
              :label="item.dicName"
              :value="item.val"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="报告费用" prop="ReportNeedMoney">
          <el-input auto-complete="off" type="number" v-model="dataForm.ReportNeedMoney"></el-input>
        </el-form-item>
        <el-form-item label="开始费用" prop="TestNeedMoney">
          <el-input auto-complete="off" type="number" v-model="dataForm.TestNeedMoney"></el-input>
        </el-form-item>


        <el-form-item label="在线状态" prop="quizStatus">
          <el-select clearable filterable placeholder="请选择在线状态" v-model="dataForm.quizStatus">
            <el-option
              :key="item.val"
              :label="item.dicName"
              :value="item.val"
              v-for="item in popupQuizData"
            ></el-option>
          </el-select>
        </el-form-item>



        <el-row>
          <el-form-item label="方案主图">
            <img-upload
              ref="ImgUpload"
              :filelist="picList"
              @handleImgUploadRemove="handleImgUploadRemove"
              @handleImgUploadChange="handleImgUploadChange"
              @handlePictureCardPreview="handlePictureCardPreview"
              uploadButton="picList"
            ></img-upload>
          </el-form-item>

        </el-row>

        <el-form-item label="简单介绍" prop="quizMemo">
          <el-input type="textarea" class="textarea" height=200px width="600"  v-model="dataForm.quizMemo" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="详情介绍" prop="InvestMemo">
          <div class="edit_container" style="max-height:500px;min-height:20px;overflow: auto;">
            <quill-editor
              v-model="dataForm.InvestMemo"
              ref="myQuillEditor"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @change="onEditorChange($event)"
            ></quill-editor>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button :size="size" @click="cleanDataForm">{{ $t("action.cancel") }}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="submitForm"
          :loading="editLoading"
        >{{$t('action.submit')}}
        </el-button>
      </div>
    </el-dialog>

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
                    status: "",
                    name: "",
                    shop_id: "",
                    t: "invest_quiz",
                    create_time: "desc"
                },
                dataForm: {
                    id: "",
                    Title: "",
                    quizMemo: "",
                    InvestMemo: "",
                    Type_TestOrLearing: "",
                    Picture: "",
                    ReportNeedMoney: "",
                    TestNeedMoney: "",
                    quizStatus: "",

                },
                dataFormRules: {

                    Title: [{required: true, message: "请输入方案名称", trigger: "blur"}],

                    quizStatus: [
                        {required: true, message: "请选择方案状态,处于停用状态还是使用状态", trigger: "change"}
                    ],
                    Picture: [{required: true, message: "请上传主图", trigger: "blur"}]
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
                popupQuizData: [],
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

            handleSuccess(res) {
                // 获取富文本组件实例
                //debugger;
                let quill = this.$refs.myQuillEditor.quill;
                // 如果上传成功
                if (res.data.imgUrl) {
                    // 获取光标所在位置
                    let length = quill.getSelection().index;
                    // 插入图片，res为服务器返回的图片链接地址

                    quill.insertEmbed(length, "image", res.data.imgUrl);
                    // 调整光标到最后
                    quill.setSelection(length + 1);
                } else {
                    // 提示信息，需引入Message
                    Message.error("图片插入失败");
                }
            },
            onEditorReady(editor) {
                // 准备编辑器
            },
            onEditorBlur() {
            }, // 失去焦点事件
            onEditorFocus() {
            }, // 获得焦点事件
            onEditorChange(e) {
            }, // 内容改变事件
            saveHtml: function (event) {
            },
            handlePictureCardPreview(data) {
               // debugger;
                var url = data.url;
                this.filelist = [];
                this.filelist.push(url);
                this.dialogVisibleImageList = true;
            },

            handleImgUploadRemove(data) {
                //debugger;
                var index = data.index;
                this.picList.splice(index, 1);
            },
            handleImgUploadChange(data) {
               // debugger;
                this.picList = data.filelist;
                if (this.picList >this.imageSizeLimit){////限制数量
                    this.picList = [this.picList[this.picList.length - 1]];
                }
            },

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
            },
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
            },
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
                    /*
                    if (params.row.pic) {
                        $.each(params.row.pic.split(","), function (key, val) {
                            let param = {};
                            if (this_.utils.isNull(val)) {
                            } else {
                                param.url = val;
                                this_.imgsList.push(param);
                            }
                        });
                    }*/
                });
            },
            //保存修改
            submitForm: function () {
                var this_ = this;

                this_.$refs.dataForm.validate(valid => {
                    if (valid) {
                        let params = Object.assign({}, this_.dataForm);
                        params.t = "invest_quiz";

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
            },
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
            },
            findPage: function (data) {
                let login_shop_id = localStorage.getItem("login_shop_id");
                if (login_shop_id) {
                    this.login_shop_id = login_shop_id;
                }
                if (this.login_shop_id) {
                    this.filters.shop_id = this.login_shop_id;
                }
                this.$refs.CyTable.findPage(this.filters);
            },

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
            },
            //excle导出
            exportData(filters, filterColumns, fileName) {
                if (filters == undefined || filters == null) {
                    filters = {};
                }
                filters.start = null;
                filters.limit = null;
                this.utils.request.queryCmnQueryPage(filters, res => {
                    if (fileName == undefined || fileName == null) {
                        fileName = "excel-list";
                    }

                    fileName = fileName + "_" + formatDate(new Date(), "yyyyMMdd");

                    if (res.data.rows == null || res.data.rows.length == 0) {
                        this.$message({message: "暂无需要导出的数据 ", type: "error"});
                        return;
                    }
                    exportExcel(res.data.rows, filterColumns, fileName);
                }, filters.tService);
            },
            // 批量删除
            handleDelete: function (data) {
                var ids = "";
                for (var i = 0; i < data.params.length; i++) {
                    ids = ids + data.params[i].id + ",";
                }

                data.t = "invest_quiz";
                data.ids = ids;
                this.utils.request.batchDeleteInfo(data, this.deleteInfoBack);
            },
            deleteInfoBack: function () {
                this.findPage();
                this.dialogVisible = false;
                this.operation = false;
            },
            // 显示查询
            queryInfo: function () {
                this.findPage(this.filters);
            },
            selectionChange: function (params) {
                console.log(params);
                this.checked = params.selections;
            },
            // 显示新增界面
            handleAdd: function () {
                this.dialogVisible = true;
                this.operation = true;
                if (this.$refs["dataForm"]) {
                    this.$refs["dataForm"].resetFields();
                }
            },
            // 处理表格列过滤显示
            handleFilterColumns: function (data) {
                this.filterColumns = data.filterColumns;
                this.$refs.tableColumnFilterDialog.setDialogVisible(false);
            },

            // 处理表格列过滤显示
            displayFilterColumnsDialog: function () {
                this.$refs.tableColumnFilterDialog.setDialogVisible(true);
            },

            // 时间格式化
            dateFormat: function (row, column, cellValue, index) {
                return format(row[column.property]);
            },

            // 处理表格列过滤显示
            initColumns: function () {
                this.columns = [
                    {prop: "Title", label: "方案名称", minWidth: 120},
                    {prop: "quizMemo", label: "简单介绍", minWidth: 120},

                    {
                        prop: "Picture",
                        label: "主图",
                        minWidth: 120,
                        formatter: this.showPhto
                    },
                    {prop: "ReportNeedMoney", label: "显示报告费用", minWidth: 120},
                    {
                        prop: "TestNeedMoney",
                        label: "开始测试费用",
                        minWidth: 120,
                        showOverflowTooltip: false
                    },
                    {
                        prop: "quizStatus",
                        label: "状态",
                        minWidth: 120,
                        formatter: this.showStatus
                    },
                    {
                        prop: "create_time",
                        label: "创建时间",
                        minWidth: 120
                    }
                ];
                var temp = [];
                $.each(this.columns, function (key, val) {
                    temp.push(val);
                });
                this.filterColumns = temp;
            },

            showPhto(row, column, cellValue, index) {
                if (cellValue != null && "" != cellValue) {
                    return (
                        '<i class="el-icon-zoom-in"><div style="display:none">' +
                        cellValue +
                        "</div></i>"
                    );
                }
            },

            resetForm(formName) {
                (this.filters = {
                    status: "",
                    name: "",
                    shop_id: "",
                    t: "invest_quiz"
                }),
                    this.$refs.CyTable.resetForm();
                this.findPage();
            },
            showStatus(row, column, cellValue, index) {
                // debugger;
                for (let ddd = 0; ddd < this.popupQuizData.length; ddd++) {
                    // debugger;
                    if (this.popupQuizData[ddd].val == cellValue) {
                        return this.popupQuizData[ddd].dicName;
                    }
                }
                /* if (cellValue == 0) {
                     return "审核中";
                 } else if (cellValue == 1) {
                     return "审核成功";
                 }*/
                return "";
            },
            // 所属题库初始化
            querypageList() {
                var that = this;
                this.utils.request.querypageList({t: "invest_quiz"}, function (data) {
                    that.shopOptions = data.data;
                });
            },

            handlePreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handlePicRemove(file, fileList) {
                if (picFileList && picFileListt.length == 0) {
                    this.dataForm.Picture = "";
                }
            },
            handleImgsRemove(file, fileList) {
                if (imgsFileList && imgsFileList.length == 0) {
                    this.dataForm.imgs = "";
                }
            },
            beforeClose() {
                this.filelist = [];
            },
            async findDicType() {
                var this_ = this;

                this.utils.request.queryDicList('trainOrtest', function (res) {
                    if (res.code = 200) {
                        this_.popupQuestionTypeData = res.data;
                    }
                    //debugger;
                    //
                });

                this.utils.request.queryDicList('quizStatusType', function (res) {
                    if (res.code = 200) {
                        this_.popupQuizData = res.data;
                    }
                    //debugger;
                    //
                });


            },


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


  .textarea >>> .el-textarea__inner{
    font-family:"Microsoft" !important;
    font-size:20px !important;
    width: 640px;
  }
</style>
