# HarteFact — Complete AI Video & Image Quality Assurance Framework

_Version 2.1 — April 2026_

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Domain Summary & Dependency Map](#domain-summary--dependency-map)
3. [Pipeline Architecture](#pipeline-architecture)
4. [Domain 1 — Technical Delivery Compliance](#domain-1--technical-delivery-compliance)
5. [Domain 2 — Spatial & Texture Integrity](#domain-2--spatial--texture-integrity)
6. [Domain 3 — Temporal Consistency & Motion Quality](#domain-3--temporal-consistency--motion-quality)
7. [Domain 4 — Audio Quality](#domain-4--audio-quality)
8. [Domain 5 — Lip Sync Precision](#domain-5--lip-sync-precision)
9. [Domain 6 — Character & Identity Integrity](#domain-6--character--identity-integrity)
10. [Domain 7 — Lighting & Scene Integrity](#domain-7--lighting--scene-integrity)
11. [Domain 8 — Brand & Client Compliance](#domain-8--brand--client-compliance)
12. [Domain 9 — Prompt & Action Adherence](#domain-9--prompt--action-adherence)
13. [Tiered Gating & Early Termination](#tiered-gating--early-termination)
14. [Frame Sampling Strategy](#frame-sampling-strategy)
15. [Threshold Calibration Methodology](#threshold-calibration-methodology)
16. [Image QA — Single-Frame Mode](#image-qa--single-frame-mode)
17. [Multi-Character Scene Handling](#multi-character-scene-handling)
18. [Scorecard & Report Design](#scorecard--report-design)
19. [Datasette Schema Design](#datasette-schema-design)
20. [Dependency Isolation Strategy](#dependency-isolation-strategy)
21. [Build Sequence & Implementation Plan](#build-sequence--implementation-plan)
22. [Competitive Landscape](#competitive-landscape)
23. [Risk Factors & Mitigations](#risk-factors--mitigations)
24. [Business Model & Prioritization](#business-model--prioritization)
25. [The Honest Caveat](#the-honest-caveat)

---

## Executive Summary

This framework defines a systematic, model-agnostic approach to measuring the quality of AI-generated video and image content. It is designed for two purposes: automated pipeline gating (discard content that fails objective thresholds) and client-facing scorecards (documented proof that deliverables meet agreed quality standards).

The framework is model-agnostic by design. The majority of metrics measure properties of the output file — resolution, texture quality, temporal stability, color accuracy, identity consistency — regardless of which model or platform produced it. This means the scoring system does not require recalibration when models change. Model-specific benchmarking (testing different models against these metrics) is a separate activity built on the same infrastructure.

All tools referenced run locally on Apple Silicon (M4 Pro 48GB) without cloud dependencies. The framework is designed for incremental implementation — each phase produces usable infrastructure consumed by later phases.

---

## Domain Summary & Dependency Map

| Phase | Domain | Builds On | Key Infrastructure Produced | Rationale |
|---|---|---|---|---|
| 1 | Technical Delivery Compliance | Nothing | File pipeline, FFmpeg wrapper, VMAF scoring, client config table | Fast, foundational, immediately useful on every project |
| 1b | Identity Consistency Spike | Phase 1 frame pipeline | InsightFace pipeline, per-frame embedding extraction | De-risks hardest high-value metric early while energy is high |
| 2 | Spatial & Texture Integrity | Phase 1 file pipeline | Frame extraction pipeline, per-frame scoring functions, FFT analysis | Core visual quality; formalizes existing work |
| 3 | Temporal Consistency & Motion | Phase 2 frame pipeline | Segmentation masks, optical flow extraction, SSIM framework | Adds segmentation masks reused in Phases 6 and 7 |
| 4 | Audio Quality | Phase 1 file pipeline | Audio analysis pipeline, librosa wrapper, LUFS measurement, sync offset value | Fast to implement; runs parallel to Phase 3 |
| 5 | Lip Sync Precision | Phases 3 and 4 | MAR extraction, DTW comparison, WhisperX phoneme timeline | Combines video landmarks with audio analysis |
| 6 | Character & Identity Integrity | Phase 3 segmentation, Phase 5 landmarks | CLIP encoder, hand landmark extraction, body proportion tracking | Identity drift plus hands, teeth, body proportions |
| 7 | Lighting & Scene Integrity | Phase 3 segmentation, Phase 6 masks | Shadow masking, luminance tracking, IoU computation | Requires segmentation infrastructure already built |
| 8 | Brand & Client Compliance | All prior phases | Client config integration, full scoring composite per client | Requires full infrastructure; directly client-facing |
| 9 | Prompt & Action Adherence | Phase 3 optical flow, Phase 6 VLM | VLM integration via Ollama, framing and composition tracking | VLM dependency; build last when all other signals are logged |

---

## Pipeline Architecture

### Tiered Gating

The pipeline uses three gates to avoid wasting compute on content that has already failed. A clip that fails Domain 1 (wrong resolution, wrong codec) should not consume GPU cycles on Domain 6 identity drift analysis.

```
Input File
    │
    ▼
┌─────────────────────────────┐
│  Domain 1: Technical Specs  │
└──────────────┬──────────────┘
               │
          GATE 1 — pass/fail on specs
               │
               ▼
┌─────────────────────────────┐
│  Domain 2: Spatial Quality  │
└──────────────┬──────────────┘
               │
          GATE 2 — pass/fail on catastrophic spatial failures
               │
               ▼
┌──────────────────────────────────────────────────┐
│  Domains 3-4: Temporal + Audio (run in parallel) │
└──────────────┬───────────────────────────────────┘
               │
          GATE 3 — pass/fail on temporal/audio basics
               │
               ▼
┌──────────────────────────────────────────────┐
│  Domains 5-9: Deep analysis (sequential)     │
└──────────────────────────────────────────────┘
               │
               ▼
         Scorecard Output
```

Failed content at any gate receives immediate feedback identifying the failure domain and specific metrics, without incurring the compute cost of downstream analysis.

### Dependency Isolation Strategy

Each domain group runs in an isolated environment to prevent dependency conflicts:

| Environment | Domains | Key Dependencies |
|---|---|---|
| `env-core` | 1 | FFmpeg (with libvmaf), ExifTool, mediainfo |
| `env-spatial` | 2 | OpenCV, PyWavelets, pyiqa (BRISQUE/NIQE), PIL |
| `env-temporal` | 3 | PyTorch + torchvision (RAFT), PySceneDetect, MediaPipe, rembg |
| `env-audio` | 4 | librosa, pyloudnorm, scipy |
| `env-face` | 5, 6 | MediaPipe FaceMesh, InsightFace, WhisperX/MFA |
| `env-vision` | 7, 8, 9 | CLIP (via transformers), colour-science, LLaVA/Ollama |

A thin orchestration layer passes file paths between environments and collects scores into Datasette. Environments can be implemented as Python venvs, Docker containers, or Conda environments depending on complexity. Start with venvs; move to Docker if dependency conflicts arise.

---

## Domain 1 — Technical Delivery Compliance

_Build this first. Everything downstream depends on verified technical specs. A client who receives a file at wrong specs — regardless of how beautiful it looks — has received a failed deliverable._

### Metrics

| Metric | Tool | Automation | Difficulty |
|---|---|---|---|
| Resolution verification | FFmpeg / mediainfo | High | Low |
| Frame rate consistency | FFmpeg | High | Low |
| Codec compliance | FFmpeg | High | Low |
| Bitrate adequacy | FFmpeg | High | Low |
| Aspect ratio verification | FFmpeg + PIL | High | Low |
| Safe zone compliance (per delivery context) | FFmpeg + PIL (client-configured) | High | Low |
| Dropped frame detection | FFmpeg | High | Low |
| File metadata integrity | ExifTool | High | Low |
| Compression artifact quality (VMAF) | VMAF via FFmpeg | High | Low–Medium |
| HDR/Dolby Vision compliance | FFmpeg (MaxCLL, MaxFALL, PQ/HLG) | High | Medium |
| Harding test compliance (broadcast) | ITU-R BT.1702 luminance/chrominance flash analysis | High | Medium |

### Implementation Notes

**Safe zone compliance** requires per-client, per-delivery-context configuration in your Datasette `clients` table. Broadcast title-safe and action-safe zones, social media UI overlay zones, and vertical versus horizontal framing all have different boundary values. Build the threshold as a client config parameter from day one.

**VMAF** (Video Multimethod Assessment Fusion, developed by Netflix) produces a perceptual quality score specifically calibrated to compression artifacts — blocking, mosquito noise, and ringing around high-contrast edges. It runs natively via FFmpeg with the `libvmaf` filter. This is distinct from AI generation artifacts measured in Domain 2 — it measures re-encoding degradation introduced after generation during your export and delivery pipeline.

**HDR/Dolby Vision compliance** is relevant when delivering to platforms that accept HDR (YouTube, Netflix, Apple TV+). Verify PQ (Perceptual Quantizer) or HLG (Hybrid Log-Gamma) transfer function, MaxCLL (Maximum Content Light Level), and MaxFALL (Maximum Frame Average Light Level). Include as a configurable check — not all deliverables require HDR, but the ability to verify it signals broadcast-grade methodology. FFmpeg can extract these values from HDR metadata; compare against platform-specific requirements stored in the `clients` table.

**Harding test compliance** is a legal delivery requirement, not a graded quality metric. Failing a Harding test (ITU-R BT.1702) is equivalent to delivering at the wrong codec or resolution — it is a binary compliance blocker for broadcast contexts. The test screens for luminance and chrominance flash patterns that can trigger photosensitive epilepsy. It is placed in Domain 1 because it carries gate-level authority: a Harding failure should block delivery regardless of how the content scores on every other metric. The underlying analysis (per-frame luminance delta oscillation) is shared with the flicker detection metric in Domain 3 — Domain 3 builds the analysis infrastructure, Domain 1 consumes it as a compliance check. For non-broadcast delivery contexts, this check is disabled via the `delivery_contexts` configuration in the `clients` table. When enabled, it is evaluated as part of Gate 1 and treated as a hard fail.

---

## Domain 2 — Spatial & Texture Integrity

_Core visual quality assessment. Measures per-frame spatial quality independent of temporal context._

### Metrics

| Metric | Tool | Automation | Difficulty |
|---|---|---|---|
| Texture / waxy / plastic quality | BRISQUE + NIQE + Laplacian | Medium | Medium |
| Color drift / desaturation | Delta-E + HSV histogram | High | Low |
| Color banding / posterization | Gradient magnitude analysis in smooth regions | High | Medium |
| VAE tile seam detection | FFT frequency analysis | High | Medium–Hard |
| Noise / grain pattern analysis | Wavelet decomposition (PyWavelets) | Medium | Medium |
| Edge coherence | Canny edge consistency across frames | Medium | Medium |
| Sharpness per region (masked) | Laplacian variance with segmentation mask | High | Medium |
| Repeating pattern / texture tiling artifacts | Autocorrelation analysis | Medium | Medium |
| Moiré pattern detection | FFT high-frequency periodic analysis | Medium | Medium |

### Implementation Notes

**BRISQUE and Laplacian** together provide a proxy for the waxy/plastic texture failure — neither alone is sufficient. BRISQUE degrades predictably when textures are smeared; Laplacian variance measures high-frequency detail loss. Supplement with **NIQE** (Natural Image Quality Evaluator) from the `pyiqa` library, which is distribution-based rather than regression-based and may generalize better to AI-specific distortions than BRISQUE alone. Log all three separately in Datasette and combine as a weighted composite in scoring output.

**Color banding / posterization** is one of the most common AI generation artifacts, particularly visible in gradients — skies, skin tones, soft lighting falloffs, out-of-focus backgrounds. Detection approach: compute gradient magnitude of luminance in regions classified as "smooth" (low texture via Laplacian). True smooth gradients produce low, uniform gradient magnitude. Banded gradients show a staircase pattern — alternating near-zero and sharp gradient spikes. A histogram of gradient magnitudes in smooth regions will bimodally distribute when banding is present. Professional colorists flag this immediately; automating it is high-value.

**VAE tile seam detection** via FFT is technically novel. A 2D FFT of each frame will show strong periodic frequency peaks at tile boundary intervals when seaming is present. Set a threshold for peak amplitude at the expected tile frequency (determined by the VAE tile size setting) and flag frames that exceed it. Caveat: images with legitimately periodic content (brick walls, fences, fabric patterns) can produce false positives. Cross-reference with the **repeating pattern metric** — if autocorrelation detects a repeating texture in the same region, suppress the tile seam flag for that region.

**Repeating pattern / texture tiling artifacts** are distinct from VAE tile seams. AI models frequently warp, misalign, or shift frequency on regular repeating patterns — brick walls, chain-link fences, tile floors, fabric weaves. Autocorrelation analysis in regions detected as containing repeating textures: consistent patterns have stable autocorrelation peaks; failing patterns show peak drift or splitting.

**Noise/grain analysis** via wavelet decomposition measures the spatial frequency signature of AI-generated noise versus natural film grain. AI-generated noise has a different distribution across wavelet subbands than natural grain. Clients in cinematic contexts flag this even when they cannot name it.

---

## Domain 3 — Temporal Consistency & Motion Quality

_Adds critical segmentation mask infrastructure reused throughout Phases 6 and 7. Invest in getting segmentation right here — it pays dividends across the entire framework._

### Metrics

| Metric | Tool | Automation | Difficulty |
|---|---|---|---|
| Background boiling / jitter | Masked SSIM | High | Medium |
| High-motion smear and distortion | Optical flow — RAFT via torchvision | Medium | Medium |
| Slideshow / motion failure detection | Mean optical flow magnitude | Medium | Low–Medium |
| Scene cut detection (unintended) | PySceneDetect (content-aware mode) | High | Low |
| Object permanence across frames | YOLO tracking across frames | Medium | Medium |
| Lens distortion consistency | Line detection via OpenCV | Medium | Medium |
| Depth of field consistency | Blur map comparison per region | Medium | Medium |
| Camera motion integrity | Optical flow directionality analysis | Medium | Medium |
| Flicker / strobing detection | Per-frame luminance delta oscillation analysis | High | Low–Medium |
| Morphing / warping artifact detection | Deformation field analysis from optical flow | Medium | Medium–Hard |

### Implementation Notes

**PySceneDetect:** use content-aware detector mode, not threshold mode. Threshold-based detection triggers excessive false positives on boiling backgrounds, which are themselves a failure mode you are measuring.

**Masked SSIM for background boiling** requires a foreground segmentation mask. Use MediaPipe Selfie Segmentation or `rembg` to isolate the background region per frame, then compute SSIM only on that region. Store masks efficiently — they feed directly into Domain 7 lighting analysis and Domain 6 hair/clothing region isolation.

**Flicker / strobing detection** is distinct from background boiling. Boiling is spatial texture instability; flicker is rapid frame-to-frame luminance or chrominance oscillation across the entire frame or large regions. Detection: compute per-frame mean luminance, flag sequences where the delta oscillates sign (bright-dark-bright-dark) above a threshold amplitude for 3+ consecutive frames. The luminance oscillation analysis built here is shared with the **Harding test compliance check in Domain 1** — Domain 3 produces the per-frame luminance delta data, Domain 1 consumes it as a binary legal compliance gate for broadcast delivery contexts.

**Morphing / warping artifacts** are distinct from both identity drift (Domain 6) and motion smear. These are frames where objects, faces, or body parts unnaturally deform between frames — a nose that stretches, a wall that breathes, an arm that bends impossibly for a single frame. Detection: compute the structural deformation field between consecutive frames using optical flow (already extracted for motion metrics), flag regions where local deformation magnitude exceeds what is physically plausible given the global motion context. A face region with high local deformation but low global motion is a morphing artifact.

**Lens distortion consistency** is measured by tracking straight-line geometry across time using OpenCV's Hough Line Transform. AI models occasionally introduce or remove apparent barrel distortion mid-clip. Flag frames where detected line curvature shifts beyond a threshold.

**Camera motion integrity** distinguishes intentional camera movement from unintended jitter by analyzing optical flow pattern type — smooth directional flow indicates intentional movement; random high-frequency flow indicates jitter. Log the ratio as a diagnostic value, not just pass/fail.

---

## Domain 4 — Audio Quality

_Runs in parallel with Domain 3 since it operates on the audio track independently of video frame analysis._

### Metrics

| Metric | Tool | Automation | Difficulty |
|---|---|---|---|
| Audio clipping detection | librosa — amplitude ceiling check | High | Low |
| Electrical hum / narrow-band noise | FFT narrow-band frequency analysis | High | Low |
| Silence gap detection | librosa RMS energy threshold | High | Low |
| Frequency spectrum balance | librosa spectral analysis | High | Low–Medium |
| Audio sync offset (systematic) | Cross-correlation peak analysis | High | Medium |
| Dynamic range / loudness (LUFS) | pyloudnorm | High | Low |
| Foley and ambience dropout | RMS envelope vs input audio comparison | High | Medium |
| AI vocal artifact detection | Spectral analysis for metallic/robotic quality | Medium | Medium |
| Unnatural breath pattern detection | Spectral envelope periodicity analysis | Medium | Medium |
| Audio-visual foley sync | Human-flagged review | Low | — |

### Implementation Notes

**LUFS measurement** (Loudness Units Full Scale) is the broadcast and streaming delivery standard. YouTube, broadcast, and podcast platforms each have specific LUFS targets. `pyloudnorm` handles this natively. Include the target LUFS value as a per-delivery-context configuration in your client table alongside safe zone settings.

**Audio sync offset** (cross-correlation peak) produces a systematic offset number in frames — how far early or late the audio correlates with the video signal. This is a direct input to Domain 5 lip sync interpretation. Log it in Datasette with a foreign key reference to the Domain 5 lip sync run.

**AI vocal artifact detection** targets the metallic/robotic quality common in AI-generated speech (TTS via neural vocoders). AI-generated speech often shows abnormal spectral smoothness in formant regions, unnatural formant transitions, and missing micro-variations that natural speech contains. Spectral centroid variance and spectral flux in voiced regions provide a proxy for detecting synthetic speech quality issues.

**Unnatural breath pattern detection** flags AI voice generation that either omits breath sounds entirely (creating an uncanny smoothness) or inserts them at rhythmically regular intervals (unlike natural irregular breathing). Analyze the periodicity and spectral signature of detected breath events against natural breath distribution patterns.

**Audio-visual foley sync** — whether a door slam coincides with the visual impact, whether footsteps align with foot contact — is not reliably automatable for AI-generated video. Log it as a human-flagged review item. This signals methodological completeness to technically sophisticated benchmark reviewers.

---

## Domain 5 — Lip Sync Precision

_Combines video landmark extraction from Domain 3 with audio analysis from Domain 4._

### Metrics

| Metric | Tool | Automation | Difficulty |
|---|---|---|---|
| MAR curve vs audio envelope | MediaPipe FaceMesh + DTW | Medium | Hard |
| Lip sync drift over time | DTW alignment curve | Medium | Hard |
| Teeth visibility during open phonemes | MediaPipe masked region scoring | Medium | Medium |
| Lip contact accuracy | Landmark distance on closed phonemes | Medium | Medium |
| Sync offset correction | Cross-correlation input from Domain 4 | High | Medium |
| Jaw movement naturalness | Landmark trajectory smoothness analysis | Medium | Medium |

### Implementation Notes

The Domain 4 audio sync offset value should be applied as a pre-alignment correction before running DTW comparison. DTW then measures shape error after offset correction. These are two distinct failure modes that must be logged separately: systematic offset (Domain 4 input) and phoneme shape accuracy (Domain 5 DTW distance). A video can have zero offset but poor shape accuracy, or significant offset but accurate shapes. Conflating them produces an uninterpretable composite score.

Use **WhisperX** or **Montreal Forced Aligner** for phoneme timing ground truth from input audio. Both run locally on Apple Silicon and provide millisecond-precise phoneme timestamps more granular than Rhubarb's discrete categories. This provides a continuous target curve for DTW comparison against continuous MAR extraction. Verify WhisperX MLX compatibility before committing — Montreal Forced Aligner is the safer fallback if WhisperX's wav2vec2 dependency causes issues.

**Jaw movement naturalness** measures the smoothness of jaw landmark trajectories. Natural jaw movement follows smooth acceleration/deceleration curves; AI-generated lip sync often produces jerky or linear jaw motion. Compute the second derivative of vertical jaw landmark position — high-frequency oscillation in the second derivative indicates unnatural motion.

---

## Domain 6 — Character & Identity Integrity

_Expanding identity work to include the most visible AI failure modes — hands, teeth, body proportions, hair, and skin tone._

### Metrics

| Metric | Tool | Automation | Difficulty |
|---|---|---|---|
| Face identity drift curve | InsightFace cosine similarity per frame | High | Medium–Hard |
| Eye gaze consistency | MediaPipe FaceMesh landmark tracking | Medium | Medium |
| Teeth rendering quality | MediaPipe masked region BRISQUE | Medium | Medium |
| Hand / finger coherence | MediaPipe Hands landmark stability | Low–Medium | Hard |
| Hand detection failure logging | MediaPipe Hands null result capture | High | Low |
| Hair boundary consistency | Segmentation mask stability | Medium | Medium |
| Clothing / accessory drift | CLIP embedding comparison per region | Medium | Medium |
| Body proportion consistency | MediaPipe Pose landmark ratios across frames | Medium–High | Medium |
| Skin tone accuracy and consistency | Chrominance tracking in face-masked regions | High | Medium |
| Pupil / iris consistency | FaceMesh iris landmark tracking | Medium | Medium |

### Implementation Notes

**Hand and finger coherence** is rated Low–Medium automation. MediaPipe Hands was trained on real human hands and fails frequently on AI-generated hands because malformed AI hands fall outside its training distribution. Critically, a null detection result is itself a failure signal — it often means the hand is too anatomically malformed for the model to parse. Log null detections explicitly as a separate metric from low-stability detections. Do not treat them as missing data.

**Body proportion consistency** tracks limb proportions — arms and legs that change length between frames, torsos that elongate, shoulders that widen. Use MediaPipe Pose landmark distances (shoulder-to-elbow, elbow-to-wrist, hip-to-knee ratios) tracked across frames. Flag ratio drift beyond a threshold. This runs on the same MediaPipe infrastructure already available from Domain 3 segmentation work.

**Skin tone accuracy and consistency** uses the face segmentation mask (already available from Domains 3/5/6 infrastructure) to isolate skin regions. Track skin-region chrominance (Cb/Cr in YCbCr space) across frames. Flag drift beyond a threshold. Compare against a known skin tone reference if available from the client brief. This is critical for talent-based content — skin tones that shift green, magenta, or desaturate frame-to-frame are one of the first things a colorist or client notices.

**Teeth rendering quality** uses Domain 5 lip sync infrastructure to identify open-mouth frames, then extracts the tooth region as a masked subimage and runs BRISQUE on that region. This directly addresses the "melted teeth" failure mode highly visible during lip sync sequences.

**CLIP embedding comparison** for clothing drift encodes semantic appearance — comparing per-frame CLIP embeddings of the clothing region detects when a shirt changes color or pattern mid-clip without requiring explicit wardrobe classification. Store the reference embedding from the first clean frame per clip in Datasette.

**InsightFace** from this domain feeds directly into Domain 8 brand compliance — the same approved talent reference image used here for identity drift becomes the compliance check for client-approved talent likeness. Design the Datasette schema to share this reference asset between domains.

**Multi-character scenes:** All per-character metrics in this domain (identity drift, skin tone, eye gaze, body proportions) must score each subject independently when multiple faces are detected. See the [Multi-Character Scene Handling](#multi-character-scene-handling) section for subject assignment logic, schema support, and fallback behavior. Do not average scores across subjects — a clip where Subject A maintains perfect identity consistency while Subject B drifts severely should report both, not produce a misleading average.

---

## Domain 7 — Lighting & Scene Integrity

_Requires segmentation infrastructure from Domain 3 and the masked region approach developed in Domain 6._

### Metrics

| Metric | Tool | Automation | Difficulty |
|---|---|---|---|
| Illumination consistency | Luminance histogram comparison per frame | High | Low–Medium |
| Shadow coherence | Shadow mask stability across frames (IoU) | Medium | Medium |
| Specular highlight consistency | HSV value channel tracking in highlight regions | Medium | Medium |
| Background-subject separation quality | Segmentation boundary coherence | Medium | Medium |
| Color temperature consistency | Correlated Color Temperature (CCT) estimation per frame | Medium | Medium |
| Reflection consistency | Structured human-review flag + partial CLIP automation | Low | Hard |
| Ambient occlusion consistency | Dark-region stability in expected AO zones | Medium | Medium |

### Implementation Notes

**Illumination consistency** — luminance histograms per frame with flagging for sudden shifts. The challenge is distinguishing intentional from unintentional shifts. Log luminance shift magnitude alongside optical flow magnitude from Domain 3. Large luminance shift with low optical flow (nothing is moving but the light changed) is a failure signal. Large luminance shift with high optical flow (camera or subject moving significantly) requires human review.

**Shadow coherence** is measured by tracking dark-region masks across frames in areas that should be consistently shadowed — under chins, in room corners, behind subjects. Shadow disappearance or direction reversal mid-clip is immediately jarring to professionally trained eyes. Compute intersection-over-union (IoU) of shadow region masks between consecutive frames.

**Color temperature consistency** extends beyond luminance to measure the warmth/coolness of the light across frames. Estimate Correlated Color Temperature (CCT) per frame from chrominance values in highlight regions. Flag shifts that don't correlate with scene changes. AI models sometimes introduce mid-clip color temperature drift that trained colorists identify immediately but is missed by simple luminance tracking.

**Reflection consistency** — reflections in mirrors, water, glass, and glossy surfaces are a common AI failure that professional VFX supervisors catch immediately. Full automation is not currently reliable — rated Low automation / Hard difficulty to reflect this honestly. The partial automation path (detect reflective surfaces via material segmentation, extract the reflected region, compare CLIP embeddings of the reflection against the subject) can flag potential inconsistencies but produces too many false positives and false negatives to serve as a pass/fail gate. In practice, this metric degrades gracefully to a structured human-review flag: the system identifies frames likely to contain reflective surfaces and queues them for manual inspection. Log as a structured human-review item in Datasette so it appears in methodology documentation.

**Ambient occlusion consistency** measures whether dark contact zones (where objects meet surfaces — feet on floor, objects on tables) remain stable. AI models sometimes remove or add ambient occlusion mid-clip, creating a "floating" appearance.

---

## Domain 8 — Brand & Client Compliance

_Every other domain measures whether the video is technically good. This domain measures whether it is the client's._

### Metrics

| Metric | Tool | Automation | Difficulty |
|---|---|---|---|
| Brand color palette adherence | Delta-E vs approved HEX values | High | Low |
| Approved talent likeness | InsightFace vs client reference image | High | Medium |
| Logo placement and visibility | Template matching via OpenCV | Medium | Medium |
| Safe zone compliance (branded elements) | Boundary masking per delivery context | High | Low |
| Visual treatment consistency vs approved reference | CLIP embedding distance vs reference frame | Medium | Medium |
| Style / grade consistency | colour-science LUT comparison | Medium | Medium |
| Text / typography rendering verification | OCR confidence scoring (EasyOCR / Tesseract) | Medium | Medium |

### Implementation Notes

The **`clients` table** in Datasette is the spine of this domain. Each client record should contain: approved HEX palette values with Delta-E tolerance thresholds, reference talent image hashes for InsightFace comparison, logo template images, delivery context identifiers (broadcast, social, vertical), approved reference frames for CLIP and LUT comparison, LUFS targets, and safe zone configurations. Every scoring run joins against this table. Design this schema before building any Domain 8 tooling.

**Visual treatment consistency** measures color grading and visual treatment consistency against a client-approved reference frame using CLIP embedding distance for semantic and tonal similarity. For clients with a specific color grade, add a LUT (Look-Up Table) comparison via the `colour-science` library to measure deviation from the approved grade.

**Text / typography rendering verification** addresses AI's notorious weakness with legible text. If generated content contains text — signage, lower thirds, product labels, UI elements — run OCR (EasyOCR or Tesseract) on detected text regions and compare against expected text from the prompt or client brief. The OCR engine's confidence score is itself a proxy for legibility — real text OCRs cleanly, garbled AI text produces low-confidence partial matches. Flag any text region with OCR confidence below a threshold for human review.

---

## Domain 9 — Prompt & Action Adherence

_VLM dependency makes this the most operationally complex domain. Build last when all other scoring signals are logged._

### Metrics

| Metric | Tool | Automation | Difficulty |
|---|---|---|---|
| Slideshow / motion failure | Mean optical flow magnitude | Medium | Low–Medium |
| Action execution quality | VLM scoring — LLaVA via Ollama (flagged) | Low | Hard |
| Subject framing adherence | Face / body bounding box tracking via MediaPipe | Medium | Medium |
| Composition stability | Rule-of-thirds grid intersection tracking via OpenCV | Medium | Low–Medium |
| Object count accuracy | VLM object counting vs prompt specification | Low | Medium |
| Spatial relationship accuracy | VLM spatial analysis vs prompt specification | Low | Hard |
| Physics plausibility (cloth, hair, fluid) | VLM-assisted flagging | Low | Hard |
| Text content accuracy | OCR vs prompt text (cross-ref Domain 8) | Medium | Medium |

### Implementation Notes

**All VLM-generated scores** must be logged in Datasette with an explicit `score_type` field value of `ai_evaluated` rather than `algorithmic`. This distinction is non-negotiable for benchmark credibility. Technically sophisticated readers will challenge your methodology if AI-generated scores and deterministic scores are presented equivalently. The separation signals methodological honesty and strengthens authority.

**Action execution quality:** pass sampled frames (every 8th frame is usually sufficient) to LLaVA running locally via Ollama on the M4 Pro, with a structured prompt describing the expected action. Ask for a 1–10 score with a one-sentence justification. Log both the score and the justification text — the justification becomes queryable qualitative data over time and surfaces systematic failure patterns.

**Physics plausibility** — hair that moves through solid objects, cloth that defies gravity, water that flows upward — is added as an explicit evaluation criterion in the VLM prompt rather than a separate metric pipeline. Low automation, but its inclusion in the methodology signals completeness to professional reviewers.

**Object count and spatial relationship accuracy** use VLM to verify that the generated content contains the correct number of subjects/objects and that their spatial relationships match the prompt (e.g., "person standing behind a desk" should not produce a person in front of the desk). These are common failure modes in AI generation that directly impact client satisfaction.

---

## Tiered Gating & Early Termination

Failed content should receive fast feedback without incurring unnecessary compute cost.

| Gate | After Domain | Pass Criteria | Failure Action |
|---|---|---|---|
| Gate 1 | Domain 1 | All technical specs within tolerance; Harding test pass (if broadcast context) | Immediate reject with spec/compliance failure report; no frame extraction. Harding failure is a legal delivery blocker equivalent to wrong codec. |
| Gate 2 | Domain 2 | No catastrophic spatial failures (BRISQUE > floor, no extreme banding) | Reject with spatial quality report; no temporal analysis |
| Gate 3 | Domains 3–4 | No catastrophic temporal/audio failures | Reject with temporal/audio report; no deep analysis |
| No gate | Domains 5–9 | All metrics logged; composite scoring applied | Full scorecard generated |

Domains 5–9 do not have hard gates because their failures are typically partial and gradable rather than catastrophic. A clip with moderate identity drift may be acceptable for some clients and unacceptable for others — the composite score and client-specific thresholds handle this.

### Early Termination Within Domains

Within a domain, if initial sampling detects a catastrophic failure, skip the remaining metrics in that domain and advance to the gate decision. Example: if the first 10 sampled frames all produce BRISQUE scores below the absolute floor, there is no value in running FFT seam detection, banding analysis, and noise profiling on the same clip.

---

## Frame Sampling Strategy

Full per-frame analysis of a 30fps 60-second clip is 1,800 frames. Define explicit sampling rates per domain to manage compute cost without sacrificing detection accuracy.

| Domain | Sampling Strategy | Rationale |
|---|---|---|
| 1 (Technical) | Full file / stream analysis | Operates on file-level metadata and stream properties, not individual frames |
| 2 (Spatial) | Every Nth frame (N=5–10) for screening; full analysis on flagged segments | Spatial artifacts are typically persistent across multiple frames |
| 3 (Temporal) | Consecutive frames in 1-second windows every 3–5 seconds for screening; full analysis on flagged windows | Temporal metrics require consecutive frames by definition; window sampling balances coverage and cost |
| 4 (Audio) | Full audio stream | Audio analysis is computationally cheap relative to video |
| 5 (Lip Sync) | Only frames where faces are detected; skip all others | Lip sync analysis on non-face frames is meaningless |
| 6 (Character) | Only frames where faces/hands/bodies are detected | Identity and body metrics only apply to frames containing the relevant features |
| 7 (Lighting) | Every Nth frame (N=5–10); full analysis on detected shifts | Lighting changes are typically gradual or sudden — sampling catches both |
| 8 (Brand) | Key frames + random sampling (10–15% of total frames) | Brand compliance needs to hold across the clip but doesn't require every frame |
| 9 (Prompt) | Every 8th frame for VLM analysis | VLM processing is the most expensive operation; 8-frame interval balances cost and coverage |

Document the sampling strategy in your published methodology. It affects reproducibility.

---

## Threshold Calibration Methodology

Every metric produces a number. The mapping from number to "acceptable" vs "unacceptable" requires ground truth.

### Calibration Dataset Requirements

| Item | Target | Notes |
|---|---|---|
| Clips per domain | 50–100 minimum | More for domains with higher variance (Domains 5, 6, 9) |
| Models represented | 5+ models across both tiers (see below) | Mix of locally generated and community-sourced |
| Content types | At minimum: talking head, full body motion, product/object, landscape/scene | Different content types produce different metric distributions |
| Human ratings | Per-domain quality rating (1–10) for each clip | Your own ratings initially; expand to 2–3 raters for inter-rater reliability |

**Model access tiers for calibration data:**

| Tier | Models | Access Method | Reproducibility |
|---|---|---|---|
| Locally runnable | ComfyUI workflows (various checkpoints), Stable Diffusion Video, open-weight models via Ollama | Direct generation with logged seeds, prompts, and settings | Full — outputs are reproducible from logged parameters |
| API-accessible | Runway Gen-3/4, Kling, Pika, Luma | API calls with logged parameters | High — same prompt and settings produce comparable (not identical) outputs |
| Community-sourced | Sora, Veo, other closed/waitlisted models | Collected from public community posts, benchmark datasets, user submissions | Low — generation parameters are often unknown; outputs cannot be reproduced |

Do not list community-sourced models in your methodology as if they are reproducibly testable. When publishing benchmarks that include closed-model outputs, explicitly note: (1) the source of the clips, (2) that generation parameters may be unknown, and (3) that results on community-sourced clips reflect the specific samples tested, not the model's general capability. This transparency strengthens rather than undermines your methodology — claiming reproducible benchmarks on models you cannot access would be a credibility risk.

### Calibration Process

1. **Collect:** Generate or gather 50–100 clips per domain across multiple models and content types.
2. **Rate:** Manually rate each clip on the domain's quality criteria (1–10 scale with written criteria for each score level).
3. **Score:** Run your automated metrics on the same clips.
4. **Correlate:** Plot automated scores against human ratings. Identify threshold values that best separate "pass" from "fail" at your desired quality level.
5. **Validate:** Hold out 20% of clips as a validation set. Verify that thresholds set on the training set produce acceptable pass/fail decisions on the held-out clips.
6. **Document:** Record threshold values, calibration dataset composition, and correlation coefficients in Datasette. These numbers support your published methodology.

### Ongoing Recalibration

When new models are released or your quality intuition improves, re-run the calibration process. Log each calibration run with a version number and timestamp. Compare threshold stability across calibration versions to identify metrics that are robust versus metrics that require frequent recalibration.

Build this as a parallel activity alongside Phases 1–3 implementation. As you build each domain's tooling, manually rate a set of clips on that domain's criteria and correlate your ratings with the metric outputs.

---

## Image QA — Single-Frame Mode

The framework is video-centric but must handle still images. Design the pipeline architecture to treat images as a degenerate case of video (a single-frame clip) rather than requiring a separate pipeline.

### Domains That Apply to Images

| Domain | Applies | Notes |
|---|---|---|
| 1 — Technical Delivery | Yes | Resolution, color space, format, metadata |
| 2 — Spatial & Texture | Yes | Full domain applies; this is the primary image QA domain |
| 3 — Temporal & Motion | No | No temporal dimension |
| 4 — Audio | No | No audio track |
| 5 — Lip Sync | No | No temporal dimension |
| 6 — Character & Identity | Partial | Single-frame identity verification against reference; no drift curve |
| 7 — Lighting & Scene | Partial | Single-frame lighting analysis; no temporal consistency |
| 8 — Brand & Client | Yes | Full domain applies |
| 9 — Prompt & Action | Partial | VLM can evaluate single images against prompt; no motion/action metrics |

Implement image mode in Phase 1 by detecting single-frame input and routing only to applicable domains. This avoids building and maintaining a separate image pipeline.

### Schema Handling for Images

The `runs` table includes a `content_type` field (`video` or `image`) that controls domain routing and gating behavior. For image runs:

- The `gate_failed_at` field still functions but skips gates that only apply to video (Gate 3 temporal/audio checks are not evaluated).
- The `frames` table produces exactly one row per metric for image runs, with `frame_number` set to `0`. This preserves schema consistency — queries that join `runs` to `frames` work identically for both content types without conditional logic.
- Domains 3, 4, and 5 produce no `scores` or `frames` rows for image runs. The absence of rows is the correct representation — do not insert placeholder rows with null scores, as this complicates aggregation queries.

---

## Multi-Character Scene Handling

Several metrics — identity drift, face detection, lip sync, skin tone, eye gaze — implicitly assume a single subject per frame. Multi-character scenes (two or more people in frame) break this assumption and will produce either averaged scores that are meaningless or null results that look like failures unless handled explicitly.

### Subject Definition

Define named subjects per project in the `clients` table's `subject_definitions` field:

```json
{
  "subject_a": {
    "name": "Lead Character",
    "role": "primary",
    "reference_image": "path/to/reference_a.png",
    "skin_tone_reference": [128, 117],
    "insightface_embedding_hash": "abc123..."
  },
  "subject_b": {
    "name": "Supporting Character",
    "role": "secondary",
    "reference_image": "path/to/reference_b.png",
    "skin_tone_reference": [131, 122],
    "insightface_embedding_hash": "def456..."
  }
}
```

### Per-Subject Scoring

When multiple faces are detected in a frame, the pipeline must assign each detected face to a defined subject before scoring. Assignment uses InsightFace embedding cosine similarity against the reference embeddings stored in `subject_definitions`. Faces that do not match any defined subject above a minimum similarity threshold are logged as `unmatched` — this may indicate an unexpected character, a misidentified face, or identity drift severe enough that the subject no longer matches their own reference.

### Domain-Specific Multi-Character Behavior

| Domain | Single-Subject Behavior | Multi-Character Behavior |
|---|---|---|
| 5 — Lip Sync | Score the single detected face | Score each subject independently; report per-subject lip sync curves; if subjects are not defined, score only the largest detected face (by bounding box area) and log a warning |
| 6 — Identity Drift | Single cosine similarity curve | Per-subject cosine similarity curves; each subject tracked against their own reference embedding |
| 6 — Skin Tone | Single chrominance track | Per-subject chrominance tracking using per-subject face masks |
| 6 — Eye Gaze | Single gaze trajectory | Per-subject gaze tracking |
| 6 — Body Proportions | Single body landmark set | Per-subject body tracking via MediaPipe Pose (multi-person mode) |
| 8 — Talent Likeness | Single face vs single reference | Per-subject face vs per-subject reference from `subject_definitions` |

### Schema Support

The `frames` table includes a `subject_id` field. For per-character metrics, each subject produces a separate row per frame per metric. Scene-level metrics (luminance, shadow coherence, color temperature) set `subject_id` to null.

### Fallback When Subjects Are Not Defined

If `subject_definitions` is empty or not configured for a run, the pipeline falls back to single-subject behavior: score only the largest detected face per frame and log a warning that multi-character scoring was not applied. This ensures the system never silently produces averaged multi-face scores that obscure per-character quality issues.

---

## Scorecard & Report Design

A numeric table in Datasette is not a client deliverable. Design the client-facing scorecard as a first-class output of the pipeline.

### Report Components

| Component | Purpose | Priority |
|---|---|---|
| Pass/fail summary | Domain-level rollup with overall verdict | Required |
| Domain detail cards | Per-domain score with metric breakdown | Required |
| Annotated frame thumbnails | Flagged frames with bounding boxes showing specific issues | Required |
| Timeline visualization | Horizontal bar showing where in the clip failures occur | Required |
| Comparison frames | Reference frame vs flagged frame (for identity drift, color drift, etc.) | High value |
| Metric trend curves | Line graphs for per-frame metrics (identity similarity, luminance, MAR) | High value |
| Score type indicators | Clear labeling of `algorithmic` vs `ai_evaluated` scores | Required |
| Client threshold reference | Shows the agreed thresholds alongside actual scores | Required for client-facing |
| Framework version stamp | Prominently displayed scoring framework version (from `scoring_script_version`) | Required |
| Re-score labeling | When an asset is re-scored against updated calibrations, the report clearly labels the new scores alongside the previous scores and identifies what changed | Required for re-evaluations |

### Report Versioning

Every client-facing report must prominently display the framework version (`scoring_script_version`) and calibration version (`threshold_version`) used to produce the scores. When the scoring framework is updated and an asset is re-scored:

- The new report must be clearly labeled as a re-evaluation, not a replacement of the original.
- Both the previous and current scores should be displayed where they differ, with an explanation of what changed (updated threshold, new metric added, calibration adjustment).
- The `runs` table supports this natively — each re-evaluation is a new run with a new `scoring_script_version`, linked to the same `clip_path`. Query all runs for a given `clip_path` to produce a score history.
- Client-facing reports should never silently replace a previous report. If a score changed from pass to fail (or vice versa) due to a framework update, the client needs to see that explicitly. This transparency is a trust asset, not a liability.

### Datasette Schema Support

To generate visual reports, store alongside scores:

- Frame numbers for every flagged issue
- Bounding box coordinates for spatially localized issues
- Thumbnail file paths for annotated frame captures
- Reference frame paths for comparison display

Design this storage in Phase 1 so it's available when you build reporting. Retrofitting frame-level annotation storage into an existing schema is painful.

---

## Datasette Schema Design

Design the schema before writing any scoring code.

### Core Tables

**`clients`** — The spine of Domain 8 and the configuration source for all client-specific thresholds.

| Column | Type | Purpose |
|---|---|---|
| id | integer PK | Client identifier |
| name | text | Client name |
| hex_palette | JSON | Approved brand HEX values |
| delta_e_threshold | real | Max Delta-E tolerance for brand colors |
| reference_talent_images | JSON | Image hashes for InsightFace comparison |
| logo_templates | JSON | Template image paths for logo detection |
| delivery_contexts | JSON | Broadcast, social, vertical configs with safe zones and LUFS targets |
| approved_reference_frames | JSON | Paths to approved reference frames for CLIP/LUT comparison |
| skin_tone_references | JSON | Optional skin tone reference chrominance values |
| subject_definitions | JSON | Named subjects with per-subject reference images, skin tone references, and role (primary/secondary) for multi-character content |

**`runs`** — One row per QA evaluation.

| Column | Type | Purpose |
|---|---|---|
| id | integer PK | Run identifier |
| clip_path | text | Path to the evaluated file |
| content_type | text | `video` or `image` — determines which domains are evaluated and how gating behaves |
| client_id | integer FK | Client reference |
| model_version | text | Generation model used (if known) |
| scoring_script_version | text | Version of the QA framework used |
| generation_parameters | JSON | Prompt, seed, settings (if available) |
| timestamp | datetime | When the run was executed |
| overall_pass | boolean | Composite pass/fail verdict |
| gate_failed_at | integer | Which gate stopped processing (null if all passed) |

**`scores`** — One row per metric per run.

| Column | Type | Purpose |
|---|---|---|
| id | integer PK | Score identifier |
| run_id | integer FK | Run reference |
| domain | integer | Domain number (1–9) |
| metric_name | text | Metric identifier |
| score_value | real | Raw metric value |
| score_type | text | `algorithmic` or `ai_evaluated` |
| pass | boolean | Pass/fail against threshold |
| threshold_value | real | Threshold used for this evaluation |
| threshold_version | text | Calibration version that set this threshold |

**`frames`** — Per-frame data for metrics that produce curves.

| Column | Type | Purpose |
|---|---|---|
| id | integer PK | Frame record identifier |
| run_id | integer FK | Run reference |
| frame_number | integer | Frame index in the clip |
| metric_name | text | Which metric this value belongs to |
| subject_id | text | Subject identifier for per-character metrics (null for scene-level metrics like luminance) |
| value | real | Per-frame metric value |
| bbox | JSON | Bounding box coordinates (if spatially localized) |
| thumbnail_path | text | Path to annotated thumbnail (if generated) |
| flagged | boolean | Whether this frame was flagged for the given metric |

**`calibrations`** — Threshold calibration history.

| Column | Type | Purpose |
|---|---|---|
| id | integer PK | Calibration identifier |
| domain | integer | Domain number |
| metric_name | text | Metric identifier |
| threshold_value | real | Calibrated threshold |
| calibration_dataset_size | integer | Number of clips used |
| correlation_coefficient | real | Correlation with human ratings |
| version | text | Calibration version string |
| timestamp | datetime | When calibration was performed |

**`research_log`** — Agent hypothesis documents, source URLs, model/node versions.

| Column | Type | Purpose |
|---|---|---|
| id | integer PK | Log entry identifier |
| hypothesis | text | Research question or hypothesis |
| source_urls | JSON | Reference URLs |
| model_versions | JSON | Model/node versions active at time of research |
| linked_run_ids | JSON | Run IDs that tested this hypothesis |
| timestamp | datetime | Entry date |

Version every run. Log model version, node versions, and scoring script version on every row. Without this, longitudinal comparison becomes impossible when tools update and behavior changes.

---

## Build Sequence & Implementation Plan

### Revised Sequence

The build sequence follows two principles: (1) each phase produces infrastructure consumed by later phases, and (2) the hardest high-value metric is tackled early to de-risk the project.

| Weeks | Phase | Work | Success Criteria |
|---|---|---|---|
| 1–2 | Phase 1 | Technical Delivery Compliance — all metrics | FFmpeg wrapper extracts all spec values; VMAF scores a clip; client config table exists in Datasette; 50 test clips pass/fail correctly |
| 3 | Phase 2a | Frame extraction pipeline | Reliable frame extraction from any input video/image; frames stored in standardized format for downstream consumption |
| 4–6 | Phase 1b | Identity Consistency Spike (InsightFace) | Per-frame face embeddings extracted; cosine similarity curve produced; correctly distinguishes stable-identity clips from drifting-identity clips on 20+ test clips; handles null detections and multi-face frames |
| 6 | Checkpoint | **Publish first benchmarks** | Technical compliance + identity consistency scored across 5+ models; methodology document published; results formatted for web/social |
| 7–9 | Phase 2b | Remaining Spatial & Texture metrics | BRISQUE/NIQE/Laplacian scoring, color banding detection, VAE seam FFT, wavelet noise analysis all producing meaningful scores |
| 10–12 | Phase 3 | Temporal Consistency & Motion | Segmentation masks working and stored; background SSIM, optical flow, flicker detection, scene cut detection all functional |
| 10–12 | Phase 4 | Audio Quality (parallel with Phase 3) | librosa pipeline, LUFS measurement, clipping detection, sync offset extraction all functional |
| 13–15 | Phase 5 | Lip Sync Precision | MAR extraction, DTW alignment, phoneme timing all integrated; offset correction from Domain 4 applied |
| 16–18 | Phase 6 | Character & Identity (remaining metrics) | Hand detection/failure logging, body proportions, skin tone, clothing drift, teeth rendering all added to InsightFace infrastructure |
| 19–21 | Phase 7 | Lighting & Scene Integrity | Shadow masking, luminance tracking, color temperature, reflection flagging all functional |
| 22–24 | Phase 8 | Brand & Client Compliance | Client config integration complete; full scoring composite per client; text/typography verification; LUT comparison |
| 25–27 | Phase 9 | Prompt & Action Adherence | VLM integration via Ollama; framing/composition tracking; physics/object/spatial flagging |
| Ongoing | Reports | Publish updated benchmarks | New model releases scored and published within 1–2 weeks of availability |

### Infrastructure Reuse Map

The sequencing eliminates redundant work across phases:

| Infrastructure | Built In | Reused In |
|---|---|---|
| File pipeline + FFmpeg wrapper | Phase 1 | Every subsequent phase |
| Frame extraction pipeline | Phase 2a | All frame-based domains (2–9) |
| InsightFace encoder | Phase 1b | Domain 8 (client talent compliance) |
| Segmentation masks | Phase 3 | Domain 6 (hair, clothing, skin), Domain 7 (shadow, lighting) |
| Optical flow extraction | Phase 3 | Domain 5 (motion smear), Domain 9 (slideshow detection) |
| Audio sync offset | Phase 4 | Domain 5 (DTW pre-alignment) |
| CLIP encoder | Phase 6 (clothing drift) | Domain 8 (visual treatment consistency), Domain 9 (prompt adherence) |
| Face landmarks (MediaPipe) | Phase 3/5 | Domain 6 (gaze, teeth, jaw), Domain 7 (skin-region lighting) |

Building in this order means you are never throwing work away and never rebuilding infrastructure you already have.

---

## Competitive Landscape

### Direct Competitors

| Competitor Type | Examples | Threat Level | Notes |
|---|---|---|---|
| Traditional broadcast QC | Telestream, Venera, Interra Systems | Low | Focused on MPEG errors, loudness, captions. Zero AI artifact detection. 2–3 years from pivoting. |
| AI research quality metrics | pyiqa, academic IQA papers | None (building blocks) | Research tools, not products. These are your dependencies, not your competitors. |
| Model companies' internal QC | Runway, OpenAI, Google | Low–Medium | Structural conflict of interest — they're incentivized to make their models look good, not objectively score them. Will never sell independent QC. |
| Adobe (potential) | Premiere / After Effects integration | Medium (long-term) | Has resources and distribution. Takes 2–4 years to ship new product categories. Also conflicted via Firefly. |
| VC-funded startup | Unknown (none visible yet) | Medium–High (12–18 months) | Most realistic competitive threat. Your defense: published methodology, client relationships, and calibration data they'd have to rebuild. |

### The Actual Incumbent

Your real competitor is **a human watching the video and deciding if it looks good.** That is the current QC process at most studios using AI generation. Your pitch is: systematic scoring is more consistent, faster, and more documentable than a person eyeballing it. That becomes compelling when AI content volume exceeds what humans can manually review.

### Competitive Moat

First-mover advantage in trust-based markets is real. Being the established authority with published benchmarks, a documented methodology, and a year of calibration data creates switching costs that pure technology features do not.

---

## Risk Factors & Mitigations

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| Dependency conflicts between CV/ML libraries | Delays of 1–3 weeks per occurrence | High | Per-domain environment isolation (venv/Docker); start with isolated venvs, escalate to Docker as needed |
| Segmentation mask quality insufficient for downstream metrics | Undermines Domains 6 and 7 reliability | Medium | Test mask quality early in Phase 3; evaluate SAM 2 as alternative if MediaPipe/rembg insufficient; degrade gracefully (disable mask-dependent metrics rather than producing unreliable scores) |
| Silent metric failures (code runs but produces wrong numbers) | Erodes credibility if published | Medium–High | Build validation datasets per metric; cross-check metric outputs against manual inspection; retain the CV advisor (see below) |
| Threshold calibration doesn't converge (automated scores don't correlate with human quality judgment) | Undermines the entire pass/fail value proposition | Low–Medium | Start calibration alongside Phase 1–2 build; use multiple metrics per quality dimension (BRISQUE + NIQE + Laplacian rather than BRISQUE alone); accept that some metrics are informational rather than pass/fail |
| VLM scoring non-determinism (Domain 9) | Reduces benchmark reproducibility | High | Log all VLM scores as `ai_evaluated`; run multiple evaluations and report mean + variance; never present VLM scores as equivalent to algorithmic scores |

### Business Risks

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| Phase 1 takes too long, nothing published | Loses first-mover window | Medium | Hard deadline: publish first benchmarks by week 6 regardless of system completeness; partial results with transparent methodology are more valuable than comprehensive results published late |
| Free pilot goes poorly | Damages reputation in small Vancouver production community | Medium | Run the system on the pilot content privately first; only present results you've verified; under-promise and over-deliver on the pilot scope |
| Client concentration (1–2 clients = all revenue) | Revenue fragile to relationship changes | High (early stage) | Diversify revenue across managed service + tool subscriptions + benchmark sponsorship; don't depend on any single client for more than 40% of revenue |
| Model evolution invalidates calibrations | Ongoing maintenance burden with no direct revenue | High | Budget recalibration time quarterly; most metrics are model-agnostic (output properties don't change when models change); flag model-specific metrics explicitly |
| Well-funded competitor enters the space | Price pressure, feature competition | Medium (12–18 months) | Build authority and relationships now; published methodology and client trust are harder to replicate than software features |

### Key Mitigation: The CV Advisor

Engage a freelance computer vision engineer for 2–4 hours per month to review your metric outputs. Not a co-founder. Not a full-time hire. A paid advisor who looks at your BRISQUE scores, your FFT peaks, your optical flow outputs, and tells you when something looks wrong. This single relationship shifts every technical risk's probability down by a meaningful margin. Budget approximately $150–300/month. It is one of the highest-ROI investments in the project.

---

## Business Model & Prioritization

### Revenue Streams Ranked by Near-Term Viability

| Priority | Revenue Stream | Model | Target Customer | Est. Revenue Range |
|---|---|---|---|---|
| 1 | Benchmark reports (free) | Authority building / customer acquisition | AI video community | $0 (marketing investment) |
| 2 | Managed QA service | Per-asset with session minimum, or monthly retainer | Vancouver production studios, agencies | $50–150/asset, $500 session minimum; $2,000–5,000/month retainer |
| 3 | Objective acceptance gate | Per-asset or per-batch fee (neutral third party) | Creator/client pairs | $50–150/asset, $200 batch minimum |
| 4 | Self-serve tool for creators | Monthly SaaS subscription | Solo creators, small studios | $30–80/month |
| 5 | API for marketplaces/platforms | Per-evaluation or monthly API fee | Stock footage marketplaces, AI content platforms | $0.10–0.50/evaluation |
| 6 | Pipeline integrations | Annual license | Production studios (ShotGrid, Nuke, Resolve) | $2,000–10,000/year |
| 7 | Compliance documentation | Bundled with managed service | Agencies, brands, broadcast | Premium on managed service pricing |

**Pricing note on managed QA service:** Most production studio projects involve dozens to hundreds of AI-generated assets, not single clips. Pricing per-project at a flat rate dramatically undercharges on high-volume work. Structure pricing as per-asset with a session minimum (e.g., $50–150 per asset, $500 minimum per engagement). For studios with ongoing volume, offer a monthly retainer with an included asset allowance and overage pricing. This aligns revenue with actual workload and avoids the situation where a 200-asset project generates the same revenue as a 3-asset project.

### Strategic Sequence

**Months 1–6:** Publish benchmarks (free). Build credibility. Run the scoring system yourself on real content. Offer 1–2 free pilots to local studios.

**Months 6–12:** Convert pilots to paid managed QA service. Generate revenue through service, not software. Continue publishing benchmarks with each major model release.

**Months 12–18:** Package the system as a self-serve tool for the creator market. Service revenue funds product development. Explore API licensing conversations with marketplace platforms.

**Months 18+:** Pipeline integrations for studio workflows. Compliance documentation as a premium service tier.

The key insight: **build a service, then productize it.** Service revenue funds product development and provides real-world calibration data that pure product development cannot generate.

---

## The Honest Caveat

Domain 8 combined with Domains 4, 5, and 6 gives you a genuinely professional system that can support client billing and public benchmark authority simultaneously. Domains 1 through 3 give you a functional system that is immediately useful on live projects.

If you build everything through Phase 9, you have a unified AI video quality assurance pipeline that does not exist anywhere else as an integrated system. If you only build through Phase 5, you already have something worth publishing benchmarks on and worth charging clients for.

The risk is not feasibility — every metric in this framework is implementable with available open-source tools on an M4 Pro 48GB without cloud dependencies. The risk is scope preventing you from shipping Phase 1. A working Phase 1 and 2 published as a YouTube series builds more authority faster than a perfect Phase 9 that never ships.

The metrics are model-agnostic. They measure properties of the output file. A frame is a frame. A waveform is a waveform. This means the system does not require recalibration when models change, and implementation is a linear process with clear success criteria at each step.

Build Phase 1 this week. Publish the methodology before the results. Ship something before it is finished.
