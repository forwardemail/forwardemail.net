import { parseArgs } from 'node:util';

import * as commands from './commands.ts';
import { CliError } from './util.ts';

const HELP = `forwardemail-selfhost ${__VERSION__}
Set up and run a small self-hosted Forward Email mail server.

Usage: forwardemail-selfhost <command> [options]

Commands:
  init                     check this box, configure, get a certificate, start
                           and create your first mailbox (step by step)
  provision --email <a>    create an account, domain and mailbox (or a new
            [--domain <d>] password for one that exists) and print DNS records
            [--mailbox <m>]
  dns                      print the DNS records to add
  doctor                   check the DNS records and that the ports are reachable
  status                   show the install and its containers
  up | down                start or stop the mail server
  logs [-f]                show (or follow) the logs
  upgrade [--version <v>]  pull an image version (default: latest) and restart

Options:
  --dir <path>             the install directory (default: ~/forwardemail,
                           or FORWARDEMAIL_DIR)
  -h, --help

Run 'forwardemail-selfhost version' for the CLI's version.
`;

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      dir: { type: 'string' },
      email: { type: 'string' },
      domain: { type: 'string' },
      mailbox: { type: 'string' },
      version: { type: 'string' },
      follow: { type: 'boolean', short: 'f' },
      help: { type: 'boolean', short: 'h' }
    }
  });
  const [command] = positionals;

  if (values.help || !command) return void console.log(HELP);

  switch (command) {
    case 'init':
      return commands.init(values);
    case 'provision':
    case 'add-mailbox':
      if (!values.email) throw new CliError('--email is needed');
      return commands.provision({ ...values, email: values.email });
    case 'dns':
      return commands.dnsCmd(values);
    case 'doctor':
      return commands.doctor(values);
    case 'status':
      return commands.status(values);
    case 'up':
      return commands.up(values);
    case 'down':
      return commands.down(values);
    case 'logs':
      return commands.logs(values);
    case 'upgrade':
      return commands.upgrade(values);
    case 'version':
      return void console.log(__VERSION__);
    default:
      throw new CliError(`Unknown command "${command}"\n\n${HELP}`);
  }
}

main().catch((err: unknown) => {
  if (err instanceof CliError) {
    console.error(`\n✖ ${err.message}`);
    process.exit(1);
  }
  console.error(err);
  process.exit(1);
});
