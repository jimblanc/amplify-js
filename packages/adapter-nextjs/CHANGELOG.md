# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 1.1.0 (2023-11-01)

### Bug Fixes

- **adapter-nextjs:** add api dir to the distribution list ([6b2d06b](https://github.com/jimblanc/amplify-js/commit/6b2d06b78eb5430f958bc59e7048cb47eb824595))
- **adapter-nextjs:** align with js-cookie on the client handling double encoded cookie names ([#12280](https://github.com/jimblanc/amplify-js/issues/12280)) ([a08bf5c](https://github.com/jimblanc/amplify-js/commit/a08bf5c80deade5dff10a80f7d2de653ee9f8319))
- **adapter-nextjs:** correct the wrong directory included in distribution ([6095a4e](https://github.com/jimblanc/amplify-js/commit/6095a4e7c34c974c1c2788b21562f7585d632cd0))
- **adapter-nextjs:** ensure to use meaningful exception on config resolution ([b06a7e4](https://github.com/jimblanc/amplify-js/commit/b06a7e46fa61aebbae24dfd9cf66f36886e07179))
- **adapter-nextjs:** getAmplifyConfig may not return config in the pages router ([#12011](https://github.com/jimblanc/amplify-js/issues/12011)) ([50b0deb](https://github.com/jimblanc/amplify-js/commit/50b0debc69689135cd8a1f92a548f468f340e5ea))
- **adapter-nextjs:** remove the constraint of calling createServerRunner only once ([091f681](https://github.com/jimblanc/amplify-js/commit/091f681b502cfee7ae4df178388cea052d7eb9fb))
- **adapter-nextjs:** remove usage of node http ([#11970](https://github.com/jimblanc/amplify-js/issues/11970)) ([64e86c6](https://github.com/jimblanc/amplify-js/commit/64e86c663d4d5d2cd6f55797466325f1efe9dfc5))
- **adapter-nextjs:** update the cookie name encoding function ([40b8f7e](https://github.com/jimblanc/amplify-js/commit/40b8f7e8be163b8ccd62c8ccdfe60b396be64cc7))
- **adapter:** fix the runWithAmplifyServerContext operation return type ([13f23a2](https://github.com/jimblanc/amplify-js/commit/13f23a237446572c7d76370d77d7cb83adc32007))
- **storage|aws-amplify:** export server apis from the subpaths ([#11910](https://github.com/jimblanc/amplify-js/issues/11910)) ([23fa46a](https://github.com/jimblanc/amplify-js/commit/23fa46a9c714273449861baf12bfa6a2ebd1ce9e))
- Update test references to removed export ([#12042](https://github.com/jimblanc/amplify-js/issues/12042)) ([c39db56](https://github.com/jimblanc/amplify-js/commit/c39db561ec6b866aea491246dbba3ddf5439d2f3))

### Features

- **adapter-core:** initial implementation of adapter-nextjs ([0093374](https://github.com/jimblanc/amplify-js/commit/0093374730a18b6434db98ed2064286b8d007906))
- **adapter-nextjs:** remove the need of calling parseAmplifyConfig in withAmplify ([c2a98db](https://github.com/jimblanc/amplify-js/commit/c2a98db38ed81e5cd539bf333265203c9dfe1151))
- change JS target to ES2020 ([#12365](https://github.com/jimblanc/amplify-js/issues/12365)) ([381b201](https://github.com/jimblanc/amplify-js/commit/381b2010afb0ca72d392307d4da64af3ca146d6f))
- ssr support for graphql ([#12430](https://github.com/jimblanc/amplify-js/issues/12430)) ([6f4d984](https://github.com/jimblanc/amplify-js/commit/6f4d98474db133959560232e3e4804ca84c4ba89))

## 0.0.1

The initial implementation of the adapter supporting using Amplify in Next.js.
