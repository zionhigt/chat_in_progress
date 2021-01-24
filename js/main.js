const logFormulaire = document.getElementById('login');
logFormulaire.addEventListener('submit', function(e){
	e.preventDefault();
	bodyRequest = {
		email: e.target.email.value,
		password: e.target.password.value
	}

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
			sessionStorage.setItem('token', response.token);
			sessionStorage.setItem('userId', response.userId);
			window.location = (response.token) ?  "./salon.html" : "#";
		})
		.catch(error => {console.log(error)});
	})
	.catch(error => {console.log(error)})
});
