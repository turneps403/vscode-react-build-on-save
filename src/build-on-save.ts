// import {exec, ChildProcess} from 'child_process'
import * as vscode from 'vscode'
import * as path from 'path';
// import {RawCommand, CommandProcessor, BackendCommand, TerminalCommand, VSCodeCommand} from './command-processor'
// import {timeout} from './util'


// export interface Configuration {
// 	statusMessageTimeout: number
// 	shell: String
// 	commands: RawCommand
// }

export class BuildOnSaveExtension {

	private config!: vscode.WorkspaceConfiguration
	private context: vscode.ExtensionContext
	private channel: vscode.OutputChannel = vscode.window.createOutputChannel('React: build on save')
	// private commandProcessor: CommandProcessor = new CommandProcessor()

	constructor(context: vscode.ExtensionContext) {
		this.context = context
		this.loadConfig()
		this.showEnablingChannelMessage()

		context.subscriptions.push(this.channel)
	}

	// /** Load or reload configuration. */
	private loadConfig() {
		this.config = vscode.workspace.getConfiguration('runOnSave')
		// this.commandProcessor.setRawCommands(<RawCommand[]>this.config.get('commands') || [])
	}

	private showEnablingChannelMessage () {
		let message = `Build on Save is ${this.getEnabled() ? 'enabled' : 'disabled'}`
		this.showChannelMessage(message)
		// this.showStatusMessage(message)
	}

	private showChannelMessage(message: string) {
		this.channel.appendLine(message)
	}
	
	getEnabled(): boolean {
		return !!this.context.globalState.get('enabled', true)
	}

	setEnabled(enabled: boolean) {
		this.context.globalState.update('enabled', enabled)
		this.showEnablingChannelMessage()
	}

	buildBecauseTap() {
		const editor = vscode.window.activeTextEditor
		if (!editor) {
		  vscode.window.showInformationMessage('editor does not exist')
		  return
		}
		
		// const path = editor.document.uri.fsPath
		let fpath = path.dirname(editor.document.uri.fsPath);
		fpath = path.dirname(fpath);
		const workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri)

		let message = `YOUR-EXTENSION: folder: ${workspaceFolder?.uri.path} \n ${fpath} \n ${workspaceFolder?.uri.path == fpath}` ;
		vscode.window.showInformationMessage(message);
		// let timeout = 1000
		// let disposable = vscode.window.setStatusBarMessage("foo bar..", timeout)
		// this.context.subscriptions.push(disposable)
	}

	private showStatusMessage(message: string, timeout?: number) {
		timeout = timeout || this.config.get('statusMessageTimeout') || 3000
		let disposable = vscode.window.setStatusBarMessage(message, timeout)
		this.context.subscriptions.push(disposable)
	}

	// /** Returns a promise it was resolved firstly and then save document. */
	// async onWillSaveDocument(document: vscode.TextDocument) {
	// 	if (!this.getEnabled()) {
	// 		return
	// 	}

	// 	let commandsToRun = this.commandProcessor.prepareCommandsForFileBeforeSaving(document.fileName)
	// 	if (commandsToRun.length > 0) {
	// 		await this.runCommands(commandsToRun)
	// 	}
	// }

	async onDocumentSaved(document: vscode.TextDocument) {
		if (!this.getEnabled()) {
			return
		}

		// /Users/i.sivirinov/Develop/js/helloworld/CHANGELOG.md
		console.log('File was saved:', document.fileName, "uri:", document.uri.path);
		vscode.window.showInformationMessage('File was saved:', document.fileName, "uri:", document.uri.path);

		if(vscode.workspace.workspaceFolders !== undefined) {
		let wf = vscode.workspace.workspaceFolders[0].uri.path ;
		let f = vscode.workspace.workspaceFolders[0].uri.fsPath ; 
			// /Users/i.sivirinov/Develop/js/helloworld
		let message = `YOUR-EXTENSION: folder: ${wf} - ${f}` ;
		vscode.window.showInformationMessage(message);
		

			let timeout = 3000
			let disposable = vscode.window.setStatusBarMessage(message, timeout)
			this.context.subscriptions.push(disposable)

		}


		// let commandsToRun = this.commandProcessor.prepareCommandsForFileAfterSaving(document.fileName)
		// if (commandsToRun.length > 0) {
		// 	await this.runCommands(commandsToRun)
		// }
	}

	// private async runCommands(commands: (BackendCommand | TerminalCommand | VSCodeCommand)[]) {
	// 	let promises: Promise<void>[] = []
	// 	// let syncCommands = commands.filter(c => !c.async)
	// 	let asyncCommands = commands.filter(c => c.async)

	// 	// Run commands in a parallel.
	// 	for (let command of asyncCommands) {
	// 		let promise = this.runACommand(command)
	// 		promises.push(promise)
	// 	}

	// 	// // Run commands in series.
	// 	// for (let command of syncCommands) {
	// 	// 	await this.runACommand(command)
	// 	// }

	// 	await Promise.all(promises)
	// }

	// private runACommand(command: BackendCommand | TerminalCommand | VSCodeCommand): Promise<void> {
	// 	// if (command.runIn === 'backend') {
	// 		return this.runBackendCommand(command)
	// 	// }
	// 	// else if (command.runIn === 'terminal') {
	// 	// 	return this.runTerminalCommand(command)
	// 	// }
	// 	// else {
	// 	// 	return this.runVSCodeCommand(command)
	// 	// }
	// }

	// private runBackendCommand(command: BackendCommand) {
	// 	return new Promise((resolve) => {
	// 		this.showChannelMessage(`Running "${command.command}"`)

	// 		// if (command.runningStatusMessage) {
	// 		// 	this.showStatusMessage(command.runningStatusMessage, command.statusMessageTimeout)
	// 		// }
	
	// 		let child = this.execShellCommand(command.command, command.workingDirectoryAsCWD ?? true)
	// 		child.stdout.on('data', data => this.channel.append(data.toString()))
	// 		child.stderr.on('data', data => this.channel.append(data.toString()))
	
	// 		child.on('exit', (e) => {
	// 			// if (e === 0 && command.finishStatusMessage) {
	// 			// 	this.showStatusMessage(command.finishStatusMessage, command.statusMessageTimeout)
	// 			// }
	
	// 			if (e !== 0) {
	// 				this.channel.show(true)
	// 			}

	// 			resolve()
	// 		})
	// 	}) as Promise<void>
	// }

	// private execShellCommand(command: string, workingDirectoryAsCWD: boolean): ChildProcess {
	// 	let cwd = workingDirectoryAsCWD ? vscode.workspace.rootPath : undefined

	// 	// let shell = this.getShellPath()
	// 	// if (shell) {
	// 	// 	return exec(command, {
	// 	// 		shell,
	// 	// 		cwd,
	// 	// 	})
	// 	// }
	// 	// else {
	// 		return exec(command, {
	// 			cwd,
	// 		})
	// 	// }
	// }

	// private getShellPath(): string | undefined {
	// 	return this.config.get('shell') || undefined
	// }

	// private async runTerminalCommand(command: TerminalCommand) {
	// 	let terminal = this.createTerminal()

	// 	terminal.show()
	// 	terminal.sendText(command.command)

	// 	await timeout(100)
	// 	await vscode.commands.executeCommand("workbench.action.focusActiveEditorGroup")
	// }

	// private createTerminal(): vscode.Terminal {
	// 	let terminalName = 'Run on Save'
	// 	let terminal = vscode.window.terminals.find(terminal => terminal.name === terminalName)

	// 	if (!terminal) {
	// 		this.context.subscriptions.push(terminal = vscode.window.createTerminal(terminalName, this.getShellPath()))
	// 	}

	// 	return terminal
	// }

	// private async runVSCodeCommand(command: VSCodeCommand) {
	// 	// finishStatusMessage have to be hooked to exit of command execution
	// 	this.showChannelMessage(`Running "${command.command}"`)

	// 	await vscode.commands.executeCommand(command.command)
	// }
}