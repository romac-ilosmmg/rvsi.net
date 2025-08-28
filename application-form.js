const modal = new bootstrap.Modal(document.getElementById("feedbackModal"));
  const modalMessage = document.getElementById("modalMessage");
  const modalHeader = document.getElementById("modalHeader");
  const modalSpinner = document.getElementById("modalSpinner");
  const submitBtn = document.querySelector('#myForm button[type="submit"]');

  let isSubmitting = false;

  function showModal(message, isSuccess = true, isLoading = false) {
    // Set modal header color
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

  document.getElementById("myForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    if (isSubmitting) return;

    const form = e.target;
    const fileInput = form.querySelector('input[name="resume"]');
    const file = fileInput.files[0];

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!file || !validTypes.includes(file.type)) {
      showModal("Invalid file type. Please upload a PDF or Word document (.pdf, .doc, or .docx).", false);
      return;
    }

    isSubmitting = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    showModal("Submitting your application, please wait...", true, true);

    const reader = new FileReader();

    reader.onload = async function () {
      const base64Data = reader.result.split(',')[1];

      const formData = {
        lastName: form.lastName.value,
        firstName: form.firstName.value,
        middleName: form.middleName.value,
        birthDate: form.birthDate.value,
        gender: form.gender.value,
        address: form.address.value,
        municipality: form.municipality.value,
        mobileNumber: form.mobileNumber.value,
        email: form.email.value,
        educationalAttainment: form.educationalAttainment.value,
        school: form.school.value,
        previousCompany: form.previousCompany.value,
        position: form.position.value,
        startDate: form.startDate.value,
        endDate: form.endDate.value,
        applyPosition: form.applyPosition.value,
        workLocation: form.workLocation.value,
        filename: file.name,
        mimeType: file.type,
        fileData: base64Data
      };

      try {
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timed out.")), 20000)
        );

        const response = await Promise.race([
          fetch("https://script.google.com/macros/s/AKfycbxUpePsuZ8Ig_BAyNLYy4WIH-hdXkmJxWoNwGa6Io1odGFnxYsQ2rUqLXc3-joa0mvp/exec", {
            method: "POST",
            body: new URLSearchParams(formData)
          }),
          timeout
        ]);

        const result = await response.text();
        const isSuccess = result.includes("") || result.toLowerCase().includes("success");

        showModal(
          isSuccess
            ? "Application Submitted! Thank you for submitting your application. We have successfully received your details and uploaded resume. Our recruitment team will review your information and contact you if you are shortlisted."
            : result || "Something went wrong. Please try again.",
          isSuccess
        );

        if (isSuccess) {
  console.log("Redirecting to homepage...");
  setTimeout(() => {
    window.location.href = "index.html"; // Adjust if needed
  }, 1000);
}

      } catch (error) {
        showModal("Submission failed: " + error.message, false);
      }

      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Application";
      isSubmitting = false;
    };

    reader.readAsDataURL(file);
  });