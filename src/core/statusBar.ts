import * as vscode from 'vscode'

let myStatusBarItem: vscode.StatusBarItem

export function activate(context: vscode.ExtensionContext) {
  vscode.window.setStatusBarMessage('开始您的编程之旅！', 5000)
  const myCommandId = 'kuizuo-plugin.showStatusBarItem'
  context.subscriptions.push(
    vscode.commands.registerCommand(myCommandId, () => {
      const n = getNumberOfSelectedLines(vscode.window.activeTextEditor)
      vscode.window.showInformationMessage(`Yeah, ${n} line(s) selected... Keep going!`)
    }),
  )

  myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
  myStatusBarItem.command = myCommandId
  context.subscriptions.push(myStatusBarItem)
  myStatusBarItem.show()
  context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem))
  context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem))

  updateStatusBarItem()
}

function updateStatusBarItem(): void {
  const n = getNumberOfSelectedLines(vscode.window.activeTextEditor)
  if (n > 0) {
    myStatusBarItem.text = `$(megaphone) ${n} line(s) selected`
    myStatusBarItem.tooltip = `Yeah, ${n} line(s) selected... Keep going!`
    myStatusBarItem.show()
  } else {
    myStatusBarItem.hide()
  }
}

function getNumberOfSelectedLines(editor: vscode.TextEditor | undefined): number {
  let lines = 0
  if (editor) {
    lines = editor.selections.reduce((prev, curr) => prev + (curr.end.line - curr.start.line), 0)
  }
  return lines
}
