

#### 前端安装

1. 下载源码

    git clone https://gitee.com/liuge1988/kitty-ui.git

2. 编译代码

    进入项目根目录，执行 npm install, 下载和安装项目相关依赖包。

3. 启动系统

    执行 npm run dev 命令，启动项目，通过 http://localhost:8090 访问。

4. 项目打包

    执行 npm run build 命令，启动打包，完成之后会生成 dist 目录。

5. Mock 开关

    通过修改src/mock/index.js中的openMock变量，可以一键开启或关闭Mock功能。

6. 修改配置

    如果想自定义端口（默认是8090），可以修改 config/index.js 下的 port 属性。

    后台接口和备份服务器地址配置在 src/utils/global.js，如有修改请做相应变更。

Quick setup — if you’ve done this kind of thing before
or	
git@github.com:zhangtingfeng/vueAdmin.git
Get started by creating a new file or uploading an existing file. We recommend every repository include a README, LICENSE, and .gitignore.

…or create a new repository on the command line
   

echo "# vueAdmin" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:zhangtingfeng/vueAdmin.git
git push -u origin main


…or push an existing repository from the command line
git remote add origin git@github.com:zhangtingfeng/vueAdmin.git
git branch -M main
git push -u origin main
…or import code from another repository
You can initialize this repository with code from a Subversion, Mercurial, or TFS project.

