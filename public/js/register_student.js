///<reference path='../../typings/jquery/jquery_plugins.d.ts'/>
///<reference path='../../typings/config/config.d.ts'/>
$(function () {
    document.getElementById('file').onchange = function () {
        if (window.File) {
            var csv = document.getElementById('file').files[0];
            var reader = new FileReader();
            reader.addEventListener('load', function (e) {
                $(".preview").css("display", "inline");
                $("#preview-body").html("");
                var arr = csvToArray(reader.result);
                arr.slice(1).forEach(function (user) {
                    $("#preview-body").append("<tr>");
                    user.forEach(function (ele, i) {
                        if (i == 1) {
                            ele = ele == 1 ? "○" : "×";
                        }
                        $("#preview-body").append("<td>" + ele + "</td>");
                    });
                });
            });
            reader.readAsText(csv, 'shift_jis');
        }
    };
    $("#button").on("click", function (e) {
        e.preventDefault();
        if (window.File) {
            var csv = document.getElementById('file').files[0];
            var reader = new FileReader();
            reader.addEventListener('load', function (e) {
                var arr = addPassToArray(csvToArray(reader.result));
                console.log(arr);
                $.ajax({
                    type: 'POST',
                    url: Config.basePath + '/register_student',
                    data: { users: arr.slice(1) },
                    success: function () {
                        console.log(arrayToCSV(arr));
                        location.href = Config.basePath + '/students';
                    }
                });
            });
            reader.readAsText(csv, 'shift_jis');
        }
    });
});
function csvToArray(csv) {
    var arr = csv.split("\n");
    arr = arr.map(function (el) {
        return el.replace(/[\n\r]/g, "");
    });
    var list = [];
    arr.forEach(function (element, i) {
        var temp = element.split(",");
        if (temp.length > 1) {
            temp[1] = temp[1] ? 1 : 0;
            temp[2] = temp[2];
            list.push(temp);
        }
    });
    return list;
}
function addPassToArray(arr) {
    arr.forEach(function (element, i) {
        if (element.length < 4 || element[3] == "") {
            if (i == 0) {
                element.push('password');
            }
            else {
                element[3] = generatePass();
            }
        }
    });
    return arr;
}
function arrayToCSV(arr) {
    var temp = arr.map(function (element) {
        return element.join(",");
    });
    return temp.join("\n");
}
function generatePass(length) {
    if (length === void 0) { length = 8; }
    return Math.random().toString(36).slice(-length);
}
