  function showJob(jobId, event) {
    const card = event.target.closest('.job-card');

    // Hide all descriptions inside the clicked card
    const descriptions = card.querySelectorAll('.job-description');
    descriptions.forEach(desc => desc.classList.remove('active'));

    // Show selected description
    card.querySelector(`#${jobId}`).classList.add('active');

    // Reset all sidebar buttons inside the clicked card
    const buttons = card.querySelectorAll('.sidebar-button');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Activate the clicked button
    event.target.classList.add('active');
  }