document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from server
    fetch('/forms')
      .then(response => response.json())
      .then(data => {
        // Process data for charts
        const genderData = processDataForPieChart(data, 'gender');
        const localityData = processDataForPieChart(data, 'locality');
        const problemCategoryData = processDataForPieChart(data, 'problemCategory');
  
        // Render charts
        renderPieChart('genderChart', genderData.labels, genderData.counts, 'Gender Distribution');
        renderPieChart('localityChart', localityData.labels, localityData.counts, 'Locality Distribution');
        renderPieChart('problemCategoryChart', problemCategoryData.labels, problemCategoryData.counts, 'Problem Category Distribution');
  
        // Render map with pinned localities
        renderMap(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  });
  
  // Function to process data for pie chart
  function processDataForPieChart(data, field) {
    const counts = {};
    data.forEach(item => {
      const value = item[field];
      counts[value] = counts[value] ? counts[value] + 1 : 1;
    });
  
    return {
      labels: Object.keys(counts),
      counts: Object.values(counts)
    };
  }
  
  // Function to render pie chart using Chart.js
  function renderPieChart(chartId, labels, data, chartTitle) {
    const ctx = document.getElementById(chartId).getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: chartTitle,
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(255, 99, 132, 0.7)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        legend: {
          position: 'bottom'
        }
      }
    });
  }
  
  // Function to render map with pinned localities using Leaflet.js
  function renderMap(data) {
    // Initialize map centered at Eluru (example)
    const map = L.map('map').setView([16.7100, 81.0952], 13);
  
    // Add base layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    // Example: Add markers for each locality in data
    data.forEach(item => {
      if (item.locality && item.locality !== '') {
        const marker = L.marker([item.latitude, item.longitude]).addTo(map);
        marker.bindPopup(`<b>${item.locality}</b><br>${item.address}`).openPopup();
      }
    });
  }
  