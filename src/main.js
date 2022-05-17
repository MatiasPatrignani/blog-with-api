const container = document.querySelector('.article__section--posts');

const postUrl = 'http://localhost:3000/posts';
const commentUrl = 'http://localhost:3000/comments';

fetch(postUrl)
    .then((response) => response.json())
    .then((data) => {
        data.forEach((element) => {
            let template = document.getElementById('post');
            let divContainer = document.createElement('div');

            const h3 = template.content.querySelector('h3');
            h3.textContent = element.title;

            const p = template.content.querySelector('p');
            p.textContent = element.body;
            
            template.content.querySelector('[role="button"]').dataset.id = element.id;

            template.content.querySelector('[role="btn-edit"]').dataset.id =
                element.id;

                
                const clone = document.importNode(template.content, true);
                container.appendChild(clone);
        });

        // BUTTON EDIT
        const editButton = document.querySelectorAll('[role="btn-edit"]');
        editButton.forEach((button) => {
            //MODAL POST API
            button.addEventListener('click', () => {
                const commentsDivs = document.querySelectorAll('.test');
                commentsDivs.forEach((comment) => {
                    comment.remove();
                });
                fetch('http://localhost:3000/posts/' + button.dataset.id)
                    .then((res) => res.json())
                    .then((post) => {
                        const title = document.querySelector('.modal-title');
                        const body = document.querySelector('.modal-body');
                        title.textContent = post.title;
                        body.textContent = post.body;
                        // MODAL USER API
                        fetch('http://localhost:3000/users/' + post.userId)
                            .then((res) => res.json())
                            .then((user) => {
                                const modalUser = document.querySelector('#userName');
                                const modalEmail = document.querySelector('#email');
                                modalUser.textContent = user.name;
                                modalEmail.textContent = user.email;
                            });
                        const btnCmt = document.getElementById('btnLoadComments');
                        btnCmt.addEventListener('click', () => {
                            fetch('http://localhost:3000/comments?postId=' + post.id)
                                .then((res) => res.json())
                                .then((comments) => {
                                    comments.forEach((comment) => {
                                        const commentsContainer = document.createElement('div');
                                        commentsContainer.classList.add('test', 'p-3');
                                        console.log(commentsContainer);
                                        const commentsBody = document.createElement('p');
                                        const commentsName = document.createElement('h6');
                                        const commentsEmail = document.createElement('p');
                                        commentsName.textContent = comment.name;
                                        commentsBody.textContent = comment.body;
                                        commentsEmail.textContent = comment.email;
                                        commentsContainer.appendChild(commentsName);
                                        commentsContainer.appendChild(commentsBody);
                                        commentsContainer.appendChild(commentsEmail);
                                        btnCmt.insertAdjacentElement('afterEnd', commentsContainer);
                                    });
                                });
                        });
                    });
            });
        });
        const deleteButtons = document.querySelectorAll('[role="button"]');

        deleteButtons.forEach((element) => {
            element.addEventListener('click', () => {
                fetch('http://localhost:3000/posts/' + element.dataset.id, {
                    method: 'DELETE',
                });
            });
        });
    });


function imagePost() {
    const imgModalUrl = 'https://dog.ceo/api/breeds/image/random';
    fetch(imgModalUrl)
        .then((res) => res.json())
        .then((data => {
            let imgId = document.getElementById('imgId');
            let imgDog = document.createElement('div');
            imgDog.innerHTML = `<img src="${data.message}" style='width:100%' height='90%' />`;
            imgId.append(imgDog);
            console.log(imgDog);
        }))
}
imagePost()
