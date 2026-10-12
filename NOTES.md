# NOTES.md

## What I built

I built the Agent Activity Explorer with **Next.js App Router, JavaScript, and Ant Design**. The goal was simple: make a lot of agent activity easier to understand without making the interface another dashboard that throws 47 things at your face.

I kept the Explorer's visual language deliberately restrained. It's an operational tool, so the interface should help you find the signal, not compete with it. Good UI isn't about adding more stuff. Sometimes it's about knowing what to leave out.

For Part B, I worked on the framework-free Perf Clinic, targeting unnecessary work in search, scrolling, layout calculations, storage updates, and ticker cleanup, alongside reducing the hero image's file size.

## A few decisions I made

I chose JavaScript because it's where I'm most comfortable building right now. TypeScript isn't a hill I'm willing to die on. If the project, team, or scale calls for it, I can switch. I have preferences, not a constitution.

I also didn't try to collect optional features like Pokémon. I'd rather get the important things right than ship a pile of half-finished extras. With more time, I'd strengthen automated test coverage, run repeatable performance benchmarks, and refine the experience based on what those tests and measurements reveal.

## My relationship with AI

I use AI to move faster, think through alternatives, debug, and challenge my own assumptions. I don't use it as a vending machine for UI: insert prompt, receive dashboard, declare victory.

The product still needs a point of view. I care about the small decisions that make something feel considered: what deserves attention, what gets out of the way, where an interaction feels clumsy, and whether a solution actually solves the problem. AI can help me explore the options, but I still need to understand, evaluate, test, and own what ships.

I'm comfortable trying new tools, libraries, and workflows, too. I like having a preferred stack, but I'm not interested in being the person who rejects a better solution because it isn't the one they already know. If there's a smarter way to build it, I want to find it.

## What I'd do next

I'd add more automated tests around the behavior most likely to break, validate the performance changes under repeatable conditions, and use those results to decide what deserves another pass.

This was time-boxed, so I'd also make sure any remaining gaps are clearly documented rather than pretending everything is magically production-perfect.

**My general rule:** use the right tools, understand the trade-offs, care about the details, and ship something people can actually use. The code matters. So does the experience. And neither should be left entirely to autocomplete.