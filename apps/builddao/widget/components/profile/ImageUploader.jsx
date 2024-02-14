const [img, setImg] = useState(null);
const [msg, setMsg] = useState("Replace");

const uploadFile = (files) => {
  setMsg("Uploading...");

  asyncFetch("https://ipfs.near.social/add", {
    method: "POST",
    headers: { Accept: "application/json" },
    body: files[0],
  })
    .catch((e) => {
      console.error(e);
      setMsg("Failed to upload");
    })
    .then((res) => {
      setImg(res.body.cid);
      setMsg("Replace");
      props.setImage({
        ipfs_cid: res.body.cid,
      });
    });
};

return (
  <>
    {img ? (
      <img src={`https://ipfs.near.social/ipfs/${img}`} alt="Image Preview"/>
    ) : (
      <Widget
        src="mob.near/widget/Image"
        loading=""
        props={{ image: props.image }}
      />
    )}
    <Files
      multiple={false}
      accepts={["image/*"]}
      clickable
      className="text-white"
      style={{ cursor: "pointer" }}
      onChange={(f) => uploadFile(f)}
    >
      {msg}
    </Files>
  </>
);
