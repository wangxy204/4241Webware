Assignment 1 - Hello World: Basic Deployment w/ Git, GitHub, Heroku  
===

Due Nov 3

This assignment is a "warm-up" exercise. 
You will simply deploy the starting Web site that you will use this term to the [Heroku Web platform](http://www.heroku.com/). 

Refer to [Getting started with node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction).

(Thanks to past instructors of the course, here is a short [getting started with Heroku movie](http://web.cs.wpi.edu/~gpollice/Movies/HerokuGettingStarted/) that may also help.)

Treat this assignment as a chance to get up to speed on Git, GitHub, and Heroku. If you already know these, great. However, if you're new to them, spend several hours practicing, experimenting, and reading documentation. In other words, don't just get your website up and done. You will need skill with these tools throughout the rest of the course.

Assignment details
---

Do the following to complete this assignment:

1. Clone the [starting project code](http://github.com/cs4241-16b/gettingstarted). **DO NOT FORK THE REPO and DO NOT MAKE IT PUBLIC.** This repo contains:
    * the server code, `server.js`
    * the `Procfile` that you need for Heroku deployment
    * A starting `index.html` file that you will edit as described below
2. Edit `index.html` to show the following information about you:
    * your name and class at WPI (e.g. class of 2020) Note: Do not put any contact or personal information that you do not potentially want other people outside of this class to see.
    * your major(s) and minor(s)
    * previous computer science courses that you have taken at WPI
    * your experience with the following technologies and methods (none, some, a lot)
        * HTML
        * CSS
        * Java
        * JavaScript
        * Ruby
        * Python
        * unit testing
3. Test your project to make sure that when someone goes to your main page, it displays correctly.
4. Deploy your project to Heroku.
5. Ensure that your project has the proper naming scheme (guide follows) so we can find it.

Naming and URL Scheme
---

You must use a consistent naming scheme for all projects in this course.
If we can't find it, we can't grade it.

By default Heroku assigns your application a random name.
To change it, follow [this guide](https://devcenter.heroku.com/articles/renaming-apps).

The name scheme should be `yourGitHubUsername-cs4241-a1`.
The `a1` will need to be updated to `a2`, `a3`, and so on in future projects.

Resources
---

If you need a JavaScript/HTML/CSS refresher, see [Technology Fundamentals by Scott Murray](http://chimera.labs.oreilly.com/books/1230000000345/ch03.html#_html) and/or [JavaScript Codeacademy](https://www.codecademy.com/en/tracks/javascript).

If you need a Git/GitHub refreseher, see [GitHub Bootcamp](https://help.github.com/categories/bootcamp/), the [GitHub Guides](https://guides.github.com/) (especially the ones on Hello World, and Understanding the GitHub Flow, and Forking Projects), and [CodeSchool's Try Git Course](https://www.codeschool.com/courses/try-git).
