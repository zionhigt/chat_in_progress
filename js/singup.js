const formulaire = document.querySelector('#sing');
formulaire.addEventListener('submit', function(e){
	e.preventDefault();

	const bodyRequest = {
		email: e.target.email.value,
		name: e.target.name.value ? e.target.name.value : null,
		password: e.target.password.value
	};

	fetch(e.target.action, {
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		method: e.target.method,
		body: JSON.stringify(bodyRequest)
	})
	.then(response => {
		response.json()
		.then(response => {
			console.log(response.status);
			window.location = (response.message == "Utilisateur crée !") ? "./index.html" : "#";
		})
		.catch(error => {console.log(error)});
	})
	.catch(error => {
		console.log(error);
	});
});

