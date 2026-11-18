/**
 * Chart.js rendering module for Grade Distribution (Bar/Pie) and
 * Semester Performance Trend (Line) visualizations using the Gold theme palette.
 */

let gradeChartInstance = null;
let trendChartInstance = null;

function getChartThemeTokens(isDark) {
  return {
    textColor: isDark ? '#94a3b8' : '#475569',
    titleColor: isDark ? '#f8fafc' : '#0f172a',
    gridColor: isDark ? 'rgba(148, 163, 184, 0.14)' : 'rgba(15, 23, 42, 0.07)',
    tooltipBg: isDark ? '#0f172a' : '#ffffff',
    tooltipBorder: isDark ? '#334155' : '#e2e8f0',
    lineColor: isDark ? '#facc15' : '#ca8a04',
    lineFill: isDark ? 'rgba(250, 204, 21, 0.14)' : 'rgba(234, 179, 8, 0.14)',
    pointBg: isDark ? '#fde047' : '#a16207',
    selectedPointBg: '#16a34a',
  };
}

/**
 * Renders or updates the Grade Distribution chart (Bar or Pie).
 * @param {HTMLCanvasElement} canvas
 * @param {{ A: number, B: number, C: number, D: number, E: number, F: number }} distribution
 * @param {'bar'|'pie'} chartType
 * @param {boolean} isDark
 */
export function renderGradeDistributionChart(canvas, distribution, chartType, isDark) {
  if (!canvas || typeof window.Chart === 'undefined') return;

  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
  const values = labels.map((g) => distribution[g] || 0);
  const totalCount = values.reduce((acc, v) => acc + v, 0);
  const tokens = getChartThemeTokens(isDark);

  const palette = [
    '#eab308', // A - Rich Gold
    '#16a34a', // B - Emerald
    '#0284c7', // C - Sky
    '#f97316', // D - Orange
    '#a855f7', // E - Violet
    '#dc2626', // F - Crimson
  ];

  if (gradeChartInstance) {
    gradeChartInstance.destroy();
    gradeChartInstance = null;
  }

  if (totalCount === 0) return;

  const isPie = chartType === 'pie';

  gradeChartInstance = new window.Chart(canvas.getContext('2d'), {
    type: isPie ? 'doughnut' : 'bar',
    data: {
      labels: labels.map((g) => `Grade ${g}`),
      datasets: [
        {
          label: 'Courses',
          data: values,
          backgroundColor: palette,
          borderColor: isDark ? '#0f172a' : '#ffffff',
          borderWidth: isPie ? 2 : 0,
          borderRadius: isPie ? 0 : 6,
          maxBarThickness: 44,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 220 },
      plugins: {
        legend: {
          display: isPie,
          position: 'right',
          labels: {
            color: tokens.textColor,
            boxWidth: 12,
            padding: 12,
            font: { family: '"DM Sans", sans-serif', size: 12 },
          },
        },
        tooltip: {
          backgroundColor: tokens.tooltipBg,
          titleColor: tokens.titleColor,
          bodyColor: tokens.textColor,
          borderColor: tokens.tooltipBorder,
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (ctx) => {
              const count = ctx.parsed.y ?? ctx.parsed;
              return ` ${count} ${count === 1 ? 'course' : 'courses'}`;
            },
          },
        },
      },
      scales: isPie
        ? {}
        : {
            x: {
              grid: { display: false },
              ticks: {
                color: tokens.textColor,
                font: { family: '"JetBrains Mono", monospace', size: 12 },
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                precision: 0,
                color: tokens.textColor,
                font: { family: '"JetBrains Mono", monospace', size: 11 },
              },
              grid: { color: tokens.gridColor },
            },
          },
    },
  });
}

/**
 * Renders or updates the Semester Performance Trend line chart.
 * @param {HTMLCanvasElement} canvas
 * @param {Array<{ label: string, shortLabel?: string, gpa: number, units: number, isSelected: boolean }>} trendSeries
 * @param {boolean} isDark
 */
export function renderSemesterTrendChart(canvas, trendSeries, isDark) {
  if (!canvas || typeof window.Chart === 'undefined') return;

  const tokens = getChartThemeTokens(isDark);

  if (trendChartInstance) {
    trendChartInstance.destroy();
    trendChartInstance = null;
  }

  if (!Array.isArray(trendSeries) || trendSeries.length === 0) return;

  trendChartInstance = new window.Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: trendSeries.map((s) => s.shortLabel || s.label),
      datasets: [
        {
          label: 'Semester GPA',
          data: trendSeries.map((s) => s.gpa),
          borderColor: tokens.lineColor,
          backgroundColor: tokens.lineFill,
          fill: true,
          tension: 0.28,
          borderWidth: 2.5,
          pointRadius: trendSeries.map((s) => (s.isSelected ? 6.5 : 4.5)),
          pointHoverRadius: 7.5,
          pointBackgroundColor: trendSeries.map((s) =>
            s.isSelected ? tokens.selectedPointBg : tokens.pointBg
          ),
          pointBorderColor: isDark ? '#0f172a' : '#ffffff',
          pointBorderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 220 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: tokens.tooltipBg,
          titleColor: tokens.titleColor,
          bodyColor: tokens.textColor,
          borderColor: tokens.tooltipBorder,
          borderWidth: 1,
          padding: 10,
          callbacks: {
            title: (items) => {
              const idx = items[0]?.dataIndex ?? 0;
              return trendSeries[idx]?.label || '';
            },
            label: (ctx) => {
              const item = trendSeries[ctx.dataIndex];
              return ` GPA: ${ctx.parsed.y.toFixed(2)} (${item.units} units)`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: tokens.textColor,
            font: { family: '"DM Sans", sans-serif', size: 11 },
          },
        },
        y: {
          min: 0,
          max: 5,
          ticks: {
            stepSize: 1,
            color: tokens.textColor,
            font: { family: '"JetBrains Mono", monospace', size: 11 },
            callback: (val) => Number(val).toFixed(1),
          },
          grid: { color: tokens.gridColor },
        },
      },
    },
  });
}
