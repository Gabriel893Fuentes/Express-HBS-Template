const random = document.getElementById('random');
const bg = ["green", "red", "orange", "pink", "blue"];

for (var i = 0; i < 5; i++) {
	random.style.background.color = bg[i];
}