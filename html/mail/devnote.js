var Promise = require('bluebird')
var fs      = Promise.promisifyAll(require('fs'))
var path    = require('path')

String.prototype.format = function(){
    var t = this+''
    for(var i = 0; i < arguments.length; i++){
        t = t.replace(/\{[a-z|A-Z]+\}/, arguments[i]+'')
    }
    return t
}

function showNoteList(notebookName){
    $('#notelist').html('')

    var rootDir = path.join(__dirname, 'devfolder')

    var notebookList = []
    if(notebookName === '모든 노트'){
        notebookList = fs.readdirSync(rootDir)
    } else {
        notebookList = [ notebookName ]
    }
    notebookList.forEach(function(notebook) {
        var notebookDir = path.join(rootDir, notebook)
        var stat = fs.statSync(notebookDir)
        if(!stat.isDirectory()){ return }

        fs.readdirSync(notebookDir).forEach(function(note){
            var extType = note.replace(/[^.]*\./, '')
            if(extType === '.DS_Store'){ return }

            var noteDir = path.join(notebookDir, note)

            var noteObj = JSON.parse(fs.readFileSync(noteDir, 'utf8'))
            var title   = noteObj.title || 'untitled'
            var updated = noteObj.updated_time.slice(4, -7) || ''
            var summary = noteObj.content.replace(/<[^\/].*?\/>/, '').substring(0, 40)
            noteDir = noteDir.replace(/\\/g, '\\\\')

            var noteListHtml = 
                `<a href="#" class="list-group-item" onclick="showNote('{noteDir}')">
                    <h5>{notebook}</h5>
                    <h4>{title}</h4>
                    <p class="hidden-xs hidden-sm">{summary}</p>
                    <div class="stick-top-right small-padding text-default-light text-sm">{updated}</div>
                </a>`
            $("#notelist").append(noteListHtml.format(noteDir, notebook, title, summary, updated))
        })
    })
}

function showNotebookList() {

    var rootDir = path.join(__dirname, 'devfolder')
    var notebookList = $("#select-notebook")
    notebookList.html('<option>모든 노트</option>')

    fs.readdirSync(rootDir).forEach(function(notebook) {
        var notebookPath = path.join(rootDir, notebook)

        var stat = fs.statSync(notebookPath);
        if (stat && stat.isDirectory()) {
            var notebookListHtml = "<option>{notebookName}</option>"
            notebookList.append(notebookListHtml.format(notebook))
        }
    })

    var notebookName = $('#select-notebook').val()
    return showNoteList(notebookName)
}

function showNote(noteDir) {

    var buf = fs.readFileSync(noteDir, 'utf8')
    if(!buf){ return alert('해당 노트를 불러올 수 없습니다.') } // Handle FileLoading Error

    try{ var obj = JSON.parse(buf) } // Handle JSON Parse Error
    catch(err){ return alert ('해당 파일의 형식이 올바르지 않습니다.') }

    document.getElementById("note-title").value = obj.title || '알 수 없음'
    document.getElementById("origin-note-path").value = noteDir
    document.getElementById("select-language").value = obj.type
    document.getElementById("markdown-editor").contentWindow.editor.setValue(obj.content)
}

function saveNote() {

    var notebookName = $('#select-notebook').val()
    var notebookDir = path.join(__dirname, 'devfolder', notebookName)

    if(notebookName === "모든 노트"){
        return alert('모든 노트 모아보기 기능에서는 노트 저장 불가합니다');
    }
    if(!fs.existsSync(notebookDir)){
        fs.mkdirSync(notebookDir)
    }

    var date = new Date()
    var noteTitle = $('#note-title').val() || 'untitled'
    var noteData = {
        version     : '1.0',
        title       : noteTitle,
        created_time: ~~(date.getTime() / 1000),
        updated_time: date.toUTCString(),
        type        : $('#select-language').val(),
        important   : false,
        trash       : false,
        content     : document.getElementById("markdown-editor").contentWindow.editor.getValue()
    }
    var noteDir = path.join(notebookDir, noteTitle+'.json')
    var originNoteDir  = $("#origin-note-path").val()

    Promise.resolve()
    .then(function(){ if(originNoteDir){ return fs.unlinkAsync(originNoteDir) } })
    .then(function(){ return fs.writeFileAsync(noteDir, JSON.stringify(noteData, null, 4)) })
    .then(function(){ return $("#origin-note-path").val(noteDir) })
    .then(function(){ return showNoteList(notebookName) })
    .catch(function(err){ return console.log(err) })
}

function createNote() {
    // CreateNote doesn't have to save file. Just clear the editor
    var notebookName = $("#select-notebook").val()
    var notebookDir = path.join(__dirname, "devfolder", notebookName)

    if(notebookName == "모든 노트"){
        return alert('모든 노트 모아보기 기능에서는 노트 추가가 불가합니다')
    }
    if(!fs.existsSync(notebookDir)){
        return alert('존재하지 않는 노트북에 있습니다.')
    }

    document.getElementById('note-title').value = ""
    document.getElementById('origin-note-path').value = ""
    document.getElementById('markdown-editor').contentWindow.editor.setValue("")
}

function deleteNote(){
    var originNoteDir = $('#origin-note-path').val()
    if(!originNoteDir){ return }

    fs.unlinkAsync(originNoteDir)
    .then(function(){
        document.getElementById('note-title').value = ""
        document.getElementById('origin-note-path').value = ""
        document.getElementById('markdown-editor').contentWindow.editor.setValue("")
        return showNoteList($('#select-notebook').val())
    }, function(err){
        console.log(err)
        return alert("노트 삭제에 실패하였습니다.")
    })
    .catch(console.log)
}

function createNotebook(notebook) {
    var dir = __dirname + '/devfolder/' + notebook;
    var fs = require('fs'); //file write
    // 노트북 디렉토리 없을 시 폴더 생성
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    } else {
        return alert('이미 존재하는 노트북입니다.')
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
            showNoteList(notebook);
        }
    });
}
$(document).ready(function() {
    var setMarkdownEditorCss = function(obj){
        for(var id in obj){
            for(var attr in obj[id]){
                document.getElementById('markdown-editor').contentWindow
                .document.getElementById(id).style[attr] = obj[id][attr]
            }
        }
        
    }
    $("#btn-edit").click(function() {
        var style = {
            in : {
                display : 'inline',
                width   : '50%'
            },
            out : {
                display : 'inline',
                left    : '50%',
                width   : 'auto'
            } 
        }
        return setMarkdownEditorCss(style)
    });

    $("#btn-markdown").click(function() {
        var style = {
            in : {
                display : 'inline',
                width   : '100%'
            },
            out : {
                display : 'none'
            }
        }
        return setMarkdownEditorCss(style)
    });

    $("#btn-preview").click(function() {
        var style = {
            in : {
                display : 'none'
            },
            out : {
                display : 'inline',
                left    : '0%',
                width   : 'auto'
            } 
        }
        return setMarkdownEditorCss(style)
    });

    $("#btn-save").click(function() {
        var noteTitle = $('#note-title')
        if(!noteTitle.val()){
            return alert("노트의 제목을 입력해 주세요")    
        }

        if(noteTitle.val() === '모든 노트'){
            noteTitle.val('')
            return alert("'모든 노트'는 노트의 제목이 될 수 없습니다.")
        } 

        return saveNote()
        // showselected();
    });

    $("#btn-download").click(function() {
        document.getElementById('markdown-editor').contentWindow.showMenu();
    });
    $("#btn-delete").click(function() {
        if(confirm("노트를 삭제하시겠습니까?")){
            return deleteNote()
        }
    });

    $("#dialog-6").dialog({ // BeforeClose is not good event for vaildation checking.
        autoOpen: false,
        buttons: {
            OK: function() {
                var title = $('#notebook-title').val().trim()
                if(!title){
                    alert("노트북 이름이 비었습니다.")
                    $("[for=terms]").addClass("invalid");

                } else if(title === '모든 노트'){
                    alert(title+"는 노트북 이름이 될 수 없습니다.")

                } else {
                    $(this).dialog('close')
                }
            },
            Close: function() {
                $('#notebook-title').val('')
                $(this).dialog("close");
            }
        },
        beforeClose: function(event, ui) {
            var title = $('#notebook-title').val().trim()
            if(title){ return createNotebook(title) }

        },
        width: 600
    });

    $("#opener-5").click(function() {
        $("#dialog-6").dialog("open");
    });

    //init
    showNotebookList();
});

function test(d) {
    console.log('hi' + d);
}