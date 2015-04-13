///<reference path='../../typings/jquery/jquery_plugins.d.ts'/>
///<reference path='../../typings/config/config.d.ts'/>
///<reference path='../../typings/filesystem/filesystem.d.ts'/>

var studentListFlag = false;
var subjectListFlag = false;
var targetStudentNumber;
var targetSubjectId;
var allData;
var BlobBuilder;

$(function(){

  allData = $("tbody>tr");

  $(".output-students").bind("click", function(){
    OutputCSV();
  });

});

function OutputCSV(){
  var cols;
  var output = "学籍番号,氏名,パスワード,\r\n";
  for(var data_i = 0; data_i < allData.length; data_i++){
    if($(allData[data_i]).css("display") != "none"){
      cols = $(allData[data_i]).children();
      for(var col_i = 0; col_i < cols.length; col_i++){
        output += $(cols[col_i]).text() + ",";
      }
      output += "\r\n";
    }
  }
  //出力した時刻を整形
  var date = [
    (((new Date()).getFullYear()).toString()).replace("20", ""),
    ((new Date()).getMonth()).toString(),
    ((new Date()).getDate()).toString(),
    ((new Date()).getHours()).toString(),
    ((new Date()).getMinutes()).toString(),
  ];
  //1桁の数字には0を追加
  var dateStr = "";
  date.forEach((d)=>{
    dateStr += ((d.length < 2)? ("0" + d) : d);
  });
  //ファイルの出力
  var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  var blob = new Blob([bom, output], {type:"text/csv"});
  var csvFile = document.createElement('a');
  csvFile.href = ((<any>window).URL || (<any>window).webkitURL).createObjectURL(blob);
  (<any>csvFile).download = 'AspenStudents' + dateStr + '.csv';
  csvFile.click();
  console.log(output);
}
