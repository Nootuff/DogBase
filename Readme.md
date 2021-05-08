# Dogbase readme

Dogbase is a website built using **express**.

Users are able to:
- Post images with captions which they can update.
- Leave comments on images.
- Favourite, like or dislike other user’s posts.
- Set and change their display name, this is the name other users will see associated with them on their posts, comments and account page.
- Set their user profile picture or simply opt out of having one (there is a placeholder image in place for users with no image of their own).
- Users have user pages where they can see their own user data as well as their own favourites and posts, there are also separate user pages viewable by other users containing only their non-confidential user data while also showing their favourites and posts.
- Users can also change their site display setting preferences from light-mode to dark mode, this preference is saved to their account, the site loads in their preferred display mode on login.
- Users have access to an account settings page where they can change most of their account settings at any time.
- Read hitchhikers guide to the galaxy
- Put non-mandatory next to profile image in register page

Includes extensive middleware to prevent users using 3rd party software such as Postman or AJAX from manipulating the site’s back end as well as multiple security NPM packages such as:
 
- Express Mongoose Sanitize
- Sanitize-html
- Helmet
