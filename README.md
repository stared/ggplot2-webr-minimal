# Simple WebR with dplyr and ggplot2 Example

This is a simple demonstration of using [WebR](https://docs.r-wasm.org/webr/latest/) with dplyr and ggplot2 to create data visualizations directly in the browser without requiring an R server.

Generate by Claude 3.7 Sonnet in [Cursor IDE](https://www.cursor.com/) - took a few iterations.

## About WebR

WebR is a version of R compiled to WebAssembly, which allows R code to be executed directly in the browser. This makes it possible to run R code without needing a server-side R installation.

## Features

- Load and run R code in the browser
- Use dplyr for data manipulation
- Create visualizations with ggplot2
- No server-side R installation required

## How to Run

1. Clone this repository or download the files
2. Open the `index.html` file in a modern web browser
   - For local development, you might need to use a local web server due to CORS restrictions
   - You can use `python -m http.server` or any other simple local server

Alternatively, you can access the demo directly on GitHub Pages if deployed.

## Using the Demo

1. Wait for WebR and the required packages (dplyr and ggplot2) to load
2. The example code will be displayed in the code box
3. Click "Run Analysis" to execute the code and display the visualization
4. The visualization shows the average MPG (miles per gallon) grouped by the number of cylinders from the built-in mtcars dataset

## Customizing

You can modify the R code in the `index.html` file to create different visualizations or analyses. The basic pattern is:

1. Load required libraries
2. Manipulate data with dplyr
3. Create visualizations with ggplot2

## Requirements

- A modern web browser with WebAssembly support (Chrome, Firefox, Safari, Edge)
- Internet connection (to load WebR and packages)

## Limitations

- Initial loading can take some time as WebR and R packages are downloaded
- Memory usage can be high for complex analyses
- Not all R packages are available or compatible with WebR

## License

This example is provided under the MIT License. Feel free to use and modify it for your own projects.

## Resources

- [WebR Documentation](https://docs.r-wasm.org/webr/latest/)
- [dplyr Documentation](https://dplyr.tidyverse.org/)
- [ggplot2 Documentation](https://ggplot2.tidyverse.org/)
