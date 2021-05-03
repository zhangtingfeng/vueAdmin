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

        <el-form-item prop="quizID">
          <el-select clearable filterable placeholder="请选择所属方案" v-model="filters.quizID" @change="selectquizIDChanged">
            <el-option
              :key="item.id"
              :label="item.title"
              :value="item.id"
              v-for="item in popupQuizListData"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="quiz_questionID">
          <el-select clearable filterable placeholder="请选择所属问题" v-model="filters.quiz_questionID"
                     @change="selectquiz_questionIDChanged">
            <el-option
              :key="item.id"
              :label="item.ShortDes"
              :value="item.id"
              v-for="item in popupQuiz_questionListData"
            ></el-option>
          </el-select>
        </el-form-item>


        <el-form-item prop="AnswerSortNum">
          <el-input auto-complete="off" placeholder="排序编号" v-model="filters.AnswerSortNum"></el-input>
        </el-form-item>

        <el-form-item prop="answertext">
          <el-input auto-complete="off" placeholder="题目简短描述" v-model="filters.answertext"></el-input>
        </el-form-item>

        <el-form-item prop="Status">
          <el-select clearable filterable placeholder="请选择在线状态" v-model="filters.Status">
            <el-option
              :key="item.val"
              :label="item.dicName"
              :value="item.val"
              v-for="item in popupQuizData"
            ></el-option>
          </el-select>

        </el-form-item>
        <el-form-item>
          <kt-button icon="el-icon-s-check" label="新增" type="primary" @click="addQuiz_question_choiceAction"/>
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
    <el-dialog title="题目详情" width="70%" :visible.sync="dialogVisible" :close-on-click-modal="false">
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


        <el-form-item label="所属方案" prop="quizID">
          <el-select v-model="dataForm.quizID" placeholder="请选择方案" clearable filterable @change="selectquizIDChanged">
            <el-option
              v-for="item in popupQuizListData"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="所属问题" prop="quiz_questionID">
          <el-select v-model="dataForm.quiz_questionID" placeholder="请选择问题" clearable filterable
                     @change="selectquiz_questionIDChanged">
            <el-option
              v-for="item in popupQuiz_questionListData"
              :key="item.id"
              :label="item.ShortDes"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="排序编号" prop="AnswerSortNum">
          <el-input type="number" v-model="dataForm.AnswerSortNum" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="简单介绍" prop="answertext">
          <el-input type="textarea" class="textarea" height=200px width="600" v-model="dataForm.answertext"
                    auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="详情介绍" prop="content">
          <div class="edit_container" style="max-height:500px;min-height:20px;overflow: auto;">
            <quill-editor
              v-model="dataForm.content"
              ref="myQuillEditor"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @change="onEditorChange($event)"
            ></quill-editor>
          </div>
        </el-form-item>

        <el-row>
          <el-form-item label="答案图片">
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


        <el-form-item label="答案是否在线" prop="Status">
          <el-select v-model="dataForm.Status" placeholder="题目是否在线" clearable filterable>
            <el-option
              v-for="item in popupQuizData"
              :key="item.val"
              :label="item.dicName"
              :value="item.val"
            ></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="分数" prop="correctAnswerScore">
          <el-input auto-complete="off" type="number" placeholder="0表示不是正确答案，大于1表示是 或者分值。负数表示扣分"
                    v-model="dataForm.correctAnswerScore"></el-input>
        </el-form-item>


        <el-form-item label="答案解析" prop="text">
          <div class="edit_container" style="max-height:500px;min-height:20px;overflow: auto;">
            <quill-editor
              v-model="dataForm.AnswerMemo"
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
                    t: "invest_quiz_question_choice",
                    create_time: "asc"
                },
                dataForm: {
                    id: "",
                    quiz_questionID: "",
                    AnswerSortNum: "",
                    answertext: "",
                    content: "",
                    Picture: "",
                    quiz_question_Status: "",
                    correctAnswerScore: "",
                    Status: "",
                    AnswerMemo: ""
                },
                dataFormRules: {
                    quiz_questionID: [
                        {required: true, message: "请选择问题", trigger: "change"}
                    ],

                    correctAnswerScore: [
                        {required: true, message: "请输入是否是答案", trigger: "change"}
                    ]
                },
                columns: [],
                filterColumns: [],
                pageRequest: {pageNum: 1, pageSize: 100},
                pageResult: {},
                checked: [],
                operation: false, // true:新增, false:编辑
                dialogVisible: false, // 新增编辑界面是否显示
                editLoading: false,
                checkpage: false,
                deptData: [],
                dialogVisibleImageList: false,
                filelist: [],

                popupQuizData: [],
                popupQuizListData: [],
                popupquestiontypeListData: [],
                popupQuiz_questionListData: [],
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
                if (this.picList > this.imageSizeLimit) {////限制数量
                    this.picList = [this.picList[this.picList.length - 1]];
                }
            },


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
            addQuiz_question_choiceAction: function (params) {
                let this_ = this;
                this.dialogVisible = true;
                this.operation = false;
                if (this.$refs["dataForm"]) {
                    this.$refs["dataForm"].resetFields();
                }
                this.dataForm.status = 0;
                this.dataForm.correctAnswerScore = 0;
                if (this.login_shop_id) {
                    this.dataForm.shop_id = this.login_shop_id;
                }
                this.dataForm.parentName = "";

                this.picList = [];
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

                });
            },
            //保存修改
            submitForm: function () {
                var this_ = this;

                this_.$refs.dataForm.validate(valid => {
                    if (valid) {
                        let params = Object.assign({}, this_.dataForm);
                        params.t = "invest_quiz_question_choice";

                        // params.imgs = this.imgsList.map(item => item.url).toString();
                        params.Picture = this.picList.map(item => item.url).toString();



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
                /*  let login_shop_id = localStorage.getItem("login_shop_id");
                  if (login_shop_id) {
                      this.login_shop_id = login_shop_id;
                  }
                  if (this.login_shop_id) {
                      this.filters.shop_id = this.login_shop_id;
                  }*/
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
                });
            },
            // 批量删除
            handleDelete: function (data) {
                var ids = "";
                for (var i = 0; i < data.params.length; i++) {
                    ids = ids + data.params[i].id + ",";
                }

                data.t = "invest_quiz_question_choice";
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

                    {
                        prop: "quiz_questionID",
                        label: "所属问题",
                        minWidth: 120,
                        formatter: this.showQuzi_ChoiceListStatus
                    },
                    {prop: "AnswerSortNum", label: "排序编号", minWidth: 120},
                    {prop: "answertext", label: "简单介绍", minWidth: 120},

                    {
                        prop: "Picture",
                        label: "主图",
                        minWidth: 120,
                        formatter: this.showPhto
                    },
                    {
                        prop: "correctAnswerScore",
                        label: "分值",
                        minWidth: 120
                    },
                    {
                        prop: "Status",
                        label: "状态",
                        minWidth: 120,
                        formatter: this.showStatus
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
                    t: "invest_quiz_question_choice"
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

                return "";
            },
            showQuziListStatus(row, column, cellValue, index) {
                // debugger;
                for (let ddd = 0; ddd < this.popupQuizListData.length; ddd++) {
                    // debugger;
                    if (this.popupQuizListData[ddd].id == cellValue) {
                        return this.popupQuizListData[ddd].title;
                    }
                }
                return "";
            },
            showQuzi_ChoiceListStatus(row, column, cellValue, index) {

                for (let ddd = 0; ddd < this.popupQuiz_questionListData.length; ddd++) {
                    //debugger;
                    if (this.popupQuiz_questionListData[ddd].id == cellValue) {
                        return this.popupQuiz_questionListData[ddd].ShortDes;
                    }
                }
                return "";
            },

            timestampToTime(row, column, cellValue, index) {
                var date = new Date(cellValue); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                let D = date.getDate() + ' ';
                let h = date.getHours() + ':';
                let m = date.getMinutes() + ':';
                let s = date.getSeconds();
                return Y + M + D + h + m + s;
            },
            showquestiontypeStatus(row, column, cellValue, index) {
                // debugger;
                for (let ddd = 0; ddd < this.popupquestiontypeListData.length; ddd++) {
                    // debugger;
                    if (this.popupquestiontypeListData[ddd].val == cellValue) {
                        return this.popupquestiontypeListData[ddd].dicName;
                    }
                }

                return "";
            },
            // 所属题库初始化
            querypageList() {
                var that = this;
                this.utils.request.querypageList({t: "invest_quiz_question_choice"}, function (data) {
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

                let lerRes = await this.utils.request.queryDicList('quizStatusType');
                if (lerRes.code = 200) {
                    this_.popupQuizData = lerRes.data;
                }
                lerRes = await this.utils.request.queryDicList('questiontype');
                if (lerRes.code = 200) {
                    this_.popupquestiontypeListData = lerRes.data;
                }
                //debugger;
                //
                let _thisvar = {}
                _thisvar.start = 1;
                _thisvar.limit = 100;
                _thisvar.status = "";
                _thisvar.t = "invest_quiz_question";
                _thisvar.sql = "queryQuizList";

                //debugger;
                lerRes = await this.utils.request.queryGetCmnQueryPage(_thisvar);
                this_.popupQuizListData = lerRes.data.rows;


                await this.readDicquestionListData();

            },

            async readDicquestionListData(quizIDvalue) {
                let _thisvar = {}
                _thisvar.start = 1;
                _thisvar.limit = 100;
                _thisvar.status = "";
                _thisvar.t = "invest_quiz_question_choice";
                _thisvar.sql = "queryquiz_questionList";
                _thisvar.quizID=quizIDvalue;

                let lerRes = await this.utils.request.queryGetCmnQueryPage(_thisvar);
                debugger;
                this.popupQuiz_questionListData = lerRes.data.rows;
            },


            review(data) {
                if (this.checked.length < 1) {
                    this.$message({message: "审核数据不能为空", type: "error"});
                    return;
                }
                this.dialogVisibleReviw = true;
            },
            selectquizIDChanged(value) {
                localStorage.setItem("quizIDMemory", value);
                this.dataForm.quizID = value;
                this.filters.quizID = value;

                console.log("quizIDMemory" + value);

                this.dataForm.quiz_questionID = null;
                this.filters.quiz_questionID = null;

                 this.readDicquestionListData(value);
            },
            selectquiz_questionIDChanged(value) {
                localStorage.setItem("quiz_questionIDMemory", value);
                this.dataForm.quiz_questionID = value;
                this.filters.quiz_questionID = value;

                console.log("quiz_questionIDMemory" + value);
            }


        },
        async beforeMount() {
            await this.findDicType();
            if (localStorage.getItem("quizIDMemory") != null) {
                //  debugger;
                //  filters.quizID
                this.dataForm.quizID = Number(localStorage.getItem("quizIDMemory"));
                this.filters.quizID = Number(localStorage.getItem("quizIDMemory"));
            }

            if (localStorage.getItem("quiz_questionIDMemory") != null) {
                this.dataForm.quiz_questionID = Number(localStorage.getItem("quiz_questionIDMemory"));
                this.filters.quiz_questionID = Number(localStorage.getItem("quiz_questionIDMemory"));
            }

        },
        mounted() {


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


  .textarea >>> .el-textarea__inner {
    font-family: "Microsoft" !important;

    width: 640px;
  }
</style>
