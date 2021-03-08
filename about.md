# JpConverter Android app - developer notes

## A tool for Japanese measures and the Japanese calendar

Designed specifically for foreigners living in Japan, this simple Android app provides quick help converting Japanese calendar years and common units of measurement. Calculate and convert:

- Japanese imperial years, which are used on everything from official documents to bank deposit slips
- Everyday measures like go (sake servings), jo (room size), and tsubo (land area)
- For the metrically challenged, centigrade to Fahrenheit, kilograms to pounds and many other common units
- Chinese zodiac signs - find out if you were born in the Year of the Horse or Year of the Dragon. 


## About this version

While the first version of this app was written in Java, this updated version has been built using React Native.  The main motivation was to make the app easier to use, in particular with regard to discoverability.  Switching direction between "to metric" and "from metric" for example wasn't very intuitive, so hopefully that has improved with this version.  

## Navigation 

In addition to using accessing a menu drawer, the user can also swipe left or right and continuously loop through all the different types of conversion that can be done.  While this is easy to do in native Android, it's not quite as easy using React Native.  

To handle this, I used the [react-native-swipe-gesture library](https://github.com/nikhil-gogineni/react-native-swipe-gesture), and tweaked it a bit to dampen the hair-trigger response, and 2) accomodate swiping from the left edge to open the menu drawer.  The latter was accomplished by adding a small amount of padding/margin on the left side of the screen.

## Other techical details

I built a few different classes to handle actual conversion logic rather than rely on a loose collection of functions.  This seems like a neater approach, and it makes it easier to standardize presentation (e.g. the number of significant digits for each calculation) and add on new conversion types in the future.

There's no need for an API, as the actual calculations are fairly straightforward.  The app uses local storage just to remember the most recent coversion types used by the user.

For the future, it should be relatively easy to add new conversion types, or use this as a template for a more detailed conversion app.  It should also be reasonably easy to allow users to enter their own custom conversion types.


