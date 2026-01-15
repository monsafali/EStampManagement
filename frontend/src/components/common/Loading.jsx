import "../../styles/global/loading.css"

export default function Loading({
  fullscreen = false,
  text = "Loading...",
  size = "md",
}) {
  return (
    <div className={`loading-container ${fullscreen ? "fullscreen" : ""}`}>
      <div className={`loading-spinner ${size}`} />
      <p className="loading-text">{text}</p>
    </div>
  );
}
