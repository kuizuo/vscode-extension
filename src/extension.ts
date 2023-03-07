import * as vscode from 'vscode'
import { activate as openBlog } from './core/openBlog'
import { activate as statusBar } from './core/statusBar'
import { activate as helloWorld } from './core/helloWorld'
import { activate as hover } from './core/hover'
import { activate as webview } from './core/webview'

export function activate(context: vscode.ExtensionContext) {
  console.log('扩展“vscode-kuizuo”已被激活！')

  helloWorld(context)
  openBlog(context)

  statusBar(context)
  hover(context)
  webview(context)
}

export function deactivate() {}
