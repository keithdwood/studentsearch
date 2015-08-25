# Student Search
Sample application for skills evaluation following the instructions found [here](https://drive.google.com/folderview?id=0B2zylj4U-msMfktXNENONTZ2cGF3UXlJMVNnX0FBbmxKNnpMX1VHc3B3LTAwYVY2dlVDc00&usp=sharing).

# Code layout and overview

The application comprises two architectural components: a client UI written in javascript using the angular framework and REST services hosted on a Node.js server. The services provide access to a mock student data base and allow simple queries on student first and last names, data aggregation (GPA calculation), and lookup by 'id'.

From repository root there is a 'node_modules' directory holding the javascript libraries being used. Custom source code is in 'web/application'. The code for the client-side UI is in a directory called 'client' and the Node server and data files are in a 'server' directory.

# Running the app

Install [node](https://nodejs.org/) if you haven't already.

Once node is installed, set `<REPOSITORY_ROOT>/web/application/server` and type `node server.js`. By default the web app will be listening on port 3000. If you need to change the port, set an environment variable 'PORT' to the desired value. Navigate a browser to `http://localhost:<PORT>/` and you will be presented with a very simple web form for executing the 'search'.

The query uses a crude 'string contains' match to find records of interest. This means, for example, requesting 'm' in the 'First Name' field will return 'Samantha' as a match.

