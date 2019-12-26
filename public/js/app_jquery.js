class SendMail extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      sendgrid_data: ''
    };
  }

  sendMail() {
    //
    // Get the current values of the html input elements.
    //
    let data = {
      to: $("#to").val(),
      from: $("#from").val(),
      message: $("#message").html()
    }; //
    // Send email using sendgrid.
    //

    $.ajax({
      url: "/sendMail",
      data: data,
      success: function (data) {
        //
        // Save the sendgrid response.
        //
        this.setState({
          sendgrid_data: data
        });
      }.bind(this),
      error: function (e) {
        alert(e.message);
      }
    });
  }

  render() {
    var response = '';
    var fontColor = '';

    if (this.state.sendgrid_data.indexOf('202') == 0) {
      response = 'Send mail succeeded!';
      fontColor = 'darkgreen';
    } else if (this.state.sendgrid_data != '') {
      response = 'Send mail failed.';
      fontColor = 'red';
    }

    return React.createElement("div", {
      className: "step"
    }, React.createElement("div", {
      className: "title"
    }, "3. Send it"), React.createElement("div", null, "From: ", React.createElement("input", {
      id: "from",
      size: "20"
    }), React.createElement("br", null), "To: ", React.createElement("input", {
      id: "to",
      size: "20"
    })), React.createElement("pre", null, React.createElement("div", {
      id: "message"
    })), React.createElement("button", {
      onClick: this.sendMail.bind(this)
    }, "send mail"), React.createElement("div", {
      id: "sendgrid_response",
      style: {
        color: fontColor
      }
    }, response), React.createElement("div", {
      id: "sendgrid_data"
    }, this.state.sendgrid_data));
  }

}

class PreviewMessage extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  renderTemplate() {
    //
    // Render the template on the server.
    //
    let data = {
      template: $("#template").val()
    }; //
    // Send the values of template variables, from the HTML input elements.
    //

    this.props.fields.forEach(function (val, idx) {
      data[val] = $("#" + val).val();
    });
    $.ajax({
      url: "/renderTemplate",
      data: data,
      success: function (data) {
        //
        // Insert the rendered user template into the DOM.
        //
        $("#message").text(data);
      },
      error: function (e) {
        alert(e.message);
      }
    });
  }

  render() {
    let templateFields = this.props.fields.map(function (val, idx) {
      //
      // Construct an input element for each template variable.
      //
      return React.createElement("div", {
        key: idx
      }, val, " : ", React.createElement("input", {
        id: val,
        size: "20"
      }));
    });
    return React.createElement("div", {
      className: "step"
    }, React.createElement("div", {
      className: "title"
    }, "2. Supply values for the variables"), React.createElement("div", {
      id: "templateFields"
    }, templateFields), React.createElement("button", {
      onClick: this.renderTemplate.bind(this)
    }, "preview email message"));
  }

}

class Mailmerge extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      fields: []
    };
  }

  processTemplate() {
    //
    // Get the user-defined template from the HTML textarea.
    //
    let template = $("#template").val(); //
    // Extract variable names from the template.
    //

    let regex = /\{\{.*?\}\}/g;
    let matches = template.match(regex);
    let fields = [];
    matches.forEach(function (val, idx) {
      let v = val.substring(2, val.length - 2);
      fields.push(v);
    });
    this.setState({
      fields: fields
    });
  }

  render() {
    let example = `Example:

Hi {{contact_first_name}}

Get {{discount_rate}} off your next purchase using this discount code:
    {{discount_code}}`;
    return React.createElement("div", null, React.createElement("div", {
      id: "titleBar"
    }, React.createElement("div", {
      id: "pageTitle"
    }, "Mail Merge"), React.createElement("i", null, "using react, node, and handlebars")), React.createElement("div", {
      className: "step"
    }, React.createElement("div", {
      className: "title"
    }, "1.  Create an email template"), React.createElement("textarea", {
      id: "template",
      rows: "8",
      cols: "80"
    }), React.createElement("pre", null, example), React.createElement("button", {
      onClick: this.processTemplate.bind(this)
    }, "process template")), React.createElement(PreviewMessage, {
      fields: this.state.fields
    }), React.createElement(SendMail, null));
  }

}

function renderRoot() {
  var domContainerNode = window.document.getElementById('root');
  ReactDOM.render(React.createElement(Mailmerge, null), domContainerNode);
}

$(document).ready(function () {
  renderRoot();
});

