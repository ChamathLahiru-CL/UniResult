import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

/**
 * GPAChart Component
 * Renders a line chart showing GPA progression over time
 */
const GPAChart = ({ data = [], labels = [], targetGPA, showTarget = false, compact = false }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data.length || !labels.length) return;

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    
    const datasets = [
      {
        label: 'GPA',
        data: data,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ];

    // Add target GPA line if requested
    if (showTarget && targetGPA) {
      datasets.push({
        label: 'Target GPA',
        data: Array(labels.length).fill(targetGPA),
        borderColor: '#9CA3AF',
        borderWidth: 2,
        borderDash: [6, 4],
        tension: 0,
        fill: false,
        pointRadius: 0
      });
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: showTarget,
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 15,
              usePointStyle: true,
              pointStyle: 'line'
            }
          },
          tooltip: {
            backgroundColor: 'white',
            titleColor: '#1F2937',
            bodyColor: '#1F2937',
            borderColor: '#E5E7EB',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            titleFont: {
              size: 14,
              weight: '600'
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              title: (items) => items[0].label,
              label: (item) => `GPA: ${item.raw}`
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: !compact,
              color: '#F3F4F6'
            },
            ticks: {
              display: !compact,
              font: {
                size: 12
              }
            }
          },
          y: {
            grid: {
              display: !compact,
              color: '#F3F4F6'
            },
            ticks: {
              display: !compact,
              font: {
                size: 12
              }
            },
            min: Math.max(0, Math.min(...data) - 0.5),
            max: Math.min(4.0, Math.max(...data) + 0.5)
          }
        }
      }
    });

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, labels, targetGPA, showTarget, compact]);

  return (
    <canvas ref={chartRef} />
  );
};

export default GPAChart;