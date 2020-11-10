let blocks;
let uploadImageFile;
let link = null;
let inputLink;

const DEFAULT_WALLPAPER = "https://i.imgur.com/GbLUCIk.jpg";

chrome.storage.local.get('linkWallpaper', function(result){
    if(result.linkWallpaper){
        link = result.linkWallpaper;
    }
})

const setCSS = () => {
    const css = `.change-wallpaper{
                    width: 2.2vh;
                    cursor: pointer;
                    padding: 40%;

                }

                .list-options-active{
                    display: block !important;
                }

                .list-options{
                    position: absolute;
                    border-radius: 0.2vw;
                    color: #009588;
                    background-color: #262D31;
                    margin-top: 0%;
                    margin-left: -27%;
                    width: 10vw;
                    display: none;
                    list-style: none;
                    
                }

                .list-options ul{
                    padding: 0.5vw;
                }

                .list-options input{
                    position: absolute;
                    width: 10vh;
                    opacity: 0;
                    font-size: 1;
                    border: none;
                }

                .list-options input #file-upload-button{
                    cursor: pointer;
                }

                .list-options ul:hover{
                    font-weight: bold;
                }

    `

    const style = document.createElement('style');
    
    style.appendChild(document.createTextNode(css));

    document.getElementsByTagName('head')[0].appendChild(style);
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const changeWallpaper = () => {
    uploadImageFile = document.querySelector("#image-wallpaper-upload");

    if(uploadImageFile.files.length){
        
        const image = uploadImageFile.files[0];
        uploadImageFile.value = "";
        const reader = new FileReader();

        reader.onload = function(event) {
            link = event.target.result;
            chrome.storage.local.set({'linkWallpaper': link}, function() {
                console.log('Link is set to ' + link);
            });
            
            setWallpaper();
        };
        
        reader.readAsDataURL(image);

    }
    else{
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
   
}

const setWallpaper = () => {
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

const createButton = () => {
    const header = document.getElementsByTagName('header');
    const button = document.createElement('img');
    const options = document.createElement('div');
    const list = document.createElement('li');
    const sendImage = document.createElement('ul');
    const sendLink = document.createElement('ul');
    const resetWallpaper = document.createElement('ul');
    const uploadImage = document.createElement('input');

    button.setAttribute("src", "https://gemolstpc.ga/reload.svg");
    button.setAttribute("class", "change-wallpaper");

    uploadImage.setAttribute("type", "file");
    uploadImage.setAttribute("id", "image-wallpaper-upload");

    sendImage.appendChild(uploadImage);
    sendImage.appendChild(document.createTextNode("Upload Image"));
    sendLink.appendChild(document.createTextNode("Use Link"));
    resetWallpaper.appendChild(document.createTextNode("Reset Wallpaper"));

    list.appendChild(sendImage);
    list.appendChild(sendLink);
    list.appendChild(resetWallpaper);
    list.setAttribute("class", "list-options")

    

    options.setAttribute("class", "drop-options");
    options.appendChild(button);
    options.appendChild(list);
    
    header[0].appendChild(options);
    
    options.addEventListener('click', ()=>{
        list.classList.toggle("list-options-active");
    });
    sendLink.addEventListener('click', changeWallpaper);
    sendImage.addEventListener('input', changeWallpaper);
    resetWallpaper.addEventListener('click', ()=>{

        chrome.storage.local.set({'linkWallpaper': DEFAULT_WALLPAPER}, function() {
            console.log('Link is set to ' + DEFAULT_WALLPAPER);
            setWallpaper();
        });

        
    
    });
}

const start = async () => {

    blocks = document.querySelector('#pane-side');
    if(blocks){
        setCSS();
        createButton();
        blocks.addEventListener('click', setWallpaper);
    }
    else{
        await sleep(3000);
        start();
    }
    
}

start();
