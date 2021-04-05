<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <span class="kt-icon-jiaobiaoxuanzhong_o"></span>
        <span class="fontFamily hhtx-shezhi buttontitle">status</span>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="oneline" style="display: none">
      <el-col :span="6" class="lineHeight">
        今日支付金额<br/>
        <div style="font-size: x-large; color: #a71d5d">{{incomeRow.todayincome?incomeRow.todayincome:0}}元</div>
        <div>
          较前一日{{(incomeRow.todayincome-incomeRow.yestdayincome)?(incomeRow.todayincome-incomeRow.yestdayincome):0}}元
        </div>
        <div> 昨日{{incomeRow.yestdayincome?incomeRow.yestdayincome:0}}元</div>
        <div> 总支付金额{{incomeRow.allCount}}元</div>
      </el-col>
      <el-col :span="6" class="lineHeight">
        今日支付订单数<br/>
        <div style="font-size: x-large; color: #a71d5d">
          {{incomeOrderNumRow.todayincome?incomeOrderNumRow.todayincome:0}}个
        </div>
        <div>
          较前一日{{(incomeOrderNumRow.todayincome-incomeOrderNumRow.yestdayincome)?(incomeOrderNumRow.todayincome-incomeOrderNumRow.yestdayincome):0}}个
        </div>
        <div> 昨日{{incomeOrderNumRow.yestdayincome?incomeOrderNumRow.yestdayincome:0}}个</div>
        <div> 总支付订单数{{incomeOrderNumRow.allCount}}个</div>
      </el-col>
      <el-col :span="6" class="lineHeight"  style="display: none">
        今日支付人数<br/>
        <div style="font-size: x-large; color: #a71d5d">
          {{incomeUserNumRow.todayincome?incomeUserNumRow.todayincome:0}}人
        </div>
        <div>
          较前一日{{(incomeUserNumRow.todayincome-incomeUserNumRow.yestdayincome)?(incomeUserNumRow.todayincome-incomeUserNumRow.yestdayincome):0}}人
        </div>
        <div> 昨日{{incomeUserNumRow.yestdayincome?incomeUserNumRow.yestdayincome:0}}人</div>
        <div> 总支付订单数{{incomeUserNumRow.allCount}}人</div>

      </el-col>
    </el-row>


    <el-row :gutter="20" style="margin-top: 10px;display: none" >
      <el-col :span="8">
        <span class="kt-icon-jiaobiaoxuanzhong_o"></span>
        <span class="fontFamily hhtx-shezhi buttontitle">注册统计</span>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="oneline" style="margin-top: 10px;display: none">
      <el-col :span="6" class="lineHeight">
        今日平台注册人数<br/>
        <div style="font-size: x-large; color: #a71d5d">{{incomeUserRow.todayincome?incomeUserRow.todayincome:0}}个</div>
        <div>
          较前一日{{(incomeUserRow.todayincome-incomeUserRow.yestdayincome)?(incomeUserRow.todayincome-incomeUserRow.yestdayincome):0}}个
        </div>
        <div> 昨日{{incomeUserRow.yestdayincome?incomeUserRow.yestdayincome:0}}个</div>
        <div> 平台注册总人数{{incomeUserRow.allCount}}个</div>
      </el-col>
      <el-col :span="6" class="lineHeight" style="margin-top: 10px;display: none">
        今日邀请注册人数<br/>
        <div style="font-size: x-large; color: #a71d5d">
          {{incomeUserShareNumRow.todayincome?incomeUserShareNumRow.todayincome:0}}个
        </div>
        <div>
          较前一日{{(incomeUserShareNumRow.todayincome-incomeUserShareNumRow.yestdayincome)?(incomeUserShareNumRow.todayincome-incomeUserShareNumRow.yestdayincome):0}}个
        </div>
        <div> 昨日{{incomeUserShareNumRow.yestdayincome?incomeUserShareNumRow.yestdayincome:0}}个</div>
        <div> 邀请注册总人数{{incomeUserShareNumRow.allCount}}个</div>
      </el-col>

    </el-row>

    <el-row :gutter="20" style="margin-top: 10px;display: none">
      <el-col :span="8">
        <span class="kt-icon-jiaobiaoxuanzhong_o"></span>
        <span class="fontFamily hhtx-shezhi buttontitle">消费统计</span>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="oneline" style="margin-top: 10px;display: none">
      <el-col :span="6" class="lineHeight">
        今日消费总数<br/>
        <div style="font-size: x-large; color: #a71d5d">{{StatisticsIncome1Row.todayincome?StatisticsIncome1Row.todayincome:0}}元</div>
        <div>
          较前一日{{(StatisticsIncome1Row.todayincome-StatisticsIncome1Row.yestdayincome)?(StatisticsIncome1Row.todayincome-StatisticsIncome1Row.yestdayincome):0}}元
        </div>
        <div> 昨日{{StatisticsIncome1Row.yestdayincome?StatisticsIncome1Row.yestdayincome:0}}元</div>
        <div> 平台消费总数{{StatisticsIncome1Row.allCount}}元</div>
      </el-col>
      <el-col :span="6" class="lineHeight">
        今日收益总数<br/>
        <div style="font-size: x-large; color: #a71d5d">{{income_type10Row.todayincome?income_type10Row.todayincome:0}}元</div>
        <div>
          较前一日{{(income_type10Row.todayincome-income_type10Row.yestdayincome)?(income_type10Row.todayincome-income_type10Row.yestdayincome):0}}元
        </div>
        <div> 昨日{{income_type10Row.yestdayincome?income_type10Row.yestdayincome:0}}元</div>
        <div> 平台收益总数{{income_type10Row.allCount}}元</div>
      </el-col>
      <el-col :span="6" class="lineHeight">
        今日提现总数<br/>
        <div style="font-size: x-large; color: #a71d5d">{{user_account_extractRow.todayincome?user_account_extractRow.todayincome:0}}元</div>
        <div>
          较前一日{{(user_account_extractRow.todayincome-user_account_extractRow.yestdayincome)?(user_account_extractRow.todayincome-user_account_extractRow.yestdayincome):0}}元
        </div>
        <div> 昨日{{user_account_extractRow.yestdayincome?user_account_extractRow.yestdayincome:0}}元</div>
        <div> 平台提现总数{{user_account_extractRow.allCount}}元</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    import {formatDate} from "@/utils/datetime";

    export default {
        data() {
            return {

                incomefilters: {
                    type: "",
                    name: "",
                    t: "destopStatistics",
                },
                incoeNumfilters: {
                    type: "",
                    name: "",
                    t: "destopStatisticsOrderSNum",
                },
                incoeUserNumfilters: {
                    type: "",
                    name: "",
                    t: "destopStatisticsUserSNum",
                },
                incoeUserfilters: {
                    type: "",
                    name: "",
                    t: "destopStatisticsUser",
                },
                incoeUserShareNumfilters: {
                    type: "",
                    name: "",
                    t: "destopStatisticsUserShare",
                },
                StatisticsIncome1filters: {
                    type: "",
                    name: "",
                    t: "destopStatisticsIncome1",
                },
                Statisticsincome_type10filters: {
                    type: "",
                    name: "",
                    t: "destopStatisticsincome_type10",
                },
                user_account_extractfilters: {
                    type: "",
                    name: "",
                    t: "destopStatisticsuser_account_extract",
                },
                incomeRow: {},
                incomeOrderNumRow: {},
                incomeUserNumRow: {},
                incomeUserRow: {},
                incomeUserShareNumRow: {},
                StatisticsIncome1Row: {},
                income_type10Row: {},
                user_account_extractRow: {},
            };
        },
        computed: {},
        mounted: function () {
            //初始化，
            this.findincomefilters();
            this.findOrderPageincoefilters();
            this.findUserNumPageincoefilters();
            this.findUserPageincoefilters();
            this.findUserShareNumPageincoefilters();
            this.findStatisticsIncome1filters();
            this.findincome_type10Rowfilters();
            this.finduser_account_extractRowfilters();
        },
        methods: {

            findincomefilters: function () {
                let _this = this;
                _this.incomefilters.start = 0;
                _this.incomefilters.limit = 100;

                this.utils.request.queryCmnQueryPage(_this.incomefilters, function (res) {
                    //debugger;
                    if (res.code==200 && res.data.rows != null) {
                        _this.incomeRow = res.data.rows[0];
                    }
                },_this.incomefilters.tService);
            },
            findOrderPageincoefilters: function () {
                let _this = this;
                _this.incoeNumfilters.start = 0;
                _this.incoeNumfilters.limit = 100;

                this.utils.request.queryCmnQueryPage(_this.incoeNumfilters, function (res) {
                    //debugger;
                    if (res.code==200 && res.data.rows != null) {
                        _this.incomeOrderNumRow = res.data.rows[0];
                    }
                },this_.incoeNumfilters.tService);
            },
            findUserNumPageincoefilters: function () {
                let _this = this;
                _this.incoeUserNumfilters.start = 0;
                _this.incoeUserNumfilters.limit = 100;

                this.utils.request.queryCmnQueryPage(_this.incoeUserNumfilters, function (res) {
                    //debugger;
                    if (res.code==200 && res.data.rows != null) {
                        _this.incomeUserNumRow = res.data.rows[0];
                    }
                },this_.incoeUserNumfilters.tService);
            },
            findUserPageincoefilters: function () {
                let _this = this;
                _this.incoeUserfilters.start = 0;
                _this.incoeUserfilters.limit = 100;

                this.utils.request.queryCmnQueryPage(_this.incoeUserfilters, function (res) {
                    //debugger;
                    if (res.code==200 && res.data.rows != null) {
                        _this.incomeUserRow = res.data.rows[0];
                    }
                });
            },
            findUserShareNumPageincoefilters: function () {
                let _this = this;
                _this.incoeUserShareNumfilters.start = 0;
                _this.incoeUserShareNumfilters.limit = 100;

                this.utils.request.queryCmnQueryPage(_this.incoeUserShareNumfilters, function (res) {
                    //debugger;
                    if (res.code==200 && res.data.rows != null) {
                        _this.incomeUserShareNumRow = res.data.rows[0];
                    }
                });
            },
            findStatisticsIncome1filters: function () {
                let _this = this;
                _this.StatisticsIncome1filters.start = 0;
                _this.StatisticsIncome1filters.limit = 100;

                this.utils.request.queryCmnQueryPage(_this.StatisticsIncome1filters, function (res) {
                    //debugger;
                    if (res.code==200 && res.data.rows != null) {
                        _this.StatisticsIncome1Row = res.data.rows[0];
                    }
                });
            },
            findincome_type10Rowfilters: function () {
                let _this = this;
                _this.Statisticsincome_type10filters.start = 0;
                _this.Statisticsincome_type10filters.limit = 100;

                this.utils.request.queryCmnQueryPage(_this.Statisticsincome_type10filters, function (res) {
                    //debugger;
                    if (res.code==200 && res.data.rows != null) {
                        _this.income_type10Row = res.data.rows[0];
                    }
                });
            },
            finduser_account_extractRowfilters: function () {
                let _this = this;
                _this.user_account_extractfilters.start = 0;
                _this.user_account_extractfilters.limit = 100;

                this.utils.request.queryCmnQueryPage(_this.user_account_extractfilters, function (res) {
                    //debugger;
                    if (res.code==200 && res.data.rows != null) {
                        _this.user_account_extractRow = res.data.rows[0];
                    }
                });
            },
        }
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }

  .dashboard-editor-container {
    width: 90%;
    height: 100%;
    text-align: center
  }

  .buttontitle {
    font-weight: bolder;
    font-size: large;
  }

  .oneline {
    margin-left: 100px !important;
    display: flex;
    margin-top: 10px !important;
  }

  .lineHeight {
    line-height: 30px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
</style>
