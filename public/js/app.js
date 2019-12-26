//
// Uses sendgrid to send an email.
//
class SendMail extends React.Component {
  constructor(props, context) {
    super(props, context); //
    // The to and from email addresses are managed here in state,
    // but the message comes from the parent in props.
    //

    this.state = {
      sendgrid_data: '',
      to: '',
      from: ''
    };
  }

  sendMail() {
    //
    // Use URLSearchParms instead of formData because POST.
    //
    var data = new URLSearchParams();
    data.append('to', this.state.to);
    data.append('from', this.state.from);
    data.append('message', this.props.message);
    let url = "/sendMail"; // url = "/receiveForm";
    // let url = "/cgi-bin/sendEmail.py";
    // url = "/cgi-bin/stub.py";

    fetch(url, {
      method: "POST",
      body: data
    }).then(async function (response) {
      // return response.json();
      var t = await response.text();
      var j = JSON.parse(t);
      return j;
    }).then(function (data) {
      //
      // Save the sendgrid response.
      //
      this.setState({
        sendgrid_data: data.response
      });
    }.bind(this));
  }

  onChangeValueHandler(val) {
    this.setState({
      [val.target.id]: val.target.value
    });
  }

  render() {
    var response = '';
    var fontColor = '';
    let onChange = this.onChangeValueHandler.bind(this); //
    // Was the email sent?  (not checking if it was received though)
    //

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
      size: "20",
      onChange: onChange
    }), React.createElement("br", null), "To: ", React.createElement("input", {
      id: "to",
      size: "20",
      onChange: onChange
    })), React.createElement("pre", null, React.createElement("div", {
      id: "message"
    }, this.props.message)), React.createElement("button", {
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

} //
//  Displays the fields extracted from the template as HTML input elements.
//  Generates the email message from the template and supplied values for variables.
//


class RenderedTemplate extends React.Component {
  //
  // The template variables will become fields in state.
  //
  constructor(props, context) {
    super(props, context);
  }

  renderTemplate() {
    //
    // Add the template to state, just for this formData.  No need to call setState.
    //
    this.state.template = this.props.template;
    let url = "/renderTemplate"; // let url = "/cgi-bin/renderTemplate.py";
    // url = "/cgi-bin/stub.py";
    //
    // Use URLSearchParams, not formdata, for POST.
    //

    var data = new URLSearchParams();

    for (const key in this.state) {
      data.append(key, this.state[key]);
    }

    fetch(url, {
      method: "POST",
      body: data
    }).then(function (response) {
      return response.json(); // var answer = await response.text();
      // var j = JSON.parse(answer);
      // return j;
    }).then(function (data) {
      //
      // Update parent with new value for message, which goes into its state,
      // causing a render of this component.
      //
      this.props.onChangeValue({
        target: {
          value: data.response,
          id: 'message'
        }
      });
    }.bind(this));
  }

  onChangeValueHandler(val) {
    this.setState({
      [val.target.id]: val.target.value
    });
  }

  render() {
    let onChange = this.onChangeValueHandler.bind(this);
    let renderTemplate = this.renderTemplate.bind(this);
    let templateFields = this.props.fields.map(function (val, idx) {
      //
      // Construct an input element for each template variable.
      //
      return React.createElement("div", {
        key: idx
      }, val, " : ", React.createElement("input", {
        id: val,
        size: "20",
        onChange: onChange
      }));
    }.bind(this));
    return React.createElement("div", {
      className: "step"
    }, React.createElement("div", {
      className: "title"
    }, "2. Supply values for the variables"), React.createElement("div", {
      id: "templateFields"
    }, templateFields), React.createElement("button", {
      onClick: renderTemplate
    }, "preview email message"));
  }

} //
//  Root class, holds the template editor.
//


class Mailmerge extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      fields: [],
      template: '',
      message: ''
    };
  }

  processTemplate() {
    //
    // Get the user-defined template from state.
    //
    let template = this.state.template; //
    // Extract variable names from the template.
    //

    let regex = /{{.*?}}/g;
    let matches = template.match(regex);
    let fields = [];
    matches.forEach(function (val, idx) {
      let v = val.substring(2, val.length - 2);
      fields.push(v);
    }); //
    // Store field names in state.
    //

    this.setState({
      fields: fields
    });
  }

  onChangeValueHandler(val) {
    //
    // Set state using the id of an element and its value.
    //
    this.setState({
      [val.target.id]: val.target.value
    });
  }

  render() {
    let example = `Example:

Hi {{contact_first_name}},

Get {{discount_rate}} off your next purchase using this discount code:
    {{discount_code}}.`;
    let onChange = this.onChangeValueHandler.bind(this);
    return React.createElement("div", null, React.createElement("div", {
      id: "titleBar"
    }, React.createElement("div", {
      id: "pageTitle"
    }, "Mail Merge"), React.createElement("i", null, "using react, python, and jinja2")), React.createElement("div", {
      className: "step"
    }, React.createElement("div", {
      className: "title"
    }, "1.  Create an email template"), React.createElement("textarea", {
      id: "template",
      rows: "8",
      cols: "80",
      onChange: onChange
    }), React.createElement("pre", null, example), React.createElement("button", {
      onClick: this.processTemplate.bind(this)
    }, "process template")), React.createElement(RenderedTemplate, {
      fields: this.state.fields,
      template: this.state.template,
      onChangeValue: onChange
    }), React.createElement(SendMail, {
      message: this.state.message
    }));
  }

}

function renderRoot() {
  var domContainerNode = window.document.getElementById('root');
  ReactDOM.render(React.createElement(Mailmerge, null), domContainerNode);
} // The DOM is ready now.


renderRoot();

