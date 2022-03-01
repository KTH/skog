<div align="center">
<img src="media/skog-logo.png" width="384">
<p>
Add <em>context</em> to your Node.js logs
</p>
<em>Forest photo by <a href="https://unsplash.com/photos/d6kSvT2xZQo">Gustav Gullstrand</a> on <a href="https://unsplash.com">Unsplash</a></em>
</div>

## Structure

[ UNDER DEVELOPMENT ]

Skog is all about _async context and logging stuff_: it uses **Async Context** to store what is going to be logged and then different libraries to **log stuff**. This repo will contain at least three packages:

- [**skog-core**](./packages/skog-core/). A "Logger" interface (without implementation) and functions for handling Async Context. Use this if you are making integrations with different logging libraries or if you want to use

  This package would be: as small as possible, wihthout almost any dependencies. It will expose as many low-level functions as possible to maximize customization.

- **skog-pino**. Pino logging library with Skog.

- **skog**. Opinionated no-config logging library. It contains decisions like "when in test, use `console`; in prod, use `pino`", etc.

## Getting started

[ UNDER DEVELOPMENT ]
