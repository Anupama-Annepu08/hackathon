// Sample data loaded into the frontend as the backend is not integrated in this demo version
const stockData = {
  stocks: [
    { symbol: "AAPL", name: "Apple Inc.", current_price: 175.50, previous_close: 172.80, change: 2.70, change_percent: 1.56, sector: "Technology", market_cap: "2.75T" },
    { symbol: "TSLA", name: "Tesla Inc.", current_price: 248.75, previous_close: 245.20, change: 3.55, change_percent: 1.45, sector: "Automotive", market_cap: "792B" },
    { symbol: "GOOGL", name: "Alphabet Inc.", current_price: 142.30, previous_close: 140.85, change: 1.45, change_percent: 1.03, sector: "Technology", market_cap: "1.78T" },
    { symbol: "MSFT", name: "Microsoft Corporation", current_price: 415.20, previous_close: 412.80, change: 2.40, change_percent: 0.58, sector: "Technology", market_cap: "3.08T" },
    { symbol: "NVDA", name: "NVIDIA Corporation", current_price: 118.85, previous_close: 115.20, change: 3.65, change_percent: 3.17, sector: "Technology", market_cap: "2.92T" }
  ],
  portfolio: [
    { symbol: "AAPL", quantity: 50, buy_price: 165.00, buy_date: "2024-08-15" },
    { symbol: "TSLA", quantity: 25, buy_price: 235.50, buy_date: "2024-07-20" },
    { symbol: "GOOGL", quantity: 30, buy_price: 138.75, buy_date: "2024-06-10" }
  ],
  ai_suggestions: [
    { symbol: "AAPL", action: "HOLD", confidence: 85, reason: "Strong fundamentals and upcoming product releases suggest continued growth. Current price is near fair value.", target_price: 180.00 },
    { symbol: "TSLA", action: "BUY", confidence: 78, reason: "Recent quarterly results exceeded expectations. EV market expansion and energy business growth are positive catalysts.", target_price: 275.00 },
    { symbol: "GOOGL", action: "HOLD", confidence: 82, reason: "AI developments and cloud growth offset advertising headwinds. Good long-term prospects but limited near-term upside.", target_price: 150.00 }
  ],
  sample_queries: [
    { query: "What should I do with Apple stock?", response: "Based on current analysis, Apple (AAPL) is showing strong fundamentals with upcoming product releases. I recommend HOLDING your position as the stock is near fair value with a target price of $180." },
    { query: "Should I buy more Tesla?", response: "Tesla (TSLA) shows positive momentum with recent quarterly results exceeding expectations. The EV market expansion and energy business growth are strong catalysts. Consider BUYING with 78% confidence and target price of $275." },
    { query: "How is my portfolio diversified?", response: "Your portfolio is currently concentrated in Technology sector (80%). Consider diversifying into other sectors like Healthcare, Finance, or Consumer Goods to reduce risk and improve long-term stability." }
  ]
};

const sections = document.querySelectorAll('.section');
const navButtons = document.querySelectorAll('.nav-btn');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const sectionId = btn.getAttribute('data-section');
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    if (sectionId === 'dashboard') {
      updateDashboard();
    } else if (sectionId === 'portfolio') {
      updatePortfolio();
    }
  });
});

function updateDashboard() {
  // Calculate portfolio value and today's change
  let portfolioValue = 0;
  let investedAmount = 0;
  let todayChange = 0;

  stockData.portfolio.forEach(pos => {
    const stock = stockData.stocks.find(s => s.symbol === pos.symbol);
    if (stock) {
      const positionValue = stock.current_price * pos.quantity;
      portfolioValue += positionValue;
      investedAmount += pos.buy_price * pos.quantity;
      todayChange += (stock.current_price - stock.previous_close) * pos.quantity;
    }
  });

  const portfolioChangePercent = investedAmount > 0 ? ((portfolioValue - investedAmount) / investedAmount) * 100 : 0;
  const todayChangePercent = investedAmount > 0 ? (todayChange / investedAmount) * 100 : 0;

  document.getElementById('portfolio-value').textContent = `$${portfolioValue.toFixed(2)}`;
  document.getElementById('portfolio-change').textContent = `${portfolioChangePercent >= 0 ? '+' : ''}${portfolioChangePercent.toFixed(2)}%`;
  document.getElementById('portfolio-change').className = portfolioChangePercent >= 0 ? 'summary-change positive' : 'summary-change negative';

  document.getElementById('today-change').textContent = `$${todayChange.toFixed(2)}`;
  document.getElementById('today-change-percent').textContent = `${todayChangePercent >= 0 ? '+' : ''}${todayChangePercent.toFixed(2)}%`;
  document.getElementById('today-change-percent').className = todayChangePercent >= 0 ? 'summary-change positive' : 'summary-change negative';

  // Render stock cards
  const stocksContainer = document.getElementById('stocks-container');
  stocksContainer.innerHTML = '';
  stockData.stocks.forEach(stock => {
    const card = document.createElement('div');
    card.className = 'stock-card';
    card.innerHTML = `
      <div class="stock-symbol">${stock.symbol}</div>
      <div class="stock-name">${stock.name}</div>
      <div>
        <span class="stock-price">$${stock.current_price.toFixed(2)}</span>
        <span class="stock-change ${stock.change >= 0 ? 'positive' : 'negative'}">
          ${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} (${stock.change_percent.toFixed(2)}%)
        </span>
      </div>
      <div>Sector: ${stock.sector}</div>
      <div>Market Cap: ${stock.market_cap}</div>
    `;
    stocksContainer.appendChild(card);
  });
}

function updatePortfolio() {
  const portfolioList = document.getElementById('portfolio-list');
  portfolioList.innerHTML = '';

  stockData.portfolio.forEach(pos => {
    const stock = stockData.stocks.find(s => s.symbol === pos.symbol);
    const currentPrice = stock ? stock.current_price : 0;
    const marketValue = currentPrice * pos.quantity;
    const gainLoss = marketValue - (pos.buy_price * pos.quantity);
    const gainLossPercent = pos.buy_price ? (gainLoss / (pos.buy_price * pos.quantity)) * 100 : 0;
    const item = document.createElement('div');
    item.className = 'portfolio-item';
    item.innerHTML = `
      <span><strong>${pos.symbol}</strong> (${pos.quantity} shares)</span>
      <span>Invested: $${(pos.buy_price * pos.quantity).toFixed(2)}</span>
      <span>Value: $${marketValue.toFixed(2)}</span>
      <span class="portfolio-gain ${gainLoss >= 0 ? 'positive' : 'negative'}">Gain/Loss: ${gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)} (${gainLossPercent.toFixed(2)}%)</span>
    `;
    portfolioList.appendChild(item);
  });

  // Render allocation pie chart
  renderAllocationChart();
}

function renderAllocationChart() {
  const ctx = document.getElementById('allocationChart').getContext('2d');
  const allocationMap = {};

  stockData.portfolio.forEach(pos => {
    const stock = stockData.stocks.find(s => s.symbol === pos.symbol);
    const value = stock ? stock.current_price * pos.quantity : 0;
    allocationMap[pos.symbol] = (allocationMap[pos.symbol] || 0) + value;
  });

  const symbols = Object.keys(allocationMap);
  const values = symbols.map(sym => allocationMap[sym]);

  if (window.allocationChartInstance) window.allocationChartInstance.destroy();

  window.allocationChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: symbols,
      datasets: [{
        data: values,
        backgroundColor: ['#2662ff', '#1b7a39', '#b22222', '#7044ff', '#ffab40']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

document.getElementById('portfolio-form').addEventListener('submit', e => {
  e.preventDefault();
  const symbolInput = document.getElementById('stock-symbol');
  const quantityInput = document.getElementById('stock-quantity');
  const buyPriceInput = document.getElementById('stock-buy-price');

  const newPos = {
    symbol: symbolInput.value.trim().toUpperCase(),
    quantity: parseInt(quantityInput.value),
    buy_price: parseFloat(buyPriceInput.value),
    buy_date: new Date().toISOString().split('T')[0]
  };
  if (!newPos.symbol || isNaN(newPos.quantity) || isNaN(newPos.buy_price)) {
    alert('Please fill all fields correctly');
    return;
  }
  // Add new position in frontend data (should connect to backend api in real)
  stockData.portfolio.push(newPos);
  symbolInput.value = '';
  quantityInput.value = '';
  buyPriceInput.value = '';
  updatePortfolio();
});

document.getElementById('chat-form').addEventListener('submit', e => {
  e.preventDefault();
  const chatInput = document.getElementById('chat-input');
  const message = chatInput.value.trim();
  if (!message) return;

  addChatMessage('user', message);

  // Simulate AI response from sample queries
  const sample = stockData.sample_queries.find(q => q.query.toLowerCase() === message.toLowerCase());
  let aiResponse = "Sorry, I don't have a response for that question.";
  if (sample) aiResponse = sample.response;

  setTimeout(() => {
    addChatMessage('ai', aiResponse);
  }, 1000);

  chatInput.value = '';
});

function addChatMessage(sender, text) {
  const container = document.getElementById('chat-container');
  const messageEl = document.createElement('div');
  messageEl.className = `chat-message ${sender}`;
  messageEl.textContent = text;
  container.appendChild(messageEl);
  container.scrollTop = container.scrollHeight;
}

// Initialize dashboard on page load
updateDashboard();
