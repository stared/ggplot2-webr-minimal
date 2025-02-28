import { WebR } from 'https://webr.r-wasm.org/latest/webr.mjs';

// Initialize DOM elements
const loadingElement = document.getElementById('loading');
const contentElement = document.getElementById('content');
const progressElement = document.getElementById('progress');
const progressBarElement = document.getElementById('progress-bar');
const runButton = document.getElementById('run-button');
const plotOutput = document.getElementById('plot-output');
const codeDisplay = document.getElementById('code-display');

// Create a simple WebR instance
const webR = new WebR();

// Initialize WebR
async function initializeWebR() {
  try {
    // Initialize WebR
    await webR.init();
    progressElement.innerText = '33%';
    progressBarElement.style.width = '33%';
    
    // Install dplyr package
    await webR.installPackages(['dplyr']);
    progressElement.innerText = '66%';
    progressBarElement.style.width = '66%';
    
    // Install ggplot2 package
    await webR.installPackages(['ggplot2']);
    progressElement.innerText = '100%';
    progressBarElement.style.width = '100%';
    
    // All done, show the content
    loadingElement.style.display = 'none';
    contentElement.style.display = 'block';
    
    // Add event listener for the run button
    runButton.addEventListener('click', runCode);
  } catch (error) {
    console.error('Error initializing WebR:', error);
    loadingElement.innerHTML = `<p class="error">Error initializing WebR: ${error.message}</p>`;
  }
}

// Function to run code and display output
async function runCode() {
  try {
    // Show loading message
    plotOutput.innerHTML = '<p>Running analysis...</p>';
    
    // Get the R code from the display
    const rCode = codeDisplay.textContent;
    
    console.log("Executing R code:", rCode);
    
    // Create a shelter to manage R objects
    const shelter = await new webR.Shelter();
    
    // Capture the plot using captureR
    const capture = await shelter.captureR(`
      library(dplyr)
      library(ggplot2)
      
      # Run the user's code
      ${rCode}
    `, {
      withAutoprint: true,
      captureConditions: true,
      captureStreams: true,
      captureGraphics: true  // Enable graphics capture
    });
    
    console.log("Capture results:", capture);
    
    // Check if we captured any images
    if (capture.images && capture.images.length > 0) {
      // Clear plot output
      plotOutput.innerHTML = '';
      
      // Add each captured image to plot output
      capture.images.forEach(img => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        plotOutput.appendChild(canvas);
      });
      
      console.log(`Displayed ${capture.images.length} plot images`);
    } else {
      plotOutput.innerHTML = '<p>No plot was generated</p>';
      console.log("No images were captured");
    }
    
    // Clean up R objects
    await shelter.purge();
    
  } catch (error) {
    console.error('Error running code:', error);
    plotOutput.innerHTML = `<p class="error">Error running analysis: ${error.message}</p>`;
  }
}

// Initialize WebR when the page loads
window.addEventListener('load', initializeWebR);