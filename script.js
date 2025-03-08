// Variable to hold the loaded model
let model;
const MODEL_URL = 'model.json'; // Path to your model.json file

// Function to load the model
async function loadModel() {
    try {
        model = await tf.loadLayersModel(MODEL_URL);
        console.log('Model loaded successfully');
        // Enable the classify button and hide the loading message
        document.getElementById('classifyButton').disabled = false;
        document.getElementById('loadingModel').style.display = 'none';
    } catch (error) {
        console.error('Error loading model:', error);
        document.getElementById('loadingModel').innerText = 'Error loading model.';
    }
}

// Handle image upload and display preview
document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function() {
            const img = document.getElementById('preview');
            img.src = reader.result;
            img.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Handle classification when the button is clicked
document.getElementById('classifyButton').addEventListener('click', async function() {
    const img = document.getElementById('preview');
    const resultElement = document.getElementById('result');

    // Check if an image is uploaded
    if (!img.src || img.style.display === 'none') {
        alert('Please upload an image first.');
        return;
    }

    resultElement.innerText = 'Classifying...';

    try {
        // Preprocess the image
        const tensor = tf.browser.fromPixels(img)
            .resizeBilinear([224, 224]) // Resize to 224x224 as required by the model
            .toFloat()
            .div(255.0) // Normalize pixel values to [0, 1]
            .expandDims(); // Add batch dimension

        // Make prediction
        const prediction = await model.predict(tensor).data();
        const classes = ['E-waste', 'Hazardous Waste', 'Organic Waste', 'Plastic Waste', 'Others', 'Unknown'];
        const maxIndex = prediction.indexOf(Math.max(...prediction));

        // Display the result
        resultElement.innerText = `Classification: ${classes[maxIndex]}`;
    } catch (error) {
        console.error('Error during classification:', error);
        resultElement.innerText = 'Error during classification. Please try again.';
    }
});

// Load the model when the page loads
loadModel();