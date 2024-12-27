const style = document.createElement('style');
style.textContent = `
    .date-input-container {
         display: inline-flex;
         align-items: center;
         border: 1px solid #ccc; /* Optional, add a default border */
        border-radius: 4px; /* Optional, add some border radius */
        overflow: hidden;
        height: 30px;
    }
    .date-input-container input[type="date"] {
      border: none;
       outline: none;
       font-size: inherit;
      padding: 0.5em;
    }
    .date-input-container i {
        margin-left: -2px;
       cursor: pointer;
        color: #333; /* Adjust icon color */
        padding: 0.5em;
        pointer-events: auto;
    }
    input[type='date']::-webkit-calendar-picker-indicator {
      background-color: #f0f0f0;  /* Calendar background color */
        color:#212121;

}
    
`;
document.head.appendChild(style);

function validateSelect(event) {
    const selectField = event.target;
        if(selectField.tagName === 'SELECT' && selectField.dataset.validated) {
        if (selectField.value.trim() === '') {
            selectField.style.border = '2px solid red';
        }else {
            selectField.style.border = '';
        }
    }
  }

function validateDate(event) {
    const inputField = event.target;
    if (inputField.type === "date" && inputField.dataset.validatedDate){
        if (inputField.value === '') {
         inputField.style.border = '2px solid red';
        }else{
           inputField.style.border = '';
        }
    }
 }


 function formatDate(dateString) {
  if(!dateString){
    return "";
  }
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function addDatePicker(inputField){
    if (inputField.name === "$PpyWorkPage$pReleaseDate" || inputField.name === "$PpyWorkPage$pLastAvailableDate") {

       const dateContainer = document.createElement('div');
       dateContainer.classList.add("date-input-container")
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.classList.add("date-input-field");
       dateInput.dataset.validatedDate = true;
         const calendarIcon = document.createElement('i');
         calendarIcon.className = "pi pi-calendar";
        dateContainer.appendChild(dateInput);
        dateContainer.appendChild(calendarIcon);


        calendarIcon.addEventListener('click', function(event){
            dateInput.focus()
         });

        dateInput.addEventListener('change', function(event) {
              inputField.value = formatDate(event.target.value);
           });

      dateInput.addEventListener("blur", validateDate);

       inputField.parentNode.insertBefore(dateContainer, inputField);
        inputField.remove();

    }
 }


function addDropdown(inputField) {
  if (inputField.name === "$PpyWorkPage$pColor") {
     
    const colors = [
      "red",
      "blue",
      "green",
      "yellow",
      "orange",
      "purple",
      "black",
      "white",
    ];

    const selectElement = document.createElement("select");
     selectElement.classList.add("leftJustifyStyle")

    const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.text = "Select a color";
        selectElement.appendChild(defaultOption);

    colors.forEach((color) => {
      const option = document.createElement("option");
      option.value = color;
      option.text = color;
      selectElement.appendChild(option);
    });
     selectElement.dataset.validated = true;
     inputField.parentNode.insertBefore(selectElement, inputField);
     inputField.remove();
     selectElement.addEventListener("blur", validateSelect);
  }else if(inputField.name === "$PpyWorkPage$pStatus"){
    const statuses = [
       "New",
      "Slightly used",
      "Good",
      "Fair",
      "Scrap",
     ];

    const selectElement = document.createElement("select");
     selectElement.classList.add("leftJustifyStyle")

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
      defaultOption.text = "Select a status";
        selectElement.appendChild(defaultOption);

    statuses.forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.text = status;
      selectElement.appendChild(option);
    });
    selectElement.dataset.validated = true;
       inputField.parentNode.insertBefore(selectElement, inputField);
       inputField.remove();
        selectElement.addEventListener("blur", validateSelect);
  }
}

function initializeValidation() {
  const inputFields = document.querySelectorAll('input[type="text"]');

  inputFields.forEach((inputField) => {
    addDropdown(inputField);
    addDatePicker(inputField);
  });
    const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
             document.querySelectorAll('input[type="text"]').forEach((inputField) => {
                if(!inputField.dataset.handledInput){
                  addDropdown(inputField);
                  addDatePicker(inputField);
                    inputField.dataset.handledInput = true;
                  }
              });
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

initializeValidation();