const image = props.image;
const onChange = props.onChange;

const Tab = {
  Upload: "Upload",
  NFT: "NFT",
  URL: "URL",
};

const origTab = () =>
  image.nft.contractId || image.nft.tokenId
    ? Tab.NFT
    : !image.ipfs_cid && image.url
    ? Tab.URL
    : Tab.Upload;

State.init({
  origImage: image,
  tab: origTab(),
  url: image.url,
  nft: image.nft ?? {},
  img: { cid: image.ipfs_cid },
});

const setTab = (tab) => State.update({ tab });

if (JSON.stringify(image) !== JSON.stringify(state.image)) {
  State.update({
    image,
  });
}

let localImage = {};

if (state.origImage.nft.contractId || state.origImage.nft.tokenId) {
  localImage.nft = {};
  if (state.origImage.nft.contractId) {
    localImage.nft.contractId = null;
  }
  if (state.origImage.nft.tokenId) {
    localImage.nft.tokenId = null;
  }
}
if (state.origImage.ipfs_cid) {
  localImage.ipfs_cid = null;
}
if (state.origImage.url) {
  localImage.url = null;
}

if (state.tab === Tab.NFT && (state.nft.contractId || state.nft.tokenId)) {
  localImage.nft = {
    contractId: state.nft.contractId || "",
    tokenId: state.nft.tokenId || "",
  };
} else if (state.tab === Tab.Upload && state.img.cid) {
  localImage.ipfs_cid = state.img.cid;
}
if (state.tab === Tab.URL && state.url) {
  localImage.url = state.url;
}

if (onChange && JSON.stringify(image) !== JSON.stringify(localImage)) {
  onChange(localImage);
}

const debounce = (func, wait) => {
  const pause = wait || 350;
  let timeout;

  return (args) => {
    const later = () => {
      clearTimeout(timeout);
      func(args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, pause);
  };
};

const onNFTChange = debounce((e) => {
  State.update({
    nft: {
      ...state.nft,
      [e.target.id]: e.target.value,
    },
  });
});
const onImageChange = debounce((e) => {
  State.update({
    [e.target.id]: e.target.value,
  });
});

return (
  <div>
    <ul className={`nav nav-tabs`}>
      <li className="nav-item">
        <button
          className={`nav-link ${state.tab === Tab.Upload ? "active" : ""}`}
          aria-current="page"
          onClick={() => setTab(Tab.Upload)}
        >
          Upload
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${state.tab === Tab.NFT ? "active" : ""}`}
          aria-current="page"
          onClick={() => setTab(Tab.NFT)}
        >
          NFT
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${state.tab === Tab.URL ? "active" : ""}`}
          aria-current="page"
          onClick={() => setTab(Tab.URL)}
        >
          URL
        </button>
      </li>
    </ul>
    <div className="p-2">
      <div className={`${state.tab === Tab.Upload ? "" : "visually-hidden"}`}>
        <IpfsImageUpload image={state.img} />
      </div>
      <div className={`${state.tab === Tab.NFT ? "" : "visually-hidden"}`}>
        NFT contract
        <input
          type="text"
          id="contractId"
          defaultValue={state.nft.contractId}
          onChange={onNFTChange}
        />
        NFT token id
        <input
          type="text"
          id="tokenId"
          defaultValue={state.nft.tokenId}
          onChange={onNFTChange}
        />
      </div>
      <div className={`${state.tab === Tab.URL ? "" : "visually-hidden"}`}>
        Image URL
        <input
          type="text"
          id="url"
          defaultValue={state.url}
          onChange={onImageChange}
        />
      </div>
    </div>
  </div>
);
