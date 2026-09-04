import {
  siAngular, siApachekafka, siBitbucket, siClaude, siCss, siDocker, siExpress, siFigma, siGithub, siGithubactions,
  siGithubcopilot, siGitlab, siGooglecloud, siGraphql, siHtml5, siJasmine, siJavascript, siJenkins, siJest, siJira,
  siModelcontextprotocol, siMocha, siMongodb, siMysql, siNgrx, siNodedotjs, siPostgresql, siPostman, siPython,
  siRabbitmq, siReactivex, siRedis, siSocketdotio, siSwagger, siTypescript,
  type SimpleIcon,
} from 'simple-icons';
import {
  Bot, Boxes, Braces, Cloud, CloudUpload, Database, LayoutGrid, MessageSquare, Network, Puzzle, Server, Sparkles, Zap,
  type IconNode,
} from 'lucide';

/**
 * Technology glyphs for the stack explorer.
 * Brand marks come from Simple Icons (rendered monochrome via currentColor,
 * with the brand hex exposed as a CSS variable for hover tinting). Concepts
 * and brands without a mark use neutral Lucide glyphs.
 */
const brands: Record<string, SimpleIcon> = {
  angular: siAngular, apachekafka: siApachekafka, bitbucket: siBitbucket, claude: siClaude, css: siCss, docker: siDocker,
  express: siExpress, figma: siFigma, github: siGithub, githubactions: siGithubactions, githubcopilot: siGithubcopilot,
  gitlab: siGitlab, googlecloud: siGooglecloud, graphql: siGraphql, html5: siHtml5, jasmine: siJasmine,
  javascript: siJavascript, jenkins: siJenkins, jest: siJest, jira: siJira, modelcontextprotocol: siModelcontextprotocol,
  mocha: siMocha, mongodb: siMongodb, mysql: siMysql, ngrx: siNgrx, nodedotjs: siNodedotjs, postgresql: siPostgresql,
  postman: siPostman, python: siPython, rabbitmq: siRabbitmq, reactivex: siReactivex, redis: siRedis,
  socketdotio: siSocketdotio, swagger: siSwagger, typescript: siTypescript,
};

const glyphs: Record<string, IconNode> = {
  bot: Bot, boxes: Boxes, braces: Braces, cloud: Cloud, 'cloud-upload': CloudUpload, database: Database,
  'layout-grid': LayoutGrid, 'message-square': MessageSquare, network: Network, puzzle: Puzzle, server: Server,
  sparkles: Sparkles, zap: Zap,
};

function lucideSvg(node: IconNode): string {
  const inner = node.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('');
  return `<svg class="tech-icon tech-icon--glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

/** Returns an inline SVG for an icon key such as `nodedotjs` or `lucide:server`. */
export function techIcon(key: string): string {
  if (key.startsWith('lucide:')) {
    const node = glyphs[key.slice(7)];
    return node ? lucideSvg(node) : '';
  }
  const b = brands[key];
  if (!b) return '';
  return `<svg class="tech-icon tech-icon--brand" viewBox="0 0 24 24" style="--brand:#${b.hex}" aria-hidden="true"><path d="${b.path}" fill="currentColor"/></svg>`;
}
