Deployment To Heroku
====================

If you haven't already, you'll need to sign up for [Heroku](http://www.heroku.com/), install the [Heroku Toolbelt](https://toolbelt.heroku.com/) and login to your toolbelt.

In order to use the RedisToGo add-on, you will also need to [verify your account](https://devcenter.heroku.com/articles/account-verification) by adding a credit card. We are using the basic version of RedisToGo so there will be no charge.

	git clone git://github.com/JamesHight/kitcms.git
	cd kitcms
	
	# Create a new Heroku application instance
	heroku create
	
	# Push the application to Heroku
	heroku push herkou master
	# You could also push a branch:
	# heroku push heroku [myBranch]:master

	# Include RedisToGo Add-on
	heroku addons:add redistogo
	
	# Set number of web workers to 1
	heroku ps:scale web=1
	
	# Open the app in your browser
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