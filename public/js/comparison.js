// Vehicle Comparison JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
  // Update comparison count in header
  updateComparisonCount();
  
  // Handle comparison form submissions
  const compareForms = document.querySelectorAll('form[action*="/comparison/add/"]');
  compareForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      // Optional: Add loading state or confirmation
      const button = this.querySelector('button[type="submit"]');
      if (button) {
        button.disabled = true;
        button.textContent = 'Adding...';
        
        // Re-enable after a short delay in case of redirect failure
        setTimeout(() => {
          button.disabled = false;
          button.textContent = 'Add to Compare';
        }, 3000);
      }
    });
  });
});

function updateComparisonCount() {
  // This would be updated via server-side rendering or AJAX
  // For now, it's handled by the server rendering the count
  const countElement = document.getElementById('compare-count');
  if (countElement && typeof window.comparisonCount !== 'undefined') {
    countElement.textContent = window.comparisonCount;
  }
}

// Function to show user feedback when adding to comparison
function showComparisonFeedback(message, type = 'success') {
  const feedback = document.createElement('div');
  feedback.className = `alert alert-${type} comparison-feedback`;
  feedback.textContent = message;
  feedback.style.position = 'fixed';
  feedback.style.top = '20px';
  feedback.style.right = '20px';
  feedback.style.zIndex = '9999';
  feedback.style.maxWidth = '300px';
  
  document.body.appendChild(feedback);
  
  setTimeout(() => {
    feedback.remove();
  }, 3000);
}