import * as vscode from 'vscode'
import { exec } from 'child_process'
import * as os from 'os'

export async function activate(context?: vscode.ExtensionContext) {
  const key = 'kuizuoPlugin.showTip'
  const showTip = vscode.workspace.getConfiguration().get(key)
  if (showTip) {
    const result = await vscode.window.showInformationMessage('是否要打开愧怍的小站？', '是', '否', '不再提示')
    if (result === '是') {
      const commandLine = os.platform() === 'win32' ? `start https://kuizuo.cn` : `open https://kuizuo.cn`
      exec(commandLine)
    } else if (result === '不再提示') {
      //最后一个参数，为true时表示写入全局配置，为false或不传时则只写入工作区配置
      await vscode.workspace.getConfiguration().update(key, false, true)
    }
  }
}

export function deactivate() {}
