Project submited for [Expedition Hackathon](https://expeditionhacks-nyc-4255.devpost.com/)

# Inspiration

People are willing to pay $1400 per carat for a diamond, but how much would you choose to pay for a glass of water? One dollar? Two dollars? This is the diamond-water paradox. The irony of the fact is that water is much more integral to survival – and while thought to be limitless, we’ve all quickly realized these past few years that it is becoming a scarce resource.

Water needs to be priced properly relative to the supply and demand – and the first step in doing so is understanding our water demand.

# What it does

Our application visualizes water demand across California - along with that we forecast future levels of water consumptions, with breakdowns for different segments (industrial, personal, livestock, etc.).

It intakes water supply and population data and graphically displays a basic analysis on a 3D map using Mapbox. It can help us visualize the supply and demand of water and eventually help us predict the value of water at all the counties within the states. We want to be able to incorporate water source data in the future to better estimate cost, helping us invest in the most efficient sources for water acquisition. 

The varying heights of counties on the map shows the population. The higher the hight, the higher the population within the county.
The colors on the map shows the consumption of water. Darker colors correlate to greater consumption of water.
Clicking on individual counties on the map will show two data points; the amount of water consumed and the population of the county.
We can navigate through the different years on top to see how the supply and demand changes with time.

# How I built it

Our data is sourced from the United States Geological Survey, The data munging, manipulation, and modeling was done in R, while the front end was built on JavaScript and the map box API, served with django. We used linear regression to model future water consumption.

# What's next for Water Demand Visualization

In the future:
* activate radio buttons for usage segment breakdown
* expand visualization to rest of America
* join with municipality source data to understand supply side as well as demand side
* water pricing model.

# Built With

javascript
mapbox
django
r

# Installation

1. cd static
2. bower install
