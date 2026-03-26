<h2 class="major">3D-PRINTED HAIR: FREQUENTLY ASKED QUESTIONS</h2>

<blockquote>Do all 3D printers have the ability to retract material?</blockquote>
<p>Yes.  Retracting is a feature that is available for 3D printers based on using fused deposition modeling technology (i.e., FDM, essentially the type of printer that layers molten plastic to create models).</p>

<blockquote>How many of these techniques/manipulations require special coding in the software? Or are all of these ideas already existing parameters you can tweak? Paths, timing, moving the printer head fast or slow, for instance.</blockquote>
<p>A quick overview:<br/>
Most 3D printing technology employ a language called G-Code, where you're essentially telling a machine what to do (i.e., where to move, how fast to move, how much material to extrude, temperature, etc.). 3D printing software takes care of transforming a 3D model into the necessary G-Code, and this process is mostly hidden from a user's point of view.  Some open source 3D printing software (e.g., slic3r and Repetier Host) expose G-Code.  This is our starting point.  We don't modify anything else other than what's available from the G-Code standard.</p>

<p>Parameters you can tweak:<br/>
From this, there's a bunch of G-Code parameters you can tweak to modify what the hair output would look like.
<ol>
<li>Temperature of the extruder</li>
<li>How much plastic to extrude for each hair</li>
<li>How fast to "pull-away"</li>
<li>The retraction amount, etc.</li>
</ul>
There are also "hair grouping" parameters you can tweak, such has hair density or arrangement (e.g., random arrangement for a more natural look, or uniform arrangements to mimic toothbrushes).</p>
<p>Like existing 3D printer software, all of these G-code manipulations can be made transparent to the user.</p>

<blockquote> How does the hair feel? Could that horse tail ever be something a child would want to stroke like a "my little pony?"</blockquote>
<p>
Yes, they are strokable.  Surprisingly, with enough strands, the extruded strings actually feel like real hair!  I mean they are synthetic, but the printed strands feel like actual strands of hair.  You can see this in the video.  And because they feel like actual strands of hair, we can perform post-processing manipulations like cutting, curling, or even braiding.</p>

<blockquote>Is this all aesthetics or are there functional things you can make as result?</blockquote>
<p>Primarily aesthetics, but there are functional things you can do, like make an actual scrubbing brush with short bristles (see video).  For fine, flowy hair, this technique also allows you to make an actual paint brush.</p>

<blockquote>It seems like you're really teaching the printer a craft. Philosophically it feels different than asking it to just extrude a 3D shape. Would you agree? And you think you could teach it other techniques?</blockquote>
<p>Agree.  Like any "making" craft, knowing little bits of details about how something works opens-up a ton of possibilities.  The fabrication research community is doing a ton of things to go beyond just simply telling a 3D printer to extrude a shape.  For example, you can actually tell a printer to "PAUSE" in the middle of a print, and then use that moment to switch materials or add something into the print ad-hoc.  You can do this as many times as you want!  And pausing is just one strategy...  really there's a ton of other things you can do beyond simply extruding molten plastic.</p>