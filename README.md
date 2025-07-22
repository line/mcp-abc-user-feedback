# ABC User Feedback MCP Server

[Model Context Protocol (MCP)](https://github.com/modelcontextprotocol) server implementation that integrates [ABC User Feedback](https://github.com/line/abc-user-feedback) API to connect an AI Agent.


![](/assets/example.png)

## Tools

1. **search_feedbacks**
  - Searches for feedback entries by channelId
  - **Inputs:**
    - `projectId` (number): The project ID to search for feedbacks.
    - `channelId` (number): The channel ID to search for feedbacks.
    - `searchText` (string?): The text to search for in the feedbacks. If not provided, all feedbacks will be returned.
    - `page` (number): The page number to retrieve.
    - `limit` (number): The number of feedbacks to retrieve per page.

2. **find_issue_by_id**
  - Finds an issue by ID
  - **Inputs:**
    - `projectId` (number): The project ID to search for feedbacks.
    - `issueId` (number): The issue ID to search for feedbacks.

3. **search_issues**
  - Searches for issues by project
  - **Inputs**
    - `projectId` (number): The project ID to search for feedbacks.
    - `page` (number): The page number to retrieve.
    - `limit` (number): The number of feedbacks to retrieve per page.


## Installation

requirements:
- Node.js v20 or later

### Step 1: Install the [ABC User Feedback](https://github.com/line/abc-user-feedback)

To communicate with the MCP Server, an active ABC User Feedback API server is required.

### Step 2: Configure AI Agent

Please add the following configuration for an AI Agent like Claude Desktop or Cline. 

Set the environment variables or arguments as follows:

- `AUF_BASE_URL`: (required) ABC User Feedback API base URL.
- `AUF_API_KEY`: (required) ABC User Feedback API key. You can create API Key in `Settings` page in the User Feedback Admin.

```json
{
  "mcpServers": {
    "mcp-abc-user-feedback": {
      "command": "node",
      "args": [
        "path/to/index.js"
      ],
      "env": {
        "AUF_BASE_URL" : "FILL_HERE",
        "AUF_API_KEY" : "FILL_HERE"
      }
    }
  }
}
```

## Contributing

Please check [CONTRIBUTING](./CONTRIBUTING.md) before making a contribution.
