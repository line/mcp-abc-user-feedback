/**
 * Copyright 2025 LY Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";
import pkg from "../package.json" with { type: "json" };

const server = new McpServer({
  name: "auf-mcp-server",
  version: pkg.version,
});

const baseUrl = process.env.AUF_BASE_URL;
const apiKey = process.env.AUF_API_KEY;

function createErrorResponse(message: string) {
  return {
    isError: true,
    content: [
      {
        type: "text" as const,
        text: message,
      },
    ],
  };
}

function createSuccessResponse(response: object) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(response),
      },
    ],
  };
}

server.tool(
  "search_feedbacks",
  "Searches for feedback entries by channelId",
  {
    projectId: z.number().describe("The project ID to search for feedbacks."),
    channelId: z.number().describe("The channel ID to search for feedbacks."),
    searchText: z
      .string()
      .optional()
      .describe(
        "The text to search for in the feedbacks. If not provided, all feedbacks will be returned.",
      ),
    page: z.number().default(1).describe("The page number to retrieve."),
    limit: z
      .number()
      .default(10)
      .describe("The number of feedbacks to retrieve per page."),
  },
  async ({ projectId, channelId, searchText, page, limit }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/projects/${projectId}/channels/${channelId}/feedbacks/search`,
        {
          query: {
            searchText,
          },
          page,
          limit,
        },
        {
          headers: {
            "x-api-key": apiKey,
          },
        },
      );

      return createSuccessResponse(response.data);
    } catch (error) {
      return createErrorResponse(`Failed to push message: ${error.message}`);
    }
  },
);

server.tool(
  "find_issue_by_id",
  "Finds an issue by ID",
  {
    projectId: z.number().describe("The project ID to search for feedbacks."),
    issueId: z.number().describe("The issue ID to search for feedbacks."),
  },
  async ({ projectId, issueId }) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/projects/${projectId}/issues/${issueId}`,
        {
          headers: {
            "x-api-key": apiKey,
          },
        },
      );

      return createSuccessResponse(response.data);
    } catch (error) {
      return createErrorResponse(`Failed to push message: ${error.message}`);
    }
  },
);

server.tool(
  "search_issues",
  "Searches for issues by project",
  {
    projectId: z.number().describe("The project ID to search for feedbacks."),
    page: z.number().default(1).describe("The page number to retrieve."),
    limit: z
      .number()
      .default(10)
      .describe("The number of feedbacks to retrieve per page."),
  },
  async ({ projectId, page, limit }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/projects/${projectId}/issues/search`,
        {
          query: {},
          page,
          limit,
        },
        {
          headers: {
            "x-api-key": apiKey,
          },
        },
      );

      return createSuccessResponse(response.data);
    } catch (error) {
      return createErrorResponse(`Failed to push message: ${error.message}`);
    }
  },
);

async function main() {
  if (!process.env.AUF_BASE_URL) {
    console.error("Please set AUF_BASE_URL");
    process.exit(1);
  }

  if (!process.env.AUF_API_KEY) {
    console.error("Please set AUF_API_KEY");
    process.exit(1);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(error => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
