function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

let timer;
let currentIndex = 1;
let isPlaying = false;
let globalData = [];
let lineGenerator;
let xScale, yScale;
let svg, path;

function parseDate(dateStr) {
  if(dateStr && dateStr.length === 8) {
    return new Date(dateStr.slice(0, 4), dateStr.slice(4, 6) - 1, dateStr.slice(6, 8));
  }
  return new Date(dateStr);
}

function drawViz(data) {
  document.body.innerHTML = '';
  const d3 = window.d3;

  const startDateStr = data.style.startDate.value;
  const endDateStr = data.style.endDate.value;
  
  globalData = data.tables.DEFAULT.filter(row => {
    let isValid = true;
    if (startDateStr && row.dateDim[0] < startDateStr) isValid = false;
    if (endDateStr && row.dateDim[0] > endDateStr) isValid = false;
    return isValid;
  }).sort((a, b) => parseDate(a.dateDim[0]) - parseDate(b.dateDim[0]));

  if (globalData.length === 0) {
    document.body.innerHTML = '<div style="padding: 20px; font-family: sans-serif;">Brak danych w zadanym przedziale.</div>';
    return;
  }

  const uiContainer = document.createElement('div');
  uiContainer.className = 'controls-container';
  uiContainer.innerHTML = `
    <button id="btn-start">Start</button>
    <button id="btn-stop">Stop</button>
    <button id="btn-reset">Reset</button>
  `;
  document.body.appendChild(uiContainer);

  document.getElementById('btn-start').addEventListener('click', () => startAnimation(data.style.animationStep.value));
  document.getElementById('btn-stop').addEventListener('click', stopAnimation);
  document.getElementById('btn-reset').addEventListener('click', resetAnimation);

  const margin = {top: 20, right: 20, bottom: 30, left: 50};
  const width = window.dscc.getWidth() - margin.left - margin.right;
  const height = window.dscc.getHeight() - 60 - margin.top - margin.bottom;

  svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  xScale = d3.scaleTime()
    .domain(d3.extent(globalData, d => parseDate(d.dateDim[0])))
    .range([0, width]);

  yScale = d3.scaleLinear()
    .domain([0, d3.max(globalData, d => d.metricVal[0])])
    .range([height, 0]);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  svg.append("g")
    .call(d3.axisLeft(yScale));

  lineGenerator = d3.line()
    .x(d => xScale(parseDate(d.dateDim[0])))
    .y(d => yScale(d.metricVal[0]))
    .curve(data.style.smoothLine.value ? d3.curveMonotoneX : d3.curveLinear);

  path = svg.append("path")
    .datum(globalData.slice(0, currentIndex))
    .attr("class", "chart-line")
    .attr("d", lineGenerator);
    
  if(isPlaying) {
      startAnimation(data.style.animationStep.value);
  }
}

function updateChart() {
  path.datum(globalData.slice(0, currentIndex))
    .transition()
    .duration(500)
    .attr("d", lineGenerator);
}

function startAnimation(stepTimeStr) {
  if (isPlaying) return;
  isPlaying = true;
  const stepTime = parseInt(stepTimeStr) || 1000;

  timer = setInterval(() => {
    currentIndex++;
    if (currentIndex > globalData.length) {
      currentIndex = 1;
    }
    updateChart();
  }, stepTime);
}

function stopAnimation() {
  isPlaying = false;
  clearInterval(timer);
}

function resetAnimation() {
  stopAnimation();
  currentIndex = 1;
  updateChart();
}

Promise.all([
  loadScript('https://cdn.jsdelivr.net/npm/@google/dscc@0.3.11/build/dscc.min.js'),
  loadScript('https://d3js.org/d3.v7.min.js')
]).then(() => {
  window.dscc.subscribeToData(drawViz, { transform: window.dscc.objectTransform });
}).catch(err => {
  console.error("Błąd ładowania bibliotek:", err);
});
