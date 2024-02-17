# Resources

## Key documentation

#### Must know info for builders

### Things to read:

- [BOS Docs](https://docs.near.org/bos/overview)
- [NEAR: Anatomy of a Component](https://docs.near.org/bos/api/state)

### Things to watch:

- [Building Anything with Everything](https://www.youtube.com/watch?v=DukrdJtZtSU&list=PLfhNHA8XzVu47dMbIk83W0WE5Krn3uhyG&index=19)
- [Putting Components Inside of Social Posts](https://www.youtube.com/watch?v=YHvUE34WI5A)

## Existing Components

#### Fork, customize, embed, get inspired

- [Social Components Library](https://near.social/mob.near/widget/N.Library)
- [BOS Hacks Component Library](https://www.boshacks.com/#/ndcplug.near/widget/BOSHACKS.Index?tab=resources)
- [NEAR Builders Component Library](https://www.nearbuilders.org/buildhub.near/widget/components.Library) (example using modules)
- [everything.dev](https://everything.dev/) (collection of apps on sidebar)
- [Events Calendar Widget](https://near.social/itexpert120-contra.near/widget/Events)
- [Discover Groups Widget](https://near.social/devs.near/widget/every.group)

## Tools

#### Get your picks and shovels here

- [bos-loader](https://github.com/near/bos-loader/tree/main)
  - Serves a local directory of component files as a JSON payload properly formatted to be plugged into a BOS `redirectMap`. When paired with a viewer configured to call out to this loader, it enables local component development—especially when working on multiple components in parallel.
- [bos-cli-rs](https://github.com/bos-cli-rs/bos-cli-rs)
  - Component syncing and CI/CD. Ability to download and deploy widgets, as well as make calls to the social contract.
- [bos-component-ts-starter](https://github.com/frol/bos-component-ts-starter/blob/main/README.md)
  - Transpiles TSX to JSX using sucrase. Also, automatically returns the `export default function` as BOS component, so you don't need to have a free-standing `return <MyComponent props={props} />` statement at the end of your file.
- [bos-workspace](https://github.com/NEARBuilders/bos-workspace)
  - like bos-loader, but more feature-rich. Starts a local gateway, supports Typescript (instead of ts-starter), has hot reload, local widget development in favorite text editor.

### Getting started with bos-workspace

Install [create-bos-app](https://github.com/archetype-org/create-bos-app)

```
pnpm add -g @archetype-org/create-bos-app
```

After installing, run the CLI to start your app, switch to the app directory, and start up the dev environment

```
create-bos-app
cd app
yarn dev
```

Note: bos-workspace has a new version coming out.
Feedback wanted on [bos-workspace v1](https://github.com/NEARBuilders/bos-workspace/pull/51). This will combine `create-bos-app` and `bos-workspace`.

## Current Build DAO

#### Works in progress - builders wanted

- [Build DAO Gateway](https://github.com/orgs/NEARBuilders/projects/6)
  - Jas, Megha, Emmanuel, and LIT Collective
- [SDKs and Component Libraries](https://docs.google.com/document/d/1jAGEuwlf5w-p_D4WZ0b1bYw55nwsRFuye2s6S6nexF4/edit#heading=h.fv44uv40vzp8)
  - Matt, Zeeshan, and Manza
  - [Lens SDK](https://docs.google.com/document/d/152w5HqoohSYAgqpknwjjZwUi_xP9vbaK1iWU16Zhw8c/edit)
  - [About VM.require](https://near.social/mob.near/widget/MainPage.N.Post.Page?accountId=sdks.near&blockHeight=109924527)
  - [SDKs](https://near.social/sdks.near/widget/SDKs.App.Pages.Home)
  - [Background/Context of libraries](https://near.social/devhub.near/widget/app?page=post&id=380)
- [Archetype](https://www.archetype.computer/), ([Proposal](https://gov.near.org/t/proposal-archetype-funding-request/37606)) BOS Component Attestation Registry
  - Seth, AJ, and Cory
- [Hyperfiles](https://hypefiles.org), ([Proposal](https://gov.near.org/t/proposal-hyperfiles-funding-request-february-2024/37557)) self-organizing on-chain knowledge graph
  - Elijah
- [DevRel / Build City](https://docs.google.com/document/d/1dwaUaVGdQJyvAJ1Za5GR3szV4yl1TOFbakRFW73iLW0/edit#heading=h.lgbgbf6pgg93) reaching builders across North America
  - Dawn, Tony, and community builders
- [everything.dev](https://github.com/orgs/near-everything/projects/1)
  - Everyone

## Writings

#### Motivation, inspiration, reflection, innovation

- [The past, present, and future of Near Social](https://mob.near.social/)
- [Why Chain Abstraction Is the Next Frontier for Web3](https://pages.near.org/blog/why-chain-abstraction-is-the-next-frontier-for-web3/)
- [Self-Sovereignty Is NEAR: A Vision for Our Ecosystem](https://pages.near.org/blog/self-sovereignty-is-near-a-vision-for-our-ecosystem)
