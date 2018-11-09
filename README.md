# TVE WebApp - Clientless

**Clientless WebApp** is a web application that uses REST APIs to interact with an authentication system and lets you obtain the asset playback authorization tokens and user metadata, along with the play token. This app lets you customize all inputs such as user-agent, device information, and params for REST endpoint.

![UI](/app-UI.png)

## Getting Started

Simply download the package and deploy on local server. Make sure to enable cgi for your local webserver and install Python 2.7. 

### Prerequisites

- [Python 2.7](https://www.python.org/download/releases/2.7/)
- [Apache Tomact](https://tomcat.apache.org/tomcat-7.0-doc/setup.html)
- [cgi](https://httpd.apache.org/docs/2.4/howto/cgi.html) 

```
https://httpd.apache.org/docs/2.4/howto/cgi.html#libraries
```

### Installing

To get a development env running, put the project on a local webserver and open the 'LoginWebApp' project folder in your IDE.

The main UI file:

```
index.html
```

Backend - Python scripts:

```
WEB-INF/cgi/regcode.py //Generates the regcode to be used furing registration and login process.
WEB-INF/cgi/theApp.py //Runs the rest of the flow i.e. authorization and beyond.
```

Download the logs on-the-way by using download button. Logs are shown in the in-app console.

## Running the tests

Deploy the package and use the channel and Pay-TV provider information to run a simple test.

### Running end to end Authentication test

First test is AuthN

```
Use the first tab 'AUTHN' for it
```

### More tests

Authorization and further flow

```
Use 'AUTHZ' tab to run authorization test which also runs further tests for media-token and usermetadata
```

## Deployment

Download the package and deploy on a local Apache Tomcat server with cgi capabilities enabled.
- Make sure to have python 2.7 installed (Code is not written for latest version of Python)

## Built With

* [Bootstrap](https://getbootstrap.com/docs/4.1/getting-started/introduction/) - The web framework used
* [jQuery](https://learn.jquery.com/about-jquery/how-jquery-works/) - Used for native functionalities 
* [Python](https://www.python.org/download/releases/2.7/) - Used for backend - to generate regcode
* [Adobe Authentication Clientless API](http://tve.helpdocsonline.com/clientless-api-reference) - Used to interact with authentication server

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/SanjeevKumarPandey/ClientlessLoginWebApp/tags). 

## Authors

* **Sanjeev Pandey** - *Lead developer* - [ClientlessLoginWebApp](https://github.com/SanjeevKumarPandey)

See also the list of [contributors](https://github.com/SanjeevKumarPandey/ClientlessLoginWebApp/graphs/contributors) who participated in this project.

## License

This project is licensed as **OpenSource** License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Bob W.
* My peers at work
* OpenSource community

