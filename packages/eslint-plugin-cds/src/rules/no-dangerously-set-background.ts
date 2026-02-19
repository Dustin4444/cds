import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

export const RULE_NAME = 'no-dangerously-set-background';

type MessageIds = 'usePreferredApi';

const CDS_PACKAGE_PREFIXES = ['@coinbase/cds-web', '@coinbase/cds-mobile'];

const INTERACTABLE_PRESSABLE_OR_BUTTON = new Set(['Interactable', 'Pressable', 'Button']);
const CARD_COMPONENTS = new Set(['MessagingCard', 'MediaCard', 'DataCard']);

function getComponentName(nameNode: TSESTree.JSXTagNameExpression): string | null {
  if (nameNode.type === 'JSXIdentifier') {
    return nameNode.name;
  }
  if (nameNode.type === 'JSXMemberExpression') {
    const property = nameNode.property.type === 'JSXIdentifier' ? nameNode.property.name : null;
    return property ?? null;
  }
  return null;
}

function getImportLocalName(nameNode: TSESTree.JSXTagNameExpression): string | null {
  if (nameNode.type === 'JSXIdentifier') {
    return nameNode.name;
  }
  if (nameNode.type === 'JSXMemberExpression') {
    return nameNode.object.type === 'JSXIdentifier' ? nameNode.object.name : null;
  }
  return null;
}

function isCdsImportSource(source: string): boolean {
  return CDS_PACKAGE_PREFIXES.some(
    (prefix) => source === prefix || source.startsWith(`${prefix}/`),
  );
}

function hasRenderAsPressableTrue(attributes: TSESTree.JSXAttribute[]): boolean {
  const attr = attributes.find(
    (a) =>
      a.type === 'JSXAttribute' &&
      a.name.type === 'JSXIdentifier' &&
      a.name.name === 'renderAsPressable',
  );
  if (!attr) {
    return false;
  }
  if (!attr.value) {
    return true;
  }
  if (attr.value.type !== 'JSXExpressionContainer') {
    return false;
  }
  const expr = attr.value.expression;
  return expr.type === 'Literal' && expr.value === true;
}

/**
 * Warns when dangerouslySetBackground is used on Interactable, Pressable, Button, or
 * Card components (MessagingCard, MediaCard, DataCard with renderAsPressable true). Use blendStyles.background
 * so the interactable displays the correct color in hovered, pressed, and
 * disabled states.
 */
export const noDangerouslySetBackground: TSESLint.RuleModule<MessageIds> = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow dangerouslySetBackground on Interactable, Pressable, Button, and Card components (MessagingCard, MediaCard, DataCard when renderAsPressable is true). Use blendStyles.background so the interactable displays the correct color in hovered, pressed, and disabled states.',
    },
    messages: {
      usePreferredApi:
        'Use blendStyles.background instead so the interactable displays the correct color in hovered, pressed, and disabled states.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context: TSESLint.RuleContext<MessageIds, []>) {
    const importedFromCds: Record<string, string> = {};
    const canonicalNameByLocalName: Record<string, string> = {};

    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        const source = typeof node.source.value === 'string' ? node.source.value : null;
        if (source === null || !isCdsImportSource(source)) {
          return;
        }
        for (const specifier of node.specifiers) {
          if (
            specifier.type === 'ImportSpecifier' ||
            specifier.type === 'ImportDefaultSpecifier' ||
            specifier.type === 'ImportNamespaceSpecifier'
          ) {
            const localName = specifier.local.name;
            importedFromCds[localName] = source;
            canonicalNameByLocalName[localName] =
              specifier.type === 'ImportSpecifier' && specifier.imported.type === 'Identifier'
                ? specifier.imported.name
                : localName;
          }
        }
      },
      JSXOpeningElement(node: TSESTree.JSXOpeningElement) {
        const dangerouslySetBackgroundAttr = node.attributes.find(
          (attr): attr is TSESTree.JSXAttribute =>
            attr.type === 'JSXAttribute' &&
            attr.name.type === 'JSXIdentifier' &&
            attr.name.name === 'dangerouslySetBackground',
        );

        if (!dangerouslySetBackgroundAttr) {
          return;
        }

        const importLocalName = getImportLocalName(node.name);
        if (importLocalName === null) {
          return;
        }

        const source = importedFromCds[importLocalName];
        if (!source || !isCdsImportSource(source)) {
          return;
        }

        const canonicalName = canonicalNameByLocalName[importLocalName] ?? importLocalName;
        const nameForSetCheck =
          node.name.type === 'JSXMemberExpression' ? getComponentName(node.name) : canonicalName;
        if (nameForSetCheck === null) {
          return;
        }

        if (INTERACTABLE_PRESSABLE_OR_BUTTON.has(nameForSetCheck)) {
          context.report({
            node: dangerouslySetBackgroundAttr,
            messageId: 'usePreferredApi',
          });
          return;
        }

        if (CARD_COMPONENTS.has(nameForSetCheck)) {
          const jsxAttrs = node.attributes.filter(
            (a): a is TSESTree.JSXAttribute => a.type === 'JSXAttribute',
          );
          if (!hasRenderAsPressableTrue(jsxAttrs)) {
            return;
          }
          context.report({
            node: dangerouslySetBackgroundAttr,
            messageId: 'usePreferredApi',
          });
        }
      },
    };
  },
};
