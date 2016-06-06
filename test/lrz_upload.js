function createUpload(opt) {
    var defaultOpt = {
        picker: '#picker', //上传按钮名
        otherBtn: ["#j-addFile"], //只能ID
        file_input: "#file", //上传文件input,只接受Id
        uploaderName: "upload", //上传对象名
        maxLength: 2, //限制上传数量
        multiple: "true", //允许多选
        fileSingleSizeLimit: 1, //上传文件最大限制，
        server: "这里是上传接口", //上传图片接口

        /*放置uploadDom的最外层*/
        wrapDom: "#hasUpList",
        /*已经上传后添加的dom列表的class*/
        uploadDomClass: ".j-up_list",
        /*添加的dom*/
        uploadDom: '<div class="up_list j-up_list">' +
            '<span class="dele j-dele">X</span>' +
            '<span class="prepres j-progres">' +
            '<span></span>' +
            '</span>' +
            '<div class="img"><span class="txt">上传中</span></div>' +
            '<input type="hidden" value="" name="file_url" class="file_url_placeholer"/>' +
            '</div>',
        /*添加后dom的索引*/
        uploadDomIndex: 0,
        /*删除按钮*/
        dele: ".j-dele",
        progress: ".j-progres",
        uploadImg: ".img",
        txt: ".txt",
        //填充上传图片对应src input的name
        uploadImgUrl: "file_url",
        //填充上传图片对应src input的class，也可以在successCallback里面保存到指定input里面
        uploadImgUrlClass: "file_url",
        tipImg: "/static/img/imgLimit.png",
        width: "",
        height: 950,
        quality: 0.7,
        successCallback: function() {}, //成功回调
        delefileCallback: function() {} //删除回调
    }

    var opts = $.extend({}, defaultOpt, opt),
        picker = opts.picker,
        otherBtn = opts.otherBtn,
        file_input = opts.file_input,
        multiple = opts.multiple,
        uploaderName = opts.uploaderName,
        maxLength = opts.maxLength,
        fileSingleSizeLimit = opts.fileSingleSizeLimit,
        server = opts.server,
        swfSrc = opts.swfSrc,
        wrapDom = opts.wrapDom,
        /*列表外层dom*/
        listDom = opts.uploadDomClass,
        /*上传完成后添加的dom的class*/
        uploadDom = opts.uploadDom,
        /*上传完成后添加的dom字符串*/
        uploadDomIndex = opts.uploadDomIndex,
        /*刚刚完成上传的索引*/
        dele = opts.dele,
        /*删除已经上传的按钮*/
        uploadDomClass = opts.uploadDomClass,
        progress = opts.progress,
        /*上传进度条*/
        uploadImg = opts.uploadImg,
        /*显示已经上传图片div的class*/
        txt = opts.txt,
        /*上传完成前的提示元素的 class*/
        uploadImgUrl = opts.uploadImgUrl,
        /*存放图片路径的input的name*/
        uploadImgUrlClass = opts.uploadImgUrlClass,
        /*存放图片路径的input的class*/
        tipImg = opts.tipImg,
        width = opts.width,
        height = opts.height,
        quality = opts.quality,
        /*提示弹窗的图片路径*/
        successCallback = opts.successCallback, //成功回调
        delefileCallback = opts.delefileCallback; //删除回调


    var fileUrlString = ""; //添加成功的文件路径拼接
    var fileListArray = []; //已经上传了的图片列表,每次上传都会重置为0
    var fileListArray_all = {}; //每次上传都会累积的图片列表，防止重复上传图片
    var fileIndex = 0; //上传文件的索引,每次上传都会重置为0
    //把不重复递增的文件ID
    var autoID = 0;
    //添加点击触发上传按钮点击事件

    $(picker).click(function() {
        var d = file_input.substr(1);
        document.getElementById(d).click();
    })
    for (var i = 0; i < otherBtn.length; i++) {
        $(otherBtn[i]).click(function() {
            var d = file_input.substr(1);
            document.getElementById(d).click();
        })
    }

    //上传图片表单值被修改时候-----------------------------
    document.querySelector(file_input).addEventListener('change', function() {
        fileListArray = [];
        fileIndex = 0;
        var Filequeue = this.files;
        var limitLen=null;

        if (Filequeue.length) {
            //限制长度
            if(Filequeue.length<maxLength){
              limitLen=Filequeue.length-1;
            }
            else{
                limitLen=maxLength;
            }
            for (var i = 0; i <limitLen; i++) {

                //判断已经上传的队列是否包含新添加的文件
                var inObject = function() {
                        var d = true;
                        for (var b in fileListArray_all) {
                            if (fileListArray_all[b].name == Filequeue[i].name && fileListArray_all[b].size == Filequeue[i].size) {
                                d = false;
                            }
                        }
                        return d;
                    }
                    //如果没有在现有永久队列中，就添加到队列
                    //console.log(inObject())
                if (inObject()) {
                    autoID++;
                    if (Filequeue[i].type == "image/gif" && Filequeue[i].size / 1024 < 150) {
                        var fmDATA = formatData(Filequeue[i])
                        fileListArray.push({ file: fmDATA, fileID: "FILE_id_" + autoID, imgType: "git" });
                    } else {
                        //添加到临时队列
                        fileListArray.push({ file: Filequeue[i], fileID: "FILE_id_" + autoID, imgType: "Other" });

                    }
                    //添加到永久队列
                    fileListArray_all["FILE_id_" + autoID] = Filequeue[i];

                }

            }
            // console.log(fileListArray);
            imgManage(fileIndex);

        }
    })

    //图片压缩处理-----------------------------------
    function CreateCavansURL(index) {
        console.log("li的index:" + index)
        lrz(fileListArray[index].file, { height: height, width: width, quality: quality })
            .then(function(rst) {
                var img = new Image();
                img.src = rst.base64;

                if (rst.fileLen > parseInt(fileSingleSizeLimit) * 1024 * 1024) {
                    reject(error);
                }
                beforeUploadImgAddDom(index);
                return rst;

            })
            .then(function(rst) {
                SendData(rst, index)
                return rst;
            }, function() {
                if (typeof commenApi != "undefined") {
                    commenApi.alertTip({
                        tit: "图片上传提示",
                        cnt: "文件过大,请上传" + fileSingleSizeLimit + "M以下的图片"
                    });
                } else {
                    alert("上传文件过大,请上传" + fileSingleSizeLimit + "M以下的图片");
                }
            }).always(function(rst) {
                var completeIndex = null;
                var fileId = fileListArray[index].fileID;
                $(wrapDom).find(listDom).each(function(index, elem) {
                    if ($(this).attr("id") == fileId) {
                        completeIndex = index;
                    }
                })
                $(wrapDom).find(listDom).eq(completeIndex).find(progress).hide();
            });
    }
    //gif格式化数据-----------------------------------------------------
    function formatData(data) {
        var formData = new FormData();
        formData.append("file", data);
        return formData;
    }
    //上传到后端前添加dom-------------------------------------------------
    function beforeUploadImgAddDom(index) {
        $(picker).before(uploadDom);
        var fileId = fileListArray[index].fileID;
        var uploadDomIndex = $(wrapDom).find(uploadDomClass).length - 1;
        $(wrapDom).find(uploadDomClass).eq(uploadDomIndex).attr("id", fileId);
        $(wrapDom).find(".file_url_placeholer").attr("name", uploadImgUrl).addClass(uploadImgUrlClass)
            //判断文件是否已上传最大数
        if ($(wrapDom).find(uploadDomClass).length >= maxLength) {
            $(wrapDom).find(picker).hide();
        }
    }
    //图片处理配适器----------------------------------------------
    function imgManage(index) {
        //如果imgType是gif就跳过图片压缩直接发送数据给后端
        if (fileListArray[index].imgType == "git") {
            beforeUploadImgAddDom(index);
            SendData("0", index)
        } else {
            CreateCavansURL(index);
        }
    }
    //上传成功状态同步DOM
    function statusSuccess(fileId,formDatas) {
        $(wrapDom).find(listDom).each(function(index) {
            if ($(this).attr("id") == fileId) {
                successIndex = index;
            }
        })
        $(wrapDom).find(listDom).eq(successIndex).find(txt).hide();
        $(wrapDom).find(listDom).eq(successIndex).find(uploadImg).css("background-image", "url(" + formDatas.url + ")");
        $(wrapDom).find(listDom).eq(successIndex).find(dele).css("display", "block");
        $(wrapDom).find(listDom).eq(successIndex).find("." + uploadImgUrlClass).val(formDatas.filename);
    }
    //上传成功状态同步DOM
    function statusError(fileId) {
        var errorIndex = null;
        $(wrapDom).find(listDom).each(function(index, elem) {
            if ($(this).attr("id") == fileId) {
                errorIndex = index;
            }
        })
        $(wrapDom).find(listDom).eq(errorIndex).find(txt).html("上传失败");
        $(wrapDom).find(listDom).eq(errorIndex).find(dele).css("display", "block");
        $(wrapDom).find(listDom).eq(errorIndex).find(progress).hide();
    }
    //发送base64数据-------------------------------------
    function SendData(rst, index) {
        var fileId = fileListArray[index].fileID;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', server);
        xhr.onload = function(data) {
            if (xhr.status === 200) {
                var formDatas = JSON.parse(data.target.responseText);
                var successIndex = null;
                // console.log(formDatas)
                // console.log(fileListArray.length)
                if (fileIndex < fileListArray.length - 1) {
                    fileIndex++;
                    // console.log("ajax后的index:" + fileIndex)
                    imgManage(fileIndex);
                    // console.log(fileIndex)
                }
                statusSuccess(fileId,formDatas);
                //拼接已经上传的图片路径
                if (fileUrlString.length == 0) {
                    fileUrlString += formDatas.url;
                } else {
                    fileUrlString += "," + formDatas.url;
                }
                //可以通过回调把上传成功的图片路径塞到指定input
                successCallback(fileUrlString);
            } else {
                // 处理其他情况
                if (fileIndex < fileListArray.length - 1) {
                    fileIndex++;
                    CreateCavansURL(fileIndex)
                        // console.log(fileIndex)
                }
                if (typeof commenApi != "undefined") {
                    commenApi.alertTip({
                        tit: "图片上传提示",
                        cnt: "上传失败"
                    });
                } else {
                    alert("上传失败")
                }
                statusError(fileId);
            }
        };

        xhr.onerror = function(e) {
            //即使失败，上传序列还是要继续执行
            if (fileIndex < fileListArray.length - 1) {
                fileIndex++;
                imgManage(fileIndex);
            }
            if (typeof commenApi != "undefined") {
                commenApi.alertTip({
                    tit: "图片上传提示",
                    cnt: "上传失败"
                });
            } else {
                alert("上传失败")
            }
            statusError(fileId);
        };

        xhr.upload.onprogress = function(e) {
            var percentComplete = ((e.loaded / e.total) || 0) * 100;
            var progressIndex = null;
            $(wrapDom).find(listDom).each(function(index, elem) {
                if ($(this).attr("id") == fileId) {
                    progressIndex = index;
                }
            })
            $(wrapDom).find(listDom).eq(progressIndex).find(".j-progres span").css("width", (((e.loaded / e.total) || 0) * 100) + "%")
        };
        //区分超过指定体积的git上传和其他格式上传----------------------------
        if (rst == "0") {
            xhr.send(fileListArray[index].file);
        } else {
            // 添加参数
            rst.formData.append('fileLen', rst.fileLen);
            //触发上传
            xhr.send(rst.formData);
        }
    }


    //删除---------------------------------------------------
    $(wrapDom).on("click", dele, function() {
        delefileCallback($(wrapDom).find(uploadDomClass).index($(this).parents(uploadDomClass)));
        var fileID = $(this).parents(uploadDomClass).attr("id");
        // console.log(fileListArray_all)
        delete fileListArray_all[fileID];
        // console.log(fileListArray_all)
        $(file_input).val("");
        $(this).parents(uploadDomClass).remove();
        if ($(wrapDom).find(uploadDomClass).length < maxLength) {
            $(wrapDom).find(picker).show();
        }
    })
}
