// Function to add smooth transitions to elements
function addSmoothTransitions() {
    const preview = document.getElementById('preview');
    const result = document.getElementById('result');

    // Add transition effects
    preview.style.transition = 'opacity 0.5s ease-in-out';
    result.style.transition = 'opacity 0.5s ease-in-out';
}

// Function to show loading indicator
function showLoadingIndicator() {
    const result = document.getElementById('result');
    result.innerText = 'Processing...';
    result.style.opacity = '0.5';
}

// Function to hide loading indicator
function hideLoadingIndicator() {
    const result = document.getElementById('result');
    result.style.opacity = '1';
}

// Function to animate result display
function animateResult() {
    const result = document.getElementById('result');
    result.style.opacity = '0';
    setTimeout(() => {
        result.style.opacity = '1';
    }, 100);
}

// Modify the classify button click event
document.getElementById('classifyButton').addEventListener('click', async function() {
    const img = document.getElementById('preview');
    const resultElement = document.getElementById('result');

    if (!img.src || img.style.display === 'none') {
        alert('Please upload an image first.');
        return;
    }

    showLoadingIndicator();

    try {
        // Preprocess the image
        const tensor = tf.browser.fromPixels(img)
            .resizeBilinear([224, 224])
            .toFloat()
            .div(255.0)
            .expandDims();

        // Make prediction
        const prediction = await model.predict(tensor).data();
        const classes = ['E-waste', 'Hazardous Waste', 'Organic Waste', 'Plastic Waste', 'Others', 'Unknown'];
        const maxIndex = prediction.indexOf(Math.max(...prediction));

        // Display the result with animation
        resultElement.innerText = `Classification: ${classes[maxIndex]}`;
        animateResult();
    } catch (error) {
        console.error('Error during classification:', error);
        resultElement.innerText = 'Error during classification. Please try again.';
    } finally {
        hideLoadingIndicator();
    }
});

// Add smooth transitions when the page loads
document.addEventListener('DOMContentLoaded', () => {
    addSmoothTransitions();
});