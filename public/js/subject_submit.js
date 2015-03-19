///<reference path="../../typings/jquery/jquery.d.ts" />
///<reference path="../../typings/ace/ace.d.ts" />
var editor;
var markdownEditor;
$(function () {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/xcode");
    editor.getSession().setMode("ace/mode/c_cpp");
    editor.setFontSize(14);
    markdownEditor = ace.edit("markdownEditor");
    markdownEditor.setTheme("ace/theme/xcode");
    markdownEditor.getSession().setMode("ace/mode/markdown");
    markdownEditor.setFontSize(14);
    markdownEditor.on("change", function () {
        $(".markdown").empty();
        $(".markdown").append(markdown.toHTML(markdownEditor.getValue()));
    });
    $(window).resize(function () {
        var width = $(window).width();
        var sidebarW = $('.sidebar-right').width();
        $('.sidebar-right').css("left", width - sidebarW + "px");
    });
    RSidebarBtnClickFunction();
    $('.sidebar-btn-right').click(RSidebarBtnClickFunction);
});
function createHiddenElement(name, value) {
    var hidden_element = document.createElement("input");
    hidden_element.setAttribute("name", name);
    hidden_element.setAttribute("type", "hidden");
    hidden_element.setAttribute("value", value);
    return hidden_element;
}
function getSubjectId() {
    var pathes = location.pathname.split("/");
    var _subjectId = pathes[pathes.length - 1];
    return (_subjectId == "editor") ? 0 : parseInt(_subjectId);
}
function postData() {
    var form = document.getElementById("subject_form");
    var nameValue = $("#name").val();
    var limitValue = $("#limit").val();
    var contentElement = createHiddenElement("content", editor.getValue());
    var exampleElement = createHiddenElement("example", markdownEditor.getValue());
    var subjectIdElement = createHiddenElement("subjectId", getSubjectId());
    console.log(nameValue);
    console.log(limitValue);
    console.log(contentElement.value);
    console.log(exampleElement.value);
    console.log(subjectIdElement.value);
    if (nameValue && limitValue && contentElement.value && exampleElement.value && subjectIdElement.value) {
        form.appendChild(contentElement);
        form.appendChild(exampleElement);
        form.appendChild(subjectIdElement);
        form.submit();
        return true;
    }
    else {
        alert("入力項目が足りません");
        return false;
    }
}
function RSidebarBtnClickFunction() {
    var sbpos = parseInt($(".sidebar-right").css("left").replace(/px/g, ""));
    var width = $(window).width();
    if (sbpos === width) {
        $('.sidebar-btn-right').css("opacity", "0.4");
        $('.sidebar-right').css("opacity", "1");
        var sidebarW = parseInt($(".sidebar-right").css("width").replace(/px/g, ""));
        $('.sidebar-right').css("left", width - sidebarW + "px");
        $('.main-view').css("margin-right", sidebarW + "px");
        $('.btnglyph').css("transform", "rotate(180deg)");
    }
    else {
        $('.sidebar-btn-right').css("opacity", "1");
        $('.sidebar-right').css("left", "100%");
        $('.main-view').css("margin-right", "0");
        $('.btnglyph').css("transform", "rotate(0deg)");
        $('.sidebar-right').css("opacity", "0");
    }
}
;
