(function () {
    //存放各层待请求队列集合
    var watingRequest = [];

    //各层待请求队列当前长度
    var watingLength = [];

    //第一次请求队列
    var arrUrlFirst =
        [
            "https://www.pixivacg.com/pzzc/pxvzc/page/7",
            "https://www.pixivacg.com/pzzc/pxvzc/page/8",
            "https://www.pixivacg.com/pzzc/pxvzc/page/9",
            "https://www.pixivacg.com/pzzc/pxvzc/page/10",
            "https://www.pixivacg.com/pzzc/pxvzc/page/11"
        ]

    //各层选择器信息,下潜3层
    const arrSelector =
        [
            {
                parent: "class___b2_gap___0",
                children: "class___post-list-item",
                flower: "tag___A___0___href"
            }, {
                parent: "class___entry-content___0",
                children: "class___wp-caption",
                flower: "tag___IMG___0___src"
            }
        ]





    //总需潜入层数
    const intDiving = arrSelector.length;

    //当前潜入层
    var j = 0;

    //放入待请求队列集合
    watingRequest.push(arrUrlFirst);

    //记录队列长度
    watingLength.push(arrUrlFirst.length);

    //最终结果集
    var finalResult = [];

    //蜘蛛主程序
    function spider() {
        //请求队列中的一项
        ajax({
            url: watingRequest[j][0],
            type: "GET",
            sync: true,
            responseType: "document",
            success: function (xhr) {
                //获得伪DOM
                var _document = xhr.responseXML.documentElement;
                //获得当前三项选择器信息
                var nowSelector = arrSelector[j];
                //三项选择器
                var parent = null;
                var children = null;
                var flower = null;
                //临时结果url队列
                var ArrUrl = [];
                //获得父级
                var parentMegs = nowSelector.parent.split("___");
                switch (parentMegs[0]) {
                    case "id": parent = _document.getElementById(parentMegs[1]); break;
                    case "class": parent = _document.getElementsByClassName(parentMegs[1])[parentMegs[2]]; break;
                    default: alert("parent空缺！");
                }

                //获得子级
                var childrenMegs = nowSelector.children.split("___");
                switch (childrenMegs[0]) {
                    case "class": children = parent.getElementsByClassName(childrenMegs[1]); break;
                    case "tag": children = parent.getElementsByTagName(childrenMegs[1]); break;
                    default: alert("children空缺！");
                }

                //仅获得目标信息
                var flowerMegs = nowSelector.flower.split("___");
                switch (flowerMegs[0]) {
                    case "class": getArrUrlByClass(); break;
                    case "tag": getArrUrlByTag(); break;
                    default: alert("flower空缺！");
                }

                function getArrUrlByClass() {
                    for (var i = 0; i < children.length; i++) {
                        //获得目标dom
                        flower = children[i].getElementsByClassName(flowerMegs[1])[flowerMegs[2]];
                        try {
                            var url = flower.getAttribute(flowerMegs[3]);
                        }
                        catch (err) {
                            console.log("异常名：" + err.name);
                            console.log("异常信息：" + err.message);
                        }
                        if (url != '' && url != ' ' && url != undefined && url != null) {
                            ArrUrl.push(url);
                        } else {
                            console.log("链接可能为空或undefined，href/src/url/link：" + url);
                        }
                    }
                }

                function getArrUrlByTag() {
                    for (var i = 0; i < children.length; i++) {
                        //获得目标dom
                        flower = children[i].getElementsByTagName(flowerMegs[1])[flowerMegs[2]];
                        try {
                            var url = flower.getAttribute(flowerMegs[3]);
                        }
                        catch (err) {
                            console.log("异常名：" + err.name);
                            console.log("异常信息：" + err.message);
                        }
                        if (url != '' && url != ' ' && url != undefined && url != null) {
                            ArrUrl.push(url);
                        } else {
                            console.log("链接可能为空或undefined，href/src/url/link：" + url);
                        }
                    }
                }

                //没有成功获取url队列的话
                if (ArrUrl.length == 0) {
                    alert("队列为空！");
                    console.log(xhr);
                    console.log(_document);
                    console.log(arrSelector[j]);
                    console.log(ArrUrl);
                } else {
                    //alert("成功获取队列！");
                    //console.log(_document);
                    //console.log(arrSelector[j]);
                    //console.log(ArrUrl);
                }

                //删除上一步请求过的第一项url
                watingRequest[j].shift();   //用于清除[[a,b,c...],[a,b,c,...]]中的数据a,b,c

                //是目标队列
                if ((j + 1) == intDiving) {
                    //获取名称
                    var strName = "_";
                    for (var i = 0; i <= j; i++) {
                        strName += (watingLength[i] - watingRequest[i].length) + "_";
                    }

                    /**
                     * 获取到图片链接
                     */
                    //1.直接下载
                    /*
                    console.log(ArrUrl);
                    */
                    for (var i = 0; i < ArrUrl.length; i++) {
                        var imgName = strName + (i + 1) + ".jpg";
                        var imgUrl = ArrUrl[i];
                        //downloadPicture(imgName,imgUrl);
                        console.log("下载了: " + strName + (i + 1) + ".jpg" + " :" + ArrUrl[i]);  //后缀动态生成
                    }

                    //2.添加到最终下载集合（推荐）
                    /*
                    for(var i=0;i<ArrUrl.length;i++){
                        finalResult.push(ArrUrl[i]);
                    }
                    */
                    if (watingRequest[j].length != 0) {
                        //继续本级
                        spider();
                    } else {

                        //删除最后的空数组
                        //watingRequest.pop(); //放到206行处

                        console.log("判断是否完成前的j和队列:");
                        console.log(j);
                        console.log(JSON.stringify(watingRequest));

                        //判断是否完成
                        function isEnd() {
                            for (var i = j; i >= 0; i--) {
                                if (watingRequest[i].length != 0) {
                                    j = i;//任务队列集中最靠后的长度不为0的任务队列索引
                                    return false;
                                } else {
                                    watingRequest.pop();  //用于清除[[a,b,c...],[a,b,c...],[]]中的空数组[]
                                }
                            }
                            return true;
                        }
                        var end = isEnd();

                        console.log("判断是否完成后的j和队列:");
                        console.log(j);
                        console.log(JSON.stringify(watingRequest));


                        //watingRequest[j-1]==0&&watingRequest[j-2]==0&&...&&watingRequest[0]==0;(.length)
                        if (end) {
                            alert("程序结束。");
                            console.log("程序结束，任务队列如下");
                            console.log(watingRequest);
                            return;
                        } else {
                            //回退x级
                            //alert("回退级、当前j:"+j+" 当前watingRequest长:"+watingRequest.length);
                            spider();
                        }
                    }
                } else {
                    //alert("目标不是"+j+"层！");
                    //放入待请求队列集合
                    watingRequest.push(ArrUrl);

                    //记录队列长度
                    watingLength.push(ArrUrl.length);

                    j++;
                    spider();
                }
            },
            error: function (xhr) {
                alert(xhr.status + ":ajax请求" + this.url + "失败！");
                console.log(xhr);
            }
        })

        /*
        console.log(watingRequest[0][0]);
        watingRequest[0].shift();
        console.log(watingRequest[0][0]);
        */
    }

    //启动蜘蛛程序
    spider();


    //ajax工具函数
    function ajax(obj) {
        var xhr = null;
        if (window.XMLHttpRequest) {
            xhr = new window.XMLHttpRequest();
        } else {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhr.responseType = obj.responseType;
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            if (xhr.status == 200) {
                obj.success(xhr);
            } else {
                obj.error(xhr);
            }
        }
        xhr.open(obj.type, obj.url, obj.sync);
        xhr.send();
    }

    //工具函数4 下载图片(待完善)
    function downloadPicture(imgName, imgUrl) {
        //        return new Promise(function(resolve,reject){
        var anchor = document.createElement("A");
        anchor.href = imgUrl;
        anchor.download = imgName;
        anchor.target = "_blank";
        document.body.appendChild(anchor);
        anchor.click();


        //给单个图片下载任务分配0.5s
        //            setTimeout(function(){
        //                resolve();
        //            },500)
        //        })
    }

})()