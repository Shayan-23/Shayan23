import { ResponsivePie } from '@nivo/pie'
import { ResponsiveLine } from '@nivo/line'

export function TransactionCharts({ transactions }) {
  // Process data for charts
  const processedData = transactions.reduce((acc, transaction) => {
    // For Pie Charts
    if (transaction.type === 'income') {
      acc.totalIncome += transaction.amount;
      acc.incomeCategories[transaction.description] = (acc.incomeCategories[transaction.description] || 0) + transaction.amount;
    } else {
      acc.totalExpenses += transaction.amount;
      acc.expenseCategories[transaction.description] = (acc.expenseCategories[transaction.description] || 0) + transaction.amount;
    }

    // For Bar Chart
    const date = new Date(transaction.date);
    const month = date.toLocaleString('default', { month: 'short' });
    if (!acc.monthly[month]) {
      acc.monthly[month] = { month, income: 0, expenses: 0 };
    }
    if (transaction.type === 'income') {
      acc.monthly[month].income += transaction.amount;
    } else {
      acc.monthly[month].expenses += transaction.amount;
    }

    return acc;
  }, {
    totalIncome: 0,
    totalExpenses: 0,
    incomeCategories: {},
    expenseCategories: {},
    monthly: {}
  });

  // Prepare Pie Chart Data
  const incomePieData = Object.entries(processedData.incomeCategories).map(([category, value]) => ({
    id: category,
    label: category,
    value: Number((value / processedData.totalIncome * 100).toFixed(1)),
  }));

  const expensePieData = Object.entries(processedData.expenseCategories).map(([category, value]) => ({
    id: category,
    label: category,
    value: Number((value / processedData.totalExpenses * 100).toFixed(1)),
  }));

  // Process data for line chart
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const month = date.toLocaleString('default', { month: 'short' });
    
    if (!acc[month]) {
      acc[month] = { month, income: 0, expenses: 0, balance: 0 };
    }
    
    if (transaction.type === 'income') {
      acc[month].income += transaction.amount;
      acc[month].balance += transaction.amount;
    } else {
      acc[month].expenses += transaction.amount;
      acc[month].balance -= transaction.amount;
    }
    
    return acc;
  }, {});

  // Convert to array and get last 6 months
  const monthlyArray = Object.values(monthlyData)
    .slice(-6)
    .map((data, index) => ({
      ...data,
      index
    }));

  // Prepare line chart data
  const lineData = [
    {
      id: 'Income',
      color: 'var(--success)',
      data: monthlyArray.map(d => ({
        x: d.month,
        y: d.income
      }))
    },
    {
      id: 'Expenses',
      color: 'var(--error)',
      data: monthlyArray.map(d => ({
        x: d.month,
        y: d.expenses
      }))
    },
    {
      id: 'Balance',
      color: 'var(--primary-blue)',
      data: monthlyArray.map(d => ({
        x: d.month,
        y: d.balance
      }))
    }
  ];

  // Common Pie Chart settings
  const pieChartSettings = {
    margin: { top: 40, right: 80, bottom: 80, left: 80 },
    innerRadius: 0.5,
    padAngle: 0.7,
    cornerRadius: 3,
    activeOuterRadiusOffset: 8,
    borderWidth: 1,
    arcLinkLabelsSkipAngle: 10,
    arcLinkLabelsTextColor: 'var(--text)',
    arcLabelsSkipAngle: 10,
    arcLabelsTextColor: '#ffffff',
  };

  return (
    <div className="charts-container">
      <div className="pie-charts">
        <div className="chart-box">
          <h3>Income Distribution</h3>
          <div className="pie-chart">
            <ResponsivePie
              data={incomePieData}
              {...pieChartSettings}
              colors={{ scheme: 'greens' }}
            />
          </div>
        </div>
        <div className="chart-box">
          <h3>Expense Distribution</h3>
          <div className="pie-chart">
            <ResponsivePie
              data={expensePieData}
              {...pieChartSettings}
              colors={{ scheme: 'reds' }}
            />
          </div>
        </div>
      </div>
      <div className="line-chart-box">
        <h3>Financial Trends</h3>
        <div className="line-chart">
          <ResponsiveLine
            data={lineData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: false,
              reverse: false
            }}
            curve="cardinal"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Month',
              legendOffset: 36,
              legendPosition: 'middle',
              tickTextColor: 'var(--text)'
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Amount ($)',
              legendOffset: -40,
              legendPosition: 'middle',
              tickTextColor: 'var(--text)'
            }}
            enableGridX={false}
            colors={d => d.color}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            enableArea={true}
            areaOpacity={0.1}
            useMesh={true}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
                    }
                  }
                ],
                textColor: 'var(--text)'
              }
            ]}
            theme={{
              text: {
                fill: 'var(--text)'
              },
              grid: {
                line: {
                  stroke: 'var(--border)'
                }
              },
              crosshair: {
                line: {
                  stroke: 'var(--text)',
                  strokeWidth: 1,
                  strokeOpacity: 0.35
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
} 