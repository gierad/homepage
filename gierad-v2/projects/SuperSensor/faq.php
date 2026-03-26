<h2 class="major" name="faq">Synthetic Sensors: FREQUENTLY ASKED QUESTIONS</h2>

<blockquote>Are there sensor dimensions that dominate more than others?</blockquote>

<p>Our high-speed sensors, namely the accelerometer, microphone, and EMI, powers a lot of the events that we've seen so far. These reults surprised us! Some take-aways: 1) high-speed sensing is a big win for instantaneous environmental events; accel wouldn't be in this list if running at ~50Hz. 2) Manufacturers/researchers can use this knowledge to target their hardware for most “bang for the buck.“ 3) Infrequently used sensors are critical for some events (e.g. kettle boiling); to be truly general purpose, you need to support the long tail of exotic/edge cases. 4) Most of the events we studied were seconds-scale, and thus were biased towards our faster sensors. In contrast, hour/day/week-scale events (e.g. house insulation issue) are better suited to low-sampling sensors, which we didn't focus.<p>

<blockquote>Do you have to train the device?</blockquote>

<p>We use several machine learning techniques to learn different environmental facets. It is possible to create a global classifier for specific events (e.g., blenders, microwaves, faucets, etc.), which means no user-training is required. For highly specific events, it is also possible for users to build their own "sensors" using a process called "programming by demonstration." Please see our paper for details!</p>

<blockquote>Any thoughts on how to make the system robust to environmental noise?</blockquote>

<p>Two metrics are useful: missed events and false triggers. Missed events depend on placement (if too far, signals are weak). We chose placements to minimize this when practical. False triggers (e.g., environmental noise) are mitigated through “signature“ matching and FFT features, which combat channel cross-talk (e.g. talking/music for audio). We can also use longer window sizes, more negative examples (adding events to “ignore list“), and “dropout training“ (a deep learning technique) to further improve it.</p>

<blockquote>What about power consumption?</blockquote>
<p>Power Consumption: The whole premise of our sensor is that it can be plugged into an electrical socket and forgotten. From this placement, we hope to be “omniscient“ through clever processing/ML. For this reason, power was not a design objective. Power draw is 120mA at 5V when fully streaming.</p>


<blockquote>What is the sensing range?</blockquote>
<p>We can successfully detect multiple events in a room with one sensor. We can extend our range for events that are driven by acoustics and vibrations (e.g., an entire floor shaking, or acoustic events propagating over the air). For line-of-sight sensors (e.g., light color, illumination, thermal image), the range is limited by the sensor's field of view.</p>
