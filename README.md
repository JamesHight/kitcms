kitCMS
======

kitCMS was designed to be a simple Node.js CMS framework. Its core components are [Express](http://expressjs.com), [Dustjs](http://linkedin.github.com/dustjs/), and [Redis](http://redis.io/). The in admin editor relies on the [CodeMirror](http://codemirror.net/) project. Content is mapped to key/value pairs stored in Redis. Templating and partials are handled using Dustjs syntax.  

<!--
[Live Demo](http://demo.kitcms.com)

[Admin Demo](http://demo.kitcms.com/admin)

	user: foo
	password: bar
-->
Main Features
-------------

* Dead simple design, everything is a key/value pair stored in Redis, even urls
* Baked in support for serving multiple web domains with data namespacing, just update the config
* Multi process and server live template updating
* Simple web admin interface
* Truly asynchronous template rendering using Dustjs
* Easy to write custom template helpers


Quick Start
-----------

	git clone git://github.com/JamesHight/kitcms.git
	cd kitcms
	git submodule init
	git submodule update
	npm install
	node lib/server

See Also: [Deploying To Heroku](https://github.com/JamesHight/kitcms/blob/master/HEROKU_DEPLOYMENT.md)

<!--

---

For a better understanding of how the CMS is structured, please have a look at these posts detailing its construction.

1. [Getting Started](http://zavoo.com/nodejs_asynchronous_cms/01/getting_setup)
2. [Configuration File](http://zavoo.com/nodejs_asynchronous_cms/02/configuration_file)
3. [Adding A Database Layer](http://zavoo.com/nodejs_asynchronous_cms/03/database_layer)
4. [Integrating Dustjs With Expressjs And Redis](http://zavoo.com/nodejs_asynchronous_cms/04/dustjs_expressjs_redis)
5. [CodeMirror, Admin Interface](http://zavoo.com/nodejs_asynchronous_cms/05/codemirror_admin)
6. [Securing Admin With Expressjs Basic Auth](http://zavoo.com/nodejs_asynchronous_cms/06/expressjs_basic_auth)
7. [Dustjs, Live Template Reloading](http://zavoo.com/nodejs_asynchronous_cms/07/dustjs_live_template_reloading)
8. [Creating Dustjs Helpers](http://zavoo.com/nodejs_asynchronous_cms/08/dustjs_helpers)
9. [Adding Cluster Support](http://zavoo.com/nodejs_asynchronous_cms/09/cluster_support)
10. [Deploying To Heroku](http://zavoo.com/nodejs_asynchronous_cms/10/deploying_to_heroku)

-->

---

Templating Example For http://[host]/foo
----------------------------------------

Redis key: layout

	{>header/}

	<h1>
		{+title/}
	</h1>
	<div class="content">
		{+content}This text will be replaced by the content from the main template.{/content}
	</div>

	{>footer/}

Redis key: header
	
	<div class="header">
		<h2>Header</h2>
	</div>

Redis key: footer
	
	<div class="footer">
		<h2>Footer</h2>
	</div>
	

Redis key: /foo

	{>layout/}

	{<title}This is my Foo page!{/title}

	{<content}
		<h3>Example of a custom Dustjs helper located in lib/dust/helpers/code.js</h3>
		{@code}
			// Here is some syntax highlighted code
			window.onload = function() {
				alert('Hello World!');
			};
		{/code}

		{@markdown}
		Here is a bit of markdown inside a Dustjs template
		==================================================

		1. The markdown helper is located at lib/dust/helpers/markdown.js
		2. It is an example of an asynchronous Dustjs helper.
		{/markdown}

	{/content}

---

Configuration
-------------

Everything is configured using the config.js file in the root directory.

See lib/db/redis.js for additional database configuration options.