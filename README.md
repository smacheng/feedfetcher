# FeedFetcher

## Mean Feed Aggregation
### made with love

FeedFetcher is a [MEAN stack](http://blog.mongodb.org/post/49262866911/the-mean-stack-mongodb-expressjs-angularjs-and) application that connects to Reddit and Hacker News, aggregating the results into a common interface.

By default, FeedFetcher only saves the last 24 hours of posts it scrapes.  Posts can be saved and searched through by a logged in user.  At this time, FeedFetcher does not support user registration.

Feeds are from Reddit or Hacker News, and must return a JSON response to be processed.  Support for RSS Feeds and more generalized scrapping is on the road map.

## Dependencies

As a MEAN App, you must have Node/NPM/Mongo set up.  Optionally you may install client side scripts (Angular, Angular Material, Angular Route) via Bower.

For automation, FeedFetcher uses Gulp to process all source files into final versions.

## Goals
FeedFetcher is a fun toy.  It's primary goal in life is to simply making reading Hacker News and Reddit easier and more enjoyable.

Additionally, it should be perceptually fast and easy to navigate.  Eventually, FeedFetcher's API will be consumed by an iOS application as well.

## Setup/Caveats

FeedFetcher is designed to be deployed in a distributed manner.  That is, files in the Client directory served by a web server, the Server directory to be proxied to via the /api route, and MongoDB on a separate host.

During development, it may be helpful to not have to worry about this.  For development purposes, follow this workflow:
* Run `gulp default` to build everything.
* Run `node app.js --development` .  This enables Express' static routing.

## Installation

* Clone/Download the Repo
* `npm install` in both client/server Directory
* Optionally `bower install` in client directory
* Add a file named appconfig.js to the server directory, with the following format:
```node
module.exports = {
    'port': process.env.PORT || YOUR_DESIRED_EXPRESS_PORT,
    'database': 'mongodb://YOUR_MONGODB_HOST:27017/feedfetcher',
    'feedfetcherSecret' : 'SECRET_TO_ENCRYPT_TOKENS',
    'email' : 'ADMIN_LOGIN_EMAIL',
    'password' : 'ADMIN_LOGIN_PASSWORD',
    'admin' : true,
    'testuseremail' : 'TEST_USER_EMAIL',
    'testuserpassword' : 'TEST_USER_PASSWORD',
};
```
* Run `gulp default` in client directory to build files
* Optionally run the `seed.sh` script in the server/db folder to seed the Mongo DB with feeds.
* Run `node app.js --setup` to config the admin user
* Drop the build/prod onto a web server
* Fetch them feeds!

In future releases, this process will be simplified.  FeedFetcher is very much a work in progress.

## Testing

Tests can currently be ran on the SERVER SIDE only.  I am working diligently to write tests for client side.

From the server folder, tests can be ran using `gulp test`.  Future commits will enable NPM test.

## Project Status

Originally, FeedFetcher was embedded into my personal web site, https://mphfish.com (you can view the code for it [here](https://github.com/mphfish/ninety).  However, as development proceeded, I ran into many problems due to trying to graft it onto a blogging platform.

The project currently works as a part of Ninety, and work is proceeding to de-tangle it from the blog platform.

## Inspiration/Credits/Other things you should look at.

* The build process for this project borrows/steals heavily from Google's [Web Starter Kit](https://github.com/google/web-starter-kit).  I have simplified a few of their build steps, but I hope to reimplement them after the project is working again.
* Additional build steps, as well as folder structure are inspired by [ng-boilerplate](http://joshdmiller.github.io/ng-boilerplate/#/home).  I wanted to take this in another direction, but I feel that the spirit is there.  I long for the day where there is a Gulp/Sass ng-boilerplate.
* I am currently using Bootstrap for layout, but I am migrating this project over to [Angular Material](https://material.angularjs.org/latest/#/).  While I think Bootstrap is a fine framework, and use it in other things, I don't think the additional weight is adding anything to this project.

## Roadmap - updated 07/06/2015

A rough idea of plans for this application:
* Test the entire damn thing! - Server Side has tests.
* Add to travis and code climate for test
* Improve the styling and layout.
* Improve Build process
* Improve Gulpfile, which is a bit hacky at this point.
* Enable configuration of feed fetch time
* Force a feed refresh
* Enable RSS Feed integration
* Allow user registration

## Contributing

Please feel free!  While I primarily use this for my own purposes, if you find you dig something here and want to make it better, the more the merrier.

## License

MIT.
