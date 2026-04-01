<h2 class="major" name="faq">Hand Activities: FREQUENTLY ASKED QUESTIONS</h2>

<blockquote>Why should we detect fine-grained activities, and why should we care?"</blockquote>

<p>State-of-the-art activity detection has been largely stuck at ambulatory states (walking, standing, sleeping, etc.) for more than two decades. We envision smartwatches (slowly, but increasingly pervasive) as a unique beachhead on the body for capturing rich everyday actions. This unlocks many applications (personal informatics is one possibility), including:</p>

<ul>
<li>User attention and interruptibility: a system that knows what your hands are doing can intelligently avoid interruptions</li>
<li>Health: detecting onset of harmful patterns (RSI, HAV syndrome, smoking), or habit building (brushing / washing hands regularly)</li>
<li>Skills assessment: facilitates skill acquisition (sports, music) and rehabilitation</li>
<li>Richer context-awareness: increases the bandwidth of *implicit* input for many applications, including priming worn digital</li> assistants like Siri and Google Now.</li>
</ul>

<blockquote>How is this work different from ViBand?</blockquote>
<p>ViBand illuminated a rich signal source, and we acknowledge it as such. However, our studies, analysis, technical implementation, and results are significant deltas over ViBand.</p>

<p>Most importantly, the application is very different: ViBand looked at explicit hand gestures, which are not hand activities — waves and flicks are not the same as e.g., typing or writing. Gestures tend to have coarse motion and are well segmented — rarely true of hand actions. </p>

<p>Not only is our domain harder, but we outperform ViBand significantly. ViBand tested three different hand gesture sets, the largest of which had 6 gestures, with a reported 94% accuracy. Our system demonstrates *25* hand actions at 93.6% accuracy. This is an apples-to-apples comparison, with both results trained per-user (ViBand doesn’t report cross-user gesture accuracy).</p>

<blockquote>What happens if the watch is worn on the non-dominant arm?</blockquote>
<p>No easy way around this, but the technique works quite well for e.g., hand activities that require two hands.</p>