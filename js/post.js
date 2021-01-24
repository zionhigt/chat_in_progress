function actualisePost(){
	fetch("https://chat-in-progress.herokuapp.com/api/post")
	.then(post =>{
		post.json()
		.then(posts => {show(posts)})
		.catch(error => {});
	})
	.catch(error => {
		console.log(error);
		const postDev = {
			message: "Lorem ipsum, dolor, sit amet consectetur adipisicing elit. Amet saepe nesciunt quaerat beatae voluptate exercitationem magni repellendus ex numquam obcaecati perferendis ipsam officia, rem odit eaque. Maiores, odit vero nihil?",
			by: "Dev",
			posting_date: Date.now(),
			likers: [],
			haters: []
		}
		console.log([postDev]);
		show([postDev]);
});
}

const postFormulaire = document.getElementById('postman');
postFormulaire.addEventListener('submit', function(e){
	e.preventDefault();
	bodyRequest = {
		message: e.target.message.value,
		userId: sessionStorage.getItem('userId')
	}

	console.log(sessionStorage);

	fetch(e.target.action, {
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Authorization': "Bearer " + sessionStorage.getItem('token')
		},
		method: e.target.method,
		body: JSON.stringify(bodyRequest)
	})
	.then(response => {
		response.json()
		.then(response => {
			document.querySelector("#message").value = "";
			actualisePost();
			
		})
		.catch(error => {console.log(error)});
	})
	.catch(error => {console.log(error)})
});


const show = posts => {

	const container = document.getElementById('postContainer')
	container.innerHTML = "";
	for(let i in posts)
	{
		let cart = getCartTemplate(posts[i]);
		container.appendChild(cart);
	}
	container.scrollTop = container.scrollHeight;
};

const likingCallBack =  e => {
	e.preventDefault();
	const stats = e.target.parentNode.href.split("/")[5];
	thumbChangeClass(e.target, stats);
	bodyRequest = {
		userId: sessionStorage.getItem('userId')
	}
	fetch(e.target.parentNode.href, {
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Authorization': "Bearer " + sessionStorage.getItem('token')
		},
		method: "POST",
		body: JSON.stringify(bodyRequest)
	})
	.then(response => {
		response.json()
		.then(response => {
			actualisePost();

		})
		.catch(error => {console.log(error)});
	})
	.catch(error => {console.log(error)})


}

const thumbChangeClass = (thumb, state) => {
	switch(state)
	{
		case "like":
			thumb.classList.remove("IDislikeIt");
			thumb.classList.add("ILikeIt");
			break;
		case "dislike":
			thumb.classList.remove("ILikeIt");
			thumb.classList.add("IDislikeIt");
			break;
		default:
			thumb.classList.remove("ILikeIt", "IDislikeIt");
			break;
	}
};
const getCartTemplate = data => {
	const date = new Date();
	const template = document.getElementById("cart");
	const cloneTemplate = document.importNode(template.content, true);
	cloneTemplate.id = data._id;
	cloneTemplate.querySelector(".post__body--message").innerHTML = data.message;
	cloneTemplate.querySelector(".post__header--by").innerHTML = data.by;
	if(data.userId == sessionStorage.getItem("userId"))
	{
		cloneTemplate.querySelector(".post__header--by").classList.add('me');
	}
	cloneTemplate.querySelector(".post__footer--time").innerHTML = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeStyle: 'short' }).format(data.posting_date);
	cloneTemplate.querySelector(".post__footer--likeCount").innerHTML = data.likers.length;
	const thumbUp = cloneTemplate.querySelector(".post__footer--doLike i");
	if(data.likers.indexOf(sessionStorage.getItem("userId")) != -1)
	{
		thumbChangeClass(thumbUp, "like");
	}
	const like = cloneTemplate.querySelector(".post__footer--doLike a");
	like.href = like.href + data._id;
	like.addEventListener("click", likingCallBack);

	cloneTemplate.querySelector(".post__footer--disLikeCount").innerHTML = data.haters.length;
	const thumbDown = cloneTemplate.querySelector(".post__footer--doDislike i");
	if(data.haters.indexOf(sessionStorage.getItem("userId")) != -1)
	{
		thumbChangeClass(thumbDown, "dislike");
	}
	const doDislike = cloneTemplate.querySelector(".post__footer--doDislike a");
	doDislike.href = doDislike.href + data._id;
	doDislike.addEventListener("click", likingCallBack);

	return cloneTemplate;
};
actualisePost();
setInterval(actualisePost, 20000);
