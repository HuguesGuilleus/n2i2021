(function () {
	function main() {
		loadmenu();
	}
	document.readyState == 'loading' ? document.addEventListener('DOMContentLoaded', main, {
		once: true
	}) : main();
}());

async function loadmenu() {
	document.body.insertAdjacentHTML('beforeend',
		await fetch("/menu.html").then(rep => rep.text())
	);
	let menuGroup = document.getElementById("menu-group");
	let bodyList = null;

	function menuSwitch() {
		if (bodyList) {
			for (let e of bodyList) {
				document.body.append(e);
			}
			bodyList = null;
			menuGroup.hidden = true;
		} else {
			bodyList = Array.from(document.body.children);
			bodyList.filter(e => e !== menuGroup).forEach(e => e.remove());
			menuGroup.hidden = false;
		}
	}
	document.getElementById("menu-button-close").addEventListener("click", menuSwitch);
	document.getElementById("menu-button").addEventListener("click", menuSwitch);
	document.addEventListener("keydown", event => {
		if (event.key === "Escape" && bodyList) {
			menuSwitch();
		}
	});

	let user = {
		isconnected: false,
		isadmin: false,
	};
	user.isconnected = await fetch("/isconnected").then(rep => rep.json());
	if (user.isconnected) {
		user.isadmin = await fetch("/isadmin").then(rep => rep.json());
	}
	if (user.isconnected) {
		document.getElementById("menu-login").hidden = true;
		if (!user.isadmin) {
			document.getElementById("menu-waitvalidation").hidden = true;
			document.getElementById("menu-historic").hidden = true;
		}
	} else {
		document.getElementById("menu-add").hidden = true;
		document.getElementById("menu-waitvalidation").hidden = true;
		document.getElementById("menu-historic").hidden = true;
	}
}