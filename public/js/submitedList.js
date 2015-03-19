///<reference path='../../typings/jquery/jquery_plugins.d.ts'/>
var studentListFlag = false;
var subjectListFlag = false;
var targetStudentNumber;
var targetSubjectId;
var allData;
$(function () {
    $("#allDataTable").tablesorter();
    allData = $("tbody>tr");
    targetStudentNumber = -1;
    targetSubjectId = -1;
    $(".submitedInList").bind("click", function () {
        var subjectId = $(this).attr("subjectId");
        var userId = $(this).attr("userId");
        window.open(Config.basePath + "/user/" + userId + "/subject/" + subjectId, '', 'scrollbars=yes,Width=800,Height=800');
    });
    $(".search-panel-group > span").bind("click", function () {
        var id = $(this).attr("id");
        SearchPanelAction(id);
    });
    $(".search-panel-content").bind("click", function () {
        var id = $(this).attr("id");
        switch (id) {
            case "student-content":
                $(".student-head").text($(this).text());
                targetStudentNumber = $(this).attr("number");
                break;
            case "subject-content":
                $(".subject-head").text($(this).text());
                targetSubjectId = $(this).attr("number");
                break;
        }
        for (var i = 0; i < allData.length; i++) {
            $(allData[i]).css("display", "");
            if ($(allData[i]).attr("studentNumber") != targetStudentNumber && targetStudentNumber != -1) {
                $(allData[i]).css("display", "none");
            }
            if ($(allData[i]).attr("subjectId") != targetSubjectId && targetSubjectId != -1) {
                $(allData[i]).css("display", "none");
            }
        }
        console.log(id);
        var splitId = id.split("-");
        id = splitId[0];
        SearchPanelAction(id);
    });
});
function SearchPanelAction(id) {
    switch (id) {
        case "student":
            if (studentListFlag) {
                studentListFlag = false;
                $("span[id='student']").css("transform", "rotate(0deg)");
                $(".student-head").css("margin-bottom", "0px");
            }
            else {
                studentListFlag = true;
                $("span[id='student']").css("transform", "rotate(180deg)");
                $(".student-head").css("margin-bottom", "15px");
            }
            break;
        case "subject":
            if (subjectListFlag) {
                subjectListFlag = false;
                $("span[id='subject']").css("transform", "rotate(0deg)");
                $(".subject-head").css("margin-bottom", "0px");
            }
            else {
                subjectListFlag = true;
                $("span[id='subject']").css("transform", "rotate(180deg)");
                $(".subject-head").css("margin-bottom", "15px");
            }
            break;
    }
    id = "#" + id + "-list";
    console.log(id);
    $(id).slideToggle("fast", function () {
        $(id).css("overflow", "auto");
    });
}
function ChangeListElements() {
}
