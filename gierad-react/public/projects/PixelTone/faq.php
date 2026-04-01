<h2 class="major">PIXELTONE: FREQUENTLY ASKED QUESTIONS</h2>

<blockquote>Text-to-Speech systems are becoming more prevalent. What have you learned in PixelTone that could generalize to other multi-modal applications?</blockquote>
<p>In PixelTone, we observed that a two-tiered approach that first tries a domain-specific method before resorting to a general purpose one worked best. For example, we combined a very constrained local system with a cloud-based general-purpose system for more accurate speech recognition. We also combined a more precise interpreter using parts of speech pattern matching with a bag-of-words approach for improving speech interpretation. </p>
<p>Likewise, we found that there are a variety of words that may apply to the same image editing operation. To handle this large variety, we used synonyms to map to known words. Additionally, to make this mapping robust, we had to adjust our vocabulary model towards the photo editing domain, which we achieved by mining online photo editing tutorials.</p>

<blockquote>What's the core contribution of this work, given that speech-to-text has been explored for a while in the HCI community?</blockquote>
<p>Agree, but for superior integration of STT applications, a speech interface alone does not suffice; to improve the user experience, it must be deployed in tandem with a complementary modality such as "touch" to support practical and more interesting applications e.g., in this case, image editing</p>

<p>In addition to the more common use of speech as a "shortcut" to invoke commands, speech also conveniently allowed users to name objects found in the image (e.g., the background, "Anna") which they could refer to at later point (e.g., "Make Anna brighter"). We believe these findings are not particularly obvious and would be valuable to the CHI Community.</p>

<p>Equally valuable is the idea of allowing users to specify commands using their own words, without necessarily conforming to the vocabulary of the application. This has implications well beyond image editing, and could translate into complex applications (e.g., 3D modeling, video editing), lowering the adoption floor for novices while maintaining a high performance ceiling for experts.</p>
