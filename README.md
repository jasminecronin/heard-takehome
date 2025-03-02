# Heard Take-Home Assignment

This is a simple CRUD app containing a frontend, backend, and local database for the purposes of the technical take-home assessment from Heard.

## To Run the app

### Prerequisites

1. Ensure you have VS Code installed. <link>
2. Download the Remote Containers extension. <link>

### Instructions
1. Clone this repo and open it in VS Code.
2. Press Ctrl+Shift+P to open the command palette, and select Dev Containers: Reopen in Container.
3. The backend server and frontend client should spin up automatically. Once the container is built and opened, navigate to localhost:5173 to access the client.
4. A list of transactions from the database should render. You can add records, update records, or delete them.


List of things I would change to move this into production
- better styling
- pagination on the get request
- authentication obviously
- sort/filter functionality
- query functionality
- confirmation of delete
- move the database into an actual database with indexing
- use something like a graphql subscription that would monitor the transaction list
and update the frontend once the transaction goes through rather than updating the front end without knowing if the record was actually deleted
- do the above for create/update as well
- proper record id generation
- error handling on the form inputs, also sanitization