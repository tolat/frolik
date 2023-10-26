const fs = require('fs')

// Assuming your JSON file is named 'cities.json'
const jsonFilePath = './cities.json';

fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return;
    }
  
    try {
      const jsonData = JSON.parse(data);
  
      // Example: Filter cities with population greater than 10000
      const filteredCities = jsonData.filter(city => city.population > 10000);
  
      // Save the filtered data to 'cities10000.json'
      const outputPath = './cities10000.json';
      fs.writeFile(outputPath, JSON.stringify(filteredCities, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('Error writing filtered data:', writeErr);
        } else {
          console.log(`Filtered data saved to ${outputPath}`);
        }
      });
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });