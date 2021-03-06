/* eslint global-require: 0 */
/* global webpackTools */
import React from 'react'
import ReactDOMServer from 'react-dom/server'

import App, { Html } from './modules/App'

const doctype = '<!DOCTYPE html>'

export const render = () => new Promise((resolve, reject) => {
  try {
    const assets = webpackTools.assets()
    const markup = ReactDOMServer.renderToString(<App />)
    const html   = ReactDOMServer.renderToStaticMarkup(<Html assets={ assets } markup={ markup } />)
    const body   = doctype + html

    resolve({ body })
  } catch (e) {
    reject(e)
  }
})

if (__DEV__) {
  // Hot reloading on the server
  const { compiler } = require('../webpack.server')

  compiler.plugin('done', () => {
    Object
      .keys(require.cache)
      .filter(module => module.startsWith(__dirname))
      .forEach(module => delete require.cache[module])
    // Refresh Webpack assets
    webpackTools.refresh()
  })
}
