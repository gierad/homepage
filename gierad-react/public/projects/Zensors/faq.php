<h2 class="major">ZENSORS: FREQUENTLY ASKED QUESTIONS</h2>

<blockquote>Why not use Computer Vision altogether?</blockquote>
<p>Our goal was not to beat existing CV systems; there are many advanced techniques to improve accuracy. Our CV features + ML show that even a basic approach can achieve high accuracy.</p>

<p>Even with our “simple” approach, we are unaware of any system in HCI or CV literature that approaches the breadth of Zensors. For example, here are 4 of the 13 sensors we deployed as part of an early study:

<ul>
<li>“How messy is the counter?” (scale)</li>
<li>“Is there leftover food?” (binary)</li>
<li>“What type of food do you see?” (category)</li>
<li>“How many people are standing in line?” (number)</li>
</ul>

We are unaware of a single, prior CV system that answers:
<ol>
<li>diverse, natural language questions</li>
<li>sensors authored by non-experts (see video)</li>
<li>with reasonably high accuracy</li>
<li>needs zero training data</li>
<li>receives live data within seconds</li>
</ol>

Zensors achieves *all five* of these properties, making it unique and compelling. By switching to Machine Learning as early as possible, we can dramatically reduce future costs.</p>

<blockquote>If you're sending an image every, let's say, 30 seconds, wouldn't that be a lot of images to process?</blockquote>
<p>Correct, but we employ image similarity detection, wherein we only process images that are significantly different from a previously captured frame. This reduces the amount of data being sent to the crowd, with a reduction of up to 40% - 60%.</p>

<blockquote>Is Zensors accuracy bounded by Computer Vision or the Crowd?</blockquote>
<p>We show that accuracy is bounded by crowd accuracy, mainly due to image quality and question ambiguity. However, there are ways to mitigate this e.g., question templates, richer context, and example labels.</p>

<blockquote>How much of Machine Learning have you explored in this work?</blockquote>
<p>We are just scratching the surface when it comes to Machine Learning. We continue exploring contributing factors for success, and we plan to explore more sophisticated computer vision and machine learning techniques such as deep learning.</p>
