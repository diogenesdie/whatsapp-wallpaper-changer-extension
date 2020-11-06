let blocks;
let link = null;
let inputLink;

const DEFAULT_WALLPAPER = "https://i.imgur.com/GbLUCIk.jpg";

chrome.storage.local.get('linkWallpaper', function(result){
    if(result.linkWallpaper){
        link = result.linkWallpaper;
    }
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function changeWallpaper(){
    inputLink = prompt("Insert the link of the image you want to use: \n(leave blank for no changes or cancel to set default wallpaper)");
    if(inputLink == ""){
        return;
    }

    if(inputLink){
        if(!inputLink.toLocaleLowerCase().includes("http")){
            alert("You must insert a link!")
            return;
        }
    }

    link = inputLink;
    chrome.storage.local.set({'linkWallpaper': link}, function() {
        console.log('Link is set to ' + link);
    });

    setWallpaper();
}

function setWallpaper(){
    const chat = document.querySelector('#main');
    const defautlWallpaper = document.querySelector('._27lSL');

    chrome.storage.local.get('linkWallpaper', function(result){
        if(result.linkWallpaper){
            link = result.linkWallpaper;
        }
    })
    
    if(link === null){
        link = DEFAULT_WALLPAPER;    
    }
    
    chat.setAttribute("style", "background-image: url('"+link+"'); background-repeat: no-repeat; background-size: cover; background-position: center;");
    defautlWallpaper.setAttribute("style", "opacity: 0;");
    
    blocks.addEventListener('click', ()=>{
        chat.style = "background-image: url('"+link+"'); background-repeat: no-repeat; background-size: cover; background-position: center;"
        defautlWallpaper.setAttribute("style", "opacity: 0;");
    });
    
}

function createButton(){
    const header = document.getElementsByTagName('header');

    const button = document.createElement('span');
    const textForButton = document.createTextNode("Change Wallpaper");

    button.setAttribute("style", "cursor: pointer; color: #080808; background-color: #EEE; border: 0.1vw solid #EEE; border-radius: 1vw; padding: 1%");
    button.appendChild(textForButton)
    button.setAttribute('id', 'change-wallpaper');
    
    header[0].appendChild(button);
    
    button.addEventListener('click', changeWallpaper);
}

async function start(){

    blocks = document.querySelector('#pane-side');
    if(blocks){
        createButton();
        blocks.addEventListener('click', setWallpaper);
    }
    else{
        await sleep(3000);
        start();
    }
    
}

start();
