
export const HelpHtml =
`
<html><head>
<meta name="HandHeldFriendly" content="true" />
<meta name="viewport"  content="width=device-width,initial-scale=1.0,user-scalable=yes" />
<style>
body {
    margin: 0;
    padding: 4px;
    background-color: #000000; /* Background color */
    background-color: #ffffff; /* Background color */
    color: #e9e9e9;            /* Foreground color used for text */
    color: #333333;            /* Foreground color used for text */
    font: 17px/1.3 Helvetica;
}
h3 {
    background-color: #2e7d32;  /* darker green */
    color: #ffffff;
    padding: 8px 5px 8px 12px;
}
div.note {
    padding: 0 15px 0 0;
    margin: 12px 5px 35px 12px;
}   
div.note p {
    margin-bottom: 15px;
}
</style>
</head><body>

<div class="note">

<h3>General navigation</h3>
<p>
Swipe the screen right or left to switch between different types of conversion, press the "forward" button at the top right-hand corner of the screen, or use the menu drawer by swiping from the left edge.  You can also access the menu drawer by pressing the menu button (three horizontal lines) in the upper left corner of the screen.
</p><p>
You can toggle conversion direction (e.g Japanese measurements to international units or vice versa) by pressing the up and down arrows in the top right-hand area of the screen.
</p>
</div><div class="note">
<h3>Metric conversion</h3>
<p>
The metric calculator converts between several common metric units (meters, kilograms, degrees centigrade, etc.) and their corresponding imperial units.  (Fluid ounces are US units.)  
</p><p>
Choose the units you wish to convert from the drop-down list at the bottom of the screen.  Press the button labeled "switch direction" if you want to change the direction of conversion to start with non-metric units. 
</p><p>
After you have selected the units, press the lighter-colored bar near the top of the screen to access a numeric keyboard, with which you can enter the number of units to convert.  
</p>
</div><div class="note">
<h3>Traditional Japanese measurements</h3>
<p>
'Tsubo' units are used for measuring land, and 'jo' units measure room sizes.  One jo is very roughly the size of one standard tatami mat.
</p><p>
'Go' and 'shaku' units are commonly used for measuring sake - 1 go (ichigo) is a standard serving of sake, and 4 go is a medium-size bottle.  There are ten shaku in one go, so 5 shaku is around half a standard serving size.  (Fluid oz refers to US measures.)
</p><p>
As described above, first choose the units you wish to convert, then enter an amount in the input area near the top of the screen.  Press the "switch direction" button to change conversion direction.
</p>
</div><div class="note">
<h3>Converting to Japanese era years</h3>

<p>
To convert from the international (Gregorian) calendar to Japanese eras, enter the international year (1688 to present) in the input area near the top of the screen.  
</p>

<h3>Converting from Japanese era years</h3>
<p>
To convert from Japanese eras to international years, first pick the Japanese era from the list at the bottom of the page, for modern-era years (starting from 1868), or press the button to switch to historical eras (starting in 1688), then choose from the drop-down list.
</p><p>
After you have chosen the era, please enter the year within that era in the input area near the top of the screen.  Valid years will be shown as a hint when the input area is empty.  You can use the plus and minus-sign buttons to shift years one at a time.
</p>
</div><div class="note">
<h3>Finding zodiac signs</h3>
<p>
Enter the year of your birth to find your animal sign in the Chinese zodiac. (The first kanji represents the ordinary animal name, and the second one represents the zodiac sign.)
</p><p>
Note that in Japan the Chinese zodiac year begins on January 1 each year.
</p>

</div>
</body></html>
`;