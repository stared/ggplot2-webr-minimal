import { WebR } from 'https://webr.r-wasm.org/latest/webr.mjs';

// Initialize DOM elements
const loadingElement = document.getElementById('loading');
const contentElement = document.getElementById('content');
const progressElement = document.getElementById('progress');
const progressBarElement = document.getElementById('progress-bar');
const runButton = document.getElementById('run-button');
const plotOutput = document.getElementById('plot-output');
const codeDisplay = document.getElementById('code-display');

// Create editable code area if it doesn't exist yet
function setupCodeEditor() {
  // If we're still using a static element, replace it with an editable textarea
  if (codeDisplay && !(codeDisplay instanceof HTMLTextAreaElement)) {
    const parentElement = codeDisplay.parentElement;
    
    // Create a new textarea element
    const codeEditor = document.createElement('textarea');
    codeEditor.id = 'code-display';
    codeEditor.className = 'code-editor';
    codeEditor.rows = 12;
    codeEditor.style.width = '100%';
    codeEditor.style.fontFamily = 'monospace';
    codeEditor.style.padding = '10px';
    
    // Copy the content from the original element
    codeEditor.value = codeDisplay.textContent || `library(dplyr)
library(ggplot2)
library(ggthemes)

# Analyze mtcars dataset
mtcars %>%
  mutate(cyl = as.factor(cyl)) %>%
  group_by(cyl) %>%
  summarise(
    mean_mpg = mean(mpg),
    count = n()
  ) %>%
  ggplot(aes(x = cyl, y = mean_mpg, fill = cyl)) +
  geom_col() +
  geom_text(aes(label = round(mean_mpg, 1)), vjust = -0.5) +
  labs(
    title = "Average MPG by Number of Cylinders",
    x = "Cylinders",
    y = "Mean MPG"
  ) +
  theme_economist()`;
    
    // Replace the original element with the textarea
    parentElement.replaceChild(codeEditor, codeDisplay);
  }
}

// Create a simple WebR instance
const webR = new WebR();

// Initialize WebR
async function initializeWebR() {
  try {
    // Initialize WebR
    await webR.init();
    progressElement.innerText = '25%';
    progressBarElement.style.width = '25%';
    
    // Install dplyr package
    await webR.installPackages(['dplyr']);
    progressElement.innerText = '50%';
    progressBarElement.style.width = '50%';
    
    // Install ggplot2 package
    await webR.installPackages(['ggplot2']);
    progressElement.innerText = '75%';
    progressBarElement.style.width = '75%';
    
    // Install ggthemes package
    await webR.installPackages(['ggthemes']);
    progressElement.innerText = '100%';
    progressBarElement.style.width = '100%';
    
    // Set up the editable code area
    setupCodeEditor();
    
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
    
    // Get the updated code display element
    const updatedCodeDisplay = document.getElementById('code-display');
    
    // Get the R code from the textarea
    const rCode = updatedCodeDisplay instanceof HTMLTextAreaElement 
      ? updatedCodeDisplay.value 
      : updatedCodeDisplay.textContent;
    
    console.log("Executing R code:", rCode);
    
    // Create a shelter to manage R objects
    const shelter = await new webR.Shelter();
    
    // Capture the plot using captureR
    const capture = await shelter.captureR(`
      library(dplyr)
      library(ggplot2)
      library(ggthemes)
      
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