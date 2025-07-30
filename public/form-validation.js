/**
 * @file form-validation.js
 * @description Handles form validation and error handling for tax filing forms.
 */

class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (!this.form) {
      throw new Error(`Form with ID "${formId}" not found.`);
    }
    this.inputs = this.form.querySelectorAll('input, select, textarea');
    this.errorMessages = {};
    this.addEventListeners();
  }


  addEventListeners() {
    this.inputs.forEach(input => {
      input.addEventListener('input', this.validateInput.bind(this, input));
      input.addEventListener('blur', this.validateInput.bind(this, input));
    });
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  removeEventListeners() {
    this.inputs.forEach(input => {
      input.removeEventListener('input', this.validateInput.bind(this, input));
      input.removeEventListener('blur', this.validateInput.bind(this, input));
    });
    this.form.removeEventListener('submit', this.handleSubmit.bind(this));
  }

  validateInput(input) {
    const type = input.type;
    const value = input.value.trim();
    const name = input.name;
    let isValid = true;
    let errorMessage = '';


    switch (type) {
      case 'text':
      case 'email':
        if (!value) {
          isValid = false;
          errorMessage = `${input.name} is required.`;
        } else if (type === 'email' && !this.validateEmail(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address.';
        }
        break;
      case 'number':
        if (!value) {
          isValid = false;
          errorMessage = `${input.name} is required.`;
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          isValid = false;
          errorMessage = `${input.name} must be a positive number.`;
        }
        break;
      case 'file':
        if (!value) {
          isValid = false;
          errorMessage = `${input.name} is required.`;
        }
        break;

      default:
          //Handle other input types if needed.
          break;
    }

    this.setErrorState(input, !isValid, errorMessage);
    this.errorMessages[name] = errorMessage;
  }


  setErrorState(input, isError, message) {
    const parent = input.parentElement;
    const errorElement = parent.querySelector('.error-message');

    if (isError) {
      if (!errorElement) {
          const newErrorElement = document.createElement('div');
          newErrorElement.className = 'error-message';
          parent.appendChild(newErrorElement);
      }
      parent.querySelector('.error-message').textContent = message;
    } else {
      if (errorElement) {
        parent.removeChild(errorElement);
      }
    }
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }


  async handleSubmit(event) {
    event.preventDefault();
    const isValid = Object.values(this.errorMessages).every(message => message === '');

    if (isValid) {
      try {
        //Simulate API call. Replace with your actual API call.
        const response = await fetch('/submit-form', {
          method: 'POST',
          body: new FormData(this.form),
        });
        const data = await response.json();

        if (response.ok) {
          console.log('Form submitted successfully:', data);
          this.form.reset();
          //Add success message.
        } else {
          throw new Error(data.message || 'Form submission failed.');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        //Add error message.
      }
    } else {
      //Add error message.
    }
  }
}


//Example usage:
const validator = new FormValidator('myForm'); //Replace 'myForm' with your form's ID.

//Clean up event listeners when component unmounts.  Consider using a framework like React for automatic cleanup.
//Example:
// window.addEventListener('beforeunload', () => validator.removeEventListeners());