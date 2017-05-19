/**
 * Created by Administrator on 2017/4/27.
 */
//添加每日一题
function login() {
    var data = $('#login_form').serializeArray();
    $('#sub_btn').text('正在登录...').attr("disabled",true);
    $.ajax({
        type: "post",
        url: "login",
        data: data,
        dataType: "json",
        success: function(res){
            if (res.errno == 0) {
                setTimeout(function () {
                    window.location.href = '/';
                },1000);
            } else {
                $('#sub_btn').text('登录').removeAttr('disabled');
                alert(res.errmsg);
            }
        },
        error:function () {
            alert('网络发生错误');
            $('#sub_btn').text('登录').removeAttr('disabled');
        }
    });
}