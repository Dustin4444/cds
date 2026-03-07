import { searchIcons } from '@coinbase/cds-mcp-server/iconSearch';
import util from 'node:util';

const usage = `Usage:
  cds search icon <query> [--limit <number>] [--json]
  cds search-icon <query> [--limit <number>] [--json]

Examples:
  cds search icon "shield"
  cds search icon "wallet" --limit 5
  cds search-icon "payment" --json
`;

type CliRunResult = {
  exitCode: number;
  stdout: string;
  stderr?: string;
};

const unknownCommandError = (command: string) =>
  `Unsupported command: "${command}".\n\n${usage}`.trim();

export const runCli = (args: string[]): CliRunResult => {
  let parsedArgs: ReturnType<typeof util.parseArgs>;

  try {
    parsedArgs = util.parseArgs({
      args,
      allowPositionals: true,
      options: {
        help: {
          type: 'boolean',
          short: 'h',
          default: false,
        },
        json: {
          type: 'boolean',
          default: false,
        },
        limit: {
          type: 'string',
          short: 'l',
        },
      },
    });
  } catch (error) {
    return {
      exitCode: 1,
      stdout: '',
      stderr: `${error instanceof Error ? error.message : 'Invalid arguments'}\n\n${usage}`.trim(),
    };
  }

  const { values, positionals } = parsedArgs;

  if (values.help || positionals.length === 0) {
    return {
      exitCode: 0,
      stdout: usage.trim(),
    };
  }

  let queryParts: string[] = [];
  let command = positionals[0];
  let resource = positionals[1];

  if (command === 'search-icon') {
    command = 'search';
    resource = 'icon';
    queryParts = positionals.slice(1);
  } else {
    queryParts = positionals.slice(2);
  }

  if (command !== 'search' || resource !== 'icon') {
    return {
      exitCode: 1,
      stdout: '',
      stderr: unknownCommandError(positionals.join(' ')),
    };
  }

  const query = queryParts.join(' ').trim();

  if (!query) {
    return {
      exitCode: 1,
      stdout: '',
      stderr: `Missing query for icon search.\n\n${usage}`.trim(),
    };
  }

  let parsedLimit: number | undefined;
  if (values.limit !== undefined) {
    if (typeof values.limit !== 'string') {
      return {
        exitCode: 1,
        stdout: '',
        stderr: 'Invalid --limit value. --limit must be a number.',
      };
    }

    parsedLimit = Number.parseInt(values.limit, 10);
    if (Number.isNaN(parsedLimit)) {
      return {
        exitCode: 1,
        stdout: '',
        stderr: `Invalid --limit value "${values.limit}". --limit must be a number.`,
      };
    }
  }

  const response = searchIcons(query, parsedLimit);

  if (values.json) {
    return {
      exitCode: 0,
      stdout: JSON.stringify(response, null, 2),
    };
  }

  if (response.total === 0) {
    return {
      exitCode: 0,
      stdout: `No icons found for "${query}".`,
    };
  }

  const summary =
    response.total > response.results.length
      ? `Found ${response.total} icons for "${query}" (showing ${response.results.length}):`
      : `Found ${response.total} icons for "${query}":`;

  const lines = [
    summary,
    '',
    ...response.results.map((result) => {
      const keywordSection =
        result.matchedKeywords.length > 0
          ? ` | keywords: ${result.matchedKeywords.slice(0, 5).join(', ')}`
          : '';
      const aliasSection =
        result.matchedAliases.length > 0
          ? ` | aliases: ${result.matchedAliases.slice(0, 5).join(', ')}`
          : '';
      return `- ${result.name} (${result.matchedBy.join(', ')})${aliasSection}${keywordSection}`;
    }),
  ];

  return {
    exitCode: 0,
    stdout: lines.join('\n'),
  };
};
