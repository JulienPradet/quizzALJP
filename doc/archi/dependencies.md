# Dependencies

The project relies on some awesome libraries outthere which are all under MIT licence.

## PeerJS

That's a wrapper for the WebRTC protocol. It's still in early phase but offers a really easy to learn API that goes out of the way when you just need to focus on your code. It actually has more features than what we need. Thus we created two wrappers that focus on DataChannels of the WebRTC protocol, and enable a star network of peers.

## RxJS

The Reactive Extensions is actually a star in Reactive Programming. It brings stream of events, and easy way to manage them in a functionnal and reactive way. That's how we handle our messages stream for our peer network. What could have been a huge mess is actually easier than ever.

## React

While it might not be the *best* view library when it comes to reactive programming, it sure has an incredible ecosystem and is highly reliable to display an application that changes a lot, and that relies on functional programming.

## tape

In order to test our codebase, we didn't want any framework that has its own magic. Tape relies on TAP standard, and is really easy to grasp with javascript knownledge only. That's actually just a library with a small API. Awesome :)

## Dev tools

The developer satisfaction is one of the most important feature of a software. If it's hard to keep things up and running, the developer won't be as motivated to add new features. Thus we use some Babel that enables today ES2015, Browserify that enables today require in the browser, and livereload that's just awesome.

## Build tool

I've been a user of grunt before. And I never made it to gulp. And webpack seems like a magic box that does everything. If I had to summarize, I'd say that javascript tooling ecosystem is scary. However, if you just stick with npm, it becomes cristal clear. You just have to grasp the basic cli of each tool you want to use, and add it as a script in your package.json. I won't switch back to tools that only worked thanks to copy/past.
