# lag-collector

[![Build Status](https://travis-ci.com/mrjabba/lag-collector.svg?branch=master)](https://travis-ci.com/mrjabba/lag-collector)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

A node based application that parses and collects lag results from Apache Kafka's `kafka-consumer-groups` CLI tool and renders the results in a web page with graphs.

## Display 
Using Express and High Charts, we can pull the previously saved lag data and track it's changes over time. 

## Persistence
Stores lag data in JSON files in `lag.files.dir`. Each time we fetch the data, we write another file here. Then we immediately load up all the data in this directory and generate charts from it.

## Dependencies
- This application uses node. You can install with `npm install`.
- The lag gathering method uses the `kafka-consumer-groups` CLI tool that comes with Confluent Platform. This was designed to work with our Confluent Cloud deployment. Download it here: https://www.confluent.io/download. If you don't use Confluent Cloud, that's OK. This will work against any Kafka cluster. 

Note that if you are using this with Confluent's Cloud offering, you will also need to install their ccloud CLI tool and point `kafka-consumer-groups` at the location of your ccloud config file. You can see an example of this in `get_lag.sh` as `--command-config ~/.ccloud/config`.

## Configuration
All the settings except the consumer list live in `lib/settings.ts` defined as a list of keys/values.
To add your list of consumers, edit `consumers.ts` to match this example:
```
module.exports = [
    {'groupName': 'consumer1-prod-apps', 'clientIdPrefix': 'consumer1'},
    {'groupName': 'consumer2', 'clientIdPrefix': 'consumer2'}
];

```
lag-collector will invoke a BASH script `get_lag.sh` to fire `kafka-consumer-groups`, running this on an interval based on `save.lag.execution.interval` (TODO). Note that you will need to edit `get_lag.sh` to fill in your `--bootstrap-server` argument.

Example execution: `./get_lag.sh consumer1 consumer3 consumer3`.
This script should save the lag to `lag.files.dir`, currently `public/data`.

## Starting the app
Simple running the app with `node dist/app.ts` (make sure you compile first, with `tsc`) will execute all the steps to generate the lag charts. 
- Each time the app starts, it will:
    * save the lag to the data store (filesystem)
    * generate static content (see `public` directory) and serve it up

Finally, navigate to https://localhost:3000 to see your lag chart(s).
