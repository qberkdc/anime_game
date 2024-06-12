let stage = 1;
let level = 1
let exp = 0
let max_exp = 200
let coin = 0
let health = 100;
let maxHealth = 100;
let global_damage = 5;
let energy = 50
let energyMax = 50
let isAttacking = 0

const pain = [
	"sound/pain1.m4a",
	"sound/pain2.m4a",
	"sound/pain3.m4a",
	"sound/pain4.m4a",
	"sound/pain5.m4a",
	"sound/pain6.m4a",
];

const congratulations = "sound/congratulations.mp3";

const healthBar = document.getElementById("healthBar");
const healthText = document.getElementById("healthText");
const energyBar = document.getElementById("energyBar");
const energyText = document.getElementById("energyText");
const character = document.getElementById("character");
const upgrade = document.getElementById("upgrade");
const stageDisplay = document.getElementById("stage");

function playSound(url) {
  const audio = new Audio(url);
  audio.play();
}
        
function updateHealthBar() {
  maxHealth = 100 + (20 * (stage-1));
  healthText.textContent = `${health} / ${maxHealth}`; // Can miktarını güncelle
  const ratio = health * 100 / maxHealth; // Oranı hesapla
  healthBar.style.width = ratio + "%"; // Can çubuğunun genişliğini ayarla
}

function updateEnergyBar() {
  energyText.textContent = `${energy} / ${energyMax}`; // Can miktarını güncelle
  const ratio = energy * 100 / energyMax; // Oranı hesapla
  energyBar.style.width = ratio + "%"; // Can çubuğunun genişliğini ayarla
}

updateHealthBar(); // Sayfa yüklendiğinde can çubuğunu güncelle

character.addEventListener("click", (event) => {
 if(health > 0) {
  const damage = Math.floor(Math.random() * 7) + global_damage; // Rastgele 10-16 arası hasar

  // Partikül oluştur ve hareketini tanımla
  for (let i = 0; i < 10; i++) { // 10 adet partikül oluştur
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.top = event.clientY + "px"; // Mouse yatay pozisyonu
    particle.style.left = event.clientX + "px"; // Mouse dikey pozisyonu
    particle.style.setProperty("--x", Math.random() * 200 - 100 + "px"); // Rastgele yön (x ekseni)
    particle.style.setProperty("--y", Math.random() * 200 - 100 + "px"); // Rastgele yön (y ekseni)
    document.body.appendChild(particle);

    // Partikülü ekrandan kaldır
    setTimeout(() => {
      particle.remove();
    }, 1000); // 1 saniye sonra partikülü kaldır
  }
	
  if (energy >= 3 && health > 0) {
    if(!isAttacking) { isAttacking = 1; }
    let timeoutID = setTimeout(() => { isAttacking = 0; }, 1000); clearTimeout(timeoutID);
    timeoutID = setTimeout(() => { isAttacking = 0; }, 1000);
    energy -= 3; health -= damage; updateHealthBar(); // Can çubuğunu güncelle
    updateEnergyBar();
    const soundID = Math.floor(Math.random() * pain.length);
    playSound(pain[soundID]);
  }
  
  if (health <= 0) {
    health = 0; updateHealthBar(); // Can çubuğunu güncelle
    playSound(congratulations);
    
    setTimeout(() => {
    stage++;
    coin += 2.5 + (stage*2) | 0;
    exp += 2 + (stage*1.25) | 0;
    updateLevel(); updateHeader();
    changeCharacter();
    health = 100 + (20 * (stage-1)); // Aşama arttıkça daha fazla can ekle
    updateHealthBar(); // Can çubuğunu güncelle
    }, 2000);
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
}

function updateLevel() {
	while(exp >= max_exp) {
		if (exp >= max_exp) {
			level++;
			exp = 0;
			max_exp += 80;
		}
		else {
			break;
		}
	}
}

function updateHeader() {
	stageDisplay.textContent = `🏞️ ${stage} | 🌀 ${level} - ${exp}/${max_exp} | 🪙 ${coin} | 🔥 ${global_damage}`;
}

upgrade.addEventListener("click", (event) => {
	if(!isAttacking) {
		let price = global_damage / 1.25 | 0;
		let upgraded = global_damage / 2.5 | 0;
		let pricecoin = price - coin;
	
		if (coin < price) {
			var failed = "You need " + pricecoin + " 🪙 for upgrade";
			alert(failed);
		}
		else {
			global_damage += upgraded;
			updateHeader();
			var success = "Your damage upgraded +" + upgraded + " spends " + price + " 🪙";
			alert(success);
			coin -= price;
		}
	}
});

setInterval(reloadEnergy, 200);
updateHealthBar();
updateEnergyBar();
updateHeader();
changeCharacter();