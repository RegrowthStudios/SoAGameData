var ControlChildren = new Array();
var BlockListState = -1;
var altColorsNumber = 0;
var blockRgbSliderInitialized = 0;
var altColorActive = 0;
var checkBoxesLength = 15;
var climateSlidersInitialized = 0;

var AppInterface = {
   name: 'Interface',
    
   GenerateControls: function(elementID, dropBoxArray, slidersArray){ //called only once per element
       var container = document.getElementById(elementID);
       var html = '';
       var diff;
       var n = 0;
       //dropBoxes are packed groups of 5+ variables in the array interleaves as: id, name, min, max, variableNames..., numChildren, (child, val)...
       for (var i = 0; i < dropBoxArray.length; ){
            diff = dropBoxArray[i+3] - dropBoxArray[i+2];
            
            html = html + "<div id='" + elementID + "droptxt" + dropBoxArray[i] + "' data-name='" + dropBoxArray[i+1] + ": ' data-parent='" + elementID + "'>" + dropBoxArray[i+1] + "</div>";
            
            html = html + "<ul class='Dropdown Dropdownm'> <li class='Dropdowni'><a id='" + elementID + dropBoxArray[i] + "' class='Dropdowni' href='#' data-selected='0' data-parent='" + elementID + "'><span>NULL</span></a> <ul class='Dropdownm'>";
            for (var i2 = 0; i2 < diff+1; i2++){
                html = html +  "<li class='Dropdowni'><a id='" + elementID + "Dropd" + dropBoxArray[i] + "," + i2 + "' class='Dropdowni' href='#' data-pid='" + dropBoxArray[i] + "' data-index='" + i2 + "' onclick='changeDropDown(this.id)' data-parent='" + elementID + "'>" + dropBoxArray[i+4+i2] + "</a></li>";
            }
            html = html + "</ul></li></ul> </br></br>";
            i = i + 5 + diff;
            n++;
       }
       container.innerHTML = container.innerHTML + html;
        
       //sliders are packed groups of 4 variables in the array interleaved as: id, name, min, max, step, secondid, numChildren, (child, val)...
       for (var i = 0; i < slidersArray.length; i = i+6){
          var k = i;
      
          var labelHtml = $("<label class='sliderLabel' for='" + elementID + "amount" + slidersArray[i] + "' id='" + elementID + "label" + slidersArray[i] + "'>" + slidersArray[i+1] + ": </label>");
          var inputHtml = $("<input type='text' id='" + elementID + "amount" + slidersArray[i] + "' value='NULL' class='sliderValue' />");
          var slideHtml;

          if (slidersArray[i+5] > 0){
            slideHtml = $("<div class='slider' id='" + elementID + "slider-range" + slidersArray[i] + "' data-index='" + slidersArray[i] + "' data-double=1 data-parent='" + elementID + "'></div></br>"); 
          }else{
            slideHtml = $("<div id='" + elementID + "slider-range" + slidersArray[i] + "' data-index='" + slidersArray[i] + "' data-double=0 data-parent='" + elementID + "'></div></br>"); 
          }
    
          if (slidersArray[i+5] > 0){
            slideHtml.slider({
                range: true,
                min: slidersArray[i+2],
                max: slidersArray[i+3],
                step: slidersArray[i+4],
                values: [ 0, 0 ],  
                slide: function( event, ui ) {
                    $( '#' + this.getAttribute('data-parent') + 'amount' + this.getAttribute('data-index')).val(ui.values[ 0 ] + ' - ' + ui.values[ 1 ]);
                    AppInterface.ChangeVariable(this.getAttribute('data-index'), ui.values[ 0 ] + ',' + ui.values[ 1 ]); // Don't change this
                }          
             });  
           }else{
            slideHtml.slider({
                range: false,
                min: slidersArray[i+2],
                max: slidersArray[i+3],
                step: slidersArray[i+4],
                values: [ 0 ],  
                slide: function( event, ui ) {
                    $( '#' + this.getAttribute('data-parent') + 'amount' + this.getAttribute('data-index')).val(ui.values[ 0 ]);
                    AppInterface.ChangeVariable(this.getAttribute('data-index'), ui.values[ 0 ]); // Don't change this
                }          
             });  
           }
           
           $("#" + elementID).append(labelHtml);
           $("#" + elementID).append(inputHtml);
           $("#" + elementID).append(slideHtml);
      }
   },
   
   //Sets the controls to have the values of the current tree's variables
   SetTree: function(variableArray){
        var ageElem = document.getElementById('TreeAge');
        var treeName = document.getElementById('currentTreeTextBox');
        treeName.value = variableArray[0];
        ageElem.innerHTML = "Tree Age: " + (100.0*variableArray[1]).toFixed(1) + "%"; //second variable is the trees age.
        for (var i = 2; i < variableArray.length; ){ 
            var inc = 3;
            if (document.getElementById("Trees" + variableArray[i]) != null){  //drop box
                var id = "TreesDropd" + variableArray[i] + "," + variableArray[i+1];
                setDropDown(id);                
            }else if (document.getElementById("Treesslider-range" + variableArray[i]) != null){ //slider: ID, Value, hasSecond                 
                if (variableArray[i+2] == 1){
                    inc = 4;
                    $("#Treesslider-range" + variableArray[i]).slider( "values", 0, [ variableArray[i+1] ]);
                    $( '#Treesamount' + variableArray[i]).val(variableArray[i+1] + ' - ' + variableArray[i+3]);
                } else{
                    inc = 3;
                    $("#Treesslider-range" + variableArray[i]).slider( "values", 0, [ variableArray[i+1] ]);
                    $( '#Treesamount' + variableArray[i]).val(variableArray[i+1]);
                }
            }
            i = i + inc;
        }
        this.ChangeState(1);
   },
   
   CheckboxInput: function(){
        var args = new Array();
        var element;
        for (var i = 0; i < checkBoxesLength-1; i++){
            element = document.getElementById("altBox" + (i+1));
            if (element.checked == ""){
                args[i] = 0;
            }else{
                args[i] = 1;
            }
        }
        this.CheckBoxInput(args);
   },
   
   SetLeafAltColors: function(size, colorArray, activeArray){
        var element;
        if (size < checkBoxesLength){
            for (var i = size; i < checkBoxesLength; i++){
                document.getElementById("altBox" + (i+1)).style.display = "none";
                document.getElementById("altLab" + (i+1)).style.display = "none";
            }
        }else if (size > checkBoxesLength){
            for (var i = checkBoxesLength; i < size; i++){
                document.getElementById("altBox" + (i+1)).style.display = "inline";
                document.getElementById("altLab" + (i+1)).style.display = "inline";
            }
        }
        checkBoxesLength = size;
        for (var i = 0; i < checkBoxesLength*3; i+=3){
            document.getElementById("altLab" + ((i/3)+1)).innerHTML = "(" + colorArray[i] + "," + colorArray[i+1] + "," + colorArray[i+2]+ ")";
        }
        for (var i = 0; i < checkBoxesLength; i++){
            document.getElementById("altBox" + (i+1)).checked = "";
        }
        for (var i = 0; i < activeArray.length; i++){
            document.getElementById("altBox" + (activeArray[i])).checked = "checked";
        }
   },   
   
   SetBlockTextures: function(valArray){
        var pyElement = document.getElementById("pyTexture");
        var pxElement = document.getElementById("pxTexture");
        var nyElement = document.getElementById("nyTexture");
        pyElement.innerHTML = "Top Texture: Index=" + valArray[0] + " Unit=" + valArray[1];
        pxElement.innerHTML = "Side Texture: Index=" + valArray[2] + " Unit=" + valArray[3];
        nyElement.innerHTML = "Bottom Texture: Index=" + valArray[4] + " Unit=" + valArray[5];
   },
   
    SetBlock: function(name, id, variableArray, altColorsArray){
        document.getElementById("currentBlockTextBox").value = name;
        document.getElementById("currentBlockID").innerHTML = "Block ID: " + id;
        for (var i = 0; i < variableArray.length; i = i + 2){ //packs of 2 variables, id then value
            if (document.getElementById("Blocks" + variableArray[i]) != null){  //drop box
                var id = "BlocksDropd" + variableArray[i] + "," + variableArray[i+1];
                setDropDown(id);             
            }else if (document.getElementById("Blocksslider-range" + variableArray[i]) != null){ //slider                
                $("#Blocksslider-range" + variableArray[i]).slider( "values", 0, [ variableArray[i+1] ]);
                $( '#Blocksamount' + variableArray[i]).val(variableArray[i+1]);
            }
        }
        var html = "<li class='Dropdowni'><a id='AltColorDropd0' class='Dropdowni' href='#' data-pid='AltColor' data-index='0' onclick='changeAltColorDropDown(this.id)' data-parent='DropBox' data-r='0' data-g='0' data-b='0'>Using Default</a></li>";
        var i;
        for (i = 0; i < altColorsArray.length; i = i + 3){
            html = html +  "<li class='Dropdowni'><a id='AltColorDropd" + (i/3+1) + "' class='Dropdowni' href='#' data-pid='AltColor' data-index='" + (i/3+1) + "' onclick='changeAltColorDropDown(this.id)' data-parent='DropBox' data-r='" + altColorsArray[i] + "' data-g='" + altColorsArray[i+1] +"' data-b='" + altColorsArray[i+2] + "' >" + altColorsArray[i] + "," + altColorsArray[i+1] + "," + altColorsArray[i+2] + "</a></li>";
        }
        for (i; i < 15*3; i = i+3){
            html = html +  "<li class='Dropdowni'><a id='AltColorDropd" + (i/3+1) + "' class='Dropdowni' style='display:none' href='#' data-pid='AltColor' data-index='" + (i/3+1) + "' onclick='changeAltColorDropDown(this.id)' data-parent='DropBox' data-r='255' data-g='255' data-b='255' >255,255,255</a></li>";
        }
        document.getElementById("AltColorList").innerHTML = html;
        
        altColorsNumber = altColorsArray.length/3;
        document.getElementById("altColorsNumber").innerHTML = altColorsNumber;
        if (altColorsArray.length > 2){
            document.getElementById("DropBoxAltColor").innerHTML = "<span>Using Default</span>"
        }
        this.ChangeState(2);
        
        if (blockRgbSliderInitialized == 0){
            InitializeBlockRGBSliders();
        }
        setAltColorDropDown("AltColorDropd0");
   },
   
   SetBiome: function(name, variableArray)
   {
        document.getElementById('currentBiomeTextBox').value = name;
        for (var i = 0; i < variableArray.length; i = i + 2){ //packs of 2 variables, id then value
            if (document.getElementById("Biomes" + variableArray[i]) != null){  //drop box
                var id = "BiomesDropd" + variableArray[i] + "," + variableArray[i+1];
                setDropDown(id);             
            }else if (document.getElementById("Biomesslider-range" + variableArray[i]) != null){ //slider                
                $("#Biomesslider-range" + variableArray[i]).slider( "values", 0, [ variableArray[i+1] ]);
                $( '#Biomesamount' + variableArray[i]).val(variableArray[i+1]);
            }else if (document.getElementById("Biomesslider-range" + (variableArray[i]-4)) != null){
                $("#Biomesslider-range" + (variableArray[i]-4)).slider( "values", 1, [ variableArray[i+1] ]);
                $( '#Biomesamount' + (variableArray[i]-4)).val( $("#Biomesslider-range" + (variableArray[i]-4)).slider("values", 0) + ' - ' + variableArray[i+1]);
            }
        }
   },
   
   ChangeState: function(newState){
        var treesCont = document.getElementById('Trees');
        var treesOverlayCont = document.getElementById('Trees-Overlay');
        var blocksCont = document.getElementById('Blocks');
        var blocksOverlayCont = document.getElementById('Blocks-Overlay');
        var blocksSearchCont = document.getElementById('Blocks-Search');
        var biomesCont = document.getElementById('Biomes');
        var biomesOverlayCont = document.getElementById('Biomes-Overlay');
        var noiseModCont = document.getElementById('Noise-Mod');
        var climateCont = document.getElementById('Climate');
        var terrainCont = document.getElementById('Terrain');
        if (newState == 0){   //MAIN SCREEN
            treesCont.style.display = "none";
            treesOverlayCont.style.display = "none";
            blocksCont.style.display = "none";
            blocksOverlayCont.style.display = "none";
            blocksSearchCont.style.display = "none";
            biomesCont.style.display = "none";
            biomesOverlayCont.style.display = "none";
            noiseModCont.style.display = "none";
            climateCont.style.display = "none";
            terrainCont.style.display = "none";
        }else if (newState == 1){   //TREE EDITOR
            treesCont.style.display = "block";
            treesOverlayCont.style.display = "block";
            blocksCont.style.display = "none";
            blocksOverlayCont.style.display = "none";
            blocksSearchCont.style.display = "none";
            biomesCont.style.display = "none";
            biomesOverlayCont.style.display = "none";
            noiseModCont.style.display = "none";
            climateCont.style.display = "none";
            terrainCont.style.display = "none";
        }else if (newState == 2){   //BLOCK EDITOR
            treesCont.style.display = "none";
            treesOverlayCont.style.display = "none";
            blocksCont.style.display = "block";   
            blocksOverlayCont.style.display = "block";
            blocksSearchCont.style.display = "none";
            biomesCont.style.display = "none";
            biomesOverlayCont.style.display = "none";
            noiseModCont.style.display = "none";
            climateCont.style.display = "none";
            terrainCont.style.display = "none";
        }else if (newState == 3){   //BLOCK SEARCH
            treesCont.style.display = "none";
            treesOverlayCont.style.display = "none";
            blocksCont.style.display = "none";   
            blocksOverlayCont.style.display = "none";
            blocksSearchCont.style.display = "block";
            biomesCont.style.display = "none";
            biomesOverlayCont.style.display = "none";
            noiseModCont.style.display = "none";
            climateCont.style.display = "none";
            terrainCont.style.display = "none";
        }else if (newState == 4){ //BIOME EDITOR
            treesCont.style.display = "none";
            treesOverlayCont.style.display = "none";
            blocksCont.style.display = "none";   
            blocksOverlayCont.style.display = "none";
            blocksSearchCont.style.display = "none";
            biomesCont.style.display = "block";
            biomesOverlayCont.style.display = "block";
            noiseModCont.style.display = "none";
            climateCont.style.display = "none";
            terrainCont.style.display = "none";
            if (climateSlidersInitialized == 0){
                InitializeClimateSliders();
            }
        }else if (newState == 5){ //NOISE MOD
            treesCont.style.display = "none";
            treesOverlayCont.style.display = "none";
            blocksCont.style.display = "none";   
            blocksOverlayCont.style.display = "none";
            blocksSearchCont.style.display = "none";
            biomesCont.style.display = "none";
            biomesOverlayCont.style.display = "none";
            noiseModCont.style.display = "block";
            climateCont.style.display = "none";
            terrainCont.style.display = "none";
        }else if (newState == 6){ //CLIMATE
            treesCont.style.display = "none";
            treesOverlayCont.style.display = "none";
            blocksCont.style.display = "none";   
            blocksOverlayCont.style.display = "none";
            blocksSearchCont.style.display = "none";
            biomesCont.style.display = "none";
            biomesOverlayCont.style.display = "none";
            noiseModCont.style.display = "none";
            climateCont.style.display = "block";
            terrainCont.style.display = "none";
        }else if (newState == 7){ //TERRAIN
            treesCont.style.display = "none";
            treesOverlayCont.style.display = "none";
            blocksCont.style.display = "none";   
            blocksOverlayCont.style.display = "none";
            blocksSearchCont.style.display = "none";
            biomesCont.style.display = "none";
            biomesOverlayCont.style.display = "none";
            noiseModCont.style.display = "none";
            climateCont.style.display = "none";
            terrainCont.style.display = "block";
        }
        state = newState;
   },
   
   OpenFile: function(){
        this.OpenFileDialog();
   },
   
   GenerateBlockList: function(blocklState, prompt, BlocksArray){
        var element = document.getElementById("Blocks-Search");
        BlockListState = blocklState;
        element.innerHTML = prompt + "<button onclick='AppInterface.ChangeState(2)'>Cancel</button></br></br>"; //clear it out and start over every time
        var html = "";
        if (BlockListState == 2){
            html = html + "<input type = 'radio' name = 'brads' id = 'radCopy' checked = '' value = '1' /><label for = 'sizeMed'>Copy</label>";
            html = html + " <input type = 'radio' name = 'brads' checked = 'checked' id = 'radSwap' value = '0' /><label for = 'sizeMed'>Swap</label></br>";
        }
        
        for (var i = 0; i < BlocksArray.length; i+=2){
            html = html + "<button data-bid=" + BlocksArray[i] + " onclick='AppInterface.GetBlock(this.getAttribute(\"data-bid\"))'>" + BlocksArray[i] + " " + BlocksArray[i+1] + "</button>";
        }
        element.innerHTML = element.innerHTML + html;
        AppInterface.ChangeState(3);
   },
   
   GetBlock: function(bid){
        var mode = 0;
        if (BlockListState == 2){
            if (document.getElementById("radSwap").checked == ''){
                mode = 1;
            }
        }
        this.RequestBlock(BlockListState, bid, mode);
   },
   
   ChangeAltColorsSize: function(type){
        var altColorsList = document.getElementById("AltColorList");
        if (type == 1 && altColorsNumber < 15){
            altColorsNumber+=1;
            var element = document.getElementById("AltColorDropd" + (altColorsNumber));
            element.style.display = "block";
            this.ResizeAltColors(1);
        }else if (type == 0 && altColorsNumber > 0){
            altColorsNumber-=1;
            var listTop = document.getElementById("DropBoxAltColor");
            var element = document.getElementById("AltColorDropd" + (altColorsNumber+1));
            if (listTop.getAttribute("data-selected") == element.getAttribute("data-index")){
                setAltColorDropDown("AltColorDropd0");
            }
            element.style.display = "none";
            this.ResizeAltColors(0);
        }
        document.getElementById("altColorsNumber").innerHTML = altColorsNumber;
   },
   
   SetSliderValue: function(element, index, value){
        $("#" + element  + "slider-range" + index).slider( "values", 0, [ value ]);
        $( '#' + element + 'amount' + index).val(value);
   },
   
   SetClimate: function(temperature, rainfall){
        $("#cTempSlider").slider( "values", 0, [ temperature ]);
        document.getElementById('tempSlideLabel').innerHTML = "Temperature: " + temperature;
        $("#cRainSlider").slider( "values", 0, [ rainfall ]);
        document.getElementById('rainSlideLabel').innerHTML = "Rainfall: " + rainfall;
   },
   
   SetNoiseTypes: function(typesArray)
   {
        var element = document.getElementById('NoiseTypes');
        var html = "";
        for (var i = 0; i < typesArray.length; i = i + 2){ //packs of variables, ID then name
        html = html + "<button class='button' onclick='AppInterface.Help(" + typesArray[i] + ")'>?</button>";
            html = html + "<input type='radio' id='noiseRadio" + typesArray[i] + "' name='typesgroup' value='" + typesArray[i] + "' onclick='AppInterface.SetType(" + typesArray[i] + ")'>" + typesArray[i+1] + "<br>"
        }
        element.innerHTML = html;
   },
   
   SetNoiseControls: function(name, type, variableArray)
   {
        document.getElementById('currentNoiseTextBox').value = name;
        document.getElementById('noiseRadio' + type).checked = "checked";
         for (var i = 0; i < variableArray.length; i = i + 7){ //packs of 7 variables: active, label, min, max, step, id then value
            if (variableArray[i] == 1){ //check if it is active
                if (document.getElementById("Noise-Mod" + variableArray[i+5]) != null){  //drop box
                    document.getElementById("Noise-Mod" + variableArray[i+5]).style.display = "block";
                    document.getElementById("Noise-Mod" + variableArray[i+5]).style.display = "block";
                    document.getElementById("Noise-Moddroptxt" + variableArray[i+5]).style.display = "block";
                    var id = "Noise-ModDropd" + variableArray[i] + "," + variableArray[i+6];
                    setDropDown(id);             
                }else if (document.getElementById("Noise-Modslider-range" + variableArray[i+5]) != null){ //slider   
                    document.getElementById("Noise-Modslider-range" + variableArray[i+5]).style.display = "block";      
                    document.getElementById("Noise-Modlabel" + variableArray[i+5]).style.display = "block"; 
                    document.getElementById("Noise-Modamount" + variableArray[i+5]).style.display = "block";
                    document.getElementById("Noise-Modlabel" + variableArray[i+5]).innerHTML = variableArray[i+1] + ": ";   
                    $("#Noise-Modslider-range" + variableArray[i+5]).slider( "option", "min", variableArray[i+2] );
                    $("#Noise-Modslider-range" + variableArray[i+5]).slider( "option", "max", variableArray[i+3] );   
                    $("#Noise-Modslider-range" + variableArray[i+5]).slider( "option", "step", variableArray[i+4] );  
                    $("#Noise-Modslider-range" + variableArray[i+5]).slider( "values", 0, [ variableArray[i+6] ]);
                    $( '#Noise-Modamount' + variableArray[i+5]).val(variableArray[i+6]);
                }
            }else{
                if (document.getElementById("Noise-Mod" + variableArray[i+5]) != null){  //drop box
                    document.getElementById("Noise-Mod" + variableArray[i+5]).style.display = "none";
                    document.getElementById("Noise-Moddroptxt" + variableArray[i+5]).style.display = "none";
                }else if (document.getElementById("Noise-Modslider-range" + variableArray[i+5]) != null){ //slider                
                    document.getElementById("Noise-Modslider-range" + variableArray[i+5]).style.display = "none"; 
                    document.getElementById("Noise-Modlabel" + variableArray[i+5]).style.display = "none"; 
                    document.getElementById("Noise-Modamount" + variableArray[i+5]).style.display = "none"; 
                }
            }
        }
        this.ChangeState(5);
   },
   
   SetNoiseList: function(element, NoiseArray) //simply a list of names for the noise function
   {
        var element = document.getElementById(element);
        var html = "";
        for (var i = 0; i < NoiseArray.length; i = i + 1){
            html = html + "<span class='NoiseSpan'>";
            html = html + "<button class='button' onclick='AppInterface.RequestNoise(" + i + ")'>" + NoiseArray[i] + "</button>";
            html = html + "<button class='button' onclick='AppInterface.ChangeNoisePosition(" + i + "," + 0 + ")'> - </button>";
            html = html + "<button class='button' onclick='AppInterface.ChangeNoisePosition(" + i + "," + 1 + ")'> + </button>";
            html = html + "<button class='button' onclick='AppInterface.DeleteNoise(" + i + ")'>Delete</button>";
            html = html + "</span>";
        }
        element.innerHTML = html;
   },
   
   SetIsBaseBiome: function(IsBase)
   {
        if (IsBase == 1){
            document.getElementById("DistributionNoiseLegend").style.display = "none";
            document.getElementById("TerrainNoiseLegend").style.display = "none";
        }else{
            document.getElementById("DistributionNoiseLegend").style.display = "block";
            document.getElementById("TerrainNoiseLegend").style.display = "block"
        }
   },
   /* The following methods are inserted by the application on startup.
   
       Quit();  Quits the program 
       SelectTree(name);  Sets a new tree as the current editor tree
       ChangeVariable(id, value);  Gives a variable a new value
       GenerateNewSeed();  Generates a new tree seed
       OpenFileDialog();
       ChangeTreeName(name); Changes name of tree
       RequestChangeState(state); Requests that the c++ application change state. ChangeState will be called if confirmed.
       Regenerate(); //Requests that the application regenerate the current world
       RequestBlockList(); //Requests a block list to be built
       RequestNoise(); //Requests noise details -1 = distribution noise
       New();
       LoadFile();
       Save();
       SaveAs();
   */
};

function New(){
    if (state == 1){ //trees
        AppInterface.New();
    }else if (state == 2){ //blocks
        AppInterface.RequestBlockList("New");
    }
}

function Open(){
    if (state == 1){ //trees
        AppInterface.OpenFile();
    }else if (state == 2){ //blocks
        AppInterface.RequestBlockList("Open");
    }else if (state == 4){ //biome editor
        AppInterface.OpenFile();
    }
}

function Save(){
    if (state == 1 || state == 2){ //trees or blocks
        AppInterface.Save();
    }
}

function SaveAs(){
    if (state == 1 || state == 2){ //trees or blocks
        AppInterface.SaveAs();
    }
}

function setSlider(value, node){
	$(node).val(value);
}

function setDropDown(source){
	var element = document.getElementById(source);	
    if (element != null){
        var listTop = document.getElementById(element.getAttribute('data-parent') + element.getAttribute('data-pid'));
        listTop.innerHTML = '<span>' + element.innerHTML + '</span>';
        listTop.setAttribute("data-selected", element.getAttribute('data-index'));
    }
}

function setAltColorDropDown(source){
	var element = document.getElementById(source);	
    if (element != null){
        var listTop = document.getElementById(element.getAttribute('data-parent') + element.getAttribute('data-pid'));
        listTop.innerHTML = '<span>' + element.innerHTML + '</span>';
        listTop.setAttribute("data-selected", element.getAttribute('data-index'));
        document.getElementById("altr").innerHTML = "R: " + element.getAttribute('data-r');
        $("#altSliderR").slider( "values", 0, element.getAttribute('data-r'));
        document.getElementById("altg").innerHTML = "R: " + element.getAttribute('data-g');
        $("#altSliderG").slider( "values", 0, element.getAttribute('data-g'));
        document.getElementById("altb").innerHTML = "R: " + element.getAttribute('data-b');
        $("#altSliderB").slider( "values", 0, element.getAttribute('data-b'));
        altColorActive = element.getAttribute('data-index');
    }
}

function changeDropDown(source){
	var element = document.getElementById(source);	
    if (element != null){
        var listTop = document.getElementById(element.getAttribute('data-parent') + element.getAttribute('data-pid'));
        listTop.innerHTML = '<span>' + element.innerHTML + '</span>';
        listTop.setAttribute("data-selected", element.getAttribute('data-index'));
        AppInterface.ChangeVariable(element.getAttribute('data-pid'), element.getAttribute('data-index'));
    }
}

function changeAltColorDropDown(source){
    var element = document.getElementById(source);	
    if (element != null){
        var listTop = document.getElementById(element.getAttribute('data-parent') + element.getAttribute('data-pid'));
        listTop.innerHTML = '<span>' + element.innerHTML + '</span>';
        listTop.setAttribute("data-selected", element.getAttribute('data-index'));
        document.getElementById("altr").innerHTML = "R: " + element.getAttribute('data-r');
        $("#altSliderR").slider( "values", 0, element.getAttribute('data-r'));
        document.getElementById("altg").innerHTML = "G: " + element.getAttribute('data-g');
        $("#altSliderG").slider( "values", 0, element.getAttribute('data-g'));
        document.getElementById("altb").innerHTML = "B: " + element.getAttribute('data-b');
        $("#altSliderB").slider( "values", 0, element.getAttribute('data-b'));
        altColorActive = element.getAttribute('data-index');
        AppInterface.ChangeVariable("BlockAltColor", element.getAttribute('data-index'), element.getAttribute('data-r'), element.getAttribute('data-g'), element.getAttribute('data-b'));
    }
}

function replaceContentInContainer(target,source) {
    document.getElementById(target).innerHTML = document.getElementById(source).innerHTML;
}

function InitializeBlockRGBSliders() {
    blockRgbSliderInitialized = 1;
    var slideHtml;
    var labelHtml;
    
    labelHtml = $("<label for='altSliderR' id='altr'>R: 0</label>")
    slideHtml = $("<div id='altSliderR' data-index='0'></div>"); 
    slideHtml.slider({
        range: false,
        min: 0,
        max: 255,
        step: 1,
        values: [ 0 ],  
        slide: function( event, ui ) {
            if (altColorActive != 0){
                var element = document.getElementById("AltColorList").childNodes[altColorActive].firstChild;
                element.setAttribute("data-r", ui.values[ 0 ]);
                element.innerHTML = element.getAttribute("data-r") + "," + element.getAttribute("data-g") + "," + element.getAttribute("data-b");
                changeAltColorDropDown(element.id);
            }
            document.getElementById('altr').innerHTML = "R: " + ui.values[ 0 ];
           // AppInterface.ChangeVariable(this.getAttribute('data-index'), ui.values[ 0 ]);
        }          
    });  
    $("#altrgbsliders").append(labelHtml);
    $("#altrgbsliders").append(slideHtml);
    labelHtml = $("<label for='altSliderG' id='altg'>G: 0</label>")
    slideHtml = $("<div id='altSliderG' data-index='0'></div>"); 
    slideHtml.slider({
        range: false,
        min: 0,
        max: 255,
        step: 1,
        values: [ 0 ],  
        slide: function( event, ui ) {
            if (altColorActive != 0){
                var element = document.getElementById("AltColorList").childNodes[altColorActive].firstChild;
                element.setAttribute("data-g", ui.values[ 0 ]);
                element.innerHTML = element.getAttribute("data-r") + "," + element.getAttribute("data-g") + "," + element.getAttribute("data-b"); 
                changeAltColorDropDown(element.id);
            }
            document.getElementById('altg').innerHTML = "G: " + ui.values[ 0 ];
           // AppInterface.ChangeVariable(this.getAttribute('data-index'), ui.values[ 0 ]);
        }          
    });  
    $("#altrgbsliders").append(labelHtml);
    $("#altrgbsliders").append(slideHtml);
    labelHtml = $("<label for='altSliderB' id='altb'>B: 0</label>")
    slideHtml = $("<div id='altSliderB' data-index='0'></div>"); 
    slideHtml.slider({
        range: false,
        min: 0,
        max: 255,
        step: 1,
        values: [ 0 ],  
        slide: function( event, ui ) {
            if (altColorActive != 0){
                var element = document.getElementById("AltColorList").childNodes[altColorActive].firstChild;
                element.setAttribute("data-b", ui.values[ 0 ]);
                element.innerHTML = element.getAttribute("data-r") + "," + element.getAttribute("data-g") + "," + element.getAttribute("data-b");
                changeAltColorDropDown(element.id);
            }
            document.getElementById('altb').innerHTML = "B: " + ui.values[ 0 ];
           // AppInterface.ChangeVariable(this.getAttribute('data-index'), ui.values[ 0 ]);
        }          
    });  
    $("#altrgbsliders").append(labelHtml);
    $("#altrgbsliders").append(slideHtml);
}

function InitializeClimateSliders()
{
    climateSlidersInitialized = 1;
    var slideHtml;
    var labelHtml;
    
    labelHtml = $("<label for='cTempSlider' id='tempSlideLabel'>Temperature: 128</label>")
    slideHtml = $("<div id='cTempSlider' data-index='0'></div>"); 
    slideHtml.slider({
        range: false,
        min: 0,
        max: 255,
        step: 1,
        values: [ 128 ],  
        slide: function( event, ui ) {
            AppInterface.SetTemperature(ui.values[0]);
            document.getElementById('tempSlideLabel').innerHTML = "Temperature: " + ui.values[ 0 ];
           // AppInterface.ChangeVariable(this.getAttribute('data-index'), ui.values[ 0 ]);
        }          
    });  
    $("#climateSliders").append(labelHtml);
    $("#climateSliders").append(slideHtml);
    labelHtml = $("<label for='cRainSlider' id='rainSlideLabel'>Rainfall: 128</label>")
    slideHtml = $("<div id='cRainSlider' data-index='0'></div>"); 
    slideHtml.slider({
        range: false,
        min: 0,
        max: 255,
        step: 1,
        values: [ 128 ],  
        slide: function( event, ui ) {
            AppInterface.SetRainfall(ui.values[0]);
            document.getElementById('rainSlideLabel').innerHTML = "Rainfall: " + ui.values[ 0 ];
           // AppInterface.ChangeVariable(this.getAttribute('data-index'), ui.values[ 0 ]);
        }          
    });  
    $("#climateSliders").append(labelHtml);
    $("#climateSliders").append(slideHtml);
}
