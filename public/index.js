var socket;
var userId={};
$(document).on('click', '.panel-heading span.icon_minim', function (e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
        $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
        $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('focus', '.panel-footer input.chat_input', function (e) {
    var $this = $(this);
    if ($('#minim_chat_window').hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideDown();
        $('#minim_chat_window').removeClass('panel-collapsed');
        $('#minim_chat_window').removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('click', '#new_chat', function (e) {
    var size = $( ".chat-window:last-child" ).css("margin-left");
     size_total = parseInt(size) + 400;
    alert(size_total);
    var clone = $( "#chat_window_1" ).clone().appendTo( ".container" );
    clone.css("margin-left", size_total);
});
$(document).on('click', '.icon_close', function (e) {
    //$(this).parent().parent().parent().parent().remove();
    $( "#chatbox" ).hide();
});

// send function start

function send(){
	var chat = $("#btn-input").val(); 
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

    if (chat =="") {
        alert('Enter Message');
    } else
    {
        var msg={};
        msg['userId']=userId['userId'];
        msg['message']=chat;
        socket.emit("chat",msg);
        var body =  '<div class="row msg_container base_sent">' +
                        '<div class="col-md-10 col-xs-10 ">' +
                            '<div class="messages msg_sent">' +
                                '<p>'+ chat + '</p>'+
                            ' <time datetime="2009-11-13T20:00">Administrator • Today '+time+'</time>'+
                            '</div>' +
                        '</div>' +
                        '<div class="col-md-2 col-xs-2 avatar">' +
                            '<img class="chatimg" src="https://cheme.mit.edu/wp-content/uploads/2017/01/stephanopoulosgeorge-431x400.jpg" class=" img-responsive ">' +
                        '</div>' +
                    '</div>';
    }
    $(body).appendTo("#messagebody");
    $('#btn-input').val('');
    $("#messagebody").animate({ scrollTop: $("#messagebody")[0].scrollHeight}, 'slow');
}

function callOrder(){
    var data={};
    data['orderId']=$("#btn-order").val();
    data['userId']=userId['userId'];
    socket.emit("ORDER_STATUS",data);
}

// send function end

$( "#btn-chat" ).click(function() {
    send()
});

$("#btn-sub").click(function(){
    alert("Test");
})

$('#btn-input').keypress(function (e) {
  if (e.which == 13) {
    send()
  }
});

$(function(){
    socket=io.connect("http://localhost:8888");
    socket.on('sendUserId',function(data){
        console.log("Test: "+data);
        var rString = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
        socket.emit("setUserId",rString);
        userId['userId']=rString;
        
    })
    socket.on('chat',function(data){
        if(data=="ORDER_VALUE"){
            sendDialog();
        }else{
            var dt = new Date();
            var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
            var divToattach='<div class="row msg_container base_receive">'+
                '<div class="col-md-2 col-xs-2 avatar">'+
                    '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Rajesh_Gopinathan.jpg/220px-Rajesh_Gopinathan.jpg" class="chatimg img-responsive ">'+
                '</div>'+
                '<div class="col-md-10 col-xs-10">'+
                    '<div class="messages msg_receive">'+
                        '<p>'+ data + '</p>'+
                        '<time datetime="2009-11-13T20:00">Admin • Today '+time+'</time>'+
                    '</div>'+
                '</div>'+
            '</div>';
            $(divToattach).appendTo("#messagebody");
            $('#btn-input').val('');
            $("#messagebody").animate({ scrollTop: $("#messagebody")[0].scrollHeight}, 'slow');
        }
    })

    function sendDialog(){
        var dt = new Date();
        var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
        var divToattach='<div class="row msg_container base_receive">'+
            '<div class="col-md-2 col-xs-2 avatar">'+
                '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Rajesh_Gopinathan.jpg/220px-Rajesh_Gopinathan.jpg" class="chatimg img-responsive ">'+
            '</div>'+
            '<div class="col-md-10 col-xs-10">'+
                '<div class="messages msg_receive">'+
                    '<div class="input-group">'+
                        '<input id="btn-order" type="text" class="form-control input-sm chat_input" placeholder="Enter Order Number" required="required" />'+
                        '<span class="input-group-btn">'+
                        '<button class="btn btn-primary btn-sm" id="btn-sub" href="Javascript:void(0)" onclick="callOrder()">Submit</button>'+
                        '</span>'+
                    '</div>'+
                    '<time datetime="2009-11-13T20:00">Admin • Today '+time+'</time>'+
                '</div>'+
            '</div>'+
        '</div>';
        $(divToattach).appendTo("#messagebody");
        $('#btn-input').val('');
        $("#messagebody").animate({ scrollTop: $("#messagebody")[0].scrollHeight}, 'slow');
    }
    
})

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}