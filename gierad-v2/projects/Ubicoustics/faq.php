<h2 class="major" name="faq">Ubicoustics: FREQUENTLY ASKED QUESTIONS</h2>

<blockquote>What is the main contribution of this work?</blockquote>

<p>We are not the first to use sound effects for training, nor augment them to build a larger corpus. However, we are the first to:</p>

<ol>
	<li>Develop a real-time, activity recognition system that demonstrates accuracies and class diversity approaching feasibility, requiring no in-situ data collection, and using nothing but microphone input (no prior work has shown this).</li>

<li>We ran a comprehensive series of experiments that quantifies the performance of our system across 4 augmentations, 7 hardware platforms, 50 locations, and 30 recognition classes. This provides insights into the feasibility of audio-based activity recognition that generalize beyond our implementation. </li>

<li> In addition to conventional testing with sound effect data, we go beyond prior work by capturing a real world dataset (to see if echos, multipath, noise, etc. affect results). We also benchmark all of our results against human coders (600 participants) to contextualize performance.

<li> We share our data, processing pipeline and models to facilitate replication and new uses.</li>
</ol>

<p>More contributions include using reverbs as augmentations for projecting sounds into realistic simulated environments. While we did not create our own architecture from scratch, we do adapt and extend a state-of-the-art model and demonstrate superior performance. Finally, sound effects have been used extensively in the past, but not pay-to-use professional libraries, which offer a vastly different scale and quality, allowing for richer augmentation as discussed at length in the paper.</p>

<blockquote>What do you mean by Plug-and-Play?</blockquote>
<p>We use “plug-and-play” as a shorthand to mean a system that requires no in-situ training or calibration. As in, a user can install an app or plug in their Alexa, and recognition just works. In theory, trained deep learning models are meant to be embedded in apps. But the reality at the moment is that few research systems achieve usable accuracies for end users (see paper for comparisons). We believe our work is close to reaching this plug-and-play property, though admittedly, there is much work to be done.</p>

<blockquote>What about Foley / Fake sounds?</blockquote>
<p>We interviewed SFX and Foley artists (with on-screen credits) as part of this research. It’s true that some classes of sound effects are made via Foley (leaves crunching, blood spatter, etc.). We confirmed that the events we studied are rarely "Foley-ed", because, quite simply, they are easier/cheaper to record than simulate (coughing, toilet flush, vacuum, crying, etc.).</p>