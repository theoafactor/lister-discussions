//We are getting the form from the DOM
const createNoteForm = document.querySelector("#create-note-form");
const createNoteInfo =  document.querySelector("#create-note-info")

//We are get
let notesSpace = document.querySelector("#notes");

//LOAD ALL NOTES
 //get all saved notes
getAllSavedNotes().then((all_saved_notes) => {

    //console.log("All notes: ", all_saved_notes)

    if(all_saved_notes.length > 0){

        displayNotes();
    }
    else{
            notesSpace.innerHTML = `<div class='col-md-8 m-auto text-center'>
                <div class='alert alert-warning'>
                            <p>No note available at this time</p>
                </div>
                    <button class="btn btn-sm btn-primary" data-toggle='modal' data-target='#createNoteModal'>Create your first note</button>
            </div>`
 }

})

 




//when the createNoteForm is submitted
createNoteForm.addEventListener("submit", async function(event){
    event.preventDefault();

    createNoteInfo.classList.remove("text-danger");
    createNoteInfo.classList.remove("text-warning");
    createNoteInfo.classList.add("text-primary");
    createNoteInfo.innerHTML = `
                <div>Creating your note. Please wait ...</div>
                <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
    `;


    let note_title = this.note_title.value.trim();
    let note_content = this.note_content.value.trim();

    note_title = note_title.length == 0 ? null : note_title;
    note_content = note_content.length == 0 ? null : note_content;

    if(note_title == null || note_content == null){
        // there is an issue 
        //alert("All fields are required");
        createNoteInfo.classList.remove("text-primary");
        createNoteInfo.classList.add("text-warning");
        createNoteInfo.innerHTML = `All fields are required`;
        
    }else{
        const feedback = await saveNote(note_title, note_content);

        console.log("Feedback from create: ", feedback)

        //feedback
        if(feedback == true){
            //alert("New note saved");

            createNoteInfo.classList.remove("text-danger");
            createNoteInfo.classList.remove("text-warning");
            createNoteInfo.classList.remove("text-primary");
            createNoteInfo.classList.add("text-success");

            createNoteInfo.innerHTML = "New note saved";

            //close the modal
            //$("#createNoteModal").modal("hide");

            //get all saved notes
            displayNotes();
            

        }

    }

})

/**
 * This function displays all the notes currently saved to 
 * the localStorage. 
 */
async function displayNotes(){

    //call the getAllSavedNotes() function to retrieve notes saved
    let all_saved_notes = await getAllSavedNotes();

    // the first part of the display table
    let table_code = `<table class='table table-striped table-hover'>
                        <thead>
                            <th>Title</th>
                            <th></th>
                        </thead>
                        <tbody>`;
    
    for(let i = 0; i < all_saved_notes.length; i++){

        console.log("Note: ", all_saved_notes[i]._id)
        let id = all_saved_notes[i]._id;

            table_code += `<tr>
                            <td>
                            <a href='#' onclick="showHideContent('${id}')">${all_saved_notes[i].note_title}</a>
                            <div class='note-content note-${id}'><span>${all_saved_notes[i].note_content}</span></div>
                            </td>
                            <td>
                            <button class='btn btn-sm btn-default' onclick="editNote('${all_saved_notes[i].id}')"><i class="icon-edit" style='color: black; font-size: 2em;'></i></button>
                            <button class='btn btn-sm btn-default' onclick="deleteNote('${all_saved_notes[i].id}')"><i class="icon-trash" style='color: red; font-size: 2em;'></i></button>
                            </td>
                        </tr>`

        
    }

    table_code += `</tbody>
                    </table>`;

    
    notesSpace.innerHTML = table_code;
}


function showHideContent(id){
   
    if(document.querySelector(`.note-${id}`).style.display == "block"){
        document.querySelector(`.note-${id}`).style.display = "none"
    }else{
        document.querySelector(`.note-${id}`).style.display = "block";
    }


}

function editNote(id){
    // 1. get the note from the storage using the id 
    // 2. design the div element to put the note 
    // 3. attach the div element to the DOM 
    // 4. show the div element 
    document.querySelector(`.note-${id}`).innerHTML = "";
    //1. 
    let note = getNoteById(id);

    //2.
    if(document.getElementById(`note-${id}`)){
        document.getElementById(`note-${id}`).remove();
    }
    
    let divElement = document.createElement("div");

    divElement.id = `note-${id}`;

    

    divElement.innerHTML = `<div class='mt-3'>
                                <form class='form'>
                                    <div class='form-group'>
                                        <label>Title</label>
                                        <input type='text' class='form-control' value='${note.title}'>
                                    </div>

                                    <div class='form-group'>
                                        <label>Content</label>
                                        <textarea class='form-control'>${note.content}</textarea>
                                    </div>

                                    <div class='form-group'>
                                       <button class='btn btn-sm btn-warning'>Save update</button>
                                    </div>
                                </form>
                            
                            </div>`

    
    //3.
    document.querySelector(`.note-${id}`).appendChild(divElement);
    document.querySelector(`.note-${id}`).style.display = "block";


    
}


function deleteNote(id){

    //prepare a dialog box instead of relying on confirm 
    let confirmation_dialog = ` <div class="modal fade" id="confirmDeleteModal_${id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
    <div class="modal-dialog">
      <div class="modal-content bg-danger">
        <div class="modal-header border-0">
          <h5 class="modal-title text-white id="exampleModalLabel">Delete this Note?</h5>
          <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-md-10 text-white">
                   <p>This process cannot be reversed</p>
                   <p>
                    <button class='btn btn-md btn-dark' id='confirm_deletion_${id}'>Proceed</button>
                   </p>

                </div>
            </div>
        </div>
        <div class="modal-footer border-0">
          <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>`

  let divElement = document.createElement("div");

  divElement.innerHTML = confirmation_dialog;

  document.body.appendChild(divElement);

  $(`#confirmDeleteModal_${id}`).modal("show");


  document.querySelector(`#confirm_deletion_${id}`).addEventListener("click", function(e){
    e.preventDefault();

    if(confirmDeleteNote(id) == true){

        $(`#confirmDeleteModal_${id}`).modal('hide');

        location.reload(); //refresh the page

    }

  })


}


function confirmDeleteNote(id){
    let savedNotes = localStorage.getItem("notes");

    savedNotes = JSON.parse(savedNotes);

    for(let i = 0; i < savedNotes.length; i++){
        if(savedNotes[i].id == id){
            //delete this note
            savedNotes.splice(i, 1)

            savedNotes = JSON.stringify(savedNotes);

            localStorage.setItem("notes", savedNotes);

            break;
        }
    }

    return true

}


async function saveNote(note_title, note_content){

    // let new_note = {
    //     title: note_title,
    //     content: note_content, 
    //     id: new Date().getTime()
    // }


    const feedback = await axios.post("http://localhost:4343/save-note", {
        note_title: note_title,
        note_content: note_content
    })

    if(feedback.data){
        return true;
    }else{
        return false;
    }

    



    // //get the localStorage
    // let savedNotes = localStorage.getItem('notes');

    // if(savedNotes == null){
    //     //there is nothing in the storage
    //     savedNotes = [];

    //     savedNotes.push(new_note);
    //     savedNotes = JSON.stringify(savedNotes);
    //     localStorage.setItem("notes", savedNotes);

    //     return true;
    // }else{
    //     //there is something in the storage
    //     savedNotes = JSON.parse(savedNotes);

       

    //     savedNotes.push(new_note);

    //     savedNotes = JSON.stringify(savedNotes);

    //     localStorage.setItem("notes", savedNotes);

    //     return true;

    // }


}


async function getAllSavedNotes(){
    // let notes = localStorage.getItem("notes");
    //start the spinner 
    notesSpace.innerHTML = `<div class='col-md-8 m-auto text-center'>
                                <div class=''>Getting your notes ...</div>
                                <div class="spinner-border mt-2" role="status">
                                <span class="sr-only">Loading...</span>
                                
                            </div>
                                                
            </div>`
    let feedback = await axios.get("http://localhost:4343/get-all-saved-notes")

   console.log("From axios: ", feedback)

    if(feedback){
        //stop the spinner
        // notesSpace.innerHTML = "Notes now available from database"
        console.log(feedback.data.data)

        notes = feedback.data.data;

        return notes

    }else{
        return [];
    }


    // if(notes){
    //     notes = JSON.parse(notes);

    //     return notes;

    // }else{

    //     return [];
    // }
}


function getNoteById(id){
    let savedNotes = localStorage.getItem("notes");

    let matchednote = null;

    if(savedNotes){
        savedNotes = JSON.parse(savedNotes);

        for(let i = 0; i < savedNotes.length; i++){
            if(savedNotes[i].id == id){
                //we have found a match
                matchednote = savedNotes[i];
                break;
            }
        }
    }

    return matchednote;


    

}
