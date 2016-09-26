function defaultselection() {

    document.getElementById("notelist").innerHTML = "";
    var filesystem = require('fs');
    var dir = __dirname + '/devfolder/';
    filesystem.readdirSync(dir).forEach(function(file) {
        file = dir + '/' + file;
        var stat = filesystem.statSync(file);
        if (stat && stat.isDirectory()) {
            var filename = file.replace(/^.*[\\\/]/, '');
            var dir2 = dir + filename + '/';
            filesystem.readdirSync(dir2).forEach(function(file) {
                file = dir2 + '/' + file;
                stat = filesystem.statSync(file);
                var filename2 = file.replace(/^.*[\\\/]/, '');

                if (filename2 != '.DS_Store') {
                    // read json
                    var fs = require('fs');
                    var obj = JSON.parse(fs.readFileSync(file, 'utf8'));

                    var title = obj["title"];
                    if (title.length == 0)
                        title = 'untitled';

                    var updated = obj["updated_time"];
                    updated = updated.slice(4, updated.length);
                    updated = updated.slice(0, -7);

                    var summary = obj["content"];
                    var maxl = summary.length;
                    if (maxl > 40)
                        maxl = 40;
                    summary = summary.slice(0, maxl);

                    var notelistelement = "<a href='#' class='list-group-item' onclick=shownote('" + file + "')> <h5>" + filename + "</h5> <h4>" + title + "</h4> <p class = 'hidden-xs hidden-sm'>" + summary + "</p> <div class = 'stick-top-right small-padding text-default-light text-sm'>" + updated + "</div></a>";
                    document.getElementById("notelist").innerHTML += String(notelistelement);
                }
            });
        }
    });
}

function showNotebookList() {
    var filesystem = require('fs');
    var dir = __dirname + '/devfolder/';

    document.getElementById("select-notebook").innerHTML = "<option>모든 노트</option>";
    filesystem.readdirSync(dir).forEach(function(file) {
        file = dir + '/' + file;
        var stat = filesystem.statSync(file);
        if (stat && stat.isDirectory()) {
            var filename = file.replace(/^.*[\\\/]/, '');
            document.getElementById("select-notebook").innerHTML += "<option>" + filename + "</option>";
        }
    });

    // 모든 노트일 때
    var x = document.getElementById("select-notebook").value;
    console.log(x);
    if (x == "모든 노트") {

        defaultselection();
    }
}

function showselected() {
    var x = document.getElementById("select-notebook").value;
    var filesystem = require('fs');
    if (x == "모든 노트") {

        defaultselection();
    } else {
        dir = __dirname + '/devfolder/' + x + '/';
        document.getElementById("notelist").innerHTML = "";
        filesystem.readdirSync(dir).forEach(function(file) {
            file = dir + '/' + file;
            stat = filesystem.statSync(file);
            filename = file.replace(/^.*[\\\/]/, '');
            if (filename != '.DS_Store') {

                // read json
                var fs = require('fs');
                var obj = JSON.parse(fs.readFileSync(file, 'utf8'));

                var title = obj["title"];
                if (title.length == 0)
                    title = 'untitled';

                var updated = obj["updated_time"];
                updated = updated.slice(4, updated.length);
                updated = updated.slice(0, -7);

                var summary = obj["content"];
                var maxl = summary.length;
                if (maxl > 40)
                    maxl = 40;
                summary = summary.slice(0, maxl);

                document.getElementById("notelist").innerHTML += "<a href='#' class='list-group-item' onclick=shownote('" + file + "')> <h5>" + x + "</h5> <h4>" + title + "</h4> <p class = 'hidden-xs hidden-sm'>" + summary + "</p> <div class = 'stick-top-right small-padding text-default-light text-sm'>" + updated + "</div></a>";
            }
        });
    }

    // if there is no note, show null
    if (document.getElementById("notelist").innerHTML == "") {

        //				document.getElementById("notelist").innerHTML+="<a href='#' class='list-group-item' onclick=shownote('"+file+"')> <h5>Notebook</h5> <h4>"+"null"+"</h4> <p class = 'hidden-xs hidden-sm'>Summary</p> <div class = 'stick-top-right small-padding text-default-light text-sm'>10:30pm</div></a>";
    }
}

function shownote(file) {

    var fs = require('fs');
    var obj = JSON.parse(fs.readFileSync(file, 'utf8'));

    var editor = document.getElementById("markdown-editor").contentWindow.editor;
    editor.setValue(obj["content"]);

    var notetitle = document.getElementById("note-title");
    notetitle.value = obj["title"];

    var selectnote = document.getElementById("select-language");
    selectnote.value = obj["type"];

}

function test(d) {
    console.log('hi' + d);
}

function saveNote() {
    var notebook = document.getElementById("select-notebook").value;
    var dir = __dirname + '/devfolder/' + notebook;
    var fs = require('fs'); //file write
    // 노트북 디렉토리 없을 시 폴더 생성
    console.log(notebook);
    if (notebook == "모든 노트") {
        alert('모든 노트 모아보기 기능에서는 노트 저장 불가합니다');
        return;
    }
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var editor = document.getElementById("markdown-editor").contentWindow.editor;
    console.log(editor.getValue());
    var myData = {
        version: '1.0'
    };
    // 파일 이름에 Time stamp
    var dt = new Date();
    var utcDate = dt.toUTCString();
    if (!Date.now) {
        Date.now = function() {
            return new Date().getTime();
        }
    }
    var timestamp = Math.floor(Date.now() / 1000);
    var title = document.getElementById('note-title').value;
    if (title.length == 0)
        title = 'untitled';
    myData["title"] = title;
    myData["created_time"] = timestamp;
    myData["updated_time"] = utcDate;
    myData["type"] = document.getElementById('select-language').value;
    myData["important"] = false;
    myData["trash"] = false;
    myData["content"] = editor.getValue();
    //			var outputFilename = __dirname + '/devfolder/' + String(timestamp) + '.json';
    var outputFilename = dir + '/' + title + '.json';
    fs.writeFile(outputFilename, JSON.stringify(myData, null, 4), function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("JSON saved to " + outputFilename);
            showselected();
        }
    });
}

function createNote() {
    var notebook = document.getElementById("select-notebook").value;
    var dir = __dirname + '/devfolder/' + notebook;
    var fs = require('fs'); //file write
    // 노트북 디렉토리 없을 시 폴더 생성
    if (notebook == "모든 노트") {
        alert('모든 노트 모아보기 기능에서는 노트 추가가 불가합니다');
        return;
    }
    if (!fs.existsSync(dir)) {
        alert('존재하지 않는 노트북에 있습니다.');
        return;
    }

    // set current page blank
    document.getElementById('note-title').value = "";
    var editor = document.getElementById("markdown-editor").contentWindow.editor;
    editor.setValue("");

    var myData = {
        version: '1.0'
    };
    // 파일 이름에 Time stamp
    var dt = new Date();
    var utcDate = dt.toUTCString();
    if (!Date.now) {
        Date.now = function() {
            return new Date().getTime();
        }
    }
    var timestamp = Math.floor(Date.now() / 1000);
    var title = document.getElementById('note-title').value;
    if (title.length == 0)
        title = 'untitled';
    myData["title"] = title;
    myData["created_time"] = timestamp;
    myData["updated_time"] = utcDate;
    myData["type"] = document.getElementById('select-language').value;
    myData["important"] = false;
    myData["trash"] = false;
    myData["content"] = editor.getValue();
    //			var outputFilename = __dirname + '/devfolder/' + String(timestamp) + '.json';
    var outputFilename = dir + '/' + myData["title"] + '.json';
    fs.writeFile(outputFilename, JSON.stringify(myData, null, 4), function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("JSON saved to " + outputFilename);
            showselected();
        }
    });
}

function createNotebook(notebook) {
    var dir = __dirname + '/devfolder/' + notebook;
    var fs = require('fs'); //file write
    // 노트북 디렉토리 없을 시 폴더 생성
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    } else {
        alert('이미 존재하는 노트북입니다.');
        return;
    }

    showNotebookList();
    document.getElementById("select-notebook").value = notebook;

    // set current page blank
    document.getElementById('note-title').value = "";
    var editor = document.getElementById("markdown-editor").contentWindow.editor;
    editor.setValue("");

    var myData = {
        version: '1.0'
    };
    // 파일 이름에 Time stamp
    var dt = new Date();
    var utcDate = dt.toUTCString();
    if (!Date.now) {
        Date.now = function() {
            return new Date().getTime();
        }
    }
    var timestamp = Math.floor(Date.now() / 1000);
    var title = document.getElementById('note-title').value;
    if (title.length == 0)
        title = 'untitled';
    myData["title"] = title;
    myData["created_time"] = timestamp;
    myData["updated_time"] = utcDate;
    myData["type"] = document.getElementById('select-language').value;
    myData["important"] = false;
    myData["trash"] = false;
    myData["content"] = editor.getValue();
    var outputFilename = dir + '/' + myData["title"] + '.json';
    fs.writeFile(outputFilename, JSON.stringify(myData, null, 4), function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("JSON saved to " + outputFilename);
            showselected();
        }
    });
}
$(document).ready(function() {
    //

    $("#btn-edit").click(function() {
        document.getElementById('markdown-editor').contentWindow.document.getElementById("in").style.display = "inline";
        document.getElementById('markdown-editor').contentWindow.document.getElementById("in").style.width = "50%";
        document.getElementById('markdown-editor').contentWindow.document.getElementById("out").style.display = "inline";
        document.getElementById('markdown-editor').contentWindow.document.getElementById("out").style.left = "50%";
        document.getElementById('markdown-editor').contentWindow.document.getElementById("out").style.width = "auto";
    });
    $("#btn-markdown").click(function() {
        document.getElementById('markdown-editor').contentWindow.document.getElementById("out").style.display = "none";
        document.getElementById('markdown-editor').contentWindow.document.getElementById("in").style.display = "inline";
        document.getElementById('markdown-editor').contentWindow.document.getElementById("in").style.width = "100%";
    });
    $("#btn-preview").click(function() {
        document.getElementById('markdown-editor').contentWindow.document.getElementById("in").style.display = "none";
        document.getElementById('markdown-editor').contentWindow.document.getElementById("out").style.display = "inline";
        document.getElementById('markdown-editor').contentWindow.document.getElementById("out").style.left = "0%";
        document.getElementById('markdown-editor').contentWindow.document.getElementById("out").style.width = "auto";
    });
    $("#btn-save").click(function() {
        var notebook = document.getElementById("select-notebook").value;
        if (notebook != "모든 노트") {
            saveNote();
        }
        // showselected();
    });
    $("#btn-download").click(function() {
        document.getElementById('markdown-editor').contentWindow.showMenu();
    });
    $("#btn-delete").click(function() {});

    $("#dialog-6").dialog({
        autoOpen: false,
        buttons: {
            OK: function() {
                $(this).dialog("close");
            }
        },
        beforeClose: function(event, ui) {
            var x = document.getElementById("notebook-title").value;
            if (!(/\S/.test(x))) {
                alert("노트북 이름이 비었습니다.");
                event.preventDefault();
                $("[for=terms]").addClass("invalid");
            } else if (x == "모든 노트") {
                alert(x + " 은(는) 노트북 이름이 될 수 없습니다.");
            } else { // create new notebook
                createNotebook(x);
            }
        },
        width: 600
    });
    $("#opener-5").click(function() {
        $("#dialog-6").dialog("open");
    });
    //init
    showNotebookList();
    // defaultselection();
});
