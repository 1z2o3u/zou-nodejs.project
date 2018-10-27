
var page=1;
var pageSize=2;

function getList(){
    $.get('/phone/list',{  
    page:page,
    pageSize:pageSize
},function(result){
    var list=result.data.list;
    var str='';
    for(var i=0;i<list.length;i++){
        str+=`
        <tr>
            <td class="OneTd">${list[i]._id}</td>
            <td><img src="/phones/${list[i].phoneHref}"> </td>
            <td class="aa"> ${list[i].phoneName}</td> 
            <td> ${list[i].phoneBrand}</td> 
            <td> ${list[i].phonePrice}</td>   
            <td> ${list[i].recoverPrice}</td> 
            <td><span class="modify">修改</span>/<a href="#" class="del">删除</a></td>
    
        </tr> `  ;

    }
    $('tbody').html(str);
    $('.modify').click(function(){
        $('.update').show();
        var id= $(this).parent().parent().children().eq(0).html();
        $('#id').val(id);
      })
      $('.cancel').click(function(){
        $('.update').hide();
      })

    // 分页处理
    $('.on').html("第"+page+"页");
    $('.prev').click(function(){
             // alert(1);
            if(page<=1){
              page=1;
            }else{page--;}
           
            $('.on').html("第"+page+"页");
            loading();
    }),
    $('.next').click(function(){
        if(page>=result.data.totalPage){
        page=result.data.totalPage
        }else{page++;}
        console.log(page)
        $('.on').html("第"+page+"页");
        loading();
    })                     
})
}   

$(function(){
                getList();
                select();  
            $('#addPhone').click(function(){
              $('.add_wrap').show();
            })
            $('#cancel').click(function(){
            $('.add_wrap').hide();
            })
            // 添加手机
            $('#add').click(function(){
                $('.add_wrap').hide();
                var formData = new FormData();
                // formData.append('id',$('#id').val());
                formData.append('phoneName',$('#phoneName').val());
                formData.append('phoneBrand',$('#phoneBrand').val());
                formData.append('phonePrice',$('#phonePrice').val());
                formData.append('recoverPrice',$('#recoverPrice').val());
                formData.append('phoneImg',$('#phoneImg')[0].files[0]);
                $.ajax({
                    url:'/phone/add',
                    method:'post',
                    data:formData,
                    contentType:false,
                    processData:false,
                    success:function(results){
                        getList(); 
                    console.log(results);
                    },
                    error:function(){

                    }
                })  
                
            })
            // 修改
            $('.add').click(function(){
                $('.update').hide();
                var formData = new FormData();
                formData.append('phoneName',$('.phoneName').val());
                formData.append('id',$('#id').val());
                formData.append('phoneBrand',$('.phoneBrand').val());
                formData.append('phonePrice',$('.phonePrice').val());
                formData.append('recoverPrice',$('.recoverPrice').val());
                formData.append('phoneImg',$('.phoneImg')[0].files[0]);
                $.ajax({
                    url:'/phone/update',
                    method:'post',
                    data:formData,
                    contentType:false,
                    processData:false,
                    success:function(results){
                        getList(); 
                    console.log(results);
                    },
                    error:function(){
                    }
                }) 
            })
    
        // 删除 
        $('tbody').on("click","a",function(event){
            var target = $(event.target);
            var id= target.parent().parent().children().eq(0).html()
            //  alert(id)
             $.get('/phone/del',{
                     id:id
                 },
                 function(results){
                    getList(); 
             })   
         })          
})
    

function loading(){
$.get('/phone/list',{  
    page:page,
    pageSize:pageSize
},function(result){
    var list=result.data.list;
    var str='';
    for(var i=0;i<list.length;i++){
        str+=`
        <tr class="tr">
            <td>${list[i]._id}</td>
            <td><img src="/phones/${list[i].phoneHref}"> </td>
            <td class="aa"> ${list[i].phoneName}</td> 
            <td> ${list[i].phoneBrand}</td> 
            <td> ${list[i].phonePrice}</td>   
            <td> ${list[i].recoverPrice}</td> 
            <td><span class="modify">修改</span>/<a href="#" class="del">删除</a></td>
        </tr> `  ;
    }
    $('tbody').html(str);
    
}  
)}

 //     <td class="lastTd">
        //     ${newArr[page-1][i]}
        // </td>

        // 加载下拉列表

        function select(){
            $.get('/brand/add_select',function(results){
                // console.log(results,"aaaaaaaaaaaa")
                var str="";
                for(var i=0;i<results.length;i++){
                    str+=`<option>${results[i].brandName}</option>`
                }
                $('select').html(str);
            })
        }


        // 序号处理

        function order(){
            var Conunt = result.data.count.num;
            var arr =[];
            for(var i =1;i<Conunt+1;i++){
                arr.push(i)
            }
            console.log(arr)
        
            let baseArray = arr;
            let len = baseArray.length;
            let n = 2; //假设每行显示4个
            let lineNum = len % 2 === 0 ? len / 2: Math.floor( (len / 2) + 1 );
            let newArr = [];
            for (let i = 0; i < lineNum; i++) {
                let temp = baseArray.slice(i*n, i*n+n);
                newArr.push(temp);
            }
        
            console.log(newArr)
        }