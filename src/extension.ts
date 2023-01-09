import * as vscode from 'vscode';
import {BuildOnSaveExtension} from './build-on-save';

export function activate(context: vscode.ExtensionContext): BuildOnSaveExtension {
	console.log('Congratulations, your extension "react-build-on-save" is now active!');

	let extension = new BuildOnSaveExtension(context)

	context.subscriptions.push(
		// vscode.workspace.onDidChangeConfiguration(() => {
		// 	extension.loadConfig()
		// }),

		vscode.commands.registerCommand('extension.enableReactBuildOnSave', () => {
			extension.setEnabled(true)
		}),

		vscode.commands.registerCommand('extension.disableReactBuildOnSave', () => {
			extension.setEnabled(false)
		}),

		vscode.commands.registerCommand('extension.doReactTapAndBuild', () => {
			extension.buildBecauseTap()
		}),

		vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
			extension.onDocumentSaved(document)
		}),
	)

	return extension


	// let disposable = vscode.commands.registerCommand('react-build-on-save.helloWorld', () => {
	// 	vscode.window.showInformationMessage('Hello World from React: build on save!');
	// });

	// context.subscriptions.push(disposable);
}

export function deactivate() {}
