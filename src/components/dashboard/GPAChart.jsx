import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

/**
 * GPAChart Component
 * Renders a modern line chart showing GPA progression over time
 * with color-coded performance and helpful indicators
 */
const GPAChart = ({ data = [], labels = [], targetGPA, showTarget = false, compact = false }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Determine point colors based on GPA value
  const getPointColor = (gpa) => {
    if (gpa >= 3.7) return '#10B981'; // Green - Excellent
    if (gpa >= 3.3) return '#3B82F6'; // Blue - Good
    if (gpa >= 3.0) return '#F59E0B'; // Orange - Average
    return '#EF4444'; // Red - Below average
  };

  useEffect(() => {
    if (!chartRef.current || !data.length || !labels.length) return;

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.01)');
    
    // Determine line color based on overall performance
    const avgGPA = data.reduce((a, b) => a + b, 0) / data.length;
    const lineColor = avgGPA >= 3.7 ? '#10B981' : avgGPA >= 3.3 ? '#3B82F6' : avgGPA >= 3.0 ? '#F59E0B' : '#EF4444';
    
    const datasets = [
      {
        label: 'Your GPA',
        data: data,
        borderColor: lineColor,
        backgroundColor: gradient,
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: data.map(gpa => getPointColor(gpa)),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: compact ? 5 : 6,
        pointHoverRadius: compact ? 7 : 8,
        pointHoverBorderWidth: 3
      }
    ];

    // Add target GPA line if requested
    if (showTarget && targetGPA) {
      datasets.push({
        label: `Target: ${targetGPA.toFixed(2)}`,
        data: Array(labels.length).fill(targetGPA),
        borderColor: '#9CA3AF',
        borderWidth: 2,
        borderDash: [8, 4],
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
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: !compact,
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 20,
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle',
              font: {
                size: 12,
                weight: '500'
              }
            }
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1F2937',
            bodyColor: '#1F2937',
            borderColor: '#E5E7EB',
            borderWidth: 2,
            padding: window.innerWidth < 640 ? 12 : 16,
            displayColors: true,
            titleFont: {
              size: window.innerWidth < 640 ? 12 : 14,
              weight: '600'
            },
            bodyFont: {
              size: window.innerWidth < 640 ? 11 : 13
            },
            callbacks: {
              title: (items) => `📊 ${items[0].label}`,
              label: (item) => {
                const gpa = item.raw;
                let performance = '';
                if (gpa >= 3.7) performance = '🌟 Excellent';
                else if (gpa >= 3.3) performance = '👍 Good';
                else if (gpa >= 3.0) performance = '✓ Average';
                else performance = '⚠ Needs Improvement';
                return [`GPA: ${gpa.toFixed(2)}`, performance];
              },
              afterLabel: (item) => {
                if (targetGPA) {
                  const diff = item.raw - targetGPA;
                  if (diff > 0) return `↗ ${diff.toFixed(2)} above target`;
                  if (diff < 0) return `↘ ${Math.abs(diff).toFixed(2)} below target`;
                  return '✓ On target';
                }
                return '';
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              display: true,
              font: {
                size: compact ? 10 : window.innerWidth < 640 ? 9 : 11,
                weight: '500'
              },
              color: '#6B7280',
              padding: window.innerWidth < 640 ? 4 : 8,
              maxRotation: window.innerWidth < 640 ? 45 : 0,
              minRotation: window.innerWidth < 640 ? 45 : 0
            },
            border: {
              display: false
            }
          },
          y: {
            title: {
              display: !compact,
              text: 'GPA (0.0 - 4.0)',
              font: {
                size: window.innerWidth < 640 ? 10 : 12,
                weight: '600'
              },
              color: '#374151',
              padding: { bottom: window.innerWidth < 640 ? 5 : 10 }
            },
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              display: true,
              font: {
                size: compact ? 10 : window.innerWidth < 640 ? 9 : 11,
                weight: '500'
              },
              color: '#6B7280',
              padding: window.innerWidth < 640 ? 4 : 8,
              stepSize: 0.5,
              callback: function(value) {
                return value.toFixed(1);
              }
            },
            border: {
              display: false
            },
            min: 0,
            max: 4.0,
            beginAtZero: true
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