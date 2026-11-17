import { forwardRef } from "react";
import LoaderSpinner from "./LoaderSpinner";

// Marker placed after an incremental list; shows a small spinner while more
// items are on the way.
const ListSentinel = forwardRef(({ hasMore }, ref) => (
  <div
    ref={ref}
    style={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
      padding: hasMore ? "1.6rem 0" : 0,
      minHeight: 1,
    }}
  >
    {hasMore && <LoaderSpinner width="2.2rem" height="2.2rem" color="#5b8def" />}
  </div>
));

export default ListSentinel;
