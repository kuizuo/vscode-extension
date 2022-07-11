import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

/**
 * 从某个HTML文件读取能被Webview加载的HTML内容
 * @param {*} context 上下文
 * @param {*} templatePath 相对于插件根目录的html文件相对路径
 */
function getWebViewContent(context: vscode.ExtensionContext, templatePath: string) {
  const resourcePath = path.join(context.extensionPath, templatePath)
  const dirPath = path.dirname(resourcePath)
  let html = fs.readFileSync(resourcePath, 'utf-8')
  // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
  html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
    return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"'
  })
  return html
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('kuizuo-plugin.openWebview', (uri) => {
      // 创建webview
      const panel = vscode.window.createWebviewPanel(
        'blogWebview', // viewType
        '愧怍的小站', // 视图标题
        vscode.ViewColumn.Beside, // 显示在编辑器的哪个部位
        {
          enableScripts: true, // 启用JS，默认禁用
          retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
        },
      )
      panel.webview.html = getWebViewContent(context, '/view/blog.html')
    }),
  )
}
