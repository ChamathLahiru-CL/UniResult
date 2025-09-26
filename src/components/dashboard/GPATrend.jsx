import React, { useEffect, useRef } from 'react';

/**
 * GPATrend Component
 * Displays a line chart showing GPA progress over months
 * Uses simple canvas-based drawing for the chart
 */
const GPATrend = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Chart dimensions
    const chartWidth = width - 40;  // Left padding
    const chartHeight = height - 40; // Bottom padding
    const chartBottom = height - 20;
    const chartLeft = 30;
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#e5e7eb'; // gray-200
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.moveTo(chartLeft, 20);
    ctx.lineTo(chartLeft, chartBottom);
    
    // X-axis
    ctx.moveTo(chartLeft, chartBottom);
    ctx.lineTo(chartLeft + chartWidth, chartBottom);
    ctx.stroke();
    
    // Grid lines
    const gridCount = 3;
    ctx.beginPath();
    ctx.strokeStyle = '#f3f4f6'; // gray-100
    ctx.lineWidth = 1;
    
    for (let i = 1; i <= gridCount; i++) {
      const y = chartBottom - (i * (chartHeight / gridCount));
      ctx.moveTo(chartLeft, y);
      ctx.lineTo(chartLeft + chartWidth, y);
      
      // Draw y-axis labels
      ctx.fillStyle = '#9ca3af'; // gray-400
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(((i * 500) / 1000).toFixed(1) + 'k', chartLeft - 5, y + 3);
    }
    ctx.stroke();
    
    // X-axis labels (months)
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const step = chartWidth / (months.length - 1);
    
    ctx.fillStyle = '#9ca3af'; // gray-400
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    
    months.forEach((month, i) => {
      const x = chartLeft + (i * step);
      ctx.fillText(month, x, chartBottom + 15);
    });
    
    // Plot data
    if (data && data.length > 0) {
      // Find max value for scaling
      const maxValue = Math.max(...data.map(point => point.value));
      const scale = chartHeight / (maxValue || 1);
      
      // Draw line
      ctx.beginPath();
      ctx.strokeStyle = '#3b82f6'; // blue-500
      ctx.lineWidth = 2;
      
      data.forEach((point, i) => {
        const x = chartLeft + (i * step);
        const y = chartBottom - (point.value * scale);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
      // Add gradient below the line
      const gradient = ctx.createLinearGradient(0, 0, 0, chartBottom);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)'); // blue-500 with opacity
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
      
      ctx.beginPath();
      data.forEach((point, i) => {
        const x = chartLeft + (i * step);
        const y = chartBottom - (point.value * scale);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.lineTo(chartLeft + ((data.length - 1) * step), chartBottom);
      ctx.lineTo(chartLeft, chartBottom);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw data points
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#3b82f6'; // blue-500
      ctx.lineWidth = 2;
      
      data.forEach((point, i) => {
        const x = chartLeft + (i * step);
        const y = chartBottom - (point.value * scale);
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      });
    }
  }, [data]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 h-full overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-blue-50 rounded-full -ml-20 -mt-20 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mb-16 opacity-40"></div>
      
      <div className="relative z-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          GPA Trend
        </h2>
        
        {/* Canvas for chart with enhanced styling */}
        <div className="relative h-56 bg-gradient-to-b from-white to-blue-50 rounded-lg border border-blue-100 p-3">
          <canvas 
            ref={canvasRef} 
            width={500} 
            height={200} 
            className="w-full h-full"
          ></canvas>
          
          {/* Performance indicator label */}
          <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-sm border border-blue-100 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            <span className="text-xs font-medium text-gray-600">Performance</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPATrend;