原插件只有提供单个文件上传demo，没有对多文件上传和git上传特别处理，所有我在原插件的基础上再次封装添加以下功能：
```html
 1.多文件上传
 2.多文件上传状态监听
 3.git文件分别处理
 4.上传大小限制
 5.上传个数限制
 6.多按钮上传
```
多文件上传功能依赖jquery，所以需要先引入jquery插件，后期有时间考虑用原生代替避免多引入一个文件

接着在页面中引入
```html
<script src="./dist/lrz.bundle.js"></script>
<script src="./dist/lrz_upload.js"></script>
```

# 如何使用

###demo参考test/demo.html
### 方式1:
js:
  createUpload({

     picker: "#picker",//上传按钮
     otherBtn: ["#j-addFile"], //新增上传按钮,暂时只能ID,这里默认是 ["#j-addFile"]
     maxLength: "5", //限制上传数量
     multiple: "false", //允许多选，㈠如果需要禁止多选去掉html文件上传标签的multiple="multiple"属性
     fileSingleSizeLimit: "2",//限制上传个数
     server:""//后端接口,
     successCallback: function(data, queue) {
            // 接收成功后返回的json格式
            console.log(data)
            //前端拦截失效，后端返回文件过大提示
            if (data.error = "oversize") {
                alert("文件过大");
                //删除DOM
                $("#" + data.fileId).remove();
                //删除队列
                delete fileArray[data.fileId];
                //重置上传文件input
                $("#file").val("");
            }

        },
    delefileCallback:function(data){
     // 接收删除的文件对象
     console.log(data)
    },
    errorCallback:function(data){
     //失败文件的标识id,和加入上传后的dom id一致,具体查看对应的上传文件后添加的dom
     console.log(data)
    }
   
});

git文件如果小于150k原文件上传，超过150k通过canvas压缩成jpeg上传，如果需要修改看源代码，暂时不对外提供接口
更多可修参数查看test/lrz_upload.js文件，多余参数会后续删除

html[HTML结构可自行修改，这里不做解释]:
```html
       <div class="up_box" id="hasUpList">
         <div class="up_list  last" id="picker">
            <span class="vertal"></span>
            <span class="horizontal"></span>
        </div>
        <div class="up_tip" id="up_tip">
            上传文件失败
        </div>
    </div>
    <input type="file" name="file" id="file" multiple="multiple" accept="image/*" style="display:none">㈠
```


#原插件参考以下：
# 后端处理

[后端处理请查看WIKI。](https://github.com/think2011/localResizeIMG/wiki)


# API

[具体参数说明请查看WIKI。](https://github.com/think2011/localResizeIMG/wiki)

# 兼容性

IE10以上及大部分非IE浏览器（chrome、微信什么的）

# FAQ

[有疑问请直接在 issues 中提问](https://github.com/think2011/localResizeIMG/issues)

```
请一定记得附上以下内容：💡
请一定记得附上以下内容：🙈
请一定记得附上以下内容：💡

平台：微信..
设备：iPhone5 IOS7..
问题：问题描述呗..
```

* Q：能否提供完整的一套UI?
* A：暂时定位是作为纯粹的处理插件，或许会考虑开发一整套UI。

* Q：有时拍摄完照片后，页面自动刷新或闪退了。
* A：虽然已作了优化处理，但内存似乎还是爆掉了，常见于低配android手机，建议每次只处理一张图片。

* Q: 怎么批量上传图片?
* A: 您可以自己写个循环来传入用户多选的图片，但在移动端上请谨慎处理，原因同上。

* Q: 直接传入图片路径的无法生成图片
* A: 可能是跨域的问题，具体请看[CORS_enabled_image](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image)

* Q: 想要商用可以吗？
* A: 没问题，但请留意issue里已知的问题。

# 开发

[想要参与 or 自己定制 or 了解源码请点击这里，逻辑和说明](https://github.com/think2011/localResizeIMG/wiki/3.-%E6%BA%90%E7%A0%81%E9%80%BB%E8%BE%91)

# 感谢

* @dwandw
* @yourlin
* @wxt2005

以上在之前的版本帮忙参与维护的朋友，以及提出问题的朋友们，真的真的很感谢你们。：D
