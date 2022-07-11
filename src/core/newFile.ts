import * as vscode from 'vscode'
import * as fs from 'fs'
import { sep } from 'path'

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('vscode-extension.newFile', async (uri: vscode.Uri) => {
    vscode.window.showQuickPick(['js', 'ts'], {}).then(async (item) => {
      console.log(uri?.fsPath)
      if (!uri?.fsPath) {
        return
      }

      const filename = `${uri.fsPath}${sep}demo.${item}`
      if (fs.existsSync(filename)) {
        vscode.window.showErrorMessage(`文件${filename}已存在`)
        return
      }

      fs.writeFile(filename, '', () => {
        vscode.window.showInformationMessage(`demo.${item}已创建`)
        vscode.window.showTextDocument(vscode.Uri.file(filename), {
          viewColumn: vscode.ViewColumn.Two, // 显示在第二个编辑器窗口
        })
      })
    })
  })
  context.subscriptions.push(disposable)
}
