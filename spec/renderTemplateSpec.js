var request = require("request");
const request_promise = require('request-promise');

var base_url = "http://localhost:3000/"
// var base_url = "https://shrouded-harbor-29005.herokuapp.com/";

describe("test basic web setup", function() {

  describe("GET /", function() {
    it("returns status code 200", function() {
      request.get(base_url, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        // done();
      });
    });
  });
});

describe ("tests the ability to render a template", function() {

  // endpoint = "receiveForm";
  endpoint = "renderTemplate";

  describe("POST /" + endpoint, function() {
    let url = base_url + endpoint;
    const form = {
        template:'hi+{{name}}',
        name:'Jimmy'
    };

    var formData = JSON.stringify(form);
    var contentLength = formData.length;

    it("renders a template", function() {
      console.log("rendering a template");

      request({
        headers: {
          'Content-Length': contentLength,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        uri: url,
        body: formData,
        method: 'POST',
        json: true
      }, function (error, response, body) {
        // console.log("body=" + body);
        // let form = JSON.parse(body);
        let form = body;
        console.log("response=" + form.response);
        expect(form.response).toBe("hi Jimmy");
        // done();
      });
    });
  });
});
