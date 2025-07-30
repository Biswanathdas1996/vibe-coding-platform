/**
 * @file This module handles data visualization for the tax filing application.
 * @module components/data-visualization
 */

import Chart from 'chart.js'; // Or any other charting library

/**
 * Creates a bar chart to visualize income sources.
 * @async
 * @param {Object} incomeData - An object containing income sources and amounts.  e.g., { "Wages": 50000, "Interest": 500 }
 * @param {string} canvasId - The ID of the canvas element where the chart will be rendered.
 * @throws {Error} If incomeData is invalid or canvas element is not found.
 */
const createIncomeChart = async (incomeData, canvasId) => {
  if (!incomeData || typeof incomeData !== 'object' || Object.keys(incomeData).length === 0) {
    throw new Error('Invalid income data provided.');
  }

  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    throw new Error(`Canvas element with ID "${canvasId}" not found.`);
  }

  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(incomeData),
      datasets: [{
        label: 'Income Sources',
        data: Object.values(incomeData),
        backgroundColor: 'rgba(54, 162, 235, 0.8)', // Example color
        borderColor: 'rgba(54, 162, 235, 1)', // Example color
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
};


/**
 * Creates a pie chart to visualize tax deductions.
 * @async
 * @param {Object} deductionData - An object containing deduction categories and amounts. e.g., { "Medical": 1000, "Charitable": 500 }
 * @param {string} canvasId - The ID of the canvas element where the chart will be rendered.
 * @throws {Error} If deductionData is invalid or canvas element is not found.
 */
const createDeductionChart = async (deductionData, canvasId) => {
  if (!deductionData || typeof deductionData !== 'object' || Object.keys(deductionData).length === 0) {
    throw new Error('Invalid deduction data provided.');
  }
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    throw new Error(`Canvas element with ID "${canvasId}" not found.`);
  }
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(deductionData),
      datasets: [{
        data: Object.values(deductionData),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)'
        ],
        hoverOffset: 4
      }]
    }
  });
};


/**
 * Cleans up chart event listeners (if any were added).  This is crucial to prevent memory leaks.  Implementation depends on how event listeners were added.  This is a placeholder.
 */
const cleanupChartListeners = () => {
  // Implement cleanup logic here based on how you've attached event listeners to the charts.
  // For example, if you used addEventListener, you'd need to remove them using removeEventListener.
};

export { createIncomeChart, createDeductionChart, cleanupChartListeners };