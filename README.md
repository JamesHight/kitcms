KitCMS
======

KitCMS was designed to be a simple Node.js CMS framework. Its core components are [Express](http://expressjs.com), [Dustjs](http://linkedin.github.com/dustjs/), and [Redis](http://redis.io/). The in admin editor relies on the [CodeMirror](http://codemirror.net/) project. Content is mapped to key/value pairs stored in Redis. Templating and partials are handled using Dustjs syntax.  

There is a simple admin interface located at: 

- https://[host]/admin

Quick Start
-----------

	git clone git://github.com/JamesHight/kitcms.git
	cd kitcms
	git submodule init
	git submodule update
	npm install
	node lib/server

Free Deployment To Heroku
-------------------------

If you haven't already, you'll need to sign up for [Heroku](http://www.heroku.com/), install the [Heroku Toolbelt](https://toolbelt.heroku.com/) and login to your toolbelt.

In order to use the RedisToGo add-on, you will also need to [verify your account](https://devcenter.heroku.com/articles/account-verification) by adding a credit card.

	git clone git://github.com/JamesHight/kitcms.git
	cd kitcms
	# Create a new Heroku application instance
	heroku create
	# Push the application to Heroku
	heroku push herkou master
	# Include RedisToGo Add-on
	heroku addons:add redistogo
	# You could also push a branch:
	# heroku push heroku [myBranch]:master
	# Set number of web workers to 1
	heroku ps:scale web=1
	# Open app in browser
	heroku open


After you have made changes to your local code, you just need to do another push to Heroku.

	heroku push herkou master


Here are some other handy Heroku commands

	# Turn off all web workers, stops app
	heroku ps:scale web=0

	# Turn worker back on
	heroku ps:scale web=1

	# View logs
	heroku logs

	# See environment variables
	heroku conf


Preventing your Heroku app from idling

	# Add a monitor extension that will continually ping your app
	heroku addons:add newrelic:standard

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