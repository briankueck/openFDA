# openFDA
http://www.clomp.com/openfda/
Demo with the openFDA API data feeds.

When attempting to build a web site to search the openFDA.org data, we ran into what appeared to be an overwhelming amount of esoteric data, which only medical professionals
(such as doctors, nurses, pharmacists, pharmaceutical drug lab scientists) & FDA employees would understand. Some of the data objects from the searches contained 10,000+ lines of JSON data.

The bulk of those JSON objects contained lists of identification numbers. While database ids might be useful to someone who works internally for the FDA, they are irrelevant to
most consumers on the web. 

So while attempting to figure out what we could present that would make sense when looking at it during a demo, we identified a need to build a way to
parse through the vast amounts of data, which the search results returned. So we built a AJAX JSON Query Analysis Tool. 

It's not super fancy as some of the donut charts, which we've seen on the web, but it's extremely useful. It allows medical professionals to look up which drugs would react with other drugs, if they were mixed by a pharmacist and given out to a patient. This tool could prevent death, expensive million dollar lawsuits & allow future developers to quickly see what's in the openFDA data streams... so that they could build features faster. We find that adds concrete real world value, rather than creating additional "Top 10 Lists" & donut/pie charts online. If you'd like to see charts, we can now use our tool to find the JSON paths to that data & then wire it up to existing web libraries to create charts, graphs, visualizations, etc....

We've also built a mix of libraries into our site, so that we can develop anything... which we're asked to build in the future. 
The question is, what do you want to dream up for us to build next? 
