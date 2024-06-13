let stage = 1;
let level = 1;
let exp = 0;
let isTime = 1;
let time = 30;
let max_exp = 200;
let coin = 0;
let health = 100;
let maxHealth = 100;
let global_damage = 5;
let energy = 50;
let energyMax = 50;
let isAttacking = 0;
let isUpgrade = 0;
var character_img = "images/character1.png";

const pain = [
	"sound/pain1.m4a",
	"sound/pain2.m4a",
	"sound/pain3.m4a",
	"sound/pain4.m4a",
	"sound/pain5.m4a",
	"sound/pain6.m4a",
];

const oh = [
	"sound/oh1.mp3",
	"sound/oh2.mp3",
	"sound/oh3.mp3",
	"sound/oh4.mp3",
	"sound/oh5.mp3",
	"sound/oh6.mp3",
	"sound/oh7.mp3",
];

const congratulations = "sound/congratulations.mp3";
const hehe = "sound/hehe.mp3";
const hayai = "sound/hayai.mp3";
const good_job = "sound/good_job.mp3";
const game_over = "sound/game_over.mp3";
const yada = "sound/yada.mp3";

const healthBar = document.getElementById("healthBar");
const healthText = document.getElementById("healthText");
const energyBar = document.getElementById("energyBar");
const energyText = document.getElementById("energyText");
const character = document.getElementById("character");
const upgrade_damage = document.getElementById("upgrade_damage");
const upgrade_energy = document.getElementById("upgrade_energy");
const stageDisplay = document.getElementById("stage");

function setCookie(variable, value) {
    document.cookie = variable + "=" + value + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
}

function getCookie(variable) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(variable + "=") === 0) {
            return cookie.substring(variable.length + 1);
        }
    }
    return "";
}

function playSound(url) {
  const audio = new Audio(url);
  audio.play();
}
        
function updateHealthBar() {
  maxHealth = 100 + (80 * (stage-1));
  healthText.textContent = `${health} / ${maxHealth}`;
  const ratio = health * 100 / maxHealth;
  healthBar.style.width = ratio + "%";
}

function updateEnergyBar() {
  energyText.textContent = `${energy} / ${energyMax}`;
  const ratio = energy * 100 / energyMax;
  energyBar.style.width = ratio + "%";
}

character.addEventListener("click", (event) => {
 if(health > 0 && isTime) {
  const damage = Math.floor(Math.random() * 7) + global_damage;
	
  if (energy >= 3 && health > 0) {
	  for (let i = 0; i < 15; i++) {
		let randomsize = 3 + Math.random() * 14
 	   const particle = document.createElement("div");
 	   particle.classList.add("particle");
 	   particle.style.top = event.clientY + "px";
 	   particle.style.left = event.clientX + "px";
 	   particle.style.width = randomsize + "px";
 	   particle.style.height = randomsize + "px";
 	   particle.style.setProperty("--x", Math.random() * 500 - 300 + "px");
 	   particle.style.setProperty("--y", Math.random() * 500 - 300 + "px");
 	   document.body.appendChild(particle);
		
 	   setTimeout(() => {
 	     particle.remove();
 	   }, 1000); 
	  }
 	
		const dmgtxt = document.createElement("div");
		dmgtxt.classList.add("dmgtext");
		dmgtxt.style.top = event.clientY + "px";
		dmgtxt.style.left = event.clientX + "px";
		dmgtxt.style.setProperty("--x", Math.random() * 100 - 50 + "px");
 	   dmgtxt.style.setProperty("--y", Math.random() * 100 - 50 + "px");
		dmgtxt.textContent = "-" + damage;
		document.body.appendChild(dmgtxt);
  
 	   setTimeout(() => {
 	     dmgtxt.remove();
 	   }, 580); 
 
    if(!isAttacking) { isAttacking = 1; }
    let timeoutID = setTimeout(() => { isAttacking = 0; }, 1000); clearTimeout(timeoutID);
    timeoutID = setTimeout(() => { isAttacking = 0; }, 1000);
    energy -= 3; health -= damage; updateHealthBar();
    updateEnergyBar();
    const soundID = Math.floor(Math.random() * pain.length);
    playSound(pain[soundID]);
  }
  
  if (health <= 0) {
    let reward_coin =  2.5 + (stage*2) | 0;
    let reward_exp = 2 + (stage*1.25) | 0;
    var message = "You won +" + reward_coin + " 🪙 and " + reward_exp + " 🌀";
	showPopup(message, 3000);
	isUpgrade = 1; isAttacking = 1;
    health = 0; updateHealthBar();
    playSound(congratulations);
    isTime = 0;
    
    setTimeout(() => {
    isTime = 1; time = 30;
    isUpgrade = 0; isAttacking = 0;
    stage++;
    coin += reward_coin;
    exp += reward_exp;
    updateLevel(); updateHeader();
    changeCharacter();
    health = 100 + (80 * (stage-1));
    updateHealthBar();
    playSound(hehe);
    }, 3000);
  }
 }
});

function reloadEnergy() {
	if(!isAttacking && health > 0) {
		let amount = 1;
		if (energy < energyMax) {
			energy += amount; updateEnergyBar();
		}
	}
}

const characters = [
	"images/character1.png",
	"images/character2.png",
	"images/character3.png",
	"images/character4.png",
	"images/character5.png",
	"images/character6.png",
	"images/character7.png",
	"images/character8.png",
	"images/character9.png",
	"images/character10.png",
	"images/character11.png",
];

function changeCharacter() {
	const characterID = Math.floor(Math.random() * characters.length);
	const character = document.getElementById("charImage");
	character.src = characters[characterID];
	character_img = characters[characterID];
}

function updateLevel() {
	while(exp >= max_exp) {
		if (exp >= max_exp) {
			level++;
			exp = 0;
			max_exp += 80;
			
			let reward_coin =  17.5 + (level*3.20) | 0;
		    let reward_damage = 8 + (level*2.8) | 0;
		    var message = "You won level up+" + reward_coin + " 🪙 and " + reward_damage + " 🔥";
			showPopup(message, 3000, 60);
			coin += reward_coin;
			global_damage += reward_damage;
	
			playSound(good_job);
		}
		else {
			break;
		}
	}
}

function updateHeader() {
	stageDisplay.textContent = `🏞️ ${stage}    🌀 ${level} ${exp}/${max_exp}    🪙 ${coin}    🔥 ${global_damage}`;
}

upgrade_damage.addEventListener("click", (event) => {
	if(!isAttacking && !isUpgrade) {
		isUpgrade = 1
		let price = global_damage / 1.05 | 0;
		let upgraded = global_damage / 2.5 | 0;
		let pricecoin = price - coin;
	
		if (coin < price) {
			var failed = "You need " + pricecoin + " 🪙 for upgrade";
			const soundID = Math.floor(Math.random() * oh.length);
  		  playSound(oh[soundID]);
			showPopup(failed);
		}
		else {
			global_damage += upgraded; playSound(hayai);
			var success = "Successful +" + upgraded + " spends " + price + " 🪙";
			showPopup(success);
			coin -= price;
		}
		
		updateHeader();
		setTimeout(() => { isUpgrade = 0 }, 1350);
	}
});

upgrade_energy.addEventListener("click", (event) => {
	if(!isAttacking && !isUpgrade) {
		isUpgrade = 1
		let price = energyMax / 5.0 | 0;
		let upgraded = energyMax / 8.5 | 0;
		let pricecoin = price - coin;
	
		if (coin < price) {
			var failed = "You need " + pricecoin + " 🪙 for upgrade";
			const soundID = Math.floor(Math.random() * oh.length);
  		  playSound(oh[soundID]);
			showPopup(failed);
		}
		else {
			energyMax += upgraded; playSound(hayai);
			var success = "Successful +" + upgraded + " spends " + price + " 🪙";
			showPopup(success);
			coin -= price;
		}
		
		updateHeader();
		setTimeout(() => { isUpgrade = 0 }, 1350);
	}
});

function showPopup(message, timeout = 1250, top = 30) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = message;

    document.body.appendChild(popup);

    popup.style.position = 'fixed';
    popup.style.top = top + '%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white'; 
    popup.style.padding = '20px';
    popup.style.fontSize = '10px';
    popup.style.borderRadius = '80px'; 
    popup.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.3)';
    popup.style.opacity = '0';
    popup.style.transition = 'opacity 0.5s'; 

    requestAnimationFrame(() => {
        popup.style.opacity = '1';
    });

    setTimeout(() => {
        popup.style.opacity = '0';
        popup.addEventListener('transitionend', () => {
            popup.remove();
        });
    }, timeout);
}

function timeLeft() {
	if (isTime) {
		if (time) {
			var message = "⏳ " + time;
			showPopup(message, 800, 71);
			time--;
		}
		else {
			isUpgrade = 1; isAttacking = 1;
			var message = "⏳ Game Over";
			showPopup(message, 2500, 71);
			
			playSound(game_over);
			
			time = 30;
			isTime = 0;
			
			setTimeout(() => {
			stage = 1;
			level = 1;
			exp = 0;
			max_exp = 200;
			coin = 0;
			health = 100;
			maxHealth = 100;
			global_damage = 5;
			energy = 50;
			energyMax = 50;
			isAttacking = 0;
			isUpgrade = 0;
			isTime = 1;
			
			updateHealthBar();
			updateEnergyBar();
			updateHeader();
			changeCharacter();
			
			}, 3000);
		}
	}
}

function saveData() {
	setCookie("stage", stage);
	setCookie("level", level);
	setCookie("exp", exp);
	setCookie("expMax", max_exp);
	setCookie("time", time);
	setCookie("coin", coin);
	setCookie("health", health);
	setCookie("maxHealth", maxHealth);
	setCookie("damage", global_damage);
	setCookie("energy", energy);
	setCookie("energyMax", energyMax);
	setCookie("character", character_img);
}

function loadData() {
	if (getCookie("character") === "") {
		return "";
	}
	else {
		stage = parseInt(getCookie("stage"));
		level = parseInt(getCookie("level"));
		exp = parseInt(getCookie("exp"));
		max_exp = parseInt(getCookie("expMax"));
		time = parseInt(getCookie("time"));
		coin = parseInt(getCookie("coin"));
		health = parseInt(getCookie("health"));
		maxHealth = parseInt(getCookie("maxHealth"));
		global_damage = parseInt(getCookie("damage"));
		energy = parseInt(getCookie("energy"));
		energyMax = parseInt(getCookie("energyMax"));
		character_img = getCookie("character");
		
		const character = document.getElementById("charImage");
		character.src = character_img;
	}
}

changeCharacter(); loadData();
setInterval(reloadEnergy, 150);
setInterval(timeLeft, 1000);
setInterval(saveData, 500);
setInterval(updateHealthBar, 80);
setInterval(updateEnergyBar, 80);
setInterval(updateHeader, 80);