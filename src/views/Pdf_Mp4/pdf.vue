<template>
  <div>
    <el-button-group>
      <el-button type="primary" icon="el-icon-arrow-left" size="mini" @click="prePage">上一页</el-button>
      <el-button type="primary" size="mini" @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right"></i>
      </el-button>
    </el-button-group>
    <div style="marginTop: 10px; color: #409EFF">{{ pageNum }} / {{ pageTotalNum }}</div>
    <pdf
      :page="pageNum"
      :src="url"
      @progress="loadedRatio = $event"
      @num-pages="pageTotalNum=$event"
    ></pdf>
  </div>
</template>

<script>
    import pdf from 'vue-pdf'

    export default {
        name: 'Pdf',
        components: {
            pdf,
        },
        data() {
            return {
               // url: '/Konowledge/%E5%AD%A6%E6%B2%9F%E9%80%9A/%E6%B2%9F%E9%80%9A%E4%B9%A6%E7%B1%8D/%E6%B2%9F%E9%80%9A%E5%8A%9B-%E4%BA%BA%E9%99%85%E5%85%B3%E7%B3%BB.pdf',
                url: '',
                pageNum: 1,
                pageTotalNum: 1,
                //  # 总页数
                loadedRatio: 0,
                //   # 当前页面的加载进度，范围是0 - 1 ，等于1的时候代表当前页已经完全加载完成了
            }
        },
        mounted() {

            debugger;
          this.url=decodeURIComponent(this.$route.query.urlpath);
          //  this.$alert(this.$route.query.urlpath+'我需要</br>换行',{dangerouslyUseHTMLString:true})
        },
        methods: {

            // 上一页
            prePage() {
                let page = this.pageNum
                page = page > 1 ? page - 1 : this.pageTotalNum
                this.pageNum = page
            },

            // 下一页
            nextPage() {
                let page = this.pageNum
                page = page < this.pageTotalNum ? page + 1 : 1
                this.pageNum = page
            }
        }
    }
</script>
