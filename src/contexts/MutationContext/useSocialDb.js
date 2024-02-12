import { useNear } from "near-social-vm";
import { useCallback, useEffect, useState } from "react";

const CONTRACT = "social.near";

export const useSocialDb = () => {
  const [allMetadata, setAllMetadata] = useState({});
  const [keys, setKeys] = useState({});

  const near = useNear();

  const getSocial = useCallback(
    (keys, finallity = "final", options) => {
      if (!near) return Promise.resolve({});
      keys = Array.isArray(keys) ? keys : [keys];
      return near.viewCall(CONTRACT, "get", { keys, options }, finallity);
    },
    [near]
  );

  const keysSocial = useCallback(
    (keys, finallity = "final", options) => {
      if (!near) return Promise.resolve({});
      keys = Array.isArray(keys) ? keys : [keys];
      return near.viewCall(CONTRACT, "keys", { keys, options }, finallity);
    },
    [near]
  );

  useEffect(() => {
    getSocial([
      "*/widget/*/metadata/name",
      "*/widget/*/metadata/image/ipfs_cid",
      "*/widget/*/metadata/tags/*",
    ])
      .then(setAllMetadata)
      .catch(console.error);
  }, [getSocial]);

  useEffect(() => {
    keysSocial(["*/widget/*"], "final", { values_only: true })
      .then(setKeys)
      .catch(console.error);
  }, [keysSocial]);

  // Based on: https://near.org/near/widget/ComponentDetailsPage?src=mob.near/widget/ComponentSearch&tab=source
  const searchComponents = useCallback(
    (props) => {
      const requiredTag = props.filterTag;
      const boostedTag = props.boostedTag;
      const inputTerm = props.term;

      const computeResults = (term) => {
        const terms = (term || "")
          .toLowerCase()
          .split(/[^\w._\/-]/)
          .filter((s) => !!s.trim());

        const matchedWidgets = [];

        const limit = props.limit ?? 30;

        const MaxSingleScore = 1;
        const YourWidgetScore = 0.5;
        const MaxScore = YourWidgetScore + MaxSingleScore * 4;

        const computeScore = (s) => {
          s = s.toLowerCase();
          return (
            terms
              .map((term) => {
                const pos = s.indexOf(term);
                return (
                  (pos >= 0 ? Math.exp(-pos) : 0) *
                  (term.length / Math.max(1, s.length))
                );
              })
              .reduce((s, v) => s + v, 0) / terms.length
          );
        };

        Object.entries(keys).forEach(([accountId, data]) => {
          const yourWidgetScore =
            accountId === props.accountId ? YourWidgetScore : 0;
          Object.keys(data.widget).forEach((componentId) => {
            const widgetSrc = `${accountId}/widget/${componentId}`;
            const widgetSrcScore = computeScore(widgetSrc);
            const componentIdScore = computeScore(componentId);
            const metadata =
              allMetadata[accountId]?.widget[componentId]?.metadata ?? {};
            const name = metadata.name || componentId;
            const image = metadata.image?.ipfs_cid;
            if (
              requiredTag &&
              !(metadata.tags && requiredTag in metadata.tags)
            ) {
              return;
            }
            const boosted =
              boostedTag && metadata.tags && boostedTag in metadata.tags;
            const tags = Object.keys(metadata.tags || {}).slice(0, 10);
            const nameScore = computeScore(name);
            const tagsScore = Math.min(
              MaxSingleScore,
              tags.map(computeScore).reduce((s, v) => s + v, 0)
            );
            const score =
              (yourWidgetScore +
                widgetSrcScore +
                componentIdScore +
                nameScore +
                tagsScore) /
              MaxScore;
            if (score > 0) {
              matchedWidgets.push({
                score,
                accountId,
                widgetName: componentId,
                widgetSrc,
                name,
                tags,
                boosted,
                image,
              });
            }
          });
        });

        matchedWidgets.sort(
          (a, b) =>
            (b.boosted ? 2 : 0) + b.score - (a.boosted ? 2 : 0) - a.score
        );
        const result = matchedWidgets.slice(0, limit);

        return result;
      };

      return computeResults(inputTerm);
    },
    [allMetadata, keys]
  );

  return { searchComponents };
};
