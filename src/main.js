const container = document.querySelector('.article__section--posts');

const postUrl = 'http://localhost:3000/posts?_page=1&_limit=9';

fetch(postUrl)
  .then((response) => response.json())
  .then((postsArray) => {
    postsArray.forEach((post) => {
      let template = document.getElementById('post');

      const h3 = template.content.querySelector('h3');
      h3.textContent = post.title;

      const p = template.content.querySelector('p');
      p.textContent = post.body;

      template.content.querySelector('[role="button"]').dataset.id = post.id;

      template.content.querySelector('[role="btn-edit"]').dataset.id = post.id;

      template.content.querySelector('[role="modal-edit"]').dataset.id =
        post.id;

      const clone = document.importNode(template.content, true);
      container.appendChild(clone);
    });
  });

// Editar New btn
const editModalNew = document.querySelectorAll('[role="modal-edit"]');
const saveFetch = document.querySelector('#saveFetch');
const titleModal = document.querySelector('#edit-title');
const bodyModal = document.querySelector('.bodyArea');
let postId;

editModalNew.forEach((button) => {
  button.addEventListener('click', () => {
    fetch('http://localhost:3000/posts/' + button.dataset.id)
      .then((res) => res.json())
      .then((post) => {
        titleModal.value = post.title;
        bodyModal.value = post.body;
        postId = post.id;
      });
  });
});

saveFetch.addEventListener('click', () => {
  fetch('http://localhost:3000/posts/' + postId, {
    method: 'PATCH',
    body: JSON.stringify({
      title: titleModal.value,
      body: bodyModal.value,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
});

// Button view
let editButton = document.querySelectorAll('[role="btn-edit"]');
const cmtBtn = document.getElementById('comments');

editButton.forEach((button) => {
  button.addEventListener('click', () => {
    cmtBtn.style.display = 'block';
    // remove cooments
    const commentsDivs = document.querySelectorAll('.test');
    commentsDivs.forEach((element) => element.remove());
    // Modal post api
    fetch('http://localhost:3000/posts/' + button.dataset.id)
      .then((response) => response.json())
      .then((post) => {
        const title = document.querySelector('.modal-title');
        const body = document.querySelector('.modal-body');
        title.textContent = post.title;
        body.textContent = post.body;
        //  Modal user api
        fetch('http://localhost:3000/users/' + post.userId)
          .then((res) => res.json())
          .then((user) => {
            const modalUser = document.querySelector('#userName');
            const modalEmail = document.querySelector('#email');
            modalUser.textContent = user.name;
            modalEmail.textContent = user.email;
          });
        // Button comments
        cmtBtn.addEventListener('click', () => {
          fetch('http://localhost:3000/comments?postId=' + post.id)
            .then((res) => res.json())
            .then((comments) => {
              // Every comment setting
              comments.forEach((comment) => {
                const commentsContainer = document.createElement('div');
                commentsContainer.classList.add('test');
                const commentsBody = document.createElement('p');
                const commentsName = document.createElement('h6');
                const commentsEmail = document.createElement('p');
                commentsName.textContent = comment.name;
                commentsBody.textContent = comment.body;
                commentsEmail.textContent = comment.email;
                commentsContainer.appendChild(commentsName);
                commentsContainer.appendChild(commentsBody);
                commentsContainer.appendChild(commentsEmail);
                cmtBtn.insertAdjacentElement('afterend', commentsContainer);
                cmtBtn.style.display = 'none';
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

const loadMore = document.querySelector('.load-btn');
const divsLoad = document.querySelectorAll('#load-Posts');

let currentPage = 1;
loadMore.addEventListener('click', () => {
  currentPage += 1;

  fetch(`http://localhost:3000/posts?_limit=9&_page=${currentPage}`)
    .then((res) => res.json())
    .then((nextPage) => {
      nextPage.forEach((post) => {
        let template = document.getElementById('post');

        const h3 = template.content.querySelector('h3');
        h3.textContent = post.title;

        const p = template.content.querySelector('p');
        p.textContent = post.body;

        template.content.querySelector('[role="button"]').dataset.id = post.id;

        template.content.querySelector('[role="btn-edit"]').dataset.id =
          post.id;

        const clone = document.importNode(template.content, true);
        container.appendChild(clone);
      });
    });
});
