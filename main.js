// Global tab switching function - MUST be defined first for onclick handlers
window.switchTab = function(tabName, buttonElement) {
  // Remove active from all buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Remove active from all panels
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  
  // Add active to clicked button
  if (buttonElement) {
    buttonElement.classList.add('active');
  }
  
  // Add active to corresponding panel
  const panel = document.querySelector(`.tab-panel[data-panel="${tabName}"]`);
  if (panel) {
    panel.classList.add('active');
  }
};

// Navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
}

// Tab switching functionality - Simple and direct (backup)
document.addEventListener('DOMContentLoaded', function() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      switchTab(targetTab, this);
    });
  });
});

const advisorForm = document.getElementById('advisorForm');
const advisorResults = document.getElementById('advisorResults');
const resultsContent = document.getElementById('resultsContent');
const resetBtn = document.getElementById('resetBtn');

advisorForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = {
    age: parseInt(document.getElementById('age').value),
    income: parseFloat(document.getElementById('income').value),
    expenses: parseFloat(document.getElementById('expenses').value),
    savings: parseFloat(document.getElementById('savings').value),
    debt: parseFloat(document.getElementById('debt').value),
    risk: document.getElementById('risk').value,
    goal: document.getElementById('goal').value
  };

  const recommendations = generateRecommendations(formData);
  displayResults(recommendations);

  advisorForm.style.display = 'none';
  advisorResults.style.display = 'block';

  advisorResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

resetBtn.addEventListener('click', () => {
  advisorForm.reset();
  advisorForm.style.display = 'block';
  advisorResults.style.display = 'none';
});

function generateRecommendations(data) {
  const monthlySurplus = data.income - data.expenses;
  const emergencyFundTarget = data.expenses * 6;
  const hasEmergencyFund = data.savings >= emergencyFundTarget;
  const debtToIncomeRatio = (data.debt / (data.income * 12)) * 100;

  const recommendations = {
    summary: '',
    allocation: {},
    priorities: [],
    investments: [],
    timeline: '',
    metrics: {}
  };

  recommendations.metrics = {
    'Monthly Surplus': `$${monthlySurplus.toFixed(2)}`,
    'Emergency Fund Target': `$${emergencyFundTarget.toFixed(2)}`,
    'Emergency Fund Status': hasEmergencyFund ? 'Complete ✓' : 'In Progress',
    'Debt-to-Income Ratio': `${debtToIncomeRatio.toFixed(1)}%`
  };

  if (monthlySurplus <= 0) {
    recommendations.summary = 'Your expenses exceed your income. Focus on reducing expenses and increasing income before investing.';
    recommendations.priorities = [
      'Review and cut unnecessary expenses',
      'Explore ways to increase income (side gigs, freelancing)',
      'Create a detailed budget using the 50/30/20 rule',
      'Avoid taking on additional debt'
    ];
    return recommendations;
  }

  if (data.goal === 'debt' || debtToIncomeRatio > 30) {
    recommendations.summary = 'Focus on debt reduction first. High debt levels should be addressed before aggressive investing.';
    recommendations.allocation = {
      'Debt Payment': 60,
      'Emergency Fund': 30,
      'Investing': 10
    };
    recommendations.priorities = [
      'Use the avalanche method: pay off highest interest debt first',
      'Build a starter emergency fund of $1,000',
      'Avoid taking on new debt',
      'Consider debt consolidation if interest rates are high'
    ];
    recommendations.investments = [
      'Hold off on major investments until debt is under control',
      'Consider low-cost index funds with small amounts ($50-100/month)'
    ];
    recommendations.timeline = '12-24 months to significantly reduce debt';
  } else if (!hasEmergencyFund || data.goal === 'emergency') {
    recommendations.summary = 'Build your emergency fund first. This is your financial foundation and safety net.';
    recommendations.allocation = {
      'Emergency Fund': 70,
      'Investing': 20,
      'Discretionary': 10
    };
    recommendations.priorities = [
      `Save ${emergencyFundTarget - data.savings > 0 ? '$' + (emergencyFundTarget - data.savings).toFixed(2) : '$0'} more for 6-month emergency fund`,
      'Use a high-yield savings account (3-5% APY)',
      'Automate monthly transfers to savings',
      'Start investing small amounts while building emergency fund'
    ];
    recommendations.investments = [
      'Open a Roth IRA and contribute $100-200/month',
      'Consider target-date funds for simplicity',
      'Low-cost index funds (S&P 500, Total Market)'
    ];
    recommendations.timeline = '6-12 months to complete emergency fund';
  } else if (data.goal === 'retirement') {
    recommendations.summary = 'Great position to focus on retirement. Time is your greatest asset for compound growth.';
    recommendations.allocation = {
      'Retirement Investing': 50,
      'Additional Savings': 30,
      'Discretionary': 20
    };
    recommendations.priorities = [
      'Maximize Roth IRA contributions ($7,000/year)',
      'Take advantage of employer 401(k) match if available',
      'Maintain emergency fund as backup',
      'Increase contributions annually'
    ];
    recommendations.investments = getRiskBasedInvestments(data.risk, 'retirement');
    recommendations.timeline = `${40 - data.age} years to retirement - excellent time to start!`;
  } else if (data.goal === 'investment' || data.goal === 'wealth') {
    recommendations.summary = 'You\'re ready to invest! Diversify across different asset classes based on your risk tolerance.';

    if (data.risk === 'high') {
      recommendations.allocation = {
        'Growth Investing': 60,
        'Emergency Fund Top-up': 20,
        'Alternative Investments': 20
      };
    } else if (data.risk === 'medium') {
      recommendations.allocation = {
        'Balanced Investing': 60,
        'Savings': 30,
        'Bonds/Safe Assets': 10
      };
    } else {
      recommendations.allocation = {
        'Conservative Investing': 40,
        'Savings': 40,
        'Bonds/Safe Assets': 20
      };
    }

    recommendations.priorities = [
      'Dollar-cost average into the market',
      'Diversify across different sectors',
      'Review and rebalance portfolio quarterly',
      'Keep 3-6 months expenses liquid'
    ];
    recommendations.investments = getRiskBasedInvestments(data.risk, 'wealth');
    recommendations.timeline = '5-10+ years for optimal growth';
  }

  return recommendations;
}

function getRiskBasedInvestments(risk, goal) {
  const investments = {
    low: [
      'Vanguard Total Bond Market Index (BND) - 40%',
      'Vanguard S&P 500 Index (VOO) - 40%',
      'High-Yield Savings Account - 20%',
      'Treasury bonds for stability'
    ],
    medium: [
      'Vanguard Total Stock Market (VTI) - 50%',
      'Vanguard Total International Stock (VXUS) - 30%',
      'Vanguard Total Bond Market (BND) - 20%',
      'Consider adding REIT exposure'
    ],
    high: [
      'Vanguard S&P 500 (VOO) - 40%',
      'Vanguard Growth Index (VUG) - 30%',
      'Vanguard Small Cap (VB) - 20%',
      'Individual growth stocks - 10%',
      'Consider cryptocurrency allocation (5% max)'
    ]
  };

  return investments[risk] || investments.medium;
}

function displayResults(recommendations) {
  let html = '';

  html += `
    <div class="result-section">
      <h4>Financial Overview</h4>
      <p>${recommendations.summary}</p>
      ${Object.entries(recommendations.metrics).map(([key, value]) => `
        <div class="metric-item">
          <span class="metric-label">${key}</span>
          <span class="metric-value">${value}</span>
        </div>
      `).join('')}
    </div>
  `;

  if (Object.keys(recommendations.allocation).length > 0) {
    html += `
      <div class="result-section">
        <h4>Recommended Allocation</h4>
        <p>How to distribute your monthly surplus:</p>
        <div class="allocation-grid">
          ${Object.entries(recommendations.allocation).map(([category, percentage]) => `
            <div class="allocation-item">
              <div class="allocation-percentage">${percentage}%</div>
              <div class="allocation-label">${category}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (recommendations.priorities.length > 0) {
    html += `
      <div class="result-section">
        <h4>Action Plan</h4>
        <p>Follow these steps to achieve your financial goals:</p>
        <ul>
          ${recommendations.priorities.map(priority => `<li>${priority}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (recommendations.investments.length > 0) {
    html += `
      <div class="result-section">
        <h4>Investment Recommendations</h4>
        <p>Based on your risk tolerance and goals:</p>
        <ul>
          ${recommendations.investments.map(investment => `<li>${investment}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (recommendations.timeline) {
    html += `
      <div class="result-section">
        <h4>Timeline</h4>
        <p>${recommendations.timeline}</p>
      </div>
    `;
  }

  resultsContent.innerHTML = html;
}
