const modal = new bootstrap.Modal(document.getElementById("feedbackModal"));
  const modalHeader = document.getElementById("modalHeader");
  const modalMessage = document.getElementById("modalMessage");
  const modalSpinner = document.getElementById("modalSpinner");

  let currentStep = 0;
  let isSubmitting = false;
  const steps = document.querySelectorAll('.form-step');

  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle('d-none', i !== index);
      step.classList.toggle('active', i === index);
    });
    currentStep = index;
    if (index === 2) fillReview();
  }

  function nextStep() {
    const currentFields = steps[currentStep].querySelectorAll('input, select');
    for (const field of currentFields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return;
      }
    }
    if (currentStep < steps.length - 1) showStep(currentStep + 1);
  }

  function prevStep() {
    if (currentStep > 0) showStep(currentStep - 1);
  }

  function fillReview() {
    const form = document.getElementById('multiStepForm');
    const inputs = form.querySelectorAll('input, select');
    const reviewList = document.getElementById('reviewList');
    reviewList.innerHTML = '';
    inputs.forEach(input => {
      if (input.value.trim() !== '') {
        const label = form.querySelector(`label[for=${input.id}]`);
        const item = document.createElement('li');
        item.className = 'list-group-item';
        item.innerHTML = `<strong>${label?.innerText || input.name}:</strong> ${input.value}`;
        reviewList.appendChild(item);
      }
    });
  }

  function showModal(message, isSuccess = true, isLoading = false) {
    modalHeader.className = isSuccess
      ? 'modal-header bg-success text-white'
      : 'modal-header bg-danger text-white';

    if (isLoading) {
      modalHeader.className = 'modal-header bg-primary text-white';
      modalSpinner.classList.remove("d-none");
    } else {
      modalSpinner.classList.add("d-none");
    }

    modalMessage.textContent = message;
    modal.show();
  }

  document.getElementById('multiStepForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    if (isSubmitting) return;

    const visibleFields = Array.from(document.querySelectorAll('.form-step:not(.d-none) input, .form-step:not(.d-none) select'));
    for (const field of visibleFields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return;
      }
    }

    const form = e.target;
    const formData = new FormData(form);

    showModal("Submitting details. This may take a few seconds...", true, true);
    isSubmitting = true;

    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out.")), 15000)
      );

      const response = await Promise.race([
        fetch("https://script.google.com/macros/s/AKfycbyOTfwVtDnuhcsOuNwVpQ43KYhYoRFvVEZA3U6F_ZATqvzzrDcV1rb4AAUSxpfRKBfn7Q/exec", {
          method: "POST",
          body: formData
        }),
        timeout
      ]);

      const result = await response.json();

      const isSuccess = result.result === "success";
      showModal(
        isSuccess ? "Form submitted successfully. A representative will get in touch shortly to finalize your manpower request." : "❌ Something went wrong. Please try again.",
        isSuccess
      );

      /*if (isSuccess) {
        form.reset();
        showStep(0);
      }*/

       if (isSuccess) {
  console.log("Redirecting to homepage...");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
}

    } catch (err) {
      showModal("❌ Submission failed: " + err.message, false);
    }

    isSubmitting = false;
  });