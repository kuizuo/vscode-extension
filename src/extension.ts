import * as vscode from 'vscode'
import { activate as openBlog } from './core/openBlog'

export function activate(context: vscode.ExtensionContext) {
  console.log('扩展“kuizuo-plugin”已被激活！')
  console.log(vscode)

  openBlog(context)

  let disposable = vscode.commands.registerCommand('kuizuo-plugin.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from kuizuo-plugin!')
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
