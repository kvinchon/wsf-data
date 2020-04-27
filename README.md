# wsf-data
This repository is exclusively reserved for the 4th year Data Project, carried out with a purely pedagogical aim.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
Make sure that `Node.js` is installed on your local machine. Binaries, installers, and source tarballs are available at <https://nodejs.org/en/download/>.

### Installing
Clone this repository into a folder of your choice:
```bash
$ git clone https://github.com/kvinchon/wsf-data.git && cd wsf-data/
```

To load server-side dependencies, run the following command: 
```bash
$ cd api/ && npm install
```

Create a `.env` file in the `api/` folder containing the database connection credentials:
```
DB_HOST=MY_DB_HOST
DB_USER=MY_DB_USER
DB_PASS=MY_DB_PASS
DB_NAME=MY_DB_NAME
```

Start the server by running the following command. By default, the server runs on port `3000`:
```bash
$ npm run start
```

In another terminal window, navigate to the `wsf-data/` folder. To load client-side dependencies, run the following command:
```bash
$ cd front/ && npm install
```

Start the client by running the following command. By default, the client runs on port `8080`:
```bash
$ npm run serve
```

## API Documentation
Documentation for the latest Current release is available at <http://localhost:3000/documentation>.

## Authors
* **Kevin Vinchon** - *Initial work* - [kvinchon](https://github.com/kvinchon)