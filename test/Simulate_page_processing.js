(function(){
    var j=0;
    
    //运行环境:http://www.xxx.com/keai/index_4.htm
    var arrSelector=[
        {
            range:[],
            parent:"class___list___0",
            girls:"tag___LI",
            flower:"tag___IMG___0___src"
        }
    ]
    //注:class___list___0:bug 如果class="list_"||class="list__"等则会出错，解决很易
    
    //以运行环境页为请求到的页面，模拟页面数据处理
    function handleComplete(para_arrSelector){
        var nowSelector=para_arrSelector[j];
        var parent=null;
        var girls=null;
        var flower=null;
        
        //结果url队列
        var arrUrl=[];
        
        //获得父级
        var parentMegs=nowSelector.parent.split("___");
        switch(parentMegs[0]){
            case "id":parent=document.getElementById(parentMegs[1]);break;
            case "class":parent=document.getElementsByClassName(parentMegs[1])[parentMegs[2]];break;
            default: alert("父级空缺！");
        }
        
        //获得子级
        var girlsMegs=nowSelector.girls.split("___");
        switch(girlsMegs[0]){
            case "class":girls=parent.getElementsByClassName(girlsMegs[1]);break;
            case "tag":girls=parent.getElementsByTagName(girlsMegs[1]);break;
            default: alert("girls空缺！");
        }
        
        //仅获得目标信息
        var flowerMegs=nowSelector.flower.split("___");
        switch(flowerMegs[0]){
            case "class":getArrUrlByClass();break;
            case "tag":getArrUrlByTag();break;
            default: alert("flower空缺！");
        }
        function getArrUrlByClass(){
            for(var i=0;i<girls.length;i++){
                //获得目标dom
                flower=girls[i].getElementsByClassName(flowerMegs[1])[flowerMegs[2]];
                arrUrl.push(flower.getAttribute(flowerMegs[3]));
                console.log(flower.getAttribute(flowerMegs[3]));
            }
        }
        function getArrUrlByTag(){
            for(var i=0;i<girls.length;i++){
                //获得目标dom
                flower=girls[i].getElementsByTagName(flowerMegs[1])[flowerMegs[2]];
                arrUrl.push(flower.getAttribute(flowerMegs[3]));
                console.log(flower.getAttribute(flowerMegs[3]));
            }
        }
        //console.log(arrUrl);
    }
    
    handleComplete(arrSelector);
})()