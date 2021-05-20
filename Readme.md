# Dogbase readme
[Dogbase.net](https://www.dogbase.net/) is a website built using **Express** & **Node.js**. The database was built using **MongoDB** and **Mongoose**. The website was created for my web-developer [portfolio](https://nootuff.github.io/) to display my proficiency in these languages and took around 4 months to complete. 

Its design is based on [Reddit](https://www.reddit.com
), allowing users to create an account, upload images (of dogs), interact with other users' uploads and customise their own account.

![Site image]( https://raw.githubusercontent.com/Nootuff/Storage/master/Portfolio_images/dogBase-2.jpg)
## Features
- Cloud image storage on [Cloudinary](https://cloudinary.com/).
- Responsive, mobile-first design.
- A light-them/ dark-theme feature allowing users to completely change the colour-scheme of the website to avoid eye-strain. This preference is saved to their account, the site loads in their preferred display theme by switching between CSS stylesheets on login.
- Attractive, user friendly UI.
- Extensive middleware to prevent users using 3rd party software such as Postman or AJAX from manipulating the site’s back-end as well as multiple security NPM packages such as:
     - *Express Mongoose Sanitize*
     - *Sanitize-html*
     - *Helmet*

## Users are able to:
- Post images with titles & captions which they can update.
- Leave comments on posted images.
- Favourite, like or dislike other user’s posts with the number of favourites, likes or dislikes a post has received being displayed for others to see. 
- Set and change their display name, this is the name other users will see associated with them on their posts, comments and account page.
- Set their user profile picture or simply opt out of having one (there is a placeholder image in place for users with no image of their own).
- Change their site display preferences from a light-theme to dark-theme.
- Users have account pages where they can see their own user data as well as their own favourites and posts, there are also separate user pages viewable by other users containing only their non-confidential user data while also showing their favourites and posts.


## Credits
Massive thanks to **Colt Steele** whose amazing course The Web Developer Bootcamp allowed me to create this.
