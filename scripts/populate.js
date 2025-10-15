function checkboxPrefab(name) {
	return `
	<label>
		<input type="checkbox" name="${name}" />
		${name}
	</label>
	`;
}

let partsJson = {};
fetch('../parts.json')
	.then(response => response.json())
	.then(data => {
		partsJson = data;

		data.blades.forEach(blade => {
			if (blade.type === 'basic') {
				const id = `basic-${blade.release}`;
				const container = document.getElementById(id);
				if (container) {
					container.innerHTML += checkboxPrefab(blade.name);
				}
			} else if (blade.type === 'unique') {
				const container = document.getElementById('unique');
				if (container) {
					container.innerHTML += checkboxPrefab(blade.name);
				}
			} else if (blade.type === 'custom') {
				const container = document.getElementById('custom-main');
				if (container) {
					container.innerHTML += checkboxPrefab(blade.name);
				}
			}
		});

		data.custom.lockchips.forEach(lockchip => {
			const container = document.getElementById('custom-lockchip');
			if (container) {
				container.innerHTML += checkboxPrefab(lockchip.name);
			}
		});

		data.custom.assists.forEach(assist => {
			const container = document.getElementById('custom-assist');
			if (container) {
				container.innerHTML += checkboxPrefab(assist.name);
			}
		});

		data.ratchets.forEach(ratchet => {
			const container = document.getElementById('ratchets');
			if (container) {
				container.innerHTML += checkboxPrefab(ratchet.name);
			}
		});

		data.bits.forEach(bit => {
			const container = document.getElementById('bits');
			if (container) {
				container.innerHTML += checkboxPrefab(bit.name);
			}
		});
	})
	.catch(error => {
		console.error('Error fetching parts.json:', error);
	});