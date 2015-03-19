/*
 * Clang error message parser
 */

start
  = messages:message* __ count:error_count __ footer?
    { return { messages: messages, count: count } }

__ 'space or break'
  = ([ \r\n\t] / "\\n" / "\\r")*

_ 'space'
  = [ \t]*

newline "line terminator"
  = "\n" / "\r\n" / "\r"
  / "\\n" / "\\r\\n" / "\\r"
  / !.

error_count
  = warnings:number _ "warning" "s"? _ "and" _ errors:number _ "error" "s"? _ "generated." newline
    { return {warnings: warnings, errors: errors}; }
  / warnings:number _ "warning" "s"? _ "generated." newline
    { return {warnings: warnings, errors: 0}; }
  / "warning generated." newline
    { return {warnings: 1, errors: 0}; }
  / errors:number _ "error" "s"? _ "generated." newline
    { return {warnings: 0, errors: errors}; }
  / "error generated." newline
    { return {warnings: 0, errors: 1}; }
  / { return {warnings: 0, errors: 0}; }

footer
  = "ERROR" .*

number
  = n:$([0-9]+) { return parseInt(n); }

message
  = pos:position ":" _ type:type ":" _ body:body newline
    code:(code:code newline { return code })?
    marker:(marker:marker newline { return marker })?
    insertion:(insertion:insertion newline { return insertion })?
    { return { position: pos, type: type, text: body, code: code, marker: marker, insertion: insertion }; }

position
  = filename:filename ":" line:number ":" column:number
    { return { file: filename, line: line, column: column }; }

filename
  = $(!":" .)+

type
  = "error" / "warning" / "note"

body
  = $(!newline .)+

code
  = "    " text:$(!newline .)+ { return text; }

marker
  = "    " text:$[ ^~]+ { return text; }

insertion
  = "    " text:$(!newline .)+ { return text; }
