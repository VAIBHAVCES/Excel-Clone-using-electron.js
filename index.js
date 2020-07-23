const $ = require("jquery");
const electron = require("electron");
const fs = require("fs");
const { strict } = require("assert");
const dialog = require("electron").remote.dialog;
$(document).ready(function () {
    let db;


    // *************    THIS PORTION PUTS UP ADDRESS IN ADRESS CELL
    $("#grid .cell").on("click", function () {
        let ridN = Number($(this).attr("rid")) ;
        let cidN = Number($(this).attr("cid")) ;


        let temp = String.fromCharCode(cidN+65)

        let charCorresponding = temp + (ridN+1);
        $(".formula-container input[id=address-input]").val(charCorresponding);
        $("#formulae-input").val(db[ridN][cidN].forumulae);
      })

    // **************  UPDATING DATABASE FILE WHENEVER SOME CHANGES HAPPEN BY YOU
    $("#grid .cell").on("blur", function () {

        let rid = $(this).attr("rid")
        let cid = $(this).attr("cid")
        // db[rid][cid].value= $(this).html();
        let value=$(this).html();
        console.log("ye meri karamaat hai")
        updateIndex(rid,cid,value);
        console.log("updated your element in daatabase");
        
  

    })

    // ***************** INTIALIZER NEW FILE
    $("#new").on("click", function () {
        db = [];
        let allRows = $("#grid").find(".row")
        // console.log(allRows.length+"  i am the length"+allRows);
        for (let i = 0; i <allRows . length; i++) {
            let row = []
            let allCells = $(allRows[i]).find(".cell")
            for (let j = 0; j < allCells.length; j++) {
                $(allCells[j]).html("");
                let cell = {
                    value:"",
                    forumulae:"",
                    child:[]
                }
                row.push(cell);

            }
            db.push(row);
        }


    })
    $("#save").on("click", function () {
        let sdb = dialog.showSaveDialogSync();
        let data = JSON.stringify(db);
        fs.writeFileSync(sdb, data);
        console.log("File saved");

    })

    $("#open").on("click", async function () {
        let sdb = await dialog.showOpenDialog();
        let buffer = fs.readFileSync(sdb.filePaths[0]);
        db = JSON.parse(buffer);
        let allRows = $("#grid .row");


        for (let i = 0; i < allRows.length; i++) {
            let cells = $(allRows[i]).find(".cell");
            for (let j = 0; j < cells.length; j++) {
                $(cells[j]).html(db[i][j].value);
            }
        }
    })

    $("#formulae-input").on("blur" , function(){

        let userFormulae=$(this).val();

        // console.log(val);
        let cellAddr = $("#address-input").val();
        let obj = getIndexes(cellAddr);
        db[obj.rid][obj.cid].forumulae=userFormulae;
        console.log("addded fprmulae in data base of : "+obj.rid+" "+obj.cid+ " as "+db[obj.rid][obj.cid].forumulae);
        let ans = evaluate(userFormulae);
        setUpFormulae(userFormulae , obj)
        updateIndex(obj.rid , obj.cid , ans);

        // console.log(cellAddr);


    })

    function setUpFormulae(userFormulae ,cellAddr){
        let subers=userFormulae.split(" ");
        for(let i=0;i<subers.length;i++){
            let code=subers[i].charCodeAt(0);
            if(code >=65 && code<=90){
                let obj=getIndexes(subers[i]);
                db[obj.rid][obj.cid].child.push(cellAddr);
                 
            }
        }      
    }
    function updateIndex(rid,cid,ans){
        
        $(`#grid .cell[rid=${rid}][cid=${cid}]`).html(ans);
        db[rid][cid].value=ans;
        let childObj=db[rid][cid].child;
        console.log("db mei dala " +rid+ "  "+cid+" is "+ans+"mere bacche hai : "+db[rid][cid].child[0]);
        for(let i=0;i<childObj.length;i++){
            let indexObj=childObj[i];
            console.log("chidl index : " +indexObj.rid+" "+indexObj.cid );
            console.log("old value of child is : " +db[indexObj.rid][indexObj.cid].value+" "+db[indexObj.rid][indexObj.cid].formulae)
            console.log("testing :  "+db[0][1].forumulae);
            let temp=evaluate(db[indexObj.rid][indexObj.cid].forumulae);
            updateIndex(indexObj.rid,indexObj.cid,temp);
        }
        
        
    }

    function getIndexes(cellAddr){
        // THIS WILLL RETURN YOU THE INDEXES OF CELL 
        let ascii = cellAddr.charCodeAt(0);
        let rid=Number(cellAddr.substring(1))-1;
        let cid=ascii-65;
       
        let obj={
            rid:rid,
            cid:cid
        };
        return obj;
    }
    function evaluate(formualae){
        // WORK IS TO EVALUTE THE EXPRESSOIN
      
        console.log("error aayegwa :  "+formualae);
        let subers=formualae.split(" ");
        for(let i=0;i<subers.length;i++){
            let code=subers[i].charCodeAt(0);
            if(code >=65 && code<=90){
                let obj=getIndexes(subers[i]);
               let value = db[obj.rid][obj.cid].value;
               console.log("value at "+obj.rid+" "+obj.cid+" is "+value);
               formualae = formualae.replace(subers[i], value);
            }
        }

        let finalans=eval(formualae);
        console.log(formualae+" it is :  "+finalans);
        return finalans;   
    }


});