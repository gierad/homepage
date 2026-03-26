<h2 class="major">PREFAB / SLIDING WIDGETS: FREQUENTLY ASKED QUESTIONS</h2>

<blockquote>What is the main contribution of this work?</blockquote>
<p>We have two main contributions: (1) we develop new fundamental methods for pixel-based interface modification, and (2) we use these new methods to implement Sliding Widgets with the goal of better understanding their behavior in real-world interfaces.</p>

<p>First, we contribute pixel-based methods for (1) real-time modeling of the appearance of widgets in multiple states, (2) linking an original widget's state into the representation needed by a new surface enhancement, and (3) mapping elements of a widget's pixel-level appearance into a surface enhancement. </p>

<p>Similarly, we complement these contributions with an implementation of Sliding Widgets as a real-time pixel-based enhancement. Sliding Widgets are well beyond the capabilities of prior pixel-based systems, so this implementation highlights our technical contributions. Instead of shallow demos of those capabilities, we aim to show how they all tie together in implementing a full enhancement. In doing so, we are also the first to examine Sliding Widgets in the context of existing everyday interfaces.</p>

<p>This technique becomes useful, for example, in use cases where there are mixed-device modalities e.g., a Microsoft surface that has both mouse and touch-screen capabilities. These devices are optimized for "mouse pointing", as evidenced in their tiny GUI icons. But these GUIs are terrible for touch interaction since they exacerbate the fat-finger problem. With our technique, we automatically convert mouse-based GUIs into sliding widgets, offering a far superior user experience by making those widgets touch-screen friendly.</p>
