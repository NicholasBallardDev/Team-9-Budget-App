import express from 'express';
import { compareGroceryPrices, findTopDeals, getBudgetRecommendation } from './tools/tools.js';

const app = express();
app.use(express.json());

// Endpoint for compare basket
app.post('/api/compare_basket', async (req, res) => {
  try {
    console.log('Received body:', req.body); // Debug line
    
    const { groceryItems } = req.body;
    
    // groceryItems should be an array of items
    // For now, just return mock comparison data
    const result = {
      weeklySavings: 15.8,
      monthlySavings: 68.41,
      storeComparison: [
        {
          store: "Aldi",
          total: 46.5,
          items: groceryItems,
          color: "#0078C8",
          nearbyLocations: ["Melbourne Store"]
        },
        {
          store: "Coles",
          total: 52.3,
          items: groceryItems,
          color: "#E4002B",
          nearbyLocations: ["Melbourne Store"]
        },
        {
          store: "Woolworths",
          total: 53.1,
          items: groceryItems,
          color: "#3DB54A",
          nearbyLocations: ["Melbourne Store"]
        },
        {
          store: "IGA",
          total: 58.2,
          items: groceryItems,
          color: "#E31837",
          nearbyLocations: ["Melbourne Store"]
        }
      ],
      storeRanking: ["Aldi", "Coles", "Woolworths", "IGA"]
    };
    
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Endpoint for find top deals
app.post('/api/find-top-deals', async (req, res) => {
  try {
    const { location, category, maxResults } = req.body;
    const result = await findTopDeals(location, category, maxResults);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Endpoint for budget recommendations
app.post('/api/budget-recommendation', async (req, res) => {
  try {
    const { monthlyBudget, householdSize, preferences } = req.body;
    const result = await getBudgetRecommendation(monthlyBudget, householdSize, preferences);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'MCP server is running!' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`MCP HTTP Server running on http://localhost:${PORT}`);
});