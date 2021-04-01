<template>
  <div>
    <h1></h1>

    <div id="index">
      <ul>
        <li v-for="(item, index) in imageslist" :key="index">
          <img :src="item"  :data-original="item" @click="imageClick"/>
        </li>
      </ul>
    </div>
    <!-- <viewer :images="photo">
      <img  v-for="(src,index) in photo"  :src='src'
            :data-original='`${src}`'  height="100">
    </viewer>

            <li :key="index"
                @click="preview(index)"
                v-for="(nbase64, index) in imageslist">
                <img style="max-width: 100%;"  :src=nbase64  alt="">
            </li>
            -->
  </div>
</template>
<script>
    import Viewer from "viewerjs";
    import "viewerjs/dist/viewer.css";
    export default {

        data() {
            return {
                msg: this.$route.query.data,
                readpicForm: {
                    username: "admin",
                    password: "123456"
                },
                loading: false,
                pwdType: "password",
                imageslist: [
                ],
                uploadfileIDList: [
                ]
            };
        },
        methods: {
            timerdoread() {
                setTimeout(() => {
                    this.readpicList();
                    this.timerdoread();//继续计时器

                }, 4000);

            },

            updateview(){

                const ViewerDom = document.getElementById("index");
                const viewer = new Viewer(ViewerDom, {
                    url:"data-original",
                    show:function () {
                        //  debugger;
                        viewer.update();
                    },
                    hide:function () {
                        //debugger;
                        viewer.destroy();
                    }

                });
            },
            imageClick(e){
                if (e.target.nodeName == 'IMG' ){
                    this.updateview();
                }
            },
            readpicList() {
                var this_ = this;
                let query = {};
                //  debugger;
                query.excludeuploadfileIDList =JSON.stringify(this_.uploadfileIDList);
                this.utils.request.requestPostUrl(query, "student-service/TestFeign/readPics", function (res) {
                    if (res.code == 200) {
                        // debugger;
                        this_.loading = false;
                        // this_.roles = res.data;
                        let varpicList = res.data;
                        // eslint-disable-next-line no-unused-vars
                        //this_.imageslist= [];
                        if (varpicList.length>1){
                            //  this_.updateview();
                        }
                        for (var i = 0; i < varpicList.length; i++) {

                            this_.uploadfileIDList.push(varpicList[i].uploadfileID)
                            this_.imageslist.push(varpicList[i].base64)
                        }
                        // debugger;
                        // this_.imageslist = thisimagelist;
                        //this_.updateview();
                        //const ViewerDom = document.getElementById("index");
                        // const viewer = new Viewer(ViewerDom, {});
                    } else {
                    }
                });
            }
        },
        created() {
            /// this.viewer({url:"data-original"});
            this.timerdoread();
            //this.updateview();
        },
        mounted() {
            // this.updateview();

        }
    };
</script>

<style scoped>
  /deep/ .form .el-input__inner {
    width: 200px !important;
  }


  li {
    margin-right: 15px;
    margin-bottom: 15px;
    width: 25%;
    height: 200px;
    display: inline-block;
  }
  li:hover{
    cursor: zoom-in;
  }
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

</style>
