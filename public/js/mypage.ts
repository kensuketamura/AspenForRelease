///<reference path="../../typings/jquery/jquery_plugins.d.ts" />
///<reference path="../../typings/config/config.d.ts" />

$(function(){
  $('#myDataTable').tablesorter();
  
  $(".subjectInList").bind("click", function() {
    var subjectId = $(this).parent().attr("id");
    location.href = Config.basePath + "/editor/" + subjectId;
  });
});
