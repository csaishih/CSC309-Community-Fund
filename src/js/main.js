var socket = io.connect(window.location.hostname);

var p1 = React.createClass({displayName: "p1",
	getInitialState: function() {
		socket.on('go', this.go);
		return {msg: ''};
	},
	go: function(e) {
		this.setState({
			msg: e.msg
		});
	},
	render: function() {
		return React.createElement("div", null, "Hello ", this.state.msg);
	}
});

var p2 = React.createClass({displayName: "p2",
	getInitialState: function() {
		socket.on('go', this.go);
		return {msg: ''};
	},
	go: function(e) {
		this.setState({
			msg: e.msg
		});
	},
	render: function() {
		return React.createElement("div", null, "Bye ", this.state.msg);
	}
});

React.renderComponent(React.createElement(p1, null), document.getElementById("p1"));
React.renderComponent(React.createElement(p2, null), document.getElementById("p2"));
React.renderComponent(React.createElement(p3, null), document.getElementById("p3"));
React.renderComponent(React.createElement(fp1, null), document.getElementById("fp1"));
React.renderComponent(React.createElement(fp2, null), document.getElementById("fp2"));
React.renderComponent(React.createElement(fp3, null), document.getElementById("fp3"));
React.renderComponent(React.createElement(ip1, null), document.getElementById("ip1"));
React.renderComponent(React.createElement(ip2, null), document.getElementById("ip2"));
React.renderComponent(React.createElement(ip3, null), document.getElementById("ip3"));