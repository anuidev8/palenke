"use client";

export default function OpenSearchHeroButton() {
  const openSearch = () => {
    window.dispatchEvent(new CustomEvent("palenke-search-open"));
  };

  return (
    <button type="button" onClick={openSearch} className="button-primary">
      Buscar biblioteca
    </button>
  );
}
