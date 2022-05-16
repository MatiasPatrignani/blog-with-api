const container = document.querySelector(".article__section--posts");

const postUrl = "http://localhost:3000/posts";
const commentUrl = "http://localhost:3000/comments";

fetch(postUrl)
  .then((response) => response.json())
  .then((data) => {
    data.forEach((element) => {
      let template = document.getElementById("post");

      const h3 = template.content.querySelector("h3");
      h3.textContent = element.title;

      const p = template.content.querySelector("p");
      p.textContent = element.body;

      template.content.querySelector('[role="button"]').dataset.id = element.id;

      template.content.querySelector('[role="btn-view"]').dataset.id =
        element.id;

      const clone = document.importNode(template.content, true);
      container.appendChild(clone);
    });

    // BUTTON VIEW
    const viewButton = document.querySelectorAll('[role="btn-view"]');
    viewButton.forEach((button) => {
      //MODAL POST API
      button.addEventListener("click", () => {
        const commentsDivs = document.querySelectorAll(".test");
        commentsDivs.forEach((comment) => {
          comment.remove();
        });
        fetch("http://localhost:3000/posts/" + button.dataset.id)
          .then((res) => res.json())
          .then((post) => {
            const title = document.querySelector(".modal-title");
            const body = document.querySelector(".modal-body");
            title.textContent = post.title;
            body.textContent = post.body;
            // MODAL USER API
            fetch("http://localhost:3000/users/" + post.userId)
              .then((res) => res.json())
              .then((user) => {
                const modalUser = document.querySelector("#userName");
                const modalEmail = document.querySelector("#email");
                modalUser.textContent = user.name;
                modalEmail.textContent = user.email;
              });
            const btnCmt = document.getElementById("btnLoadComments");
            btnCmt.addEventListener("click", () => {
              fetch("http://localhost:3000/comments?postId=" + post.id)
                .then((res) => res.json())
                .then((comments) => {
                  comments.forEach((comment) => {
                    const commentsContainer = document.createElement("div");
                    commentsContainer.classList.add("test");
                    console.log(commentsContainer);
                    const commentsBody = document.createElement("p");
                    const commentsName = document.createElement("h6");
                    const commentsEmail = document.createElement("p");
                    commentsName.textContent = comment.name;
                    commentsBody.textContent = comment.body;
                    commentsEmail.textContent = comment.email;
                    commentsContainer.appendChild(commentsName);
                    commentsContainer.appendChild(commentsBody);
                    commentsContainer.appendChild(commentsEmail);
                    btnCmt.insertAdjacentElement("afterEnd", commentsContainer);
                  });
                });
            });
          });
      });
    });

    // BUTTON EDIT
    let modalDuplicate = false;

    btnEdit = document.querySelectorAll('[role="btn-edit"]');
    btnEdit.forEach((editButton) =>
      editButton.addEventListener("click", () => {
        console.log(editButton.dataset.id);
        if (!modalDuplicate) {
          // Create a form dynamically
          const formProfile = document.getElementById("formal-Modal");

          //Creating Title Input
          const modalTitle = document.querySelector(".modal-title--edit");
          let titleLabel = document.createElement("label");
          titleLabel.setAttribute("for", " title-edit");
          titleLabel.textContent = "Title";
          modalTitle.appendChild(titleLabel);

          let titleInput = document.createElement("input");
          titleInput.type = "text";
          titleInput.classList.add("form-control");
          titleInput.setAttribute("id", "title-edit");
          titleInput.setAttribute("placeholder", "Post title");
          titleLabel.appendChild(titleInput);

          //Creating Body Input
          const modalPostBody = document.querySelector(".modal-post--body");
          let postLabel = document.createElement("label");
          postLabel.setAttribute("for", " body-edit");
          postLabel.textContent = "Body";
          modalPostBody.appendChild(postLabel);

          let bodyTextArea = document.createElement("Textarea");
          bodyTextArea.classList.add("form-control");
          bodyTextArea.setAttribute("id", "body-edit");
          bodyTextArea.setAttribute("placeholder", "Post body");
          bodyTextArea.setAttribute("rows", "3");
          formProfile.appendChild(bodyTextArea);

          modalDuplicate = true;

          let saveChange = document.querySelectorAll('[role="btn_save"]');
          saveChange.forEach((saveButton) =>
            saveButton.addEventListener("click", () => {
              let title = document.getElementById("title-edit").value;
              let body = document.getElementById("body-edit").value;

              class Post {
                constructor(title, body) {
                  this.title = title;
                  this.body = body;
                }
              }
              const profileObj = new Post(title, body);
              console.log(JSON.stringify(profileObj));
              console.log(saveButton.dataset.id);
              fetch("http://localhost:3000/posts/" + saveButton.dataset.id, {
                method: "PATCH",
                body: JSON.stringify({ profileObj }),
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                },
              })
                .then((res) => res.json())
                .then((json) => console.log(json));
            })
          );
        }
      })
    );
  });

// BUTTON DELETE
const deleteButtons = document.querySelectorAll('[role="button"]');
deleteButtons.forEach((element) => {
  element.addEventListener("click", () => {
    // element.parentNode.parentNode.remove()}
    fetch("http://localhost:3000/posts/" + element.dataset.id, {
      method: "DELETE",
    });
  });
});
