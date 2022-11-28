const createNoteForm = document.querySelector("#create-note-form");
let notesSpace = document.querySelector("#notes");

//LOAD ALL NOTES
 //get all saved notes
 let all_saved_notes = getAllSavedNotes();

 let table_code = `<table class='table table-striped table-hover'>
                     <thead>
                         <th>Title</th>
                         <th></th>
                     </thead>
                     <tbody>`;
 for(let i = 0; i < all_saved_notes.length; i++){

         table_code += `<tr>
                         <td>${all_saved_notes[i].title}</td>
                         <td></td>
                     </tr>`

     
 }

 table_code += `</tbody>
                 </table>`;

 
 notesSpace.innerHTML = table_code;


//when the createNoteForm is submitted
createNoteForm.addEventListener("submit", function(event){
    event.preventDefault();


    let note_title = this.note_title.value.trim();
    let note_content = this.note_content.value.trim();

    note_title = note_title.length == 0 ? null : note_title;
    note_content = note_content.length == 0 ? null : note_content;

    if(note_title == null || note_content == null){
        // there is an issue 
        alert("All fields are required");
    }else{
        const feedback = saveNote(note_title, note_content);
        //feedback
        if(feedback == true){
            alert("New note saved");

            //close the modal
            $("#createNoteModal").modal("hide");

            //get all saved notes
            let all_saved_notes = getAllSavedNotes();

            let table_code = `<table class='table table-striped table-hover'>
                                <thead>
                                    <th>Title</th>
                                    <th></th>
                                </thead>
                                <tbody>`;
            for(let i = 0; i < all_saved_notes.length; i++){

                    table_code += `<tr>
                                    <td>${all_saved_notes[i].title}</td>
                                    <td></td>
                                </tr>`
    
                
            }

            table_code += `</tbody>
                            </table>`;

            
            notesSpace.innerHTML = table_code;
            

        }

    }

})


function saveNote(note_title, note_content){

    let new_note = {
        title: note_title,
        content: note_content
    }

    //get the localStorage
    let savedNotes = localStorage.getItem('notes');

    if(savedNotes == null){
        //there is nothing in the storage
        savedNotes = [];

        savedNotes.push(new_note);
        savedNotes = JSON.stringify(savedNotes);
        localStorage.setItem("notes", savedNotes);

        return true;
    }else{
        //there is something in the storage
        savedNotes = JSON.parse(savedNotes);

       

        savedNotes.push(new_note);

        savedNotes = JSON.stringify(savedNotes);

        localStorage.setItem("notes", savedNotes);

        return true;

    }


}


function getAllSavedNotes(){
    let notes = localStorage.getItem("notes");

    if(notes){
        notes = JSON.parse(notes);

        return notes;

    }else{

        return [];
    }
}