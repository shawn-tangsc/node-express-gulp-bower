# gulp+node+express+bower 脚手架

### 抱歉
该项目是我很久之前搭建的一个gulp+node+express+bower 脚手架 ，当时没有落下搭建的文档，所以现在基本也忘记了，但是这个项目在开发jquery+bootstrap的项目时，还是比较有用的，虽然现在已经没啥用了，不过丢了还是比较可惜的，我就上传github保存了。

### 执行说明

* 开发中，直接gulp就可以开发了

	```
	gulp 
	```
	默认会启动一个http://localhost:4000的端口来做热部署开发服务器
	
### 开发

* 开发中，你需要讲html文件放在views放在views文件夹下开发，
* js文件放在src下的js文件夹下开发
* sass文件放在src下的sass文件夹下开发
* src下的文件会在开发中热部署的方式动态的更新到views文件夹下public文件夹
* 如果在前端开发中，发现需要依赖一些三方库，你可以通过bower来管理前端的依赖，依赖会自动打包到views/public/lib目录下。开发中直接引入就行了。
* 页面开发，可以通过目录结构直接在http://localhost:4000后跟上你views里面的目录结构来访问页面，也可以通过express的route来指定。
* 就这样了。。。。