//page settings

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("keypress", jump);

//game variables

let onGround = true;
let leftPressed = false;
let rightPressed = false;
let max_speed = 4;
let characterAcceleration = 0.25;
let onPlat = false;

//game objects

class Character{
    vel_x = 0.0;
    vel_y = 0.0;
    width = 20;
    height = 20;
    colour = "red";
    x = canvas.width/2-this.width;
    y = canvas.height-this.height;
}

class Platform{
    constructor(x , y, width = canvas.width/3){
        this.x = x;
        this.y = y;
        this.onPlatform = false;
        this.width = width;
        this.height = 10;
    }
    
}
//initialize character

let box = new Character();

//initialize platforms

let plat1 = new Platform(0, canvas.height-80);
let plat2 = new Platform(canvas.width/3, canvas.height-160);
let plat3 = new Platform(canvas.width*2/3, canvas.height-240);
let plat4 = new Platform(30, canvas.height - 300, canvas.width/4);
let plat5 = new Platform(200, canvas.height - 390, canvas.width/10);
let plat6 = new Platform(360, canvas.height - 470, canvas.width/10);

let platArray = [plat1, plat2, plat3, plat4, plat5, plat6];

//functions

function drawPlatforms(){
    platArray.forEach(element => {
        drawPlatform(element);
    });
}
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}
function moveCharacter(){
    if(rightPressed && box.vel_x < max_speed) {
        box.vel_x += characterAcceleration;
    }
    else if(leftPressed && box.vel_x > (-max_speed)) {
        box.vel_x += -characterAcceleration;
    }
    if(box.vel_x > max_speed){
        box.vel_x = max_speed;
    }
    else if(box.vel_x < -max_speed){
        box.vel_x = max_speed;
    }
}

function friction(){
    if(onGround || onPlat){
        if(!leftPressed && !rightPressed && box.vel_x < 0){
            box.vel_x += 0.25;
        }
        else if(!leftPressed && !rightPressed && box.vel_x > 0){
            box.vel_x -= 0.25;
        }
    }
}

function drawPlatform(platform){
    ctx.beginPath();
    ctx.rect(platform.x, platform.y, platform.width, platform.height);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

function drawCharacter(){
    ctx.beginPath();
    ctx.rect(box.x, box.y, box.width, box.height);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

function collidePlatUnderside(platform){
    if(box.x + box.vel_x>= platform.x - box.width && box.x + box.vel_x <= platform.x + platform.width){
        if(box.vel_y < 0){
            if(box.y + box.vel_y < platform.y + platform.height && box.y + box.vel_y  > platform.y){
                box.y = platform.y + platform.height;
                box.vel_y = 0;
            }
        }
    }
}

function checkIfOnplat(){
    let isOn = false;
    platArray.forEach(element => {
        if(element.onPlatform){
            isOn = true;
        }
    });
    onPlat = isOn;
}

function collidePlatTopside(platform){
    if(box.x + box.vel_x>= platform.x - box.width && box.x + box.vel_x  <= platform.x + platform.width){
        if(box.vel_y > 0){
            if(box.y + box.vel_y + box.height < platform.y + platform.height && box.y + box.vel_y + box.height > platform.y){
                box.y = platform.y - box.height;
                box.vel_y = 0;
                platform.onPlatform = true;
            }
        }
    }
    else{
        platform.onPlatform = false;
    }
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCharacter();
    gravity();
    friction();
    checkCollision();
    moveCharacter();
    drawPlatforms();
    box.y += box.vel_y;
    box.x += box.vel_x;
}

function jump(e){
    if(e.key = "Space" && (onGround || onPlat)){
        box.vel_y = -8;
        onGround = false;
        platArray.forEach(element => {
            element.onPlatform = false;
        });
        onPlat = false;
    }
}
function gravity(){

    if(!onGround && !onPlat && box.vel_y < 8){
        box.vel_y += 0.25;
    }
}
function checkCollision(){
    if(box.y + box.vel_y >= canvas.height-box.height){
        box.y = canvas.height-box.height;
        box.vel_y = 0;
        onGround = true;
    }
    if (box.x < 0){
        box.x = 0;
    }
    if (box.x + box.width > canvas.width){
        box.x = canvas.width - box.width;
    }
    platArray.forEach(element => {
        collidePlatTopside(element);
        collidePlatUnderside(element);
    });
    checkIfOnplat();
}
setInterval(draw, 10);
