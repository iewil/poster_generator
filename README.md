# Getting started

Step 1: Clone repo and checkout node-script branch

```
git clone git@github.com:iewil/poster_generator.git
git checkout node-script
```

Step 2: Go into root folder and install libraries

```
cd post-script
npm install
```

Step 3: Change params based on requirements (line 93)

```
generatePDF("NTUC Northpoint SE", "https://temperaturepass.ndi-api.gov.sg/login/PROD-S83CS0191L-NTUC-NORTHPOINT-SE")
```

Step 4: Run script

```
node index.js
```