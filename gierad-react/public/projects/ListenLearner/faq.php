<h2 class="major" name="faq">Listen Learner: FREQUENTLY ASKED QUESTIONS</h2>

<blockquote>How does Listen Learner handle overlapping sounds?</blockquote>

<p>We acknowledge that more work can improve our system’s handling of overlapping sound.</p>

<p>First, we note that during inference, our model (ensemble of one-vs-rest classifiers) can already detect simultaneous events. </p>

<p>Second, we can take advantage of beamforming mic arrays (as do most smart speakers). We used them for clustering experiments (reported in paper). In subsequent experiments, we tried audio subtraction from multiple directions - sound from one direction (e.g., TV) was subtracted with sound from another direction (e.g., faucet) - and found that sound isolation through beamforming is possible. In fact, these techniques [4] are widely used by e.g., phones/headsets/speakers for noise cancellation.</p>

<p>Third, we can leverage software-based (blind source separation) methods [3] to disambiguate between overlapping sounds. Classical methods [3] and more recent deep learning-based BSS [6,7] can be used. Although traditionally applied to emphasize speech content, we can use these techniques to remove it and improve robustness.
</p>

<blockquote>What do you think are the main contributions of this work?</blockquote>
<p>This work makes contributions in contextual sensing and ML methods for real-world activity recognition. Specifically:</p>

<ol>
	<li>We characterize an operational space for personalized HAR systems using two dimensions that significantly impact practicality— model accuracy vs. user-burden. Framing our problem through this lens was instrumental to our exploration, and we believe future research in HAR and context-driven systems can also benefit from this framing.</li>

<li>We contribute a solution that optimizes this tradeoff with an interactive, low-burden approach supported by virtual assistants. Although the majority of our paper focuses on our smart speaker implementation, we describe other applications that illustrate how our technique can generalize.</li>

<li>We make system contributions by building an end-to-end hardware/software implementation to match our intended modality and form factor, in service of ecological validity.</li>

<li>We make contributions to interaction techniques, by describing several methods on how we can embed our auto class-discovery algorithm into non-visual interactive experiences.</li>

<li>We make quantitative contributions by rigorously benchmarking our system’s performance in a variety of contexts - long-term deployments, controlled studies, and baseline comparisons from known techniques and publicly available datasets.</li>

<li>We make qualitative contributions that characterize people’s preferences for self-supervised learning in acoustic sensing and voice assistants. We also quantify when our interaction techniques work best and when it breaks down, informing future research in interactive ML systems</li>
</ol>
