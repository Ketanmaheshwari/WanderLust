// Immediately Invoked Function Expression (IIFE) to avoid polluting the global namespace
(() => {
  'use strict' // Enforces stricter parsing and error handling for better coding practices

  // Select all forms with the class 'needs-validation'
  const forms = document.querySelectorAll('.needs-validation')

  // Convert NodeList to an array and loop through each form
  Array.from(forms).forEach(form => {

    // Add a 'submit' event listener to each form
    form.addEventListener('submit', event => {

      // If the form is not valid according to HTML5 form validation rules
      if (!form.checkValidity()) {
        event.preventDefault()      // Prevent form from submitting
        event.stopPropagation()     // Stop event from bubbling further
      }

      // Add Bootstrap class to show validation feedback (e.g., red borders, messages)
      form.classList.add('was-validated')

    }, false) // Indicates the listener should not be passive or capture-phase
  })
})()
