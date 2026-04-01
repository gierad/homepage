<h2 class="major">TAPPCLOUD: FREQUENTLY ASKED QUESTIONS</h2>

<blockquote>Describe TappCloud in one sentence.</blockquote>
<p>TappCloud is a system that automatically transforms an online tutorial into an executable application.</p>

<blockquote>This seems like a giantic system! Which aspects of it were implemented?</blockquote>
<p>TappCloud has a ton of gears running in tandem! All key features were implemented: TappCloud wiki, real-time parameter adjustment, automatically-generated image galleries, live-view portals, CRF command extractor, demonstration interface for mapping commands to tutorial steps or creating new tapps from scratch, and the TappCloud server deployed with eight application servers on Amazon’s EC2 infrastructure.</p>

<blockquote>What is the minimal requirement for an application to thave "TappCloud" capabilities?</blockquote>
<p>Our approach requires some mechanism for playing back commands in the target application. Many mature software packages support playback via macro, plug-in or scripting features (e.g., Photoshop, GIMP, Maya, SketchUp, Microsoft Office). For target applications that are not inherently scriptable, we could potentially use a GUI-based automation technique like Sikuli or Prefab to playback commands.</p>