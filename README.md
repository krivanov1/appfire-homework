# How to run this app

1. **Install dependencies**  
   Run the following command in the project root:
   ```sh
   npm install
   ```

2. **Update URLs**  
   Replace `{{yourBaseUrl}}` with your ngrok URL in both `routes.ts` and `atlassian-connect.json`.

3. **Set ngrok auth token**  
   Replace `{{youAuthtoken}}` in `credentials.json` with your ngrok auth token.

4. **Open ngrok tunnel on port 3001**  
   Run:
   ```sh
   ngrok http 3001
   ```

5. **Start the development server**  
   Run the following command in the project root:
   ```sh
   npm run dev:custom
   ```

6. **Install the Jira app**  
   Use `{{yourBaseUrl}}/install` as your installation url