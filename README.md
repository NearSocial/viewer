# Viewer

A framework for reusable components to render and modify SocialDB by Social08.

## Widget example

```jsx
let accountId = "eugenethedream"; //props.accountId;
let profile = socialGetr(`${accountId}/profile`);
let b = <div>Hello</div>;

(
  <div>
    <img src={profile.image.url}/>
    <span>{profile.name}</span> <span>(@{accountId})</span>
  </div>
);
```
