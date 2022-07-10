import * as vscode from 'vscode'
import * as os from 'os'

class MyCompletionItemProvider implements vscode.CompletionItemProvider {
  private position?: vscode.Position

  constructor() {}

  // 提供代码提示的候选项
  public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
    this.position = position
    const snippetCompletion = new vscode.CompletionItem('log', vscode.CompletionItemKind.Operator)
    snippetCompletion.documentation = new vscode.MarkdownString('quick console.log result')

    return [snippetCompletion]
  }

  // 光标选中当前自动补全item时触发动作
  public resolveCompletionItem(item: vscode.CompletionItem) {
    const label = item.label
    if (this.position && typeof label === 'string') {
      item.command = {
        command: 'kuizuo-plugin.log',
        title: 'refactor',
        arguments: [this.position.translate(0, label.length + 1)], // 这里可以传递参数给该命令
      }
    }

    return item
  }
}

export function activate(context: vscode.ExtensionContext) {
  const commandId = 'kuizuo-plugin.log'
  const commandHandler = (editor: vscode.TextEditor, edit: vscode.TextEditorEdit, position: vscode.Position) => {
    const lineText = editor.document.lineAt(position.line).text
    // match case name.log etc.
    const matchVarReg = new RegExp(`\(\[^\\s\]*\[^\'\"\`\]\).${'log'}$`)
    // match case 'name'.log etc.  /(['"`])([^'"])\1.log/
    const matchStrReg = new RegExp(`\(\[\'\"\`\]\)\(\[^\'\"\`\]*\)\\1\.${'log'}$`)
    let matchFlag: 'var' | 'str' = 'var'
    let text,
      key,
      quote = "'",
      insertVal = ''
    ;[text, key] = lineText.match(matchVarReg) || []
    if (!key) {
      ;[text, quote, key] = lineText.match(matchStrReg) || []
      matchFlag = 'str'
    }
    // if matched
    if (key) {
      const index = lineText.indexOf(text)
      edit.delete(new vscode.Range(position.with(undefined, index), position.with(undefined, index + text.length)))
      if (matchFlag === 'var' && key.includes("'")) {
        quote = '"'
      }
      // format like console.log("xxx", xxx)
      if (matchFlag === 'var') {
        //  only console.log(xxx)
        insertVal = `${'console.log'}(${key})`
      }
      // if key is string format like console.log("xxx")
      if (matchFlag === 'str') {
        insertVal = `${'console.log'}(${quote}${key}${quote})`
      }

      edit.insert(position.with(undefined, index), insertVal)
    }

    return Promise.resolve([])
  }
  context.subscriptions.push(vscode.commands.registerTextEditorCommand(commandId, commandHandler))

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      'kuizuo-plugin.insertLog',
      (editor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
        // 获取选中代码 在其下方插入 console.log(xxx)
        const { selection, selections } = editor
        // 选中多个代码时
        if (selections.length > 1) {
          return
        }

        // 如果不是当行代码
        if (!selection.isSingleLine) {
          return
        }

        const lineEnd = editor.document.lineAt(editor.selection.end).range.end
        const value = editor.document.getText(selection)
        const insertVal = `${os.EOL}${'console.log'}('${value}', ${value})`

        edit.insert(lineEnd, insertVal)
        editor.selection = new vscode.Selection(lineEnd, lineEnd) // 重置选中区域 重置光标
        return Promise.resolve([])
      },
    ),
  )

  const disposable = vscode.languages.registerCompletionItemProvider(
    ['html', 'javascript', 'javascriptreact', 'typescript', 'typescriptreact', 'vue'],
    new MyCompletionItemProvider(),
    '.', // 注册代码建议提示，只有当按下“.”时才触发
  )

  context.subscriptions.push(disposable)
}
