---
name: Sunset
description: An amber and evergreen workbench for reviewing temporary decisions.
colors:
  accent: "#f3be65"
  ink: "#26332c"
  line: "#dce1d9"
  muted: "#637067"
  canvas: "#f5f6f3"
  surface: "white"
  header: "#222e27"
  queue: "#fafbf8"
  selected: "#fff2d9"
  selected-edge: "#bc7f24"
  sample: "#f9e6bf"
  primary-hover: "#3c5143"
  focus: "#a56a13"
typography:
  headline:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "clamp(26px, 2.8vw, 37px)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-1.1px"
  title:
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.7px"
  body:
    fontSize: "13px"
    lineHeight: 1.8
  label:
    fontSize: "12px"
    fontWeight: 650
rounded:
  field: "6px"
  button: "7px"
  action-form: "8px"
  workbench: "12px"
spacing:
  control-gap: "8px"
  action-gap: "10px"
  form-gap: "15px"
  field-padding: "11px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.button}"
    padding: "10px 15px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "{spacing.field-padding}"
  workbench:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.workbench}"
---

# Design System: Sunset

## Overview

**Creative North Star: "The Operational Workbench" (provisional descriptive name)**

The implemented interface pairs evergreen navigation and actions with amber selection and sample context. Quiet paper surfaces, compact metadata, and explicit evidence make temporary decisions easy to revisit. This describes the pilot implementation; it does not establish customer validation.

The approved amber-to-dawn palette and then → now → decision evidence sequence are the durable visual commitments. Other atmosphere language remains provisional.

**Key Characteristics:**
- Evergreen actions and amber emphasis.
- A queue beside a focused review surface.
- Numbered evidence with explicit human decisions.
- Compact system typography and restrained depth.

## Colors

### Primary
Amber accents the sunrise mark, text selection, selected queue row, and sample context. Evergreen ink carries primary actions and readable content; the darker header anchors the workspace.

### Neutral
Canvas, queue, and white surface distinguish nested regions. Muted text supports dates, ownership, and references; the line token separates evidence and history. Status text and dots use distinct green, amber, rust, and gray treatments alongside written labels.

## Typography

The interface uses the native system sans-serif stack. The page headline has compact tracking; detail titles are bounded to (27ch), queue titles to (26ch), and decision prose to (70ch). Metadata ranges from (10px) to (12px); evidence copy is (13px). Queue headings use (15px), and decision titles use (18px). Counts and numbered steps use tabular numerals.

## Layout

Main content is centered at a maximum width of (1440px), with (4%) horizontal padding. The workbench has a (340px) queue and a flexible detail column, with a minimum height of (650px). Detail padding starts at (28px 36px 35px). Evidence places then and now in adjacent columns with a connecting arrow; the decision follows beneath.

At (1000px) and below the queue narrows to (290px), evidence stacks, and the connector disappears. At (680px) and below the queue sits above detail, its list scrolls within (265px), forms use one column, and primary decision actions fill the available width. At (1400px) and above the detail gets wider padding.

## Elevation & Depth

Depth comes from tonal surfaces and thin dividers. There are no floating panel shadows. The selected queue row uses an inset (3px) amber edge. Controls transition background over (0.15s); changed evidence briefly fades from amber over (0.5s). Reduced-motion preferences disable both transitions and animations.

## Shapes

The workbench has softened outer corners; list rows retain square edges to read as a continuous queue. Fields and buttons use the small radii in the token layer. Circular numbered steps and status dots encode sequence and state. The sunrise symbol repeats in the brand and queue footer.

## Components

### Buttons
Primary actions use evergreen with white labels; secondary actions use white with a thin border. Text actions remove the container. Disabled controls reduce opacity to (0.5). Keyboard focus uses an amber (3px) outline offset by (3px).

### Inputs / Fields
White fields have a muted green border, generous internal padding, and the shared focus outline. Textareas resize vertically with a minimum height of (90px). Field labels sit above controls. Search uses a compact (12px) treatment.

### Navigation
The dark topbar holds the sunrise wordmark, caption, and environment label. Queue filter buttons expose pressed state through a pale green fill. Selected records use an amber background and inset edge, independently of their status labels.

### Cards / Containers
The bordered workbench contains the queue and detail rather than a collection of elevated cards. Inline action forms use a pale green surface and compact rounded corners. Notices use amber for context, rust for errors, and pale green for success.

### Evidence and decision
Numbered then and now sections show the original reason, prerequisite reference, current and target statuses, and observation timestamp. The third numbered section presents the next decision and verification caveat. Decision history uses small dots and dated entries.

## Do's and Don'ts

### Do:
- **Do** preserve the approved then → now → decision sequence.
- **Do** pair status color with a written label.
- **Do** retain visible keyboard focus and reduced-motion behavior.
- **Do** distinguish synthetic sample context from Jira workspace context.

### Don't:
- **Don't** present a met prerequisite as proof that removal is safe.
- **Don't** replace the implemented flat workbench with floating shadow cards without a new design decision.
- **Don't** treat provisional atmosphere language as a validated brand commitment.
