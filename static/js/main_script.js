console.log("hello")
fetch("http://127.0.0.1:8080/posts/read")
.then(res => res.json())
.then(data => display(data))
.catch(error => console.log(error));

function display(data)
{var str=""

    data.forEach(post => {
      // console.log(post)
      var id=post._id;
      console.log(id)
      str  += `
      <div class="jumbotron container">
      <h3 class="mb-0">${post.title}</h3>
      <div class="mb-1 text-muted">by-${post.author}</div>
      <div class="row mb-2">
      <div class="col-md">
        <div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
          <div class="col p-4 d-flex flex-column position-static">
           
            <p class="card-text mb-auto">${post.content}</p>
          </div>
        </div>
      </div>
      </div>
      

 


          <button type="button" class="btn btn-outline-danger btn-lg" id="delete" onclick='del("${post._id}")' >Delete <i class="far fa-trash-alt"></i></button>
          <button type="button" class="btn btn-outline-primary btn-lg" id="update" data-toggle="modal" data-target="#exampleModalCenter" onclick='set("${post._id}")' >Update <i class="fas fa-pen"></i></button>
<!-- Modal -->
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Update your blog</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      
      <div class="form-group" >
        <label for="text">Title :</label>
        <textarea class="form-control" id="title" name="title" rows="1"></textarea>
      </div>
      <div class="form-group">
          <label for="content">Content :</label>
          <textarea class="form-control" id="content" name="content" rows="3"></textarea>
        </div>
        <div class="modal-footer">
        <button type="button" class="btn btn-outline-danger " data-dismiss="modal">Close <i class="far fa-window-close"></i></button>
        <button type="button" class="btn btn-outline-primary " onclick='upd()'>Save changes <i class="far fa-save"></i></button>
      </div>
      </div>
     
    </div>
  </div>
</div>
      </div>`
    });
document.getElementById("posts").innerHTML+=str;
 }
function del(id)
{
    console.log(`http://127.0.0.1:8080/posts/delete/${id}`)
   
//     fetch(`http://127.0.0.1:8080/posts/delete/${id}}`, {
//   method: 'DELETE', // or 'PUT'
// })
fetch(`http://127.0.0.1:8080/posts/delete/${id}`, {
              method: 'DELETE',
              headers:{'Content-Type':'application/json'},
              
          })
              // .then(res => res.json())
              // .then(data => console.log(data));
              window.open("http://127.0.0.1:8080/posts","_self");
}
function upd()
{
  let id= localStorage.getItem('id');
  console.log(id)
 fetch(`http://127.0.0.1:8080/posts/update/${id}`, {
              method: 'PUT',
              headers:{'Content-Type':'application/json'},
              body: JSON.stringify({
      "title": document.getElementById('title').value,
      "content":document.getElementById('content').value,
  })
          })
              .then(res => res.json())
              .then(data => {
                alert(data)
              });
window.open("http://127.0.0.1:8080/posts","_self");
}
function set(id) {
localStorage.setItem("id",id)
fetch(`http://127.0.0.1:8080/posts/read/${id}`)
.then(res => res.json())
.then(data => setdetails(data))
.catch(error => console.log(error));
}
function setdetails(data)
{ console.log(data)
document.getElementById("title").innerHTML=data.title
document.getElementById("content").innerHTML=data.content
}