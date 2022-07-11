import * as vscode from 'vscode'
import { activate as openBlog } from './core/openBlog'
import { activate as newFile } from './core/newFile'
import { activate as statusBar } from './core/statusBar'
import { activate as helloWorld } from './core/helloWorld'
import { activate as log } from './core/log'
import { activate as hover } from './core/hover'
import { activate as webview } from './core/webview'

export function activate(context: vscode.ExtensionContext) {
  console.log('扩展“vscode-extension”已被激活！')
  console.log(vscode)

  helloWorld(context)
  openBlog(context)
  newFile(context)

  statusBar(context)
  log(context)
  hover(context)
  webview(context)
}

export function deactivate() {}
