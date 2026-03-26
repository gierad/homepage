<h2 class="major" name="faq">SurfaceSight: FREQUENTLY ASKED QUESTIONS</h2>

<blockquote>How unique are object contours?</blockquote>

<p>This is perhaps the biggest “ah ha” of the work and a central contribution. It turns out that 2D object contours are <em>surprisingly</em> distinctive, especially if one selects a context of use (e.g., kitchen objects).</p>

<p>Training on a single object view is insufficient (will overfit; poor recognition). That is precisely why we trained on <em>all</em> object orientations (from the paper: “it is important to expose all sides of an object to SurfaceSight during training […] in the training phase, we captured data for each object … different positions, different angles”). To evaluate this, we also placed objects in random orientations and positions, and this is the accuracy we report (~94%).</p>


<blockquote>Is there a relationship between BMI and accuracy on user angle estimation?</blockquote>
<p>This is why we ran a 14 person user study as opposed to a performance evaluation. It offers some initial clues as to the performance across users. We collected self-reported height and weight in our demographics intake form, and from this we can report that we had 8 normal weight, 4 overweight and 2 obese users (NIH BMI scale). There is no correlation in weight and accuracy.
</p>

<blockquote>Why not use a camera?</blockquote>
<p>360 degree cameras are powerful, but must deal with variable lighting, require more compute to process, and have privacy implications in e.g., the home. Contours from LIDAR have known real-world scale, unlike cameras that must compute scale-invariant features.</p>

<p>Depth cameras could conceivably be made 360, or several could be used in concern (large/expensive). Although there are many technologies in use, very few are millimeter accurate, which is what we need for accurate contours.</p>

<p>Radar tends to be less directional, with most wavelengths either passing through or scattering on objects we included (plastic bowls or metal rice cookers). Sonar too is not directional/precise enough.</p>

<p>Yes, LIDAR has “primitive curves” with “very little features”, but they are also <em>extremely precise</em>, capturing even small differences in contour shape/angle, which enables our approach.</p>
