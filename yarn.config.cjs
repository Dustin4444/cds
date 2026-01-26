/** @type {import('@yarnpkg/types')} */
const { defineConfig } = require('@yarnpkg/types');

// Optional dependencies are still considered of type "dependencies"
// This function finds if a dependency is optional by checking the workspace manifest optionalDependencies.
const isOptionalDependency = (dependency) => {
  return (
    Object.keys(dependency.workspace.manifest.optionalDependencies ?? {}).find(
      (optionalDependency) => optionalDependency === dependency.ident,
    ) !== undefined
  );
};

/**
 * Workspaces that are excluded from dependency version consistency checks.
 * These packages are allowed to have different versions of dependencies
 * for specific testing or compatibility purposes.
 */
const CONSTRAINT_EXCLUDED_WORKSPACES = new Set([
  // This app validates React 18 compatibility and must stay on React 18
  // even when other packages upgrade to React 19
  'react18-compat-test',
]);

/**
 * Checks if a workspace is excluded from consistency constraints.
 * @param {import('@yarnpkg/types').Yarn.Constraints.Dependency} dependency
 * @returns {boolean}
 */
const isExcludedWorkspace = (dependency) => {
  return CONSTRAINT_EXCLUDED_WORKSPACES.has(dependency.workspace.ident);
};

/**
 * This rule will enforce that a workspace MUST depend on the same version of
 * a dependency as the one used by the other workspaces.
 *
 * @param {import('@yarnpkg/types').Yarn.Constraints.Context} context
 */
const enforceConsistentDependenciesAcrossTheProject = ({ Yarn }) => {
  for (const dependency of Yarn.dependencies()) {
    if (dependency.type === `peerDependencies`) continue;
    // There's a bug in yarn constraint dependency.update where the update function expects
    // the dependency to be part of dependencies instead of optionalDependencies.
    if (isOptionalDependency(dependency)) continue;
    // Skip workspaces that are excluded from consistency checks
    if (isExcludedWorkspace(dependency)) continue;
    for (const otherDependency of Yarn.dependencies({ ident: dependency.ident })) {
      if (otherDependency.type === `peerDependencies`) continue;
      // Don't enforce consistency with excluded workspaces
      if (isExcludedWorkspace(otherDependency)) continue;
      dependency.update(otherDependency.range);
    }
  }
};

/**
 * This rule will enforce that a workspace MUST depend on the local "workspace:^"
 * version of a dependency if it exists.
 *
 * @param {import('@yarnpkg/types').Yarn.Constraints.Context} context
 */
const enforceWorkspaceDependenciesWhereAvailable = ({ Yarn }) => {
  for (const workspace of Yarn.workspaces()) {
    for (const workspacePackageDependency of Yarn.dependencies({ ident: workspace.ident })) {
      if (workspacePackageDependency.type === 'peerDependencies') continue;
      workspacePackageDependency.update('workspace:^');
    }
  }
};

module.exports = defineConfig({
  async constraints(context) {
    enforceConsistentDependenciesAcrossTheProject(context);
    enforceWorkspaceDependenciesWhereAvailable(context);
  },
});
