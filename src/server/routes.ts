import { Express } from 'express';
import { AddOn } from 'atlassian-connect-express';

export default function routes(app: Express, addon: AddOn) {
  app.get('/install', (req, res) => {
    res.json({
      "key": "subtasks-panel",
      "name": "Subtasks Panel",
      "description": "An Atlassian Connect app that adds a panel to Jira issues to display subtasks.",
      "baseUrl": "{{yourBaseUrl}}",
      "authentication": {
        "type": "jwt"
      },
      "lifecycle": {
        "installed": "/installed",
        "uninstalled": "/uninstalled",
      },
      "scopes": [
        "READ"
      ],
      "apiMigrations": {
        "signed-install": true
      },
      "modules": {
        "webPanels": [{
          "key": "subtasks-panel",
          "location": "atl.jira.view.issue.left.context",
          "name": {
            "value": "Subtasks"
          },
          "url": "/app/subtasks"
        }]
      }

    }
    );
  });

  app.get('/subtasks', addon.authenticate(), (req, res) => {
    // Rendering a template is easy; the render method takes two params: the name of the component or template file, and its props.
    // Handlebars and jsx are both supported, but please note that jsx changes require `npm run watch-jsx` in order to be picked up by the server.
    const httpClient = addon.httpClient(req);
    httpClient.get(`/rest/api/2/issue/${req.query.issueKey}/subtask`, (error: any, response: { statusCode: number; }, body: string) => {
      if (error) {
        console.error('Error fetching subtasks:', error);
        return res.status(500).send('Error fetching subtasks');
      }
      if (response.statusCode !== 200) {
        console.error('Error fetching subtasks:', response.statusCode, body);
        return res.status(response.statusCode).send(body);
      }
      const subtasks = JSON.parse(body);
      res.render('subtasks', { subtasks, issueKey: req.query.issueKey });
    });
  });

  app.get('/issue', addon.authenticate(), (req, res) => {
    // Rendering a template is easy; the render method takes two params: the name of the component or template file, and its props.
    // Handlebars and jsx are both supported, but please note that jsx changes require `npm run watch-jsx` in order to be picked up by the server.
    const httpClient = addon.httpClient(req);
    httpClient.get(`/rest/api/2/issue/${req.query.issueKey}`, (error: any, response: { statusCode: number; }, body: string) => {
      if (error) {
        console.error('Error fetching subtasks:', error);
        return res.status(500).send('Error fetching subtasks');
      }
      if (response.statusCode !== 200) {
        console.error('Error fetching subtasks:', response.statusCode, body);
        return res.status(response.statusCode).send(body);
      }
      const subtasks = JSON.parse(body);
      res.render('subtasks', { subtasks, issueKey: req.query.issueKey });
    });
  });




  // Add additional route handlers here...
}
