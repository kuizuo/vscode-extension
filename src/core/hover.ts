import * as vscode from 'vscode'

function provideHover(document: vscode.TextDocument, position: vscode.Position) {
  const word = document.getText(document.getWordRangeAtPosition(position))

  if (new RegExp(`kuizuo`, 'mi').test(word)) {
    // 支持markdown语法
    return new vscode.Hover(`**🎉You find me!**`)
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(['json', 'jsonc'], {
      provideHover,
    }),
  )
}
