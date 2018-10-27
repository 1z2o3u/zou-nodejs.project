
var page=1;
var pageSize=2;
$(function(){
    getList();
    loading();
    $('#addPhone').click(function(){
    $('.add_wrap').show();
  })
  $('#cancel').click(function(){
  $('.add_wrap').hide();
  })
    // 添加品牌
    $('#add').click(function(){
        $('.add_wrap').hide();
        var formData = new FormData();
        formData.append('brandName',$('#phoneName').val());
        formData.append('brandImg',$('#phoneImg')[0].files[0]);
        $.ajax({
            url:'/brand/add',
            method:'post',
            data:formData,
            contentType:false,
            processData:false,
            success:function(results){
                loading();
                console.log(results);
            },
            error:function(){

            }
        })  
        
    })
})    
// 分页
function getList(){
    $.get('/brand/list',{  
    page:page,
    pageSize:pageSize
},function(result){
    $('.on').html("第"+page+"页");
    $('.prev').click(function(){
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

function loading(){
    $.get('/brand/list',{  
        page:page,
        pageSize:pageSize
    },function(result){
        var list=result.data.list;
        var str='';
        for(var i=0;i<list.length;i++){
            str+=`
            <tr class="tr">
                <td>${list[i]._id}</td>
                <td><img src="/brands/${list[i].phoneHref}"> </td>
                <td class="aa"> ${list[i].brandName}</td> 
                <td><span class="modify">修改</span>/<a href="#" class="del">删除</a></td>
            </tr> `  ;
        }
        $('tbody').html(str);
        
    }  
    )}
    