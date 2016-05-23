'use babel';

let request = require('request');
let path = require('path');
let config = require('properties-reader');
//let Firebase = require('../node_modules/firebase');
const user_home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
const apmrc_file_path = path.join(user_home, '.atom','.apmrc');

export class NetworkService {

    constructor(service, url) {
        this.url = url;
        this.topHNIds = {};
        this.serviceName = service;
        this.topNPosts = [];

        console.log("constructing NetworkService with: " + this.url);

        //Following will make this plugin work behind the proxy. But yeah, only if it is set in .apmrc :-D.
        var prop = config(apmrc_file_path);
        let proxyUrl = prop.get('https-proxy') || prop.get('http-proxy');
        this.proxiedRequest = request.defaults({'proxy': proxyUrl});

        /* -- No proxy support(at this moment), and so not usable.
        this.firebaseRef = new Firebase(this.url);
          this.firebaseRef.once("value", function(data) {
              console.log(data);
          }, function(error) {
              console.error(error);
        }); */

    }; // Constructor end

  formatTopIds(topHNIds) {
    var self = this;
    //TODO: Make number of posts configurable.
    let topPosts = topHNIds.slice(0,15);
    self.topNPosts.length = 0;
    return new Promise(function(resolve , reject){
      for(var id of topPosts) {
        let storyUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
        self.proxiedRequest(storyUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              self.topNPosts.push(JSON.parse(body));
              if (self.topNPosts.length == topPosts.length){
                console.log('Resolving formatTopIds');
                resolve(self.topNPosts);
              }
            } else {
              console.error("Error while loading URL(formatTopIds):", error);
            }
          });
      }
    });
  };//End of formatTopIds

  getTopHN() {
    let self = this;
    return new Promise(function(resolve, reject){
      self.proxiedRequest(self.url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          self.topHNIds = JSON.parse(body);
          resolve(self.topHNIds);
        } else {
          console.error("Error while loading URL(getTopHN):", error);
          reject(error);
        }
      });

    });

  };//End of getTopHN

}//End of NetworkService
