

[Download the code for the frontend-apis](./frontend-apis.zip "Frontend APIs")
### Step 1 - install the server 
We will be using the server example from the previous chapters.
so 
```bash
cd server
npm install
npm run build
```

### Step 2 - generate client contracts  
The generated code will be the fronend dependency package
so 
```bash
cd server
npm run client
```

> Look for the @todo directory, this is where the contract package is generated.
> Contracts can be used locally or published to a registry

### Step 3 - install the client 
We'll use a simple angular-cli application.
Our `packahe.json` file contains an entry for the @todo/client package.

> yarn & npm behaves differently. npm will copy the contents of the package to the node_modules directory, while `yarn` will use a symbolic link to connect the package.
so 
```bash
cd client
npm install
ng build
```




