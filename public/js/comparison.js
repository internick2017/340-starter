// Vehicle Comparison JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
  // Update comparison count in header
  updateComparisonCount();
  
  // Handle comparison form submissions
  const compareForms = document.querySelectorAll('form[action*="/comparison/add/"]');
  compareForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      // Add loading state and visual feedback
      const button = this.querySelector('button[type="submit"]');
      if (button) {
        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = 'Adding...';
        button.style.opacity = '0.7';
        
        // Re-enable after a short delay in case of redirect failure
        setTimeout(() => {
          button.disabled = false;
          button.textContent = originalText;
          button.style.opacity = '1';
        }, 3000);
      }
    });
  });
  
  // Add hover effects and click animations
  const compareButtons = document.querySelectorAll('.btn-compare');
  compareButtons.forEach(button => {
    // Add click animation
    button.addEventListener('click', function(e) {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
    
    // Ensure button is visible and styled
    button.style.display = 'inline-block';
    button.style.visibility = 'visible';
  });
});

function updateComparisonCount() {
  // Update the count display from server-rendered value
  const countElement = document.getElementById('compare-count');
  if (countElement) {
    // Use the server-provided count
    if (typeof window.comparisonCount !== 'undefined') {
      countElement.textContent = window.comparisonCount;
    }
    
    // Add visual feedback if count > 0
    if (window.comparisonCount > 0) {
      countElement.style.fontWeight = 'bold';
      countElement.style.color = '#28a745';
    }
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