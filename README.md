# H4kk3r Newz

## What is this?

Simple. Its a proxy server that passes news.ycombinator.com and replaces all links and entries char by char with their leetspeek equivalent. It doesn't pass cookies, or anything, meaning this should be a read only version of HackerNews. I don't want to fetch userdata or anything, just serve hackernews in H4ck3r$p33ch!

## How to run?

Yarn: ```yarn start```
NPM: ```npm start```

Binds default to PORT-Environment Variable or 3000, if no variable is set

## URL-Parameters:
|Param|Values|Default|
|-|-|-|
|```mode=``` | ```mild``` or ```heavy``` | ```mild``` |
