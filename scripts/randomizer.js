// Set up event listeners for all checkboxes and load their states from localStorage
await new Promise(resolve => setTimeout(resolve, 100)); // lol i mean gotta wait
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(checkbox => {
	const storedValue = localStorage.getItem(checkbox.name);
	checkbox.checked = storedValue === 'true';

	checkbox.addEventListener('change', () => {
		localStorage.setItem(checkbox.name, checkbox.checked);
	});
});


// Run the generator!
document.getElementById('generate').addEventListener('click', () => {
	let numBeys = document.getElementById('num-beys').value;
	let selectedParts = getSelection();

	// Ensure there are enough parts to choose from
	if (selectedParts.blades.length < numBeys || selectedParts.ratchets.length < numBeys || selectedParts.bits.length < numBeys) {
		alert('Not enough parts selected!');
		return;
	}

	// Generate the beys
	let beys = [];
	for (let i = 0; i < numBeys; i++) {
		let bey = {};

		let bladeIndex = Math.floor(Math.random() * selectedParts.blades.length);
		let bladeName = selectedParts.blades[bladeIndex];
		let bladeImg = partsJson.blades.find(blade => blade.name === bladeName).img;
		bey.blade = { name: bladeName, img: bladeImg };
		selectedParts.blades.splice(bladeIndex, 1);

		// If CX main blade, also select assist blade and lock chip
		if (partsJson.blades.find(blade => blade.name === bladeName).type === "custom") {
			let assistIndex = Math.floor(Math.random() * selectedParts.custom.assists.length);
			let assistName = selectedParts.custom.assists[assistIndex];
			let assistImg = partsJson.custom.assists.find(assist => assist.name === assistName).img;
			bey.assist = { name: assistName, img: assistImg };
			selectedParts.custom.assists.splice(assistIndex, 1);

			let lockIndex = Math.floor(Math.random() * selectedParts.custom.lockchips.length);
			let lockName = selectedParts.custom.lockchips[lockIndex];
			let lockImg = partsJson.custom.lockchips.find(lock => lock.name === lockName).img;
			bey.lock = { name: lockName, img: lockImg };
		}

		let ratchetIndex = Math.floor(Math.random() * selectedParts.ratchets.length);
		let ratchetName = selectedParts.ratchets[ratchetIndex];
		let ratchetImg = partsJson.ratchets.find(ratchet => ratchet.name === ratchetName).img;
		bey.ratchet = { name: ratchetName, img: ratchetImg };
		selectedParts.ratchets.splice(ratchetIndex, 1);

		if (ratchetName !== "Turbo") {
			let bitIndex = Math.floor(Math.random() * selectedParts.bits.length);
			let bitName = selectedParts.bits[bitIndex];
			let bitImg = partsJson.bits.find(bit => bit.name === bitName).img;
			bey.bit = { name: bitName, img: bitImg };
			selectedParts.bits.splice(bitIndex, 1); // Remove selected part
		}

		beys.push(bey);
	}

	// Display the generated beys
	function partPrefab(name, img) {
		return `
		<article style="background-color: #1C212C; width: 12rem;">
					<h6 style="text-align: center;">${name}</h6>
					<div style="display: flex; justify-content: center; align-items: center; padding: 0.5rem;">
						<img src="${img}" alt="${name}" style="max-height: 6rem;" />
					</div>
				</article>
		`
	}

	const outputContainer = document.getElementById('beys-container');
	outputContainer.innerHTML = ''; // Clear previous output
	for (const bey of beys) {
		let container = document.createElement('div');
		container.className = 'bey';
		for (const [partType, part] of Object.entries(bey)) {
			container.innerHTML += partPrefab(part.name, part.img);
		}
		outputContainer.appendChild(container);
	}
});


// Select and Deselect all buttons
document.getElementById('select-all').addEventListener('click', () => {
	if (confirm('Are you sure you want to select all parts?')) {
		checkboxes.forEach(checkbox => {
			checkbox.checked = true;
			localStorage.setItem(checkbox.name, 'true');
		});
	}
});


// Deselect all button
document.getElementById('deselect-all').addEventListener('click', () => {
	if (confirm('Are you sure you want to deselect all parts?')) {
		checkboxes.forEach(checkbox => {
			checkbox.checked = false;
			localStorage.setItem(checkbox.name, 'false');
		});
	}
});


// Export button
document.getElementById('export').addEventListener('click', () => {
	const selectedParts = getSelection();
	let element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(selectedParts)));
	element.setAttribute('download', 'beyblade-x-selections.json');
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
});


// Import Button
document.getElementById('import').addEventListener('click', () => {
	let input = elementFromHtml('<input type="file" accept=".json" style="display: none;" />');
	document.body.appendChild(input);
	input.click();

	input.addEventListener('change', () => {
		const file = input.files[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = (e) => {
				const text = e.target.result;
				const data = JSON.parse(text);
				console.log(data);

			
				data.blades.forEach(name => {
					const checkbox = document.querySelector(`input[type="checkbox"][name="${name}"]`);
					if (checkbox) {
						checkbox.checked = true;
						localStorage.setItem(checkbox.name, 'true');
					}
				});

				data.custom.lockchips.forEach(name => {
					const checkbox = document.querySelector(`input[type="checkbox"][name="${name}"]`);
					if (checkbox) {
						checkbox.checked = true;
						localStorage.setItem(checkbox.name, 'true');
					}
				});

				data.custom.assists.forEach(name => {
					const checkbox = document.querySelector(`input[type="checkbox"][name="${name}"]`);
					if (checkbox) {
						checkbox.checked = true;
						localStorage.setItem(checkbox.name, 'true');
					}
				});

				data.ratchets.forEach(name => {
					const checkbox = document.querySelector(`input[type="checkbox"][name="${name}"]`);
					if (checkbox) {
						checkbox.checked = true;
						localStorage.setItem(checkbox.name, 'true');
					}
				});

				data.bits.forEach(name => {
					const checkbox = document.querySelector(`input[type="checkbox"][name="${name}"]`);
					if (checkbox) {
						checkbox.checked = true;
						localStorage.setItem(checkbox.name, 'true');
					}
				});
			};

			reader.readAsText(file);
		}
	});
});


// Util functions
function elementFromHtml(html) {
	const template = document.createElement('template');
	template.innerHTML = html.trim();
	return template.content.firstChild;
}


function getSelection() {
	let selectedParts = {
		"blades": [],
		"custom": {
			"lockchips": [],
			"assists": []
		},
		"ratchets": [],
		"bits": []
	}

	// Gather selected parts based on checkboxes
	checkboxes.forEach(checkbox => {
		if (checkbox.checked) {
			if (partsJson.blades.find(blade => blade.name === checkbox.name)) {
				selectedParts.blades.push(checkbox.name);
			} else if (partsJson.custom.lockchips.find(lockchip => lockchip.name === checkbox.name)) {
				selectedParts.custom.lockchips.push(checkbox.name);
			} else if (partsJson.custom.assists.find(assist => assist.name === checkbox.name)) {
				selectedParts.custom.assists.push(checkbox.name);
			} else if (partsJson.ratchets.find(ratchet => ratchet.name === checkbox.name)) {
				selectedParts.ratchets.push(checkbox.name);
			} else if (partsJson.bits.find(bit => bit.name === checkbox.name)) {
				selectedParts.bits.push(checkbox.name);
			}
		}
	});

	return selectedParts;
}