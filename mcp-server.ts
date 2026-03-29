#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define the tools
const tools: Tool[] = [
  {
    name: "create_person",
    description: "Create a new person with name, email, and optional phone number",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          description: "Full name of the person",
        },
        email: {
          type: "string",
          description: "Email address",
        },
        phoneNumber: {
          type: "string",
          description: "Optional phone number",
        },
      },
      required: ["name", "email"],
    },
  },
  {
    name: "read_person",
    description: "Get a person by ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: {
          type: "string",
          description: "Person ID",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "read_all_people",
    description: "Get all people in the database",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "update_person",
    description: "Update a person's information",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: {
          type: "string",
          description: "Person ID",
        },
        name: {
          type: "string",
          description: "Updated name (optional)",
        },
        email: {
          type: "string",
          description: "Updated email (optional)",
        },
        phoneNumber: {
          type: "string",
          description: "Updated phone number (optional)",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_person",
    description: "Delete a person by ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: {
          type: "string",
          description: "Person ID",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "search_people",
    description: "Search for people by name",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "Search query (partial name match)",
        },
      },
      required: ["query"],
    },
  },
];

type ToolInput = {
  id?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  query?: string;
};

// Create server
const server = new Server(
  {
    name: "person-search-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {
        listChanged: true,
      },
    },
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const name = request.params?.name || request.name;
  const args = request.params?.arguments || request.arguments || {};
  const input = args as ToolInput;

  try {
    switch (name) {
      case "create_person": {
        const result = await prisma.person.create({
          data: {
            name: input.name!,
            email: input.email!,
            phoneNumber: input.phoneNumber || null,
          },
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "read_person": {
        const result = await prisma.person.findUnique({
          where: { id: input.id! },
        });
        if (!result) {
          return {
            content: [
              {
                type: "text",
                text: `Person with ID ${input.id} not found`,
              },
            ],
            isError: true,
          };
        }
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "read_all_people": {
        const result = await prisma.person.findMany({
          orderBy: { createdAt: "desc" },
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "update_person": {
        const updateData: Record<string, unknown> = {};
        if (input.name !== undefined) updateData.name = input.name;
        if (input.email !== undefined) updateData.email = input.email;
        if (input.phoneNumber !== undefined) updateData.phoneNumber = input.phoneNumber;

        const result = await prisma.person.update({
          where: { id: input.id! },
          data: updateData,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "delete_person": {
        const result = await prisma.person.delete({
          where: { id: input.id! },
        });
        return {
          content: [
            {
              type: "text",
              text: `Person ${result.name} (ID: ${result.id}) deleted successfully`,
            },
          ],
        };
      }

      case "search_people": {
        const result = await prisma.person.findMany({
          where: {
            name: {
              contains: input.query!,
              mode: "insensitive",
            },
          },
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: "text",
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error executing tool ${name}: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
