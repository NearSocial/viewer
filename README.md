# NEAR Discovery (BOS)

## Setup & Development

Initialize repo:

```
yarn
```

Start development version:

```
yarn start
```

## Component example

Profile view

```jsx
let accountId = props.accountId || "eugenethedream";
let profile = socialGetr(`${accountId}/profile`);

<div>
  <img src={profile.image.url} />
  <span>{profile.name}</span> <span>(@{accountId})</span>
</div>;
```

Profile editor

```jsx
let accountId = context.accountId;

if (!accountId) {
  return "Please sign in with NEAR wallet";
}

const profile = socialGetr(`${accountId}/profile`);

if (profile === null) {
  return "Loading";
}

initState({
  name: profile.name,
  url: profile.image.url,
});

const data = {
  profile: {
    name: state.name,
    image: {
      url: state.url,
    },
  },
};

return (
  <div>
    <div>account = {accountId}</div>
    <div>
      Name:
      <input type="text" value={state.name} />
    </div>
    <div>
      Image URL:
      <input type="text" value={state.url} />
    </div>
    <div>Preview</div>
    <div>
      <img src={state.url} alt="profile image" /> {state.name}
    </div>
    <div>
      <CommitButton data={data}>Save profile</CommitButton>
    </div>
  </div>
);
```

## Local VM Development

If you need to make changes to the VM and test locally, you can easily link your local copy of the VM:

1. Clone the viewer repo as a sibling of `near-discovery-alpha`:

```
git clone git@github.com:NearSocial/VM.git
```

Folder Structure:

```
/near-discovery-alpha
/VM
```

2. Initialize the `VM` repo and run the link command:

```
cd VM
yarn
yarn link
yarn build
```

3. Run the link command inside `near-discovery-alpha` and start the app:

```
cd ../near-discovery-alpha
yarn link "near-social-vm"
yarn start
```

4. Any time you make changes to the `VM`, run `yarn build` inside the `VM` project in order for the viewer project to pick up the changes.
