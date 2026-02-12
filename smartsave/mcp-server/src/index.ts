#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Import your tool handlers
import { compareGroceryPrices, findTopDeals, getBudgetRecommendation } from "./tools/tools.js";

// Create MCP server
const server = new Server(
  {
    name: "savie-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "compare_grocery_prices",
        description: "Compare grocery prices across different stores for a given basket of items",
        inputSchema: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: { type: "string" },
              description: "List of grocery items to compare"
            },
            location: {
              type: "string",
              description: "Location/postcode for comparison"
            },
            stores: {
              type: "array",
              items: { type: "string" },
              description: "Optional list of stores to compare (e.g., ['Woolworths', 'Coles', 'Aldi'])"
            }
          },
          required: ["items", "location"]
        }
      },
      {
        name: "find_top_deals",
        description: "Find the best grocery deals and discounts in a specific location",
        inputSchema: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "Location/postcode to search for deals"
            },
            category: {
              type: "string",
              description: "Optional category filter (e.g., 'produce', 'dairy', 'meat')"
            },
            maxResults: {
              type: "number",
              description: "Maximum number of deals to return (default: 5)"
            }
          },
          required: ["location"]
        }
      },
      {
        name: "get_budget_recommendation",
        description: "Get personalized budget and shopping recommendations based on user preferences",
        inputSchema: {
          type: "object",
          properties: {
            monthlyBudget: {
              type: "number",
              description: "User's monthly grocery budget"
            },
            householdSize: {
              type: "number",
              description: "Number of people in household"
            },
            preferences: {
              type: "array",
              items: { type: "string" },
              description: "Dietary preferences or restrictions"
            }
          },
          required: ["monthlyBudget", "householdSize"]
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "compare_grocery_prices": {
        const result = await compareGroceryPrices(
          args.items as string[],
          args.location as string,
          args.stores as string[] | undefined
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case "find_top_deals": {
        const result = await findTopDeals(
          args.location as string,
          args.category as string | undefined,
          args.maxResults as number | undefined
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case "get_budget_recommendation": {
        const result = await getBudgetRecommendation(
          args.monthlyBudget as number,
          args.householdSize as number,
          args.preferences as string[] | undefined
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }
      ],
      isError: true
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Savie MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});