import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('ei.findContextFiles', async () => {
    if (!vscode.workspace.workspaceFolders) {
      vscode.window.showErrorMessage('Open a workspace folder first.');
      return;
    }

    try {
      const matches = await vscode.workspace.findFiles(
				'**/*{ai,AI,context,Context,prompt,Prompt,claude,Claude,instruction,instructions,agent,agents,guide,guides,doc,docs,documentation}*.md',
				'**/node_modules/**',
				50
			);

      if (!matches.length) {
        vscode.window.showInformationMessage('No AI context files found in workspace.');
        return;
      }

      const pick = await vscode.window.showQuickPick(
        matches.map(uri => ({
          label: vscode.workspace.asRelativePath(uri),
          uri
        })),
        { placeHolder: 'Select a context file to open' }
      );

      if (!pick) {return;}

      const doc = await vscode.workspace.openTextDocument(pick.uri);
      await vscode.window.showTextDocument(doc, { preview: false });

      const snippet = doc.getText().slice(0, 200).replace(/\r?\n/g, ' ');
      vscode.window.showInformationMessage(`Opened ${pick.label}: ${snippet}...`);
    } catch (err) {
      vscode.window.showErrorMessage('Error while searching for context files: ' + String(err));
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
