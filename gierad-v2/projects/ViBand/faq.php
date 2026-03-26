<h2 class="major" name="faq">VIBAND: FREQUENTLY ASKED QUESTIONS</h2>

<blockquote>What sensor are you tweaking, and how are you tweaking it? Can this work on an Apple Watch?</blockquote>
<p>We are tweaking the smartwatch's accelerometer. Most operating systems and APIs limit accelerometer sampling speed to around 100 Hz, mostly because this is sufficient for its primary use: to detect the orientation of the watch. But it turns out that most accelerometers are capable of operating at high speed. Our tweak consists of overriding the OS's API limitation by writing a custom kernel driver.</p>

<p>The watch we used was an LG G Watch, which has an InvenSense MPU6515 accelerometer. This accelerometer can also be found in the Moto 360, Samsung Gear 2, Samsung Gear Fit, the LG Urbane, and many other popular smartwatches.</p>

<p>The Apple Watch accelerometer is made by ST Micro Electronics, which likely goes up to 1.6kHz. But Apple doesn't share hardware details, so we are left to speculate. But in any case, our sensing technique can theoretically work on an Apple Watch.</p>

<blockquote>What can you see that you couldn't before, but maybe more important, what CANT you see that i'd think you could from the video, etc.</blockquote>
<p>This is best illustrated in the image below:</p>
<p><img src="http://www.gierad.com/assets/viband/lowres/viband_faq1.png"></p>
<p>The left half of the signal is what a regular accelerometer can see (~100Hz), whereas our approach goes way beyond this line (look at those characteristic bumps from the coffee grinder and the dremel). Faster sampling rate means being able to capture extremely small micro-vibrations.</p>

<blockquote>How does this technique affect battery life?</blockquote>
<p>Since we're hacking around a "default" setting, our technique will take a toll on battery life. However, it is possible to implement the ViBand system as a System on Chip (similar to those used in "OK, Google" and "Hello Siri"). SoCs are highly power efficient, and have been shown to have minimal impact on battery life.</p>