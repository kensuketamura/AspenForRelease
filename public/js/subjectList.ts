///<reference path='../../typings/jquery/jquery_plugins.d.ts'/>
///<reference path='../../typings/config/config.d.ts'/>

$(function(){
  $(".subjectInList").bind("click", function() {
    var subjectId = $(this).attr("id");
    location.href = Config.basePath + "/subject/"+ subjectId;
  });
});
