# Performance Clinic

I approached this as a small performance investigation, not a rewrite. The goal was to find work the browser was doing unnecessarily, remove it, and keep the existing experience intact.

## 1. Stop preparing the entire dataset on every search

- **What I noticed:** Search could become sluggish with 100,000 events.
- **How I tracked it down:** I inspected `js/app.js` and found that `search()` serialized every event, lowercased the result, filtered the dataset, and sorted the matches on every input event.
- **Why it was happening:** The same search preparation and ordering work was being repeated on every keystroke.
- **What I changed:** I cached lowercase searchable text and sorted the events once at startup. Search now filters the cached text while preserving the existing order.
- **How I'd measure the impact:** Record the same search interaction before and after in Chrome DevTools Performance, then compare scripting time and responsiveness. I haven't recorded comparable timings yet, so I'm not claiming a numeric speedup.

## 2. Stop making scrolling do a full-dataset scan

- **What I noticed:** Scrolling could trigger unnecessary JavaScript work.
- **How I tracked it down:** In `onScroll()`, I found a full-dataset filter used to count events in the focused minute.
- **Why it was happening:** A value that could be calculated once was being recalculated from all 100,000 events during scrolling.
- **What I changed:** I precomputed event counts by minute and replaced the repeated scan with a `Map` lookup. I also used `requestAnimationFrame` to coalesce rapid scroll updates.
- **How I'd measure the impact:** Record the same scrolling path before and after, comparing scripting time and long tasks in Chrome DevTools Performance.

## 3. Make card sizing less expensive

- **What I noticed:** Equalizing agent-card heights involved unnecessary repeated comparisons and layout work.
- **How I tracked it down:** I inspected `equalizeCardHeights()` and found nested loops repeatedly measuring cards against one another.
- **Why it was happening:** The implementation did more comparisons than necessary and mixed layout reads with writes.
- **What I changed:** I reset the heights, grouped cards by visual row, measured each card once, and applied the maximum height for its row.
- **How I'd measure the impact:** Compare the initial render or resize interaction in Chrome DevTools Performance, paying attention to scripting and layout work.

## 4. Write viewed IDs to storage once per page

- **What I noticed:** Processing a page of results could trigger repeated synchronous local-storage writes.
- **How I tracked it down:** In `rememberViewed()`, the storage write happened inside the loop processing individual items.
- **Why it was happening:** The same array was repeatedly serialized and persisted during a single batch.
- **What I changed:** I update the viewed IDs in memory and persist the result once after processing the page.
- **How I'd measure the impact:** Compare the same page-render interaction before and after. Numeric timings haven't been recorded yet.

## 5. Give the live ticker a proper cleanup routine

- **What I noticed:** Repeatedly opening and closing the live ticker could leave resources active longer than intended.
- **How I tracked it down:** I checked `openTicker()` and `closeTicker()` and found that the interval and window event listeners weren't being cleaned up.
- **Why it was happening:** Resources were created when the ticker opened, but their lifecycle wasn't fully managed when it closed.
- **What I changed:** I retained references to the interval and keyboard handler, then cleared the interval and removed the listener when closing the ticker.
- **How I'd verify it:** Open and close the ticker repeatedly and check that old intervals and listeners don't accumulate.

## 6. Ship a lighter hero image

- **What I noticed:** The hero image was adding several megabytes to the initial image transfer.
- **How I tracked it down:** Inspecting the asset revealed that `hero.png` was 4,270,977 bytes at 1700 × 950 pixels.
- **Why it was happening:** A large visual asset was being served as a PNG when a compressed WebP was a better fit.
- **What I changed:** I converted the image to WebP at quality 82 and updated the HTML reference. The resulting file is 430,806 bytes.
- **Measured result:** The asset file dropped from 4,270,977 bytes to 430,806 bytes, a reduction of approximately **89.9%**. I'd also verify the actual transferred size in Chrome DevTools Network after a reload.

## A note on my workflow

I used AI as a development aid for exploring approaches, debugging, and speeding up parts of the investigation. I still treat the code and its behaviour as my responsibility: suggestions need to make sense in context, fixes need to preserve the experience, and performance claims need evidence.

For this clinic, the code changes and asset-size comparison are documented above. Where I haven't captured a controlled before-and-after benchmark, I've said so rather than inventing a number. That's a distinction I want to keep clear: **an optimization should be explainable, and a performance claim should be measurable.**