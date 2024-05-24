import React, { FC, useEffect, useState } from 'react'

export const Image = ({ image, alt, fallbackUrl }) => {
  const [imageUrl, setImageUrl] = useState(undefined)

  // todo: image can changed. need watch
  useEffect(() => {
    image?.ipfs_cid
      ? setImageUrl(`https://ipfs.near.social/ipfs/${image.ipfs_cid}`)
      : image?.url
      ? setImageUrl(image?.url)
      : setImageUrl(fallbackUrl)
  }, [image])

  return (
    <img
      src={imageUrl}
      alt={alt}
      onError={() => {
        if (imageUrl !== fallbackUrl) {
          setImageUrl(fallbackUrl)
        }
      }}
    />
  )
}
