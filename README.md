# How to run this app

1. **Install dependencies**  
   Run the following command in the project root:
   ```sh
   npm install
   ```

2. **Open ngrok tunnel on port 3001**  
   Run:
   ```sh
   ngrok http 3001
   ```

3. **Update URLs**  
   Replace `{{yourBaseUrl}}` with your ngrok URL in both `routes.ts` and `atlassian-connect.json`.

4. **Set ngrok auth token**  
   Replace `{{youAuthtoken}}` in `credentials.json` with your ngrok auth token.

5. **Start the development server**  
   Run the following command in the project root:
   ```sh
   npm run dev:custom
   ```

6. **Install the Jira app**  
   Use `{{yourBaseUrl}}/install` as your installation url

6. **Install the Jira app**  
   Use `{{yourBaseUrl}}/install` as your installation url

7. **Install Chrome/Brave Plugin**  
   Install ModHeader - Modify HTTP headers extension and add ngrok-skip-browser-warning with a value of 1, in order to skip ngrok warning
