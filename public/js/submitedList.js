///<reference path='../../typings/jquery/jquery_plugins.d.ts'/>
///<reference path='../../typings/config/config.d.ts'/>
///<reference path='../../typings/filesystem/filesystem.d.ts'/>
var studentListFlag = false;
var subjectListFlag = false;
var targetStudentNumber;
var targetSubjectId;
var allData;
var BlobBuilder;

$(function () {
    $("#allDataTable").tablesorter();

    allData = $("tbody>tr");
    targetStudentNumber = -1;
    targetSubjectId = -1;

    $(".submitedInList").bind("click", function () {
        var subjectId = $(this).attr("subjectId");
        var userId = $(this).attr("userId");
        window.open(Config.basePath + "/user/" + userId + "/subject/" + subjectId, '', 'scrollbars=yes,Width=1300,Height=800');
        $.getJSON(Config.basePath + "/api/submits", function (res) {
            for (var res_i = 0; res_i < res.length; res_i++) {
                for (var data_i = 0; data_i < allData.length; data_i++) {
                    if (res[res_i].student_number == $(allData[data_i]).attr("studentNumber") && res[res_i].id == $(allData[data_i]).attr("subjectId")) {
                        $($(allData[data_i]).children()[3]).text(res[res_i].marks);
                    }
                }
            }
        });
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

    $(".output-submits").bind("click", function () {
        // Note: The file system has been prefixed as of Google Chrome 12:
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(window.TEMPORARY, 1 * 1024 * 1024, OutputCSV);
    });
});

function OutputCSV(fs) {
    fs.root.getFile('data.csv', { create: true, exclusive: true }, function (fe) {
        console.log("file");
        fe.createWriter(function (fw) {
            console.log("file");
            fw.onwriteend = function (e) {
                console.log('Write completed.');
            };

            fw.onerror = function (e) {
                console.log('Write failed: ' + e.toString());
            };

            var cols;
            var output = "学籍番号,氏名,課題名,評価,提出状況,締切,\r\n";
            for (var data_i = 0; data_i < allData.length; data_i++) {
                if ($(allData[data_i]).css("display") != "none") {
                    cols = $(allData[data_i]).children();
                    for (var col_i = 0; col_i < cols.length; col_i++) {
                        if (col_i == 4) {
                            output += ($(cols[col_i]).text()).replace(" 提出", "") + ",";
                        } else {
                            output += $(cols[col_i]).text() + ",";
                        }
                    }
                    output += "\r\n";
                }
            }
            var bb = new Blob([output], { type: "text/plain" });
            var csvFile = document.createElement('a');
            csvFile.href = fe.toURL();
            csvFile.download = 'AspenSubmitsData.csv';
            csvFile.click();
            console.log(output);
        });
    });
}

function SearchPanelAction(id) {
    switch (id) {
        case "student":
            if (studentListFlag) {
                studentListFlag = false;
                $("span[id='student']").css("transform", "rotate(0deg)");
                $(".student-head").css("margin-bottom", "0px");
            } else {
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
            } else {
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
