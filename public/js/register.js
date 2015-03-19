$(function() {
  $("input").on("input", function() {
    $("button").attr("disabled", "");
    $("button").addClass("disabled");
    var snum = $("input[name='inputNumber']").val().toLowerCase();
    if(snum.match(/^[a-z][0-9]{2}[0-9a-z].[0-9]{3}$/)) {
      if($("input[name='inputName']").val() !== "") {
        $("button").removeClass("disabled");
        $("button").removeAttr("disabled");
      }
    }
  });
  $("input[name='inputNumber']").blur(function() {
    $(this).val($(this).val().toLowerCase());
  });

});
