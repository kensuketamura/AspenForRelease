$(function () {
    $("#button").on("click", function (e) {
        e.preventDefault();
        if (window.File) {
            var csv = document.getElementById('file').files[0];
            var reader = new FileReader();
            reader.addEventListener('load', function (e) {
                console.log(arrayToCSV(csvToArray(reader.result)));
            });
            reader.readAsText(csv, 'shift_jis');
        }
    });
});
function csvToArray(csv) {
    var arr = csv.split("\n");
    var list = [];
    arr.forEach(function (element, i) {
        var temp = element.split(",");
        if (temp.length > 1) {
            if (i == 0) {
                temp.push('password');
            }
            else {
                temp.push(generatePass());
            }
            list.push(temp);
        }
    });
    return list;
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
