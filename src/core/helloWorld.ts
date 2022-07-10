import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('kuizuo-plugin.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from kuizuo-plugin!')
  })

  context.subscriptions.push(disposable)
}
