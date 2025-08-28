const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const submitSpinner = document.getElementById('submitSpinner');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Start loading
    submitBtn.disabled = true;
    submitText.textContent = "Sending...";
    submitSpinner.classList.remove('d-none');

    const formData = new FormData(form);
    const data = new URLSearchParams();
    for (const pair of formData.entries()) {
      data.append(pair[0], pair[1]);
    }

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycby7S5GXsDDH5nS6UzHoLAndXdx9OEkjMiNnpmGRoiC4jLAZcGAsuPFMq7ihw_e-fEvY7g/exec', {
        method: 'POST',
        body: data
      });

      const result = await response.json();
      if (result.result === 'success') {
        form.reset();

        // Show success modal
        const modal = new bootstrap.Modal(document.getElementById('successModal'));
        modal.show();
      } else {
        alert('Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      alert('There was an error submitting the form.');
    } finally {
      // Stop loading
      submitBtn.disabled = false;
      submitText.textContent = "Send";
      submitSpinner.classList.add('d-none');
    }
  });