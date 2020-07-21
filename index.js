const $ = require("jquery");
const electron = require("electron");
const fs = require("fs");
const dialog = require("electron").remote.dialog;
$(document).ready(function(){
    let db;


    // *************    THIS PORTION PUTS UP ADDRESS IN ADRESS CELL
    $("#grid .cell").on("click", function(){
        let ridN=Number($(this).attr("rid"))+1;
        let cidN=Number($(this).attr("cid"))+65;


        let temp=String.fromCharCode(cidN)
    
        let charCorresponding=temp+ridN;
        $(".formula-container input[type=address-input]").val(charCorresponding);

    })

    // **************  UPDATING DATABASE FILE WHENEVER SOME CHANGES HAPPEN BY YOU
    $("#grid .cell").on("blur",function(){

        let rid=$(this).attr("rid")
        let cid=$(this).attr("cid")
        db[rid][cid]=$(this).html();
        console.log("updated your element in daatabase");


    })

    // ***************** INTIALIZER NEW FILE
    $("#new").on("click", function(){
        db=[];
        let allRows=$("#grid").find(".row")
        // console.log(allRows.length+"  i am the length"+allRows);
        for(let i=0;i<allRows.length;i++){
            let row=[]
            let allCells=$(allRows[i]).find(".cell")
            for(let j=0;j<allCells.length;j++){
                $(allCells[j]).html("");
                let cell=""
                row.push(cell);

            }
            db.push(row);
        }
        console.log(db);

    })
    $("#save").on("click",function(){
        let sdb = dialog.showSaveDialogSync();
        let data=JSON.stringify(db);
        fs.writeFileSync(sdb, data);
        console.log("File saved");
        
    })

    $("#open").on("click" , async function(){
        let sdb = await dialog.showOpenDialog();
        let buffer = fs.readFileSync(sdb.filePaths[0]);
        console.log(buffer);
        db = JSON.parse(buffer);
        let allRows=$("#grid .row");


        for(let i=0;i<allRows.length;i++){
            let cells=$(allRows[i]).find(".cell");
            for(let j=0;j<cells.length;j++){
                $(cells[j]).html(db[i][j]);
            }
        }
    })

});