My 11th mini-project! This was a tough one, but it brought together a lot of different tools I have at my disposal by now. 

USER CRUD  
You are able to sign up, log in, update your account, or delete your account. I have purposefully reduced the number of fields that are required when signing up and updating, but those fields are presented with the dummy data when viewing your account. Additionally, this application takes advantage of session storage for user data for signing in, managing the cart, and logging out. Due to the quirks of using a placeholder api, I have omitted storing any session data or truly logging in when signing up, as getting a valid response with which to sign in the user is impossible. This is because the api will never change its data.   

PRODUCT CATALOG  
You can easily navigate to multiple destinations especially with the use of the navigation bar. The home page is the first destination, where you are shown multiple categories of products to explore. 

It is easy to view listings and add to cart. Products added to cart are stored within the application as well as within your browser so that you can later return to it. When the application loads, it will first check for an existing shopping cart before making a fresh one. Currently it does not check to make sure that the user matches the one who should 'own' it.

SHOPPING CART  
When viewing the shopping cart, you are able to see all products in your cart. It details how many of an item you have in the cart, and gives you the ability to change it there as well. If the number hits zero, it will be removed from the cart. 

The price of each item is clearly shown, as well as the combined price for the full quantity of an item if multiple are in the cart. It also shows the cart's total price on the button to check out.  

ACCESSIBILITY  
The main thing I focused on was ensuring that the forms had labels, names, and that there were no obscure inputs that a screenreader could not read. The other thing that I did not anticipate at first but proved to be very important, was specifically labeling every part on the item page and in the cart that would provide them important information. As such, it now will read out the item's description and price, and if they have it in their cart it will review the name, quantity and pricing information.

INTERNATIONALIZATION
I also implemented both an english and japanese translation for this application. It used i18n and can hot swap between both on demand by use of buttons in the navigation bar.

INTEGRATION AND UNIT TESTING  
I wrote 2 integration tests and 1 unit test. All 3 pass and cover api calls, mocking functions, infiniteQuery and ensuring elements are rendering on screen.